# Mon Portfolio — BB-Digital

Portfolio personnel développé avec HTML, Tailwind CSS, JavaScript et Node.js/Express.

## Aperçu

- Fond animé avec particules et lignes reliées (courbes de Bézier)
- Mode sombre / clair avec bascule et mémorisation
- Halo lumineux autour du curseur en mode sombre
- Section présentation, compétences filtrables, projets et formulaire de contact
- Envoi de mail réel via Nodemailer + Gmail
- Déployé sur Vercel (front) et Render (back)

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Structure | HTML5 sémantique |
| Style | Tailwind CSS v3 |
| Interactivité | JavaScript vanilla (ES6+) |
| Animation | Canvas API + courbes de Bézier |
| Serveur | Node.js + Express |
| Envoi mail | Nodemailer |
| Versioning | Git + GitHub |
| Déploiement front | Vercel |
| Déploiement back | Render |

## Structure du projet

```
mon-portfolio/
├── index.html          # Page principale
├── server.js           # Serveur Express
├── package.json        # Dépendances Node.js
├── tailwind.config.js  # Configuration Tailwind
├── .gitignore          # Fichiers ignorés par Git
├── .env                # Variables d'environnement (non versionné)
├── src/
│   ├── input.css       # CSS source Tailwind
│   ├── output.css      # CSS généré (versionné)
│   └── main.js         # JavaScript principal
└── images/
    ├── projet1.webp
    ├── projet2.webp
    └── projet3.webp
```

## Installation locale

### Prérequis

- Node.js v18+
- Git

### Étapes

```bash
# Cloner le dépôt
git clone https://github.com/NONO7365/mon-portfolio.git
cd mon-portfolio

# Installer les dépendances
npm install

# Créer le fichier .env
# EMAIL_USER=votre@gmail.com
# EMAIL_PASS=votre_mot_de_passe_application
# PORT=3000

# Générer le CSS Tailwind
npx tailwindcss -i ./src/input.css -o ./src/output.css --watch

# Démarrer le serveur (dans un second terminal)
node server.js
```

Ouvrir `index.html` avec Live Server dans VS Code.

## Variables d'environnement

Créer un fichier `.env` à la racine :

```
EMAIL_USER=votre@gmail.com
EMAIL_PASS=mot_de_passe_application_gmail
PORT=3000
```

> Le mot de passe d'application Gmail se génère sur : myaccount.google.com/apppasswords

## Déploiement

### Front-end — Vercel

1. Connecter le dépôt GitHub sur vercel.com
2. Framework Preset : `Other`
3. Build Command : vide
4. Le fichier `src/output.css` doit être versionné

### Back-end — Render

1. Connecter le dépôt GitHub sur render.com
2. Runtime : `Node`
3. Build Command : `npm install`
4. Start Command : `node server.js`
5. Ajouter les variables d'environnement `EMAIL_USER` et `EMAIL_PASS`

### CORS

Dans `server.js`, ajouter l'URL Vercel à la liste des origines autorisées :

```javascript
app.use(cors({
  origin: [
    'http://127.0.0.1:5500',
    'https://votre-portfolio.vercel.app',
  ]
}));
```

## Fonctionnalités

- **Dark/Light mode** : bascule via bouton, préférence sauvegardée en localStorage
- **Halo curseur** : cercle lumineux qui suit la souris en mode sombre
- **Fond animé** : 60 particules (20 sur mobile) reliées par des lignes, se déplaçant sur des courbes de Bézier
- **Filtres compétences** : tri par Frontend / Backend / DevOps
- **Formulaire de contact** : validation JS + envoi réel via Express et Nodemailer
- **Animations au scroll** : apparition progressive des sections via IntersectionObserver

## Auteur

BB-Digital — [GitHub](https://github.com/NONO7365)
