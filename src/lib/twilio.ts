import Twilio from "twilio";

export function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  try {
    return Twilio(sid, token);
  } catch {
    return null;
  }
}

export async function sendNudge(opts: {
  to: string; // E.164
  from: string; // E.164 (Twilio number) or WhatsApp sender (e.g., 'whatsapp:+14155238886')
  body: string;
}) {
  const client = getTwilioClient();
  if (!client) throw new Error("Twilio client not configured");
  return client.messages.create({ to: opts.to, from: opts.from, body: opts.body });
}
