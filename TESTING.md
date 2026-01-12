# 🧪 Testing Guide - Sistem Aspirasi Mahasiswa

## Pre-Deployment Testing Checklist

Sebelum deploy ke production, pastikan semua fitur sudah ditest dengan baik.

## 🚀 Setup Testing Environment

```bash
cd nextjs-app
npm install
npx prisma db push
npm run dev
```

Buka: `http://localhost:3000`

---

## ✅ Test Cases

### 1. Landing Page

**URL:** `http://localhost:3000`

- [ ] Halaman loading dengan benar
- [ ] Logo UDINUS tampil
- [ ] Gradient background tampil
- [ ] Animasi fade-in berfungsi
- [ ] Button "Masuk ke Sistem" berfungsi
- [ ] Footer tampil dengan tahun yang benar
- [ ] Responsive di mobile

**Expected Result:** Landing page modern dengan animasi smooth

---

### 2. Login Page

**URL:** `http://localhost:3000/login`

#### Test Case 2.1: Login dengan User Lama (MD5 Password)

**Steps:**
1. Buka halaman login
2. Masukkan username: `admin`
3. Masukkan password: `admin123`
4. Click "Login"

**Expected Result:**
- [ ] Redirect ke `/dashboard`
- [ ] Dashboard admin tampil
- [ ] Navbar menampilkan username
- [ ] Statistik tampil

#### Test Case 2.2: Login dengan Password Salah

**Steps:**
1. Masukkan username: `admin`
2. Masukkan password: `wrongpassword`
3. Click "Login"

**Expected Result:**
- [ ] Error message: "Username atau password salah"
- [ ] Tetap di halaman login
- [ ] Form tidak reset

#### Test Case 2.3: Login dengan User Tidak Ada

**Steps:**
1. Masukkan username: `usernotexist`
2. Masukkan password: `anypassword`
3. Click "Login"

**Expected Result:**
- [ ] Error message tampil
- [ ] Tetap di halaman login

---

### 3. Register Page

**URL:** `http://localhost:3000/register`

#### Test Case 3.1: Register User Baru

**Steps:**
1. Buka halaman register
2. Masukkan username: `testuser`
3. Masukkan password: `testpass123`
4. Konfirmasi password: `testpass123`
5. Click "Daftar"

**Expected Result:**
- [ ] Success message tampil
- [ ] Redirect ke login setelah 2 detik
- [ ] User baru tersimpan di database
- [ ] Password di-hash dengan bcrypt

#### Test Case 3.2: Register dengan Password Tidak Cocok

**Steps:**
1. Masukkan username: `testuser2`
2. Masukkan password: `testpass123`
3. Konfirmasi password: `different123`
4. Click "Daftar"

**Expected Result:**
- [ ] Error: "Password dan konfirmasi password tidak cocok"
- [ ] Form tidak submit

#### Test Case 3.3: Register dengan Username yang Sudah Ada

**Steps:**
1. Masukkan username: `admin` (sudah ada)
2. Masukkan password: `testpass123`
3. Konfirmasi password: `testpass123`
4. Click "Daftar"

**Expected Result:**
- [ ] Error: "Username sudah digunakan"

---

### 4. Dashboard Admin

**URL:** `http://localhost:3000/dashboard` (setelah login sebagai admin)

#### Test Case 4.1: Statistik Dashboard

**Steps:**
1. Login sebagai admin
2. Lihat dashboard

**Expected Result:**
- [ ] Card "Total Aspirasi" tampil dengan angka
- [ ] Card "Menunggu" tampil (warna kuning)
- [ ] Card "Diproses" tampil (warna cyan)
- [ ] Card "Selesai" tampil (warna hijau)
- [ ] Angka sesuai dengan data di database

#### Test Case 4.2: Tabel Aspirasi Terbaru

**Expected Result:**
- [ ] Tabel tampil dengan 5 aspirasi terbaru
- [ ] Kolom: #, Nama, NIM, Jurusan, Gedung, Kategori, Aspirasi, Status, Tanggal
- [ ] Data sesuai dengan database
- [ ] Badge status dengan warna yang benar
- [ ] Link "Lihat Semua" berfungsi

---

### 5. Dashboard Mahasiswa

**URL:** `http://localhost:3000/dashboard` (setelah login sebagai mahasiswa)

#### Test Case 5.1: Form Aspirasi

**Steps:**
1. Login sebagai mahasiswa (username: `rienn`)
2. Isi form:
   - Nama: Auto-filled dengan username
   - NIM: `A11.2021.12345`
   - Jurusan: `Teknik Informatika`
   - Gedung: Pilih "Gedung D"
   - Kategori: Pilih "Ruang Kelas"
   - Isi Aspirasi: `AC di ruang D.3.1 tidak dingin`
3. Click "Kirim Aspirasi"

**Expected Result:**
- [ ] Success message tampil
- [ ] Form di-reset
- [ ] Data tersimpan di database
- [ ] Status default: "Menunggu"

#### Test Case 5.2: Validasi Form

**Steps:**
1. Coba submit form kosong
2. Coba submit tanpa pilih gedung
3. Coba submit tanpa pilih kategori

**Expected Result:**
- [ ] Browser validation muncul
- [ ] Form tidak submit
- [ ] Required fields highlighted

---

### 6. List Aspirasi (Admin)

**URL:** `http://localhost:3000/dashboard/aspirasi`

#### Test Case 6.1: Filter Aspirasi

**Steps:**
1. Login sebagai admin
2. Buka list aspirasi
3. Click filter "Menunggu"
4. Click filter "Diproses"
5. Click filter "Selesai"
6. Click filter "Semua"

**Expected Result:**
- [ ] Data ter-filter sesuai status
- [ ] Button filter active dengan warna berbeda
- [ ] Jumlah data sesuai

#### Test Case 6.2: Update Status

**Steps:**
1. Pilih aspirasi dengan status "Menunggu"
2. Change dropdown status ke "Diproses"

**Expected Result:**
- [ ] Status berubah di database
- [ ] Success message tampil
- [ ] Badge warna berubah

**Note:** Hanya admin dengan `can_ubah_status = 1` atau superadmin yang bisa ubah status

#### Test Case 6.3: Flag Aspirasi

**Steps:**
1. Click button 🚩 pada aspirasi
2. Check database

**Expected Result:**
- [ ] `is_flagged` berubah jadi `true`
- [ ] Row background jadi merah muda
- [ ] Button 🚩 jadi merah

#### Test Case 6.4: Delete Aspirasi (Superadmin Only)

**Steps:**
1. Login sebagai superadmin
2. Click button 🗑️
3. Confirm delete

**Expected Result:**
- [ ] Konfirmasi dialog muncul
- [ ] Setelah confirm, data terhapus
- [ ] Success message tampil
- [ ] Data hilang dari list

---

### 7. Reporting

**URL:** `http://localhost:3000/dashboard/reporting`

#### Test Case 7.1: View Report

**Steps:**
1. Login sebagai admin
2. Buka reporting page

**Expected Result:**
- [ ] Tabel report tampil
- [ ] Kolom: Kategori, Total, Menunggu, Diproses, Selesai
- [ ] Data grouped by kategori
- [ ] Total row di footer
- [ ] Angka sesuai dengan data

#### Test Case 7.2: Print Report

**Steps:**
1. Click button "Cetak Laporan"

**Expected Result:**
- [ ] Print dialog browser muncul
- [ ] Preview print tampil rapi
- [ ] Button "Cetak" hidden di print
- [ ] Timestamp tampil

---

### 8. Navbar & Navigation

#### Test Case 8.1: Desktop Navigation

**Steps:**
1. Login sebagai admin
2. Check navbar

**Expected Result:**
- [ ] Logo tampil
- [ ] Menu: Dashboard, List Aspirasi, Reporting
- [ ] Superadmin: Menu "Manajemen Admin" tampil
- [ ] Username dropdown berfungsi
- [ ] Logout berfungsi

#### Test Case 8.2: Mobile Navigation

**Steps:**
1. Resize browser ke mobile size
2. Check navbar

**Expected Result:**
- [ ] Hamburger menu tampil
- [ ] Click hamburger, menu expand
- [ ] All menu items tampil
- [ ] Click menu item, menu collapse

---

### 9. Logout

#### Test Case 9.1: Logout

**Steps:**
1. Login
2. Click username dropdown
3. Click "Logout"

**Expected Result:**
- [ ] Redirect ke `/login`
- [ ] Session cleared
- [ ] Tidak bisa akses `/dashboard` tanpa login

---

### 10. Authorization

#### Test Case 10.1: Mahasiswa Access Control

**Steps:**
1. Login sebagai mahasiswa
2. Coba akses `/dashboard/reporting`

**Expected Result:**
- [ ] Menu "Reporting" tidak tampil di navbar
- [ ] Direct access redirect atau error

#### Test Case 10.2: Admin Access Control

**Steps:**
1. Login sebagai admin biasa (bukan superadmin)
2. Check menu

**Expected Result:**
- [ ] Menu "Manajemen Admin" tidak tampil
- [ ] Hanya bisa lihat aspirasi sesuai penugasan

---

### 11. Responsive Design

#### Test Case 11.1: Mobile (375px)

**Steps:**
1. Resize browser ke 375px width
2. Test semua halaman

**Expected Result:**
- [ ] All pages responsive
- [ ] No horizontal scroll
- [ ] Touch-friendly buttons
- [ ] Forms usable

#### Test Case 11.2: Tablet (768px)

**Expected Result:**
- [ ] Layout adapted
- [ ] Tables scrollable
- [ ] Navigation works

#### Test Case 11.3: Desktop (1920px)

**Expected Result:**
- [ ] Full layout
- [ ] No wasted space
- [ ] Optimal UX

---

### 12. Performance

#### Test Case 12.1: Page Load Speed

**Tools:** Chrome DevTools Network tab

**Expected Result:**
- [ ] Landing page: < 1s
- [ ] Dashboard: < 2s
- [ ] List aspirasi: < 2s

#### Test Case 12.2: Build Size

```bash
npm run build
```

**Expected Result:**
- [ ] Build success
- [ ] No errors
- [ ] Bundle size reasonable (< 1MB)

---

## 🐛 Bug Report Template

Jika menemukan bug, catat dengan format:

```markdown
**Bug:** [Judul singkat]

**Steps to Reproduce:**
1. Step 1
2. Step 2
3. Step 3

**Expected Result:**
[Apa yang seharusnya terjadi]

**Actual Result:**
[Apa yang terjadi]

**Screenshots:**
[Jika ada]

**Environment:**
- Browser: [Chrome/Firefox/Safari]
- OS: [Windows/Mac/Linux]
- Screen size: [Desktop/Mobile]
```

---

## ✅ Final Checklist

Sebelum deploy:

- [ ] All test cases passed
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build successful
- [ ] Database connection works
- [ ] Environment variables set
- [ ] Documentation updated
- [ ] Backup database created

---

## 📊 Test Results Template

```markdown
## Test Results - [Date]

### Summary
- Total Tests: 50
- Passed: 48
- Failed: 2
- Skipped: 0

### Failed Tests
1. [Test name] - [Reason]
2. [Test name] - [Reason]

### Notes
[Any additional notes]
```

---

**Happy Testing! 🧪**
