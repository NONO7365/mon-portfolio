console.log(
  "BREVO_API_KEY reçue:",
  process.env.BREVO_API_KEY
    ? process.env.BREVO_API_KEY.substring(0, 10) + "..."
    : "VIDE",
);
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const https = require("https");

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

  const data = JSON.stringify({
    sender: { name: "Portfolio", email: "brbergeret@gmail.com" },
    to: [{ email: "brbergeret@gmail.com" }],
    replyTo: { email: email, name: nom },
    subject: "Portfolio - Message de " + nom,
    htmlContent:
      "<h2>Nouveau message</h2>" +
      "<p><strong>Nom :</strong> " +
      nom +
      "</p>" +
      "<p><strong>Email :</strong> " +
      email +
      "</p>" +
      "<hr><p>" +
      message.replace(/\n/g, "<br>") +
      "</p>",
  });

  const options = {
    hostname: "api.brevo.com",
    path: "/v3/smtp/email",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": process.env.BREVO_API_KEY,
    },
  };

  try {
    await new Promise((resolve, reject) => {
      const request = https.request(options, (response) => {
        let body = "";
        response.on("data", (chunk) => (body += chunk));
        response.on("end", () => {
          if (response.statusCode >= 200 && response.statusCode < 300) {
            resolve(body);
          } else {
            reject(new Error("Brevo API error: " + body));
          }
        });
      });
      request.on("error", reject);
      request.write(data);
      request.end();
    });

    res.status(200).json({ succes: true, message: "Mail envoye !" });
  } catch (erreur) {
    console.error("Erreur envoi mail :", erreur.message);
    res.status(500).json({ succes: false, erreur: "Erreur lors de l'envoi." });
  }
});

app.listen(PORT, () => {
  console.log("Serveur demarre sur http://localhost:" + PORT);
});
