# Instagram Clone — Setup Guide

## Prérequis (une seule installation à faire)

| Outil | Lien |
|---|---|
| **Docker Desktop** | https://www.docker.com/products/docker-desktop |
| **Expo Go** (sur téléphone) | App Store / Google Play |

---

## Structure attendue des dossiers

```
📁 ton-dossier-parent/
├── 📁 instagram-app/          ← Backend Spring Boot
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── src/...
├── 📁 instagram-frontend/     ← Frontend Expo
│   ├── Dockerfile.frontend    ← ⬅ copier ici
│   ├── package.json
│   └── app/...
└── 📁 docker/                 ← ou là où est ton docker-compose
    ├── docker-compose.yml
    ├── start.sh
    └── README.md
```

> **Important :** Le chemin `context: ../../instagram-frontend` dans `docker-compose.yml`
> doit pointer vers ton dossier frontend. Ajuste-le si besoin.

---

## Lancer l'application (1 seule commande)

```bash
# 1. Clone le repo
git clone <url-du-repo>
cd <dossier-du-repo>

# 2. Lance tout
./start.sh
```

**Sur Windows :**
```cmd
docker compose up --build
```

---

## Ce qui se passe automatiquement

```
docker compose up --build
       │
       ├── 🐘 PostgreSQL démarre (port 5432)
       │         ↓ (attend que la DB soit prête)
       ├── ☕ Backend Spring Boot compile et démarre (port 8080)
       │         ↓
       └── 📱 Frontend Expo démarre en mode tunnel (port 8081)
                 ↓
           QR code affiché dans le terminal
```

---

## Connecter le téléphone

1. Les services démarrent → un **QR code** apparaît dans le terminal
2. Ouvre **Expo Go** sur ton téléphone
3. Scanne le QR code
4. L'app se lance ! 🎉

> Le mode `--tunnel` via ngrok permet de se connecter même si le PC et le téléphone
> ne sont pas sur le même Wi-Fi.

---

## Commandes utiles

```bash
# Arrêter tous les services
docker compose down

# Arrêter et supprimer les données (reset DB)
docker compose down -v

# Voir les logs en temps réel
docker compose logs -f

# Voir seulement les logs frontend
docker compose logs -f frontend

# Rebuild seulement le frontend
docker compose up --build frontend
```

---

## Problèmes fréquents

| Problème | Solution |
|---|---|
| `port 8080 already in use` | `docker compose down` puis relancer |
| QR code ne fonctionne pas | Utiliser le lien `exp://` affiché dans le terminal |
| Backend ne démarre pas | Attendre que PostgreSQL soit `healthy` (30-60s) |
| `./start.sh: Permission denied` | `chmod +x start.sh` |
| Expo tunnel lent | Normal, ngrok prend 10-20s à se connecter |

---

## Variables d'environnement

Si tu veux changer l'IP backend dans l'app, modifie :

```js
// instagram-frontend/src/constants/api.js
export const API_BASE_URL = 'http://192.168.1.XX:8080/api';
```

> En mode Docker tunnel, l'URL reste celle de ta machine locale.
> Le frontend appelle le backend directement depuis le téléphone (pas via Docker network).
