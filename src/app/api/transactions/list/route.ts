import { NextResponse } from "next/server";
import { getTransactions } from "@/lib/store/devStore";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id as string | undefined;
  const all = getTransactions();
  const items = userId ? all.filter((t) => t.userId === userId) : all;
  return NextResponse.json({ ok: true, items });
}
