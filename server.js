const fs = require("fs");
const path = require("path");

// Lecture du .env en local
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

const express = require("express");
const cors = require("cors");
const Brevo = require("@getbrevo/brevo");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://127.0.0.1:5501",
      "https://mon-portfolio-coral-rho.vercel.app",
      "https://mon-portfolio-git-main-nono7365s-projects.vercel.app",
    ],
  }),
);
app.use(express.json());

app.post("/contact", async (req, res) => {
  const { nom, email, message } = req.body;

  if (!nom || !email || !message) {
    return res.status(400).json({ succes: false, erreur: "Champs manquants." });
  }

  try {
    const apiInstance = new Brevo.TransactionalEmailsApi();
    const apiKey = apiInstance.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Portfolio - Message de " + nom;
    sendSmtpEmail.htmlContent =
      "<h2>Nouveau message depuis le portfolio</h2>" +
      "<p><strong>Nom :</strong> " +
      nom +
      "</p>" +
      "<p><strong>Email :</strong> " +
      email +
      "</p>" +
      "<hr />" +
      "<p>" +
      message.replace(/\n/g, "<br>") +
      "</p>";
    sendSmtpEmail.sender = { name: "Portfolio", email: "brbergeret@gmail.com" };
    sendSmtpEmail.to = [{ email: "brbergeret@gmail.com" }];
    sendSmtpEmail.replyTo = { email: email, name: nom };

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    res.status(200).json({ succes: true, message: "Mail envoye !" });
  } catch (erreur) {
    console.error("Erreur envoi mail :", erreur);
    res.status(500).json({ succes: false, erreur: "Erreur lors de l'envoi." });
  }
});

app.listen(PORT, () => {
  console.log("Serveur demarre sur http://localhost:" + PORT);
});
