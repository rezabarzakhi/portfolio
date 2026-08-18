import nodemailer from "nodemailer";

export async function sendContactEmail(data: { name: string; email: string; subject: string; message: string }) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) return;

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  });

  await transport.sendMail({
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
    to: process.env.CONTACT_TO ?? "reza.barzakhi@gmail.com",
    replyTo: data.email,
    subject: `[Portfolio] ${data.subject}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
  });
}
