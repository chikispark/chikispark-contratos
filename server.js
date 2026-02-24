const express = require("express");
const multer = require("multer");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" })); // permite cualquier origen
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer en memoria para recibir PDF
const upload = multer({ storage: multer.memoryStorage() });

// Ruta de prueba
app.get("/", (_req, res) => {
  res.send("Servidor funcionando correctamente");
});

// Endpoint para recibir PDF y enviarlo por correo
app.post("/sendContrato", upload.single("pdf"), async (req, res) => {
  try {
    const { nombre, emailCliente, numeroContrato } = req.body;

    if (!req.file) {
      return res.status(400).json({ ok: false, error: "No se envió PDF" });
    }

    const pdfBuffer = req.file.buffer;

    // Configura tu correo (usa contraseña de aplicación)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "contratos.chikispark@gmail.com",
        pass: "evgx yogj ribm eqqt" // aquí tu contraseña de aplicación generada en Google
      }
    });

    const mailOptions = {
      from: "contratos.chikispark@gmail.com",
      to: ["evgx yogj ribm eqqt", emailCliente],
      subject: `Contrato ${numeroContrato}`,
      text: `Contrato de ${nombre}`,
      attachments: [
        { filename: `Contrato_${numeroContrato}.pdf`, content: pdfBuffer }
      ]
    };

    await transporter.sendMail(mailOptions);

    res.json({ ok: true, message: "Contrato enviado correctamente a administración y cliente" });

  } catch (e) {
    console.error("Error en /sendContrato:", e);
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));