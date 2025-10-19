import { NextRequest, NextResponse } from "next/server";
import { addTransactions, StoredTransaction } from "@/lib/store/devStore";
import { categorize } from "@/lib/categorizer/rules";

function normalizeRow(r: Record<string, any>): StoredTransaction | null {
  // Try to map common CSV headers
  const desc = r.description || r.DESC || r.memo || r.Memo || r["Description"];
  const amtRaw = r.amount ?? r.AMOUNT ?? r["Amount"] ?? r.debit ?? r.credit;
  const dateRaw = r.date ?? r.DATE ?? r["Transaction Date"] ?? r["Date"];
  if (!desc || !amtRaw || !dateRaw) return null;
  const amount = Number(String(amtRaw).replace(/[^0-9.-]/g, ""));
  if (!Number.isFinite(amount) || amount === 0) return null;
  const type: "income" | "expense" = amount > 0 ? "income" : "expense";
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const date = new Date(dateRaw).toISOString().slice(0, 10);
  const category = categorize({ description: String(desc), amount, date, type });
  return { id, amount, description: String(desc), date, type, category };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rows = Array.isArray(body?.rows) ? body.rows : [];
    const normalized = rows
      .map((r: any) => normalizeRow(r))
      .filter(Boolean) as StoredTransaction[];
    if (!normalized.length) return NextResponse.json({ ok: false, count: 0 }, { status: 400 });
    addTransactions(normalized);
    return NextResponse.json({ ok: true, count: normalized.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
