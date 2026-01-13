# 🚀 Quick Deploy Guide

## Push ke GitHub

```bash
# 1. Tambah remote (ganti dengan URL repository Anda)
git remote add origin https://github.com/USERNAME/aspirasi-mahasiswa-udinus.git

# 2. Rename branch ke main
git branch -M main

# 3. Push ke GitHub
git push -u origin main
```

## Deploy ke Vercel

### 1. Buka Vercel
- Go to: https://vercel.com
- Login dengan GitHub

### 2. Import Project
- Click "Add New..." → "Project"
- Pilih repository: `aspirasi-mahasiswa-udinus`
- Click "Import"

### 3. Configure Project
**Framework Preset:** Next.js (auto-detected)

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Environment Variables:**
Tambahkan variabel berikut:

```
DATABASE_URL=mysql://user:password@host:port/database
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-secret-key-here
NODE_ENV=production
```

### 4. Generate NEXTAUTH_SECRET

Di terminal lokal, jalankan:
```bash
openssl rand -base64 32
```

Copy hasilnya dan paste ke `NEXTAUTH_SECRET`

### 5. Setup Database Production

**Opsi A: Railway (Recommended)**
1. Buka https://railway.app
2. Login dengan GitHub
3. Click "New Project" → "Provision MySQL"
4. Setelah ready, click "MySQL" → "Variables"
5. Copy `DATABASE_URL`
6. Paste ke Vercel Environment Variables

**Opsi B: PlanetScale**
1. Buka https://planetscale.com
2. Create new database
3. Get connection string
4. Paste ke Vercel Environment Variables

### 6. Deploy!

- Click "Deploy"
- Tunggu ±2-3 menit
- Setelah selesai, klik "Visit" untuk lihat aplikasi

### 7. Push Database Schema

Setelah deploy berhasil:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Push database schema
npx prisma db push
```

### 8. Import Data (Opsional)

Jika ingin import data dari database lama:

```bash
# Export dari database lokal
mysqldump -u root -p nnic > backup.sql

# Import ke database production
mysql -h RAILWAY_HOST -u RAILWAY_USER -p RAILWAY_DB < backup.sql
```

## ✅ Checklist

- [ ] Repository dibuat di GitHub
- [ ] Code di-push ke GitHub
- [ ] Project di-import ke Vercel
- [ ] Environment variables di-set
- [ ] Database production ready (Railway/PlanetScale)
- [ ] Deploy berhasil
- [ ] Database schema di-push
- [ ] Test aplikasi di production
- [ ] Data di-import (jika perlu)

## 🔗 Links

- GitHub Repo: https://github.com/USERNAME/aspirasi-mahasiswa-udinus
- Vercel Dashboard: https://vercel.com/dashboard
- Production URL: https://your-app.vercel.app
- Railway Dashboard: https://railway.app/dashboard
- PlanetScale Dashboard: https://app.planetscale.com

## 🆘 Troubleshooting

**Build Error:**
- Check logs di Vercel dashboard
- Pastikan environment variables sudah benar

**Database Connection Error:**
- Verify DATABASE_URL
- Check database is accessible from Vercel

**NextAuth Error:**
- Verify NEXTAUTH_URL matches deployment URL
- Check NEXTAUTH_SECRET is set

## 📞 Support

Jika ada masalah, check:
1. Vercel deployment logs
2. Browser console
3. Database connection

---

**Good luck! 🚀**
