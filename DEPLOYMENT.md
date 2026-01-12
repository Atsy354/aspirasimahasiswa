# 🚀 Panduan Deployment ke Vercel

## Langkah 1: Persiapan Repository

### 1.1 Initialize Git (jika belum)

```bash
cd nextjs-app
git init
git add .
git commit -m "Initial commit: Migrasi dari PHP ke Next.js"
```

### 1.2 Push ke GitHub

```bash
# Buat repository baru di GitHub, lalu:
git remote add origin https://github.com/username/aspirasi-mahasiswa.git
git branch -M main
git push -u origin main
```

## Langkah 2: Setup Database Production

### Opsi A: Railway (Recommended)

1. Buka [Railway.app](https://railway.app)
2. Login dengan GitHub
3. Click "New Project" → "Provision MySQL"
4. Setelah database dibuat, klik "MySQL" → "Variables"
5. Copy `DATABASE_URL` (format: `mysql://user:password@host:port/database`)

### Opsi B: PlanetScale

1. Buka [PlanetScale.com](https://planetscale.com)
2. Create new database
3. Get connection string
4. Format: `mysql://user:password@host/database?sslaccept=strict`

## Langkah 3: Deploy ke Vercel

### 3.1 Import Project

1. Buka [Vercel.com](https://vercel.com)
2. Login dengan GitHub
3. Click "Add New..." → "Project"
4. Import repository Anda
5. Click "Import"

### 3.2 Configure Environment Variables

Di halaman konfigurasi project, tambahkan environment variables:

```env
DATABASE_URL=mysql://user:password@host:port/database
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=generate-random-secret-key-here
NODE_ENV=production
```

**Cara Generate NEXTAUTH_SECRET:**
```bash
# Di terminal lokal:
openssl rand -base64 32
```

### 3.3 Deploy

1. Click "Deploy"
2. Tunggu proses build selesai (±2-3 menit)
3. Jika berhasil, Anda akan mendapat URL deployment

## Langkah 4: Setup Database Schema

### 4.1 Install Vercel CLI

```bash
npm i -g vercel
```

### 4.2 Link Project

```bash
cd nextjs-app
vercel login
vercel link
```

### 4.3 Push Database Schema

```bash
npx prisma db push
```

### 4.4 (Opsional) Import Data dari PHP Lama

Jika Anda ingin mengimpor data dari database PHP lama:

```bash
# Export data dari database lokal
mysqldump -u root -p nnic > backup.sql

# Import ke database production (Railway/PlanetScale)
mysql -h HOST -u USER -p DATABASE < backup.sql
```

## Langkah 5: Verifikasi Deployment

### 5.1 Test Aplikasi

1. Buka URL deployment Anda
2. Test halaman landing page
3. Test login dengan user dari database
4. Test register user baru
5. Test dashboard admin
6. Test submit aspirasi

### 5.2 Check Logs

Jika ada error:
1. Buka Vercel Dashboard
2. Click project Anda
3. Click "Deployments" → Latest deployment
4. Click "View Function Logs"

## Langkah 6: Custom Domain (Opsional)

### 6.1 Tambah Domain

1. Di Vercel Dashboard, click "Settings" → "Domains"
2. Add domain Anda (contoh: `aspirasi.udinus.ac.id`)
3. Ikuti instruksi untuk setup DNS

### 6.2 Update Environment Variables

Setelah domain aktif, update `NEXTAUTH_URL`:

```env
NEXTAUTH_URL=https://aspirasi.udinus.ac.id
```

## Troubleshooting

### Error: "Can't reach database server"

**Solusi:**
- Pastikan DATABASE_URL benar
- Cek apakah database Railway/PlanetScale aktif
- Pastikan tidak ada typo di connection string

### Error: "Prisma Client not generated"

**Solusi:**
- Pastikan `postinstall` script ada di package.json
- Redeploy project

### Error: "NextAuth configuration error"

**Solusi:**
- Pastikan NEXTAUTH_SECRET sudah diset
- Pastikan NEXTAUTH_URL sesuai dengan URL deployment
- Clear browser cookies

### Build Failed

**Solusi:**
1. Check build logs di Vercel
2. Pastikan semua dependencies terinstall
3. Test build lokal: `npm run build`
4. Pastikan tidak ada TypeScript errors

## Monitoring & Maintenance

### Update Aplikasi

```bash
# Setelah ada perubahan code:
git add .
git commit -m "Update: deskripsi perubahan"
git push origin main

# Vercel akan otomatis deploy
```

### Database Backup

**Railway:**
- Backup otomatis setiap hari
- Manual backup: Export dari Railway dashboard

**PlanetScale:**
- Backup otomatis
- Restore dari dashboard

### Performance Monitoring

1. Buka Vercel Dashboard
2. Click "Analytics"
3. Monitor:
   - Response time
   - Error rate
   - Traffic

## Checklist Deployment

- [ ] Repository di GitHub
- [ ] Database production ready (Railway/PlanetScale)
- [ ] Environment variables configured
- [ ] Build berhasil di Vercel
- [ ] Database schema pushed
- [ ] Data imported (jika perlu)
- [ ] Login tested
- [ ] All features tested
- [ ] Custom domain setup (opsional)
- [ ] SSL certificate active
- [ ] Monitoring setup

## Support

Jika ada masalah:
1. Check dokumentasi Vercel: https://vercel.com/docs
2. Check dokumentasi Railway: https://docs.railway.app
3. Check Prisma docs: https://www.prisma.io/docs

---

**Selamat! Aplikasi Anda sudah live! 🎉**
