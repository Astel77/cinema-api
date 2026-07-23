# 🎬 Pathé Cinéma — API REST (NestJS)

API backend de l'application de réservation de cinéma **Pathé Cinéma**, réalisée pour
l'examen final du module API REST (NestJS) — Licence 2 GI.

## ✅ Fonctionnalités

- **CRUD complet** : Films, Cinémas, Séances, Réservations, Utilisateurs
- **Authentification JWT** (inscription, connexion, mot de passe oublié / réinitialisation, profil)
- **Autorisation RBAC** (rôles `user` / `admin`) via `@Roles()` + `RolesGuard`
- **Routes protégées** — garde JWT globale, `@Public()` pour les routes ouvertes
- **Validation des données** avec DTO + `class-validator` (`whitelist`, `forbidNonWhitelisted`, `transform`)
- **Base de données relationnelle** via TypeORM (SQLite par défaut, PostgreSQL en option)
- **Gestion des erreurs** centralisée (`HttpExceptionFilter`) avec codes HTTP cohérents
- **Espace Administrateur complet** : gestion des utilisateurs, films, cinémas, séances,
  réservations, et tableau de bord de statistiques (`/api/admin/dashboard`)
- **Consommation d'API externes** :
  - [OpenWeather](https://openweathermap.org/api) — météo sur le tableau de bord
  - [ExchangeRate-API](https://www.exchangerate-api.com/) — conversion de devises (FCFA → USD/EUR/GBP)
- **Documentation Swagger** auto-générée : `http://localhost:3000/api/docs`
- **Bonus inclus** : Dockerfile + docker-compose (Postgres + Redis), pipeline CI GitHub Actions, tests e2e

## 🏗️ Architecture

```
src/
├── auth/            # Inscription, connexion, JWT, reset password
├── users/            # Profil + gestion admin des utilisateurs
├── movies/           # CRUD films
├── cinemas/           # CRUD salles de cinéma
├── sessions/          # CRUD séances (liées à un film + un cinéma)
├── reservations/       # Réservation de sièges, annulation, historique
├── external/          # Intégration OpenWeather + ExchangeRate-API
├── admin/            # Tableau de bord / statistiques globales
├── common/           # Decorators, Guards, Filters, Enums partagés
├── config/           # Configuration TypeORM
└── database/seed.ts     # Script de peuplement (admin + données de démo)
```

Chaque module suit le pattern **Controller → Service → Entity/Repository**, avec des DTO
dédiés pour la validation des entrées (architecture propre et modulaire).

## 🚀 Démarrage rapide

```bash
cd backend/cinema-api
npm install
cp .env.example .env      # puis ajustez les valeurs si besoin
npm run seed               # crée le compte admin + données de démo
npm run start:dev
```

L'API démarre sur `http://localhost:3000/api`, la doc Swagger sur `http://localhost:3000/api/docs`.

Par défaut, le projet utilise **SQLite** (fichier `cinema.sqlite`, zéro configuration).
Pour utiliser PostgreSQL, mettez `DB_TYPE=postgres` dans `.env` et renseignez les variables
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (ou utilisez `docker-compose up`).

### Compte administrateur (créé par `npm run seed`)

```
email:    admin@pathe-cinema.com
password: Admin123!
```

## 🔑 Authentification

1. `POST /api/auth/register` → crée un compte (rôle `user` par défaut)
2. `POST /api/auth/login` → renvoie `{ user, accessToken }`
3. Ajoutez le token à chaque requête protégée : `Authorization: Bearer <accessToken>`
4. `GET /api/auth/me` → profil de l'utilisateur connecté

## 📚 Principaux endpoints

| Méthode | Route                          | Accès          | Description                        |
|--------|---------------------------------|----------------|-------------------------------------|
| POST   | `/api/auth/register`            | Public         | Créer un compte                     |
| POST   | `/api/auth/login`               | Public         | Connexion (JWT)                     |
| POST   | `/api/auth/forgot-password`     | Public         | Générer un jeton de reset           |
| POST   | `/api/auth/reset-password`      | Public         | Réinitialiser le mot de passe       |
| GET    | `/api/movies`                   | Public         | Liste des films                     |
| POST   | `/api/movies`                   | Admin          | Créer un film                       |
| PATCH  | `/api/movies/:id`               | Admin          | Modifier un film                    |
| DELETE | `/api/movies/:id`               | Admin          | Supprimer un film                   |
| GET    | `/api/cinemas`                  | Public         | Liste des cinémas                   |
| GET    | `/api/sessions?movieId=`        | Public         | Liste des séances (filtrable)       |
| GET    | `/api/reservations/occupied-seats?sessionId=` | Public | Sièges déjà pris pour une séance |
| POST   | `/api/reservations`             | Utilisateur    | Réserver des sièges                 |
| GET    | `/api/reservations/mine`        | Utilisateur    | Mes réservations                    |
| DELETE | `/api/reservations/:id`         | Propriétaire/Admin | Annuler une réservation         |
| GET    | `/api/reservations`             | Admin          | Toutes les réservations             |
| GET    | `/api/users`                    | Admin          | Liste des utilisateurs              |
| PATCH  | `/api/users/:id/role`           | Admin          | Changer le rôle d'un utilisateur    |
| PATCH  | `/api/users/:id/status`         | Admin          | Activer / désactiver un compte      |
| GET    | `/api/admin/dashboard`          | Admin          | Statistiques globales               |
| GET    | `/api/external/weather?city=`   | Public         | Météo (OpenWeather)                 |
| GET    | `/api/external/exchange-rates`  | Public         | Taux de change (ExchangeRate-API)   |

La liste exhaustive et interactive est disponible sur Swagger (`/api/docs`).

## 🧪 Tests

```bash
npm run test        # tests unitaires
npm run test:e2e     # tests end-to-end (auth, RBAC, films)
```

## 🐳 Docker (bonus)

```bash
docker-compose up --build
```

Lance l'API + PostgreSQL + Redis. Pensez à exécuter `npm run seed` (ou l'équivalent en
conteneur) pour peupler la base après le premier démarrage.

## 🔄 Git Flow suggéré

- `main` → code stable / production
- `develop` → intégration
- `feature/xxx` → une branche par fonctionnalité (ex: `feature/auth-jwt`, `feature/admin-panel`)
- Commits clairs : `feat(auth): ajoute la réinitialisation du mot de passe`, etc.

Une pipeline CI (`.github/workflows/ci.yml`) build et teste automatiquement le projet à
chaque push/PR sur `main` et `develop`.
