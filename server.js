const fs = require("fs");
const path = require("path");
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8")
    .split("\n")
    .forEach((ligne) => {
      const idx = ligne.indexOf("=");
      if (idx > 0) {
        process.env[ligne.slice(0, idx).trim()] = ligne.slice(idx + 1).trim();
      }
    });
}
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "OK" : "VIDE");

const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ["http://127.0.0.1:5500", "http://127.0.0.1:5501"] }));
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/contact", async (req, res) => {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ succes: false, erreur: "Champs manquants." });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: "Portfolio - Message de " + nom,
    text: "Nom : " + nom + "\nEmail : " + email + "\n\nMessage :\n" + message,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ succes: true, message: "Mail envoyé !" });
  } catch (erreur) {
    console.error("Erreur envoi mail :", erreur);
    res.status(500).json({ succes: false, erreur: "Erreur lors de l'envoi." });
  }
});
app.listen(PORT, () => {
  console.log("Serveur démarré sur http://localhost:" + PORT);
});
