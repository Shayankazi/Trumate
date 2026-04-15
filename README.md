# TruMate — College Roommate Matcher

TruMate is a mobile-first roommate matching platform for college students in India. It uses a smart compatibility algorithm to connect students based on location, lifestyle habits, and shared interests — with a Tinder-like swipe interface, a request/accept flow, and real-time chat.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Animations | Framer Motion |
| State | Zustand (persisted to localStorage) |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) — Atlas or local |
| Real-time | Socket.io |
| Auth | JWT + bcryptjs |
| Deployment | Docker, Nginx, AWS EC2 |

---

## How It Works

- **Two roles**: `owner` (has a room to share) and `seeker` (looking for a room). Discover only shows opposite roles.
- **Matching algorithm**: 60 pts location proximity · 25 pts lifestyle preferences · 15 pts shared interests
- **Flow**: Swipe right → pending request → target accepts → chat unlocked
- **City filter**: Strict — Pune users only see Pune listings

---

## Local Development

### Prerequisites

- Node.js v18+
- MongoDB (local instance or MongoDB Atlas URI)

### 1. Clone the repo

```bash
git clone https://github.com/Shayankazi/Trumate.git
cd Trumate
```

### 2. Install dependencies

```bash
npm install
```

> Single `npm install` covers both frontend and backend — there is one shared `package.json`.

### 3. Create the `.env` file

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/trumate
JWT_SECRET=your_super_secret_key_here
PORT=3001
```

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (Atlas or `mongodb://localhost:27017/trumate`) |
| `JWT_SECRET` | Any long random string used to sign JWTs |
| `PORT` | Backend port (default `3001`) |

> **MongoDB Atlas note**: If using Atlas, whitelist your IP in **Network Access** (or use `0.0.0.0/0` for open access during dev).

### 4. Start the dev server

```bash
npm run dev
```

This runs both services concurrently:

| Service | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| Backend (Express) | http://localhost:3001 |

Vite automatically proxies `/api` and `/socket.io` to the backend, so no CORS config needed in dev.

### 5. Seed the database (optional)

To populate the database with 52 sample Indian student profiles (25 owners + 25 seekers + 2 test users):

**Step 1** — Temporarily add the seed route to `api/app.ts`:

```ts
import seedRoute from './routes/seed.js'
// ...
app.use('/api/seed', seedRoute)
```

**Step 2** — With the server running, call the endpoint:

```bash
curl -X POST http://localhost:3001/api/seed
```

**Step 3** — Remove the seed route from `api/app.ts` after seeding.

**Test credentials** (created by the seed):

| Role | Email | Password |
|---|---|---|
| Seeker | arjun.test@trumate.in | Test@1234 |
| Owner | kavya.test@trumate.in | Test@1234 |

---

## Docker

### Prerequisites

- Docker and Docker Compose installed

### 1. Create the `.env` file

Same as the local setup above. The `docker-compose.yml` loads it via `env_file`.

### 2. Build and start all containers

```bash
docker-compose up --build -d
```

This builds and starts two containers:

| Container | Role | Port |
|---|---|---|
| `backend` | Express API + Socket.io | `127.0.0.1:3001` (not exposed publicly) |
| `frontend` | Nginx serving React build | `0.0.0.0:80` |

Nginx proxies `/api/` and `/socket.io/` to the backend container internally — the frontend only ever talks to port `80`.

### 3. Check logs

```bash
# All containers
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Frontend / Nginx only
docker-compose logs -f frontend
```

### 4. Stop containers

```bash
docker-compose down
```

### 5. Rebuild after code changes

```bash
docker-compose up --build -d
```

---

## Deploying on AWS EC2

### 1. Launch an EC2 instance

- **AMI**: Ubuntu 22.04 LTS (recommended)
- **Instance type**: t2.micro (free tier) or t3.small
- **Security Group inbound rules**:

| Type | Port | Source |
|---|---|---|
| HTTP | 80 | 0.0.0.0/0 |
| SSH | 22 | Your IP |

### 2. Install Docker on the instance

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
# Log out and back in for the group to apply
```

### 3. Clone the repo and set up `.env`

```bash
git clone https://github.com/Shayankazi/Trumate.git
cd Trumate
nano .env   # add MONGODB_URI, JWT_SECRET, PORT=3001
```

### 4. Start with Docker Compose

```bash
docker-compose up --build -d
```

The app is now live at `http://<your-ec2-public-ip>`.

### Common EC2 issues

| Symptom | Likely cause | Fix |
|---|---|---|
| Site loads but API fails | Port 80 not open in Security Group | Add HTTP inbound rule |
| `ECONNREFUSED` on backend | Wrong `MONGODB_URI` or Atlas IP not whitelisted | Check `.env` and Atlas Network Access |
| Socket.io not connecting | Nginx WebSocket config missing | Already handled in `nginx.conf` |
| Container exits immediately | Backend crash (bad env vars) | Run `docker-compose logs backend` |

---

## Project Structure

```
/
├── api/                  # Express backend
│   ├── models/           # Mongoose schemas (User, Match, Swipe, Message)
│   ├── routes/           # auth, users, matches, messages
│   ├── middleware/        # JWT auth middleware
│   └── server.ts         # HTTP + Socket.io server entry
├── src/                  # React frontend
│   ├── pages/            # Discover, Matches, Chat, ProfileSetup, Home, Login
│   ├── components/       # BottomNav, Logo
│   ├── store/            # Zustand auth store
│   └── lib/              # API URL helper
├── Dockerfile.backend    # Node.js backend image
├── Dockerfile.frontend   # Multi-stage: Vite build → Nginx
├── docker-compose.yml    # Orchestrates backend + frontend
├── nginx.conf            # Proxies /api and /socket.io to backend
└── .env                  # Not committed — create manually
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend + backend in dev mode (concurrently) |
| `npm run client:dev` | Start Vite frontend only |
| `npm run server:dev` | Start Express backend only (via nodemon) |
| `npm run build` | TypeScript check + Vite production build |
| `npm run check` | TypeScript type check only |

---

## License

Educational project — WADL assignment. Built for the student community.
