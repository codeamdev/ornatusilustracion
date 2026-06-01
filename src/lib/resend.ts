import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ornatus.art";

interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail(data: ContactEmailData) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Nuevo mensaje de contacto de ${data.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1C1917; border-bottom: 1px solid #DDD6CB; padding-bottom: 16px;">
          Nuevo mensaje de contacto
        </h2>
        <p><strong>Nombre:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <div style="margin-top: 20px; padding: 16px; background: #F0ECE5; border-radius: 4px;">
          <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
    `,
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
  const itemsHtml = data.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" width="60" height="60"
               style="object-fit: cover; border-radius: 4px;" />
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right;">
          ${item.price != null ? `€${item.price.toFixed(2)}` : "Consultar"}
        </td>
      </tr>`
    )
    .join("");

  const html = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1C1917; border-bottom: 1px solid #DDD6CB; padding-bottom: 16px;">
        Nueva solicitud de pedido
      </h2>
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
    </div>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: ADMIN_EMAIL,
    subject: `Nuevo pedido de ${data.customer.name}`,
    html,
  });
}
