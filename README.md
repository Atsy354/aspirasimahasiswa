# Sistem Aspirasi Mahasiswa UDINUS - Next.js

Aplikasi web untuk mengelola aspirasi mahasiswa Universitas Dian Nuswantoro, dibangun dengan Next.js 15, TypeScript, Prisma ORM, dan NextAuth.js.

## 🚀 Fitur

- ✅ **Autentikasi** - Login/Register dengan NextAuth.js
- ✅ **Role-based Access Control** - Admin, Superadmin, dan Mahasiswa
- ✅ **Dashboard Interaktif** - Statistik real-time
- ✅ **Manajemen Aspirasi** - CRUD lengkap untuk aspirasi
- ✅ **Reporting** - Laporan berdasarkan kategori
- ✅ **Responsive Design** - Mobile-friendly
- ✅ **Database Migration** - Mendukung data dari PHP lama (MD5 & bcrypt)

## 📋 Prerequisites

- Node.js 18+ 
- MySQL 5.7+ atau MariaDB 10.3+
- npm atau yarn

## 🛠️ Installation

### 1. Clone atau Copy Project

```bash
cd nextjs-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Database

#### Opsi A: Menggunakan Database Lama (Migrasi dari PHP)

Jika Anda sudah memiliki database `nnic` dari aplikasi PHP lama:

1. Update file `.env`:
```env
DATABASE_URL="mysql://root:@localhost:3306/nnic"
```

2. Push schema Prisma ke database:
```bash
npx prisma db push
```

**PENTING**: Aplikasi ini mendukung password lama (MD5) dari PHP. User yang sudah ada dapat login dengan password lama mereka.

#### Opsi B: Database Baru

1. Buat database baru:
```sql
CREATE DATABASE nnic CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

2. Update `.env`:
```env
DATABASE_URL="mysql://root:@localhost:3306/nnic"
```

3. Push schema dan seed data:
```bash
npx prisma db push
```

4. Import data awal (opsional):
```bash
# Gunakan file SQL dari folder PHP lama
mysql -u root -p nnic < ../nnic.sql
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Setup Environment Variables

Edit file `.env`:

```env
# Database
DATABASE_URL="mysql://root:@localhost:3306/nnic"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="ganti-dengan-secret-key-yang-aman"

# Environment
NODE_ENV="development"
```

**PENTING untuk Production**: 
- Ganti `NEXTAUTH_SECRET` dengan string random yang aman
- Update `NEXTAUTH_URL` dengan URL production Anda
- Update `DATABASE_URL` dengan kredensial database production

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## 📦 Deployment ke Vercel

### 1. Persiapan

1. Push code ke GitHub repository
2. Login ke [Vercel](https://vercel.com)
3. Import project dari GitHub

### 2. Environment Variables di Vercel

Tambahkan environment variables berikut di Vercel Dashboard:

```env
DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-production-secret-key-here
NODE_ENV=production
```

### 3. Database Production

#### Opsi A: Railway MySQL

1. Buat MySQL database di [Railway.app](https://railway.app)
2. Copy connection string dari Railway
3. Update `DATABASE_URL` di Vercel

#### Opsi B: PlanetScale

1. Buat database di [PlanetScale](https://planetscale.com)
2. Copy connection string
3. Update `DATABASE_URL` di Vercel

### 4. Deploy

```bash
# Vercel akan otomatis deploy setiap push ke main branch
git push origin main
```

### 5. Setup Database Production

Setelah deploy pertama kali:

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

## 📁 Struktur Project

```
nextjs-app/
├── app/
│   ├── api/              # API Routes
│   │   ├── auth/         # NextAuth endpoints
│   │   ├── aspirasi/     # Aspirasi CRUD
│   │   ├── kategori/     # Kategori endpoints
│   │   ├── gedung/       # Gedung endpoints
│   │   ├── statistics/   # Dashboard stats
│   │   ├── reporting/    # Reporting data
│   │   └── register/     # User registration
│   ├── dashboard/        # Dashboard pages
│   │   ├── aspirasi/     # Aspirasi list
│   │   └── reporting/    # Reports
│   ├── login/            # Login page
│   ├── register/         # Register page
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── AdminDashboard.tsx
│   ├── MahasiswaDashboard.tsx
│   └── Providers.tsx
├── lib/                  # Utilities
│   ├── auth.ts          # NextAuth config
│   └── prisma.ts        # Prisma client
├── prisma/
│   └── schema.prisma    # Database schema
├── public/
│   └── logo.jpg         # Logo UDINUS
└── types/               # TypeScript types
    └── next-auth.d.ts
```

## 🔐 Default Users

Jika menggunakan database dari PHP lama, user default:

- **Superadmin**: 
  - Username: `admin`
  - Password: `admin123`

- **Mahasiswa**:
  - Username: `rienn`
  - Password: `123456`

**PENTING**: Ganti password default setelah login pertama kali!

## 🐛 Troubleshooting

### Error: "Can't reach database server"

- Pastikan MySQL service berjalan
- Cek kredensial di `.env`
- Cek firewall/port 3306

### Error: "Prisma Client not generated"

```bash
npx prisma generate
```

### Error: "NextAuth session not found"

- Pastikan `NEXTAUTH_SECRET` sudah diset
- Clear browser cookies
- Restart development server

### Build Error di Vercel

- Pastikan semua environment variables sudah diset
- Cek logs di Vercel dashboard
- Pastikan database dapat diakses dari Vercel

## 📝 Migrasi dari PHP

Aplikasi ini 100% kompatibel dengan database PHP lama:

1. ✅ Mendukung password MD5 (legacy)
2. ✅ Mendukung password bcrypt (baru)
3. ✅ Struktur database sama
4. ✅ Data dapat digunakan langsung

User dapat login dengan password lama mereka tanpa perlu reset.

## 🔄 Update & Maintenance

### Update Dependencies

```bash
npm update
```

### Database Migration

Jika ada perubahan schema:

```bash
npx prisma db push
```

### Backup Database

```bash
mysqldump -u root -p nnic > backup.sql
```

## 📞 Support

Untuk pertanyaan atau issues, silakan hubungi tim development.

## 📄 License

© 2026 Universitas Dian Nuswantoro

---

**Dibuat dengan ❤️ menggunakan Next.js 15**
