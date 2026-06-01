# 🔐 JWT Authentication System

Sistem autentikasi modern fullstack menggunakan **React + Express.js + Supabase PostgreSQL** dengan JWT.

![Stack](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=flat-square&logo=react)
![Stack](https://img.shields.io/badge/Backend-Express.js-000000?style=flat-square&logo=express)
![Stack](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=flat-square&logo=supabase)
![Stack](https://img.shields.io/badge/Auth-JWT-pink?style=flat-square)

---

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Struktur Folder](#-struktur-folder)
- [Tech Stack](#-tech-stack)
- [Prasyarat](#-prasyarat)
- [Setup Supabase](#-1-setup-supabase)
- [Setup Lokal](#-2-setup-lokal)
- [Deploy Backend ke Railway](#-3-deploy-backend-ke-railway)
- [Deploy Frontend ke Vercel](#-4-deploy-frontend-ke-vercel)
- [API Endpoints](#-api-endpoints)
- [Environment Variables](#-environment-variables)

---

## ✨ Fitur

- ✅ **Register** — validasi input, bcrypt password hashing
- ✅ **Login** — verifikasi credential, JWT token generation
- ✅ **Logout** — hapus token dari client
- ✅ **Protected Route** — halaman yang hanya bisa diakses user terautentikasi
- ✅ **Profile User** — ambil data user dari database
- ✅ **JWT Middleware** — verifikasi token di setiap protected endpoint
- ✅ **Persistent Login** — token tersimpan di localStorage, tidak hilang saat refresh
- ✅ **Auto Redirect** — redirect otomatis ke login jika belum autentikasi

---

## 📁 Struktur Folder

```
Backend_auth/
├── backend/                          # Node.js Express API
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js           # Supabase client
│   │   ├── controllers/
│   │   │   ├── authController.js     # Register, Login, Logout
│   │   │   └── userController.js     # Get Profile
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verification
│   │   │   └── validateMiddleware.js # Input validation
│   │   ├── routes/
│   │   │   ├── authRoutes.js         # /api/auth/*
│   │   │   └── userRoutes.js         # /api/user/*
│   │   └── services/
│   │       └── authService.js        # Business logic
│   ├── index.js                      # Express entry point
│   ├── .env.example                  # Template environment variables
│   └── package.json
│
└── frontend/                         # React Vite App
    ├── src/
    │   ├── api/
    │   │   └── axiosInstance.js      # Axios + interceptors
    │   ├── context/
    │   │   └── AuthContext.jsx       # Context API + useAuth hook
    │   ├── components/
    │   │   ├── ProtectedRoute.jsx    # Route guard
    │   │   └── Navbar.jsx            # Navigation bar
    │   └── pages/
    │       ├── Login.jsx             # Halaman login
    │       ├── Register.jsx          # Halaman register
    │       └── Dashboard.jsx         # Dashboard (protected)
    ├── .env                          # VITE_API_URL
    └── package.json
```

---

## 🛠 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend | React 18, Vite, React Router DOM, Axios |
| Backend | Node.js, Express.js v5, JWT, bcrypt |
| Database | Supabase (PostgreSQL) |
| Hosting Backend | Railway |
| Hosting Frontend | Vercel |

---

## 📦 Prasyarat

Pastikan sudah terinstall:
- [Node.js](https://nodejs.org/) v18 atau lebih baru
- [Git](https://git-scm.com/)
- Akun [Supabase](https://supabase.com) (gratis)
- Akun [Railway](https://railway.app) (gratis)
- Akun [Vercel](https://vercel.com) (gratis)

---

## 🗄 1. Setup Supabase

### 1.1 Buat Project

1. Login ke [app.supabase.com](https://app.supabase.com)
2. Klik **"New Project"**
3. Isi nama project, password database, dan pilih region terdekat (Singapore)
4. Tunggu project selesai dibuat (~2 menit)

### 1.2 Buat Tabel Users

1. Di sidebar kiri, klik **SQL Editor**
2. Klik **"New query"**
3. Copy-paste SQL berikut, lalu klik **Run**:

```sql
-- Buat tabel users
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  username    VARCHAR(50)   NOT NULL UNIQUE,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  created_at  TIMESTAMPTZ   DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ   DEFAULT NOW() NOT NULL
);

-- Index untuk performa query
CREATE INDEX IF NOT EXISTS idx_users_email    ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);

-- Aktifkan Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: izinkan backend mengakses semua data
CREATE POLICY "Backend can manage users"
  ON public.users FOR ALL
  USING (true) WITH CHECK (true);
```

### 1.3 Ambil Kredensial API

1. Pergi ke **Project Settings → API**
2. Salin dua nilai berikut:
   - **Project URL** → untuk `SUPABASE_URL`
   - **anon public** key → untuk `SUPABASE_ANON_KEY`

> ⚠️ **Penting:** `SUPABASE_URL` harus berupa base URL saja, **tanpa** `/rest/v1/` di belakangnya.
> ```
> ✅ Benar:  https://abcdefgh.supabase.co
> ❌ Salah:  https://abcdefgh.supabase.co/rest/v1/
> ```

---

## ⚙️ 2. Setup Lokal

### 2.1 Clone Repository

```bash
git clone https://github.com/USERNAME/Backend_auth.git
cd Backend_auth
```

### 2.2 Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Buat file .env dari template
cp .env.example .env
```

Edit file `backend/.env` dan isi dengan nilai asli:

```env
PORT=5000
NODE_ENV=development

SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Generate dengan: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=your-random-secret-min-64-chars
JWT_EXPIRES_IN=24h

CORS_ORIGIN=http://localhost:5173
```

Jalankan backend:

```bash
npm run dev
# Server berjalan di http://localhost:5000
```

### 2.3 Setup Frontend

Buka terminal baru:

```bash
cd frontend

# Install dependencies
npm install
```

Edit file `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Jalankan frontend:

```bash
npm run dev
# Buka http://localhost:5173
```

---

## 🚂 3. Deploy Backend ke Railway

### 3.1 Push ke GitHub (jika belum)

```bash
# Di root folder Backend_auth
git init
git add .
git commit -m "Initial commit"
git branch -m main
git remote add origin https://github.com/USERNAME/Backend_auth.git
git push -u origin main
```

### 3.2 Deploy di Railway

1. Login ke [railway.app](https://railway.app) dengan akun GitHub
2. Klik **"New Project"** → **"Deploy from GitHub repo"**
3. Pilih repository `Backend_auth`
4. Klik **"Add service"** → pilih repository

### 3.3 Konfigurasi Service

Di halaman service, masuk ke tab **Settings**:

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

### 3.4 Tambahkan Environment Variables

Masuk ke tab **Variables** → klik **"Raw Editor"**, paste:

```
PORT=5000
NODE_ENV=production
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://your-frontend.vercel.app
```

> ⚠️ `CORS_ORIGIN` diisi URL Vercel **setelah** frontend di-deploy (langkah 4).
> Sementara, isi dulu dengan `http://localhost:5173` agar bisa testing lokal.

### 3.5 Generate Domain

Setelah deploy berhasil (✅):

1. Tab **Settings** → scroll ke **"Networking"**
2. Klik **"Generate Domain"**
3. Salin URL yang muncul, contoh:
   ```
   https://backend-auth-production-xxxx.up.railway.app
   ```
4. Test di browser:
   ```
   https://backend-auth-production-xxxx.up.railway.app/api/health
   ```
   Harus muncul: `{ "success": true, "message": "Server berjalan dengan baik! 🚀" }`

---

## 🌐 4. Deploy Frontend ke Vercel

### 4.1 Deploy di Vercel

1. Login ke [vercel.com](https://vercel.com) dengan akun GitHub
2. Klik **"New Project"**
3. Import repository `Backend_auth`
4. Konfigurasi:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### 4.2 Tambahkan Environment Variable

Sebelum klik Deploy, tambahkan environment variable:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://backend-auth-production-xxxx.up.railway.app/api` |

> Ganti `xxxx` dengan URL Railway yang sudah didapat di langkah 3.5.

5. Klik **"Deploy"**
6. Setelah selesai, salin URL Vercel, contoh:
   ```
   https://backend-auth-apps.vercel.app
   ```

### 4.3 Update CORS_ORIGIN di Railway

Sekarang update variable `CORS_ORIGIN` di Railway dengan URL Vercel:

1. Railway → service backend-auth → tab **Variables**
2. Edit `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=https://backend-auth-apps.vercel.app
   ```
3. Railway akan otomatis redeploy

### 4.4 Edit Environment Variable Vercel (jika perlu update)

Jika URL Railway berubah dan perlu update `VITE_API_URL`:

1. Vercel Dashboard → project → **Settings → Environment Variables**
2. Klik **Edit** di baris `VITE_API_URL`
3. Ubah nilai → **Save**
4. Pergi ke tab **Deployments** → klik **⋮ → Redeploy**

> ⚠️ Vite meng-embed env variable saat build — wajib redeploy setiap kali mengubah `VITE_*`.

---

## 🔌 API Endpoints

Base URL: `https://your-backend.up.railway.app`

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/api/health` | ❌ | Health check server |
| `POST` | `/api/auth/register` | ❌ | Register user baru |
| `POST` | `/api/auth/login` | ❌ | Login, return JWT |
| `POST` | `/api/auth/logout` | ✅ Bearer | Logout |
| `GET` | `/api/user/profile` | ✅ Bearer | Data profile user |

### Contoh Request Register

```bash
curl -X POST https://your-backend.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Contoh Request Login

```bash
curl -X POST https://your-backend.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Contoh Request Profile (Protected)

```bash
curl -X GET https://your-backend.up.railway.app/api/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `PORT` | Port server | `5000` |
| `NODE_ENV` | Environment | `development` / `production` |
| `SUPABASE_URL` | URL project Supabase | `https://xxxx.supabase.co` |
| `SUPABASE_ANON_KEY` | Anon key Supabase | `eyJhbGci...` |
| `JWT_SECRET` | Secret key JWT (min 32 karakter) | `random-hex-string` |
| `JWT_EXPIRES_IN` | Masa berlaku token | `24h` |
| `CORS_ORIGIN` | URL frontend yang diizinkan | `https://app.vercel.app` |

### Frontend (`frontend/.env`)

| Variable | Deskripsi | Contoh |
|----------|-----------|--------|
| `VITE_API_URL` | Base URL backend API | `https://backend.railway.app/api` |

---

## 🔐 Alur Autentikasi

```
Register:  Form → POST /auth/register → Validasi → bcrypt.hash → Simpan ke Supabase
Login:     Form → POST /auth/login → bcrypt.compare → jwt.sign → Return token
Protected: Request → Authorization header → jwt.verify → req.user → Response
```

---

## 👨‍💻 Author

Dibuat sebagai project tugas kelompok Backend — Semester 6
- Damar Djati Hutama (5230411038)
- Ahmad Fata Dani Adnan (5230411042).
