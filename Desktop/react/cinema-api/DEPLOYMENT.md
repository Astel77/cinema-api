# 🚀 Guide de déploiement cloud (backend)

Cette partie ne peut pas être faite à ta place : il faut un compte sur une
plateforme cloud, ce que je n'ai pas accès depuis mon environnement. Voici
la méthode la plus simple et gratuite, étape par étape.

## Option recommandée : Render.com (gratuit, sans carte bancaire)

1. Pousse ton projet sur GitHub (voir README principal) si ce n'est pas déjà fait.
2. Va sur https://render.com et crée un compte (tu peux te connecter avec GitHub directement).
3. Clique sur **"New +"** → **"Web Service"**.
4. Connecte ton dépôt GitHub `backend/cinema-api` (ou le dossier `cinema-api` si monorepo).
5. Render détecte automatiquement `render.yaml` (déjà présent dans ce dossier) et pré-remplit :
   - Build command : `npm install && npm run build`
   - Start command : `npm run start:prod`
6. Renseigne les variables d'environnement marquées `sync: false` dans `render.yaml` :
   - `FRONTEND_URL` → l'URL de ton frontend déployé (ou `http://localhost:5173` en attendant)
   - `OPENWEATHER_API_KEY` → ta clé OpenWeather
   - `SEED_ADMIN_PASSWORD` → un mot de passe admin de ton choix
7. Clique sur **"Create Web Service"**.
8. Attends la fin du build (quelques minutes) → Render te donne une URL du style
   `https://cinema-api-xxxx.onrender.com`.
9. Une fois en ligne, lance le seed **à distance** 
   (onglet "Shell" dans le dashboard du service) :
   ```bash
   npm run seed
   ```

## ⚠️ Limite importante à connaître (honnêteté avant tout)

Le plan gratuit de Render **n'a pas de disque persistant** : le fichier
`cinema.sqlite` sera **recréé vide à chaque redéploiement ou redémarrage**
du service (ce qui arrive automatiquement après une période d'inactivité
sur le plan gratuit). Pour un projet de démonstration/soutenance, ce n'est
pas grave — relance simplement `npm run seed` dans le Shell si les données
ont disparu. Pour une vraie persistance, il faudrait soit :
- passer sur PostgreSQL géré (Render propose une base Postgres gratuite
  séparée — mets alors `DB_TYPE=postgres` et les `DB_HOST/PORT/USER/...`
  fournis par Render), soit
- ajouter un disque payant sur Render.

## Pour le frontend

Le plus simple est **Vercel** ou **Netlify** (gratuits) :
1. Connecte ton dépôt GitHub du frontend.
2. Build command : `npm run build`, dossier de sortie : `dist`.
3. Ajoute la variable d'environnement `VITE_API_URL` avec l'URL Render de ton backend
   (ex: `https://cinema-api-xxxx.onrender.com/api`).

## En résumé

Le projet est **prêt techniquement à être déployé** (config Render fournie,
variables d'environnement gérées, CORS déjà configurable via `FRONTEND_URL`).
Mais cliquer sur "Deploy" et créer les comptes reste une action que **toi
seul** peux faire — dis-moi si tu bloques à une étape précise et je
t'accompagne en temps réel.
