import { NextRequest, NextResponse } from "next/server";
import { FINMATE_SYSTEM_PROMPT } from "@/lib/finmate/prompt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function callOllama(model: string, input: string, system: string) {
  const base = process.env.OLLAMA_BASE || "http://127.0.0.1:11434";
  const url = `${base.replace(/\/$/, "")}/api/chat`;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: input },
        ],
        stream: false,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const content = data?.message?.content || data?.choices?.[0]?.message?.content;
    if (!content) return null;
    return String(content);
  } catch {
    return null;
  }
}

function concise(text: string, limit = 900) {
  if (text.length <= limit) return text;
  return text.slice(0, limit - 3) + "...";
}

function heuristicReply(message: string, history: any[]) {
  const msg = message.toLowerCase();
  const expenses = history.filter((t: any) => t.type === "expense");
  const incomes = history.filter((t: any) => t.type === "income");
  const sum = (xs: any[]) => xs.reduce((a, b) => a + Number(b.amount || 0), 0);
  const monthlySpend = Math.abs(sum(expenses));
  const monthlyIncome = sum(incomes);
  const savingsRate = monthlyIncome > 0 ? Math.max(0, (monthlyIncome - monthlySpend) / monthlyIncome) : 0;
  const shortfall = monthlyIncome - monthlySpend;
  const risk = shortfall < 0 ? "elevated" : "moderate";

  if (/plan|save|shortfall|forecast|cashflow|budget/.test(msg)) {
    const microSave = 200;
    const microCut = Math.max(200, Math.round((monthlySpend * 0.05) / 100) * 100);
    return [
      "Health snapshot:",
      `- Income: ₹${monthlyIncome.toLocaleString()} | Spend: ₹${monthlySpend.toLocaleString()} | Savings rate: ${(savingsRate * 100).toFixed(0)}%`,
      `- Shortfall risk (30d): ${risk}`,
      "\nMicro-actions:",
      `- Move ₹${microSave} to savings today; set weekly auto-transfer.`,
      `- Cap non-essentials by ~₹${microCut}/mo for 30 days.`,
      `- Enable bill reminders 3 days before due.`,
      "\nExplainability:",
      `- Rationale: based on recent income/spend pattern and typical leakage categories.`,
      `- Confidence: 0.65`,
      `- Expected impact: +₹${(microSave + microCut).toLocaleString()}/mo`,
    ].join("\n");
  }

  // General helpful reply
  return "Tell me your goal (e.g., 'avoid shortfall next month', 'save ₹50,000 in 3 months') and I’ll draft a concise plan with 2–3 actions.";
}

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ ok: false, error: "missing_message" }, { status: 400 });
    }

    // Try Ollama if configured
    const model = process.env.OLLAMA_MODEL || "llama3.1";
    let reply: string | null = null;
    if (process.env.OLLAMA_BASE) {
      reply = await callOllama(model, message, `${FINMATE_SYSTEM_PROMPT}\nRespond concisely (<= 12 lines). Always include rationale, a concrete next step, and a confidence score.`);
    }

    // If Ollama not available, heuristic using local history
    if (!reply) {
      let history: any[] = [];
      try {
        const res = await fetch(`${process.env.NEXTAUTH_URL || "http://127.0.0.1:3001"}/api/transactions/list`, {
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        });
        const data = await res.json();
        if (data?.ok && Array.isArray(data.items)) history = data.items;
      } catch {
        // ignore
      }
      reply = heuristicReply(message, history);
    }

    return NextResponse.json({ ok: true, reply: concise(reply) });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
