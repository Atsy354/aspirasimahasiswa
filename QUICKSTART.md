# 🚀 Quick Start Guide

## Langkah Cepat untuk Memulai

### 1. Masuk ke Folder Project

```bash
cd nextjs-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

**Opsi A: Gunakan Database Lama (Paling Mudah)**

Edit file `.env`:
```env
DATABASE_URL="mysql://root:@localhost:3306/nnic"
```

Lalu jalankan:
```bash
npx prisma db push
```

**Opsi B: Database Baru**

```bash
# Buat database
mysql -u root -p -e "CREATE DATABASE nnic CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# Import data lama (opsional)
mysql -u root -p nnic < ../nnic.sql

# Push schema
npx prisma db push
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka browser: **http://localhost:3000**

### 6. Login

**User Default (dari database lama):**
- Username: `admin`
- Password: `admin123`

Atau:
- Username: `rienn`
- Password: `123456`

## ✅ Selesai!

Aplikasi sudah berjalan di lokal!

## 🌐 Deploy ke Vercel

```bash
# 1. Push ke GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/repo.git
git push -u origin main

# 2. Buka vercel.com
# 3. Import repository
# 4. Set environment variables:
#    - DATABASE_URL (dari Railway/PlanetScale)
#    - NEXTAUTH_URL (https://your-app.vercel.app)
#    - NEXTAUTH_SECRET (generate dengan: openssl rand -base64 32)
# 5. Deploy!

# 6. Push database schema
vercel login
vercel link
npx prisma db push
```

## 📚 Dokumentasi Lengkap

- **README.md** - Dokumentasi aplikasi
- **DEPLOYMENT.md** - Panduan deploy detail
- **MIGRATION.md** - Panduan migrasi data
- **MIGRATION_SUMMARY.md** - Ringkasan migrasi

## 🆘 Troubleshooting Cepat

**Error: Can't connect to database**
```bash
# Check MySQL service running
# Check .env DATABASE_URL
```

**Error: Prisma Client not found**
```bash
npx prisma generate
```

**Error: Build failed**
```bash
npm run build
# Check error messages
```

## 📞 Butuh Bantuan?

Baca dokumentasi lengkap di **README.md** atau **DEPLOYMENT.md**

---

**Happy Coding! 🎉**
