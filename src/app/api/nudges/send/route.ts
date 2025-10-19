import { NextRequest, NextResponse } from "next/server";
import { sendNudge } from "@/lib/twilio";

export async function POST(req: NextRequest) {
  try {
    const { to, body, from } = await req.json();
    const sender = from || process.env.TWILIO_FROM;
    if (!to || !body || !sender) {
      return NextResponse.json({ ok: false, error: "missing_params" }, { status: 400 });
    }
    await sendNudge({ to, from: sender, body });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
