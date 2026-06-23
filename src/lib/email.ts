import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";

async function getEmailConfig() {
  try {
    const rows = await prisma.siteConfig.findMany({
      where: { key: { in: ["smtp_host", "smtp_port", "smtp_secure", "smtp_user", "smtp_pass", "from_email", "admin_email"] } },
    });
    const cfg: Record<string, string> = {};
    for (const r of rows) cfg[r.key] = r.value;
    return {
      host: cfg.smtp_host || process.env.SMTP_HOST || "smtp.example.com",
      port: parseInt(cfg.smtp_port || process.env.SMTP_PORT || "587"),
      secure: (cfg.smtp_secure || process.env.SMTP_SECURE || "false") === "true",
      user: cfg.smtp_user || process.env.SMTP_USER || "",
      pass: cfg.smtp_pass || process.env.SMTP_PASS || "",
      from: cfg.from_email || process.env.FROM_EMAIL || "noreply@ornatusilustracion.com",
      admin: cfg.admin_email || process.env.ADMIN_EMAIL || "admin@ornatusilustracion.com",
    };
  } catch {
    return {
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
      from: process.env.FROM_EMAIL || "noreply@ornatusilustracion.com",
      admin: process.env.ADMIN_EMAIL || "admin@ornatusilustracion.com",
    };
  }
}

interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData) {
  const cfg = await getEmailConfig();
  const transporter = nodemailer.createTransport({
    host: cfg.host, port: cfg.port, secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });
  await transporter.sendMail({
    from: cfg.from,
    to: cfg.admin,
    subject: `Nuevo mensaje de contacto de ${data.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1C1917; border-bottom: 1px solid #DDD6CB; padding-bottom: 16px;">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <div style="margin-top: 20px; padding: 16px; background: #F0ECE5; border-radius: 4px;">
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>`,
  });
}

interface OrderItem {
  name: string;
  image: string;
  price: number | null;
  quantity: number;
}

interface OrderEmailData {
  customer: { name: string; email: string; phone: string; message?: string };
  items: OrderItem[];
}

export async function sendOrderEmail(data: OrderEmailData) {
  const cfg = await getEmailConfig();
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" width="60" height="60" style="object-fit: cover; border-radius: 4px;" />
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          ${item.price != null ? `$${Math.round(item.price).toLocaleString("es-CO")}` : "Consultar"}
        </td>
      </tr>`
    )
    .join("");

  const transporter = nodemailer.createTransport({
    host: cfg.host, port: cfg.port, secure: cfg.secure,
    auth: { user: cfg.user, pass: cfg.pass },
  });
  await transporter.sendMail({
    from: cfg.from,
    to: cfg.admin,
    subject: `Nuevo pedido de ${data.customer.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1C1917; border-bottom: 1px solid #DDD6CB; padding-bottom: 16px;">Nueva solicitud de pedido</h2>
        <h3>Datos del cliente</h3>
        <p><strong>Nombre:</strong> ${data.customer.name}</p>
        <p><strong>Email:</strong> ${data.customer.email}</p>
        <p><strong>Teléfono:</strong> ${data.customer.phone}</p>
        ${data.customer.message ? `<p><strong>Nota:</strong> ${data.customer.message}</p>` : ""}
        <h3 style="margin-top: 24px;">Productos</h3>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
          <thead>
            <tr style="background: #F0ECE5;">
              <th style="padding: 10px; text-align: left;">Imagen</th>
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: center;">Cant.</th>
              <th style="padding: 10px; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>`,
  });
}
