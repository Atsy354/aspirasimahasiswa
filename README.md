# 📚 Sistem Aspirasi Mahasiswa UDINUS - Next.js

> Migrasi dari PHP ke Next.js dengan TypeScript, Prisma, dan NextAuth

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database
npx prisma db push

# Run development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Database Setup](#database-setup)
6. [Development](#development)
7. [Deployment](#deployment)
8. [Testing](#testing)
9. [API Documentation](#api-documentation)
10. [Troubleshooting](#troubleshooting)

---

## ✨ Features

### For Mahasiswa:
- ✅ Register & Login
- ✅ Submit aspirasi
- ✅ View submission status

### For Admin:
- ✅ Dashboard with statistics
- ✅ View aspirasi by kategori
- ✅ Update status (Eksekutor)
- ✅ Flag/Unflag aspirasi (Monitor/Eksekutor)
- ✅ Delete aspirasi (Superadmin)
- ✅ Monthly reporting with charts
- ✅ Admin management (Superadmin)

### Key Features:
- 🔐 Role-based access control
- 📊 Real-time statistics
- 📈 Chart.js visualizations
- 🖨️ Print-friendly reports
- 📱 Responsive design
- 🔒 Secure authentication (MD5 + Bcrypt)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MySQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Charts:** Chart.js + react-chartjs-2
- **Deployment:** Vercel

---

## 📦 Installation

### Prerequisites:
- Node.js 18+ 
- MySQL 8+
- npm or yarn

### Steps:

```bash
# 1. Clone repository
git clone <repository-url>
cd nextjs-app

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Edit .env with your database credentials
# DATABASE_URL="mysql://user:password@localhost:3306/nnic"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-secret-here"

# 5. Push database schema
npx prisma db push

# 6. (Optional) Seed database
# Import nnic.sql from parent directory

# 7. Run development server
npm run dev
```

---

## ⚙️ Configuration

### Environment Variables

Create `.env` file in root:

```env
# Database
DATABASE_URL="mysql://root:@localhost:3306/nnic"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Environment
NODE_ENV="development"
```

### Generate Secret:
```bash
openssl rand -base64 32
```

---

## 🗄️ Database Setup

### Local Development:

```bash
# Start MySQL
# Windows: Start MySQL service
# Mac: brew services start mysql
# Linux: sudo systemctl start mysql

# Push schema
npx prisma db push

# Open Prisma Studio (optional)
npx prisma studio
```

### Import Existing Data:

```bash
mysql -u root -p nnic < ../nnic.sql
```

### Production (Railway):

1. Create MySQL database on Railway
2. Copy `DATABASE_URL` from Railway
3. Update `.env` in Vercel
4. Run `npx prisma db push` locally with production URL

---

## 💻 Development

### File Structure:

```
nextjs-app/
├── app/
│   ├── api/              # API routes
│   │   ├── aspirasi/     # Aspirasi CRUD
│   │   ├── admin/        # Admin management
│   │   ├── auth/         # NextAuth
│   │   ├── kategori/     # Categories
│   │   ├── gedung/       # Buildings
│   │   ├── statistics/   # Dashboard stats
│   │   └── reporting/    # Monthly reports
│   ├── dashboard/        # Dashboard pages
│   │   ├── aspirasi/     # List aspirasi
│   │   ├── reporting/    # Reports
│   │   └── manajemen-admin/  # Admin management
│   ├── login/            # Login page
│   ├── register/         # Register page
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── AdminDashboard.tsx
│   ├── MahasiswaDashboard.tsx
│   └── Providers.tsx
├── lib/                  # Utilities
│   ├── auth.ts           # NextAuth config
│   ├── prisma.ts         # Prisma client
│   ├── api.ts            # API helpers
│   └── utils.ts          # Common functions
├── types/                # TypeScript types
│   ├── models.ts         # Shared types
│   └── next-auth.d.ts    # NextAuth types
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static files
```

### Development Commands:

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format

# Database commands
npx prisma studio        # Open database GUI
npx prisma db push       # Push schema changes
npx prisma generate      # Generate Prisma client
```

---

## 🚀 Deployment

### Deploy to Vercel:

1. **Push to GitHub:**
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. **Import to Vercel:**
- Go to [vercel.com](https://vercel.com)
- Click "Import Project"
- Select your repository
- Configure environment variables

3. **Environment Variables:**
```
DATABASE_URL=mysql://user:pass@host:port/db
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-production-secret
NODE_ENV=production
```

4. **Deploy:**
- Click "Deploy"
- Wait for build to complete
- Visit your app!

### Database Options:

**Railway (Recommended):**
- Free tier available
- Easy MySQL setup
- Copy connection string

**PlanetScale:**
- Serverless MySQL
- Free tier available
- Good for production

---

## 🧪 Testing

### Test Accounts:

```
Superadmin:
- Username: admin
- Password: admin123

Regular Admin:
- Username: admin2
- Password: admin123

Mahasiswa:
- Username: mahasiswa1
- Password: mahasiswa123
```

### Test Checklist:

**Authentication:**
- [ ] Login with admin
- [ ] Login with mahasiswa
- [ ] Register new account
- [ ] Logout

**Mahasiswa Features:**
- [ ] Submit aspirasi
- [ ] View submission

**Admin Features:**
- [ ] View dashboard statistics
- [ ] View aspirasi by kategori
- [ ] Update status (Eksekutor)
- [ ] Flag aspirasi (Monitor)
- [ ] Unflag aspirasi (Eksekutor - only if Selesai)
- [ ] Delete aspirasi (Superadmin)
- [ ] View monthly reports
- [ ] Generate charts
- [ ] Print reports

**Superadmin Features:**
- [ ] Add new admin
- [ ] Edit admin
- [ ] Assign penugasan
- [ ] Delete admin

---

## 📖 API Documentation

### Authentication

**POST** `/api/auth/signin`
- Login user
- Body: `{ username, password }`

**POST** `/api/register`
- Register new user
- Body: `{ username, password }`

### Aspirasi

**GET** `/api/aspirasi`
- Get all aspirasi (filtered by admin scope)

**POST** `/api/aspirasi`
- Create new aspirasi
- Body: `{ nama, nim, jurusan, kategoriId, gedungId, isiAspirasi }`

**PATCH** `/api/aspirasi/[id]`
- Update aspirasi (status or isFlagged)
- Body: `{ status?: string, isFlagged?: boolean }`

**DELETE** `/api/aspirasi/[id]`
- Delete aspirasi (superadmin only)

### Statistics

**GET** `/api/statistics`
- Get dashboard statistics
- Returns: `{ total, menunggu, diproses, selesai }`

### Reporting

**GET** `/api/reporting/monthly?month=1&year=2024`
- Get monthly report data
- Returns: `{ categories, statusSummary }`

### Admin Management

**GET** `/api/admin`
- Get all admins (superadmin only)

**POST** `/api/admin`
- Create new admin
- Body: `{ username, password, canUbahStatus, isSuperadmin, penugasan }`

**PATCH** `/api/admin/[id]`
- Update admin
- Body: `{ username?, password?, canUbahStatus?, isSuperadmin?, penugasan? }`

**DELETE** `/api/admin/[id]`
- Delete admin (superadmin only)

---

## 🐛 Troubleshooting

### Database Connection Error:

```bash
# Check MySQL is running
# Windows: services.msc → MySQL
# Mac: brew services list
# Linux: systemctl status mysql

# Test connection
mysql -u root -p

# Regenerate Prisma client
npx prisma generate
```

### Build Errors:

```bash
# Clear cache
rm -rf .next
npm run build

# Check for TypeScript errors
npm run lint
```

### NextAuth Errors:

```bash
# Verify NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET

# Generate new secret
openssl rand -base64 32
```

### Port Already in Use:

```bash
# Kill process on port 3000
# Windows: netstat -ano | findstr :3000
# Mac/Linux: lsof -ti:3000 | xargs kill
```

---

## 📞 Support

- **Documentation:** See `/docs` folder
- **Issues:** Create issue on GitHub
- **Email:** support@example.com

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Credits

- **Original PHP System:** Sistem Aspirasi Mahasiswa UDINUS
- **Migration:** Next.js + TypeScript
- **University:** Universitas Dian Nuswantoro

---

**Last Updated:** 2026-01-13
**Version:** 2.0.0
**Status:** Production Ready ✅
