import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

// Función de Backend 1: Endpoint POST /consultas/enviar-pdf
// Recibe email, pdfBase64 y metadatos, envía el correo con nodemailer
// Retorna { ok: true, messageId } o error
router.post("/consultas/enviar-pdf", async (req, res) => {
  try {
    const { email, subject, filename, pdfBase64, meta, items } = req.body;

    if (!email || !pdfBase64) {
      return res.status(400).json({
        ok: false,
        error: "Falta email o pdfBase64"
      });
    }

    const pdfBuffer = Buffer.from(pdfBase64, "base64");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: subject || "Consultas en Línea - Municipalidad",
      text: construirTexto(meta, items),
      attachments: [
        {
          filename: filename || "consulta.pdf",
          content: pdfBuffer,
          contentType: "application/pdf"
        }
      ]
    });

    return res.json({
      ok: true,
      messageId: info.messageId
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      error: "Error enviando correo"
    });
  }
});

function construirTexto(meta, items = []) {
  let texto = "Detalle de Consultas:\n\n";

  if (meta?.nombre) texto += `Nombre: ${meta.nombre}\n`;
  if (meta?.dni) texto += `DNI: ${meta.dni}\n`;
  texto += `Fecha: ${new Date().toLocaleString()}\n\n`;

  texto += "Conceptos:\n";

  for (const item of items) {
    texto += `- ${item.concepto} : S/ ${item.monto}\n`;
  }

  return texto;
}

export default router;