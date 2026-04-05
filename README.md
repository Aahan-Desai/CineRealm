# CineRealm 

**CineRealm** is an interactive, social platform built for storytellers, screenwriters, and movie enthusiasts. It empowers users to create their own movies, script detailed scenes, define character traits, draft dialogue or action blocks, and even set up branching interactive choices. Users can also discover other creators, rate and react to scenes, follow their favorite writers, and curate an immersive movie feed.

---

##  Key Features

- **User Authentication & Profiles:** Secure email/password login using JWT. Users can upload avatars and cover photos, manage a bio, and maintain a unique profile.
- **Movie Creation Engine:** Write entirely interactive movies with custom backdrops, posters, and privacy settings (Public vs. Private).
- **Scene & Script Drafting:** Divide movies into specific scenes. Formulate act structures, outline characters, and write script blocks (Action or Dialogue).
- **Interactive Outcomes:** Map out choices within scenes that lead to different narrative branches.
- **Social Ecosystem:** Follow other creators to populate a tailored Feed. Like and rate movies, react to individual scenes, and track reading/viewing progress.
- **Modern Cinematic UI:** An Apple-inspired, premium glassmorphism user interface designed with modern fonts, subtle micro-animations, and responsive layouts.

---

##  Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript, React 19
- **Styling:** Tailwind CSS v4, Vanilla CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **Component Library:** Shadcn UI / Radix UI
- **Icons:** Lucide React
- **Data Fetching:** Axios

### Backend
- **Runtime:** Node.js
- **Server Framework:** Express
- **Language:** TypeScript
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon)
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs
- **Media Storage:** Cloudinary & Multer
- **Validation:** Zod

---

##  Project Structure

```text
cinerealm/
├── backend/                  # Express server & Prisma database
│   ├── prisma/               # Database schema & migrations
│   ├── src/
│   │   ├── controllers/      # API logic controllers
│   │   ├── middlewares/      # Auth, rate limiting & upload middleware
│   │   ├── routes/           # Express router endpoints
│   │   └── server.ts         # Main server entrypoint
│   └── package.json          # Backend dependencies
│
└── frontend/                 # Next.js Application
    ├── app/                  # Next.js App Router pages
    ├── components/           # Reusable UI React components
    ├── lib/                  # Utilities, API integrations & stores
    ├── public/               # Static assets
    └── package.json          # Frontend dependencies
```

---

##  Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v20+ recommended)
- [PostgreSQL](https://www.postgresql.org/) Database (or a cloud provider like Neon)
- [Cloudinary](https://cloudinary.com/) Account (for image uploads)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/cinerealm.git
cd cinerealm
```

### 2. Backend Setup

Open a terminal to start up the backend server.

```bash
cd backend
npm install
```

**Set up environment variables:**
Create a `.env` file in the `backend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
DATABASE_URL="postgresql://user:password@hostname/database?sslmode=require"
JWT_SECRET="your_super_secret_jwt_key"

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Database Initialization:**
```bash
npx prisma generate
npx prisma db push
```

**Run Backend Server:**
```bash
npm run dev
```
The server will run on the defined port (typically `http://localhost:5000`).

### 3. Frontend Setup

Open a new terminal window to start the frontend application.

```bash
cd frontend
npm install
```

**Set up environment variables:**
Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

For production deployments such as Vercel, add the same `NEXT_PUBLIC_API_URL` value in the project environment variables and point it at your deployed backend origin.

**Run Frontend Development Environment:**
```bash
npm run dev
```
Access the web app at `http://localhost:3000`.

---

##  API Overview

Major API routing structure handled by the backend:
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login to account
- `GET /api/users/:username` - Fetch user profile information
- `GET /api/movies` - Get the movie feed or search movies
- `POST /api/movies` - Establish a new movie draft
- `POST /api/scenes` - Develop a scene inside a movie
- `POST /api/upload` - Secure endpoint for imagery payload

*(For exhaustive endpoint paths and expected payloads, review the respective `*Route.ts` and `*Controller.ts` combinations inside the `backend/src` directory).*

---

##  License

This project is licensed under the [ISC License](LICENSE).
