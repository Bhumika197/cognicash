import { NextRequest, NextResponse } from "next/server";
import { addTransactions, StoredTransaction } from "@/lib/store/devStore";
import { categorize } from "@/lib/categorizer/rules";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as any)?.id as string | undefined;

    const { amount, description, date, type } = await req.json();
    if (!amount || !description || !date || !type) {
      return NextResponse.json({ ok: false, error: "missing_params" }, { status: 400 });
    }
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt === 0) {
      return NextResponse.json({ ok: false, error: "bad_amount" }, { status: 400 });
    }
    const txType = (type === "income" ? "income" : "expense") as "income" | "expense";
    const cat = categorize({ description, amount: amt, date, type: txType });
    const tx: StoredTransaction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      userId,
      amount: amt,
      description,
      date,
      type: txType,
      category: cat,
    };
    addTransactions([tx]);
    return NextResponse.json({ ok: true, tx });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}
