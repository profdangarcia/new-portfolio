import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASSWORD, EMAIL_TO } = process.env;

export async function POST(request: Request) {
  if (request.method !== "POST") {
    return NextResponse.json({ message: "Bad request!" }, { status: 400 });
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Bad request!" }, { status: 400 });
  }

  const { name, email, message } = body;
  if (!name || !email || !message) {
    return NextResponse.json({ message: "Bad request!" }, { status: 400 });
  }

  if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASSWORD || !EMAIL_TO) {
    console.error("Missing mail env vars");
    return NextResponse.json(
      { message: "Server configuration error" },
      { status: 500 }
    );
  }

  const text = `Contato: "${name}" <${email}>\n\n${message}`;

  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: false,
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Novo Contato via Portfólio" <${MAIL_USER}>`,
      to: EMAIL_TO,
      subject: "Contato via Dan Garcia - Portfólio",
      text,
    });
  } catch (err) {
    console.error("Send mail error:", err);
    return NextResponse.json(
      { message: "Failed to send email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Email sent!" });
}
