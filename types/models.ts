// Shared type definitions for the application

export interface User {
    id: string
    username: string
    role: 'admin' | 'mahasiswa'
    canUbahStatus: boolean
    isSuperadmin: boolean
}

export interface Kategori {
    id: number
    namaKategori: string
}

export interface Gedung {
    id: number
    namaGedung: string
}

export interface Aspirasi {
    id: number
    nama: string
    nim: string
    jurusan: string | null
    isiAspirasi: string
    status: 'Menunggu' | 'Diproses' | 'Selesai'
    isFlagged: boolean
    tanggal: string
    kategori: Kategori
    gedung: Gedung
    kategoriId: number
    gedungId: number
}

export interface Penugasan {
    id: number
    userId: number
    kategoriId: number
    gedungId: number
    kategori: Kategori
    gedung: Gedung
}

export interface Admin extends User {
    penugasan: Penugasan[]
}

export interface Statistics {
    total: number
    menunggu: number
    diproses: number
    selesai: number
}

export interface KategoriGroup {
    kategori: string
    kategoriId: number
    count: number
    aspirasi: Aspirasi[]
}

export interface ReportData {
    success: boolean
    total: number
    categories: Array<{
        kategori: string
        total: number
        percent: number
    }>
    statusSummary: Array<{
        status: string
        total: number
        percent: number
    }>
}

export interface ApiResponse<T = any> {
    success?: boolean
    data?: T
    error?: string
    message?: string
}
