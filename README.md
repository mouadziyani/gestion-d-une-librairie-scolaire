# Gestion d'une Librairie Scolaire

Application full-stack de gestion d'une librairie scolaire, construite avec Laravel pour l'API backend et React pour l'interface frontend.

Le projet permet de gerer les produits, le stock, les commandes, les paiements, les ecoles partenaires, les utilisateurs, les commandes speciales, les notifications et les rapports de ventes.

## Sommaire

- [Apercu](#apercu)
- [Fonctionnalites](#fonctionnalites)
- [Stack technique](#stack-technique)
- [Structure du projet](#structure-du-projet)
- [Installation](#installation)
- [Configuration](#configuration)
- [Commandes utiles](#commandes-utiles)
- [API principale](#api-principale)
- [Tests et verification](#tests-et-verification)
- [Workflow Git](#workflow-git)

## Apercu

Cette plateforme separe clairement le backend et le frontend:

- `backend/`: API Laravel, authentification, logique metier, base de donnees, paiements et rapports.
- `frontend/`: application React/Vite, routes, pages admin/client/moderateur, services API et interface utilisateur.

Roles principaux:

- `admin`: gestion complete de la plateforme.
- `moderator`: gestion operationnelle du stock, produits, commandes et rapports selon les permissions.
- `client`: navigation catalogue, panier, checkout, commandes et factures.

## Fonctionnalites

### Client

- Creation de compte, connexion et gestion du profil.
- Consultation des produits et categories.
- Panier local et validation de commande.
- Paiement en especes ou par carte via Stripe.
- Suivi des commandes et factures.
- Demande de commande speciale.
- Notifications liees au compte.

### Administration

- Tableau de bord avec indicateurs de ventes, commandes, stock et utilisateurs.
- Gestion des produits, categories, fournisseurs et disponibilites.
- Gestion des commandes, statuts et paiements.
- Gestion des ecoles partenaires.
- Gestion des utilisateurs et roles.
- Gestion du stock et historique des mouvements.
- Gestion des commandes speciales.
- Parametrage general du site.
- Rapports de ventes avec export CSV, Excel et PDF.

### Backend

- API REST JSON.
- Authentification par Laravel Sanctum.
- Controle d'acces par roles.
- Validation avec Form Requests.
- Paiements Stripe et webhooks.
- Export PDF avec DomPDF.
- Pagination simple sur les listes principales.

## Stack technique

### Backend

- PHP `^8.2`
- Laravel `^12.0`
- Laravel Sanctum
- Stripe PHP SDK
- barryvdh/laravel-dompdf
- MySQL ou base compatible Laravel

### Frontend

- React `^19`
- Vite
- React Router
- Axios
- Tailwind CSS
- Stripe React SDK

## Structure du projet

```text
gestion-d-une-librairie-scolaire/
|-- backend/
|   |-- app/
|   |-- config/
|   |-- database/
|   |-- routes/
|   |-- tests/
|   `-- composer.json
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   `-- utils/
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

## Installation

### 1. Cloner le projet

```bash
git clone git@github.com:mouadziyani/gestion-d-une-librairie-scolaire.git
cd gestion-d-une-librairie-scolaire
```

### 2. Installer le backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve
```

API locale:

```text
http://localhost:8000/api
```

### 3. Installer le frontend

```bash
cd ../frontend
npm install
npm run dev
```

Frontend local:

```text
http://localhost:5173
```

## Configuration

### Backend `.env`

Configurer au minimum:

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=librairie_scolaire
DB_USERNAME=root
DB_PASSWORD=

STRIPE_KEY=
STRIPE_SECRET=
STRIPE_WEBHOOK_SECRET=
```

### Frontend `.env`

Le fichier `frontend/.env` reste local et ne doit pas etre commit.

Exemple:

```env
VITE_STRIPE_PUBLISHABLE_KEY=
```

## Commandes utiles

### Backend

```bash
cd backend
php artisan serve
php artisan migrate
php artisan db:seed
php artisan test
php artisan route:list
```

### Frontend

```bash
cd frontend
npm run dev
npm run build
npm run lint
```

## API principale

Quelques routes importantes:

| Methode | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/register` | Inscription |
| POST | `/api/login` | Connexion |
| POST | `/api/logout` | Deconnexion |
| GET | `/api/me` | Utilisateur connecte |
| GET | `/api/products` | Liste des produits |
| GET | `/api/categories` | Liste des categories |
| GET | `/api/schools` | Liste des ecoles |
| POST | `/api/checkout` | Validation de commande |
| POST | `/api/stripe/payment-intent` | Creation d'un paiement Stripe |
| GET | `/api/orders` | Liste des commandes |
| PATCH | `/api/orders/{id}/status` | Mise a jour du statut d'une commande |
| GET | `/api/reports/sales` | Rapport de ventes |
| GET | `/api/reports/sales/export` | Export CSV/Excel |
| GET | `/api/reports/sales/pdf` | Export PDF |

Les routes sensibles utilisent Sanctum et le middleware de roles.

## Tests et verification

Verification backend:

```bash
cd backend
php artisan test
```

Verification frontend:

```bash
cd frontend
npm run build
```

Derniere verification effectuee:

- Backend tests: OK
- Frontend build: OK
- Route PDF ventes: OK

## Workflow Git

Branche principale de developpement:

```text
dev
```

Bonnes pratiques:

- Creer des commits courts et thematiques.
- Verifier `git status` avant chaque commit.
- Ne jamais commit les fichiers `.env`.
- Tester le backend et le frontend avant de push.

Commandes courantes:

```bash
git status
git add .
git commit -m "feat: describe the change"
git push origin dev
```

## Auteur

Projet developpe par Mouad Ziyani.
