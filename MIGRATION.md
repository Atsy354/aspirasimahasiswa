# 📦 Panduan Migrasi Data dari PHP ke Next.js

## Overview

Aplikasi Next.js ini **100% kompatibel** dengan database PHP lama. Anda dapat:
1. Menggunakan database yang sama
2. User lama dapat login dengan password lama (MD5)
3. Tidak perlu reset password

## Opsi Migrasi

### Opsi 1: Gunakan Database yang Sama (Recommended)

Cara termudah adalah menggunakan database `nnic` yang sudah ada.

#### Langkah-langkah:

1. **Backup database lama** (penting!)
```bash
mysqldump -u root -p nnic > backup_nnic_$(date +%Y%m%d).sql
```

2. **Update .env di Next.js**
```env
DATABASE_URL="mysql://root:@localhost:3306/nnic"
```

3. **Push Prisma schema** (ini akan update tabel jika perlu)
```bash
cd nextjs-app
npx prisma db push
```

4. **Test aplikasi**
```bash
npm run dev
```

5. **Login dengan user lama**
   - Username: `admin`
   - Password: `admin123` (atau password lama Anda)

✅ **Selesai!** Semua data dan user lama sudah bisa digunakan.

### Opsi 2: Database Baru dengan Import Data

Jika Anda ingin database baru yang terpisah:

#### Langkah-langkah:

1. **Buat database baru**
```sql
CREATE DATABASE nnic_nextjs CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

2. **Update .env**
```env
DATABASE_URL="mysql://root:@localhost:3306/nnic_nextjs"
```

3. **Push schema Prisma**
```bash
npx prisma db push
```

4. **Import data dari database lama**
```bash
# Export data dari database lama (tanpa CREATE TABLE)
mysqldump -u root -p nnic --no-create-info > data_only.sql

# Import ke database baru
mysql -u root -p nnic_nextjs < data_only.sql
```

## Kompatibilitas Password

### Password MD5 (dari PHP lama)

Aplikasi Next.js mendukung password MD5 dari PHP lama:

```php
// PHP lama
$password = md5($input_password);
```

```typescript
// Next.js baru - otomatis detect MD5
if (user.password.length === 32) {
  // MD5 hash
  const md5Hash = crypto.createHash('md5').update(password).digest('hex')
  isValid = md5Hash === user.password
}
```

### Password Bcrypt (user baru)

User baru yang register di Next.js akan menggunakan bcrypt:

```typescript
// Hash password dengan bcrypt
const hashedPassword = await bcrypt.hash(password, 10)
```

### Upgrade Password (Opsional)

Jika Anda ingin upgrade semua password dari MD5 ke bcrypt:

```sql
-- Script untuk upgrade password
-- HATI-HATI: Backup dulu sebelum jalankan!

-- 1. Identifikasi user dengan MD5 (password length = 32)
SELECT id, username, LENGTH(password) as pwd_length 
FROM user 
WHERE LENGTH(password) = 32;

-- 2. User harus login ulang untuk auto-upgrade
-- Atau jalankan script Node.js untuk bulk upgrade
```

Script upgrade (opsional):
```typescript
// scripts/upgrade-passwords.ts
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'

async function upgradePasswords() {
  const users = await prisma.user.findMany({
    where: {
      password: {
        // MD5 hash length is 32
        contains: /^[a-f0-9]{32}$/
      }
    }
  })

  console.log(`Found ${users.length} users with MD5 passwords`)
  
  // NOTE: Anda perlu tahu password plaintext untuk upgrade
  // Atau minta user reset password
}
```

## Verifikasi Migrasi

### 1. Check Database Connection

```bash
cd nextjs-app
npx prisma studio
```

Ini akan membuka Prisma Studio di browser untuk melihat data.

### 2. Test Login

```bash
npm run dev
```

Buka `http://localhost:3000/login` dan test:
- Login dengan user lama
- Login dengan user baru (register)

### 3. Check Data Integrity

```sql
-- Check jumlah data
SELECT 
  (SELECT COUNT(*) FROM user) as total_users,
  (SELECT COUNT(*) FROM aspirasi) as total_aspirasi,
  (SELECT COUNT(*) FROM kategori) as total_kategori,
  (SELECT COUNT(*) FROM gedung) as total_gedung;

-- Check admin assignments
SELECT u.username, k.nama_kategori, g.nama_gedung
FROM admin_penugasan ap
JOIN user u ON ap.user_id = u.id
JOIN kategori k ON ap.kategori_id = k.id
JOIN gedung g ON ap.gedung_id = g.id;
```

## Troubleshooting

### Error: "Table doesn't exist"

**Solusi:**
```bash
npx prisma db push --force-reset
# HATI-HATI: Ini akan hapus semua data!
# Pastikan sudah backup!
```

### Error: "Can't login with old password"

**Penyebab:** Password di database mungkin bukan MD5

**Solusi:**
1. Check password di database:
```sql
SELECT username, password, LENGTH(password) FROM user WHERE username = 'admin';
```

2. Jika bukan MD5 (length != 32), reset password:
```sql
-- MD5 untuk 'admin123'
UPDATE user SET password = '0192023a7bbd73250516f069df18b500' WHERE username = 'admin';
```

### Error: "Foreign key constraint fails"

**Solusi:**
```bash
# Disable foreign key checks sementara
mysql -u root -p nnic -e "SET FOREIGN_KEY_CHECKS=0;"

# Import data
mysql -u root -p nnic < data.sql

# Enable kembali
mysql -u root -p nnic -e "SET FOREIGN_KEY_CHECKS=1;"
```

## Rollback Plan

Jika ada masalah, Anda bisa rollback:

### 1. Restore Database

```bash
# Restore dari backup
mysql -u root -p nnic < backup_nnic_YYYYMMDD.sql
```

### 2. Kembali ke PHP Lama

Aplikasi PHP lama masih bisa digunakan dengan database yang sama.

## Best Practices

1. ✅ **Selalu backup** sebelum migrasi
2. ✅ **Test di development** dulu
3. ✅ **Verifikasi data** setelah migrasi
4. ✅ **Dokumentasi** perubahan yang dilakukan
5. ✅ **Siapkan rollback plan**

## Checklist Migrasi

- [ ] Backup database lama
- [ ] Setup Next.js environment
- [ ] Configure DATABASE_URL
- [ ] Run `npx prisma db push`
- [ ] Test database connection
- [ ] Test login dengan user lama
- [ ] Test register user baru
- [ ] Verify data integrity
- [ ] Test all features
- [ ] Document any issues
- [ ] Prepare rollback plan

## Support

Jika ada masalah saat migrasi:
1. Check error logs
2. Verify database connection
3. Check Prisma schema
4. Restore dari backup jika perlu

---

**Good luck dengan migrasi! 🚀**
