# ProjetFR - Librairie Scolaire

![Laravel](https://img.shields.io/badge/Laravel-8.x-red) ![React](https://img.shields.io/badge/React-18.2-blue) ![MySQL](https://img.shields.io/badge/MySQL-8.0-orange) ![PHP](https://img.shields.io/badge/PHP-8.1-purple)

ProjetFR est une **application web complète** de gestion d’une librairie scolaire.  
Elle permet aux **clients** de consulter et acheter des produits en ligne, et aux **administrateurs** de gérer le stock, les commandes, les écoles partenaires et les statistiques de vente.

---

## **Table des matières**
- [Fonctionnalités](#fonctionnalités)
- [Stack Technique](#stack-technique)
- [Architecture du Projet](#architecture-du-projet)
- [Installation](#installation)
- [Branches Git](#branches-git)
- [Commandes Utiles](#commandes-utiles)
- [API Endpoints](#api-endpoints)
- [Contribuer](#contribuer)
- [Licence](#licence)

---

## **Fonctionnalités**

### **Client**
- Créer un compte / se connecter
- Consulter les produits en temps réel
- Ajouter des produits au panier et passer des commandes
- Choisir le mode de paiement (en ligne / à la livraison)
- Suivre l’historique de ses commandes
- Passer des commandes spéciales pour produits non disponibles

### **Administrateur**
- Gestion complète des produits et des catégories
- Gestion des utilisateurs et écoles partenaires
- Suivi des ventes et inventaires
- Statistiques et export PDF / Excel
- Gestion des commandes spéciales

---

## **Stack Technique**
- **Backend** : Laravel 8+, MVC, Sanctum pour authentication
- **Frontend** : React 18+, Axios pour API calls, React Router pour navigation SPA
- **Base de données** : MySQL 8.0
- **Versionning** : Git / GitHub
- **Architecture** : Hybrid **MVC + N-Tier**
- **Sécurité** : Hashage des mots de passe, protection contre injections SQL et XSS

---

## **Architecture du Projet**

```
ProjetFR/
├── backend/ # Laravel backend (API, Business Logic, Database Models)
├── frontend/ # React SPA (Pages, Composants, Services API)
├── .gitignore
├── README.md
``` 


- **Frontend (React)** : Interface utilisateur responsive, navigation SPA  
- **Backend (Laravel)** : Routes API, Controllers, Services Layer pour la logique métier, Models pour la DB  
- **Data Access** : MySQL, migrations, seeders  
- **External Services** : Paiement, notifications email

---

## **Installation**

### **1️ Backend Laravel**
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
# Configurer la base de données dans .env
php artisan migrate
php artisan db:seed
php artisan serve

Laravel backend run sur http://127.0.0.1:8000
```

### **2️ Frontend React**
```bash
cd frontend
npm install
npm start


React frontend run sur http://localhost:3000
```

---

## **Branches Git recommandées**
- `main` → Code stable / production
- `dev` → Développement intégré
- `feature/backend` → Développement backend Laravel
- `feature/frontend` → Développement frontend React

---

## **Commandes Utiles**

### **Backend Laravel**
```bash
php artisan serve       # Lancer serveur Laravel
php artisan migrate     # Appliquer les migrations
php artisan db:seed     # Seed données initiales
php artisan tinker      # Tester le code backend en console
```

### **Frontend React**
```bash
cd frontend
npm install            # Installer toutes les dépendances React
npm start              # Lancer le serveur de développement React
npm run build          # Compiler React pour production
npm test               # Lancer les tests unitaires
```

---

## **API Endpoints (Exemples)**

| Méthode | Endpoint                  | Description |
|---------|---------------------------|-------------|
| GET     | /api/products             | Récupérer tous les produits |
| GET     | /api/products/{id}        | Récupérer un produit spécifique |
| POST    | /api/orders               | Créer une commande |
| GET     | /api/orders/{id}          | Détails d’une commande |
| POST    | /api/auth/login           | Connexion utilisateur |
| POST    | /api/auth/register        | Inscription utilisateur |

> Tous les appels API utilisent **Laravel Sanctum** pour l’authentification token-based.  

---

## **Branches Git recommandées**
- `main` → Code stable / production  
- `dev` → Développement intégré  
- `feature/backend` → Développement backend Laravel  
- `feature/frontend` → Développement frontend React  

---

## **Contribuer**
1. Fork le projet sur GitHub  
2. Créer une branche feature:  
```bash
git checkout -b feature/ma-fonctionnalité
```
3. Faire vos modifications et commit:
```bash
git commit -m "Description de la fonctionnalité"
```
4. Pousser la branche sur GitHub:
```bash
git push origin feature/ma-fonctionnalité
```
5. Créer un Pull Request pour intégrer vos modifications dans la branche `dev` ou `main`.

---

## **Licence**
MIT License

---

## **Remarques professionnelles**
- **Backend et frontend séparés** pour faciliter le développement et la maintenance.  
- Architecture **prête pour la scalabilité** et l’ajout futur de fonctionnalités (paiement en ligne, notifications, reporting avancé).  
- **Sécurité** : hashage des mots de passe, protection contre injections SQL et XSS.  
- Suivi des bonnes pratiques pour le code et gestion Git.

---

## **Contact**
Pour toute question ou problème lié au projet, vous pouvez contacter le développeur :  
**Mouad Ziyani** – ([LinkedIn](https://www.linkedin.com/in/mouad-ziyani/))
