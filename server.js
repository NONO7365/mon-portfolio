// ============================================
// IMPORTS
// ============================================
require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARES
// ============================================

// Autorise les requêtes venant du navigateur (Live Server tourne sur le port 5500)
app.use(cors({ origin: ["http://127.0.0.1:5500", "http://127.0.0.1:5501"] }));

// Permet à Express de lire le JSON envoyé par le formulaire
app.use(express.json());

// ============================================
// CONFIGURATION NODEMAILER
// ============================================
/*const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});*/

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "brbergeret@gmail.com", // ton vrai email ici
    pass: "ocakcnfxsoueqfll", // ton mot de passe d'application ici
  },
});

// ============================================
// ROUTE POST /contact
// ============================================
app.post("/contact", async (req, res) => {
  const { nom, email, message } = req.body;

  // Validation côté serveur
  if (!nom || !email || !message) {
    return res.status(400).json({ succes: false, erreur: "Champs manquants." });
  }

  // Options du mail
  /*const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // tu te l'envoies à toi-même
    replyTo: email,
    subject: `Portfolio — Message de ${nom}`,
    text: `Nom : ${nom}\nEmail : ${email}\n\nMessage :\n${message}`,
    html: `
      <h2>Nouveau message depuis ton portfolio</h2>
      <p><strong>Nom :</strong> ${nom}</p>
      <p><strong>Email :</strong> ${email}</p>
      <hr />
      <p>${message.replace(/\n/g, "<br>")}</p>
    `,
  };*/

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: "brbergeret@gmail.com", // ← ton email en dur ici
    replyTo: email,
    subject: `Portfolio — Message de ${nom}`,
    text: `Nom : ${nom}\nEmail : ${email}\n\nMessage :\n${message}`,
    html: `
    <h2>Nouveau message depuis ton portfolio</h2>
    <p><strong>Nom :</strong> ${nom}</p>
    <p><strong>Email :</strong> ${email}</p>
    <hr />
    <p>${message.replace(/\n/g, "<br>")}</p>
  `,
  };

  // Envoi du mail
  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ succes: true, message: "Mail envoyé avec succès !" });
  } catch (erreur) {
    console.error("Erreur envoi mail :", erreur);
    res.status(500).json({ succes: false, erreur: "Erreur lors de l'envoi." });
  }
});

// ============================================
// DÉMARRAGE DU SERVEUR
// ============================================
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
