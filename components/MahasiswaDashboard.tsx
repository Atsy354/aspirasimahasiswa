'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Kategori {
    id: number
    namaKategori: string
}

interface Gedung {
    id: number
    namaGedung: string
}

export default function MahasiswaDashboard() {
    const { data: session } = useSession()
    const [kategoriList, setKategoriList] = useState<Kategori[]>([])
    const [gedungList, setGedungList] = useState<Gedung[]>([])
    const [formData, setFormData] = useState({
        nama: session?.user?.username || '',
        nim: '',
        jurusan: '',
        kategoriId: '',
        gedungId: '',
        isiAspirasi: ''
    })
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        fetchOptions()
        if (session?.user?.username) {
            setFormData(prev => ({ ...prev, nama: session.user.username }))
        }
    }, [session])

    const fetchOptions = async () => {
        try {
            const [kategoriRes, gedungRes] = await Promise.all([
                fetch('/api/kategori'),
                fetch('/api/gedung')
            ])

            if (kategoriRes.ok) {
                const data = await kategoriRes.json()
                setKategoriList(data)
            }

            if (gedungRes.ok) {
                const data = await gedungRes.json()
                setGedungList(data)
            }
        } catch (error) {
            console.error('Error fetching options:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/aspirasi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Aspirasi berhasil dikirim!' })
                setFormData({
                    nama: session?.user?.username || '',
                    nim: '',
                    jurusan: '',
                    kategoriId: '',
                    gedungId: '',
                    isiAspirasi: ''
                })
            } else {
                const data = await response.json()
                setMessage({ type: 'error', text: data.error || 'Gagal mengirim aspirasi' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan. Silakan coba lagi.' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-400 to-blue-600 py-8 px-4">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-center py-5 rounded-t-lg shadow-lg mb-8">
                <h1 className="text-2xl font-semibold tracking-wide">Sistem Aspirasi Mahasiswa UDINUS</h1>
            </header>

            {/* Form Container */}
            <div className="max-w-md mx-auto bg-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-6">
                <h4 className="text-center text-blue-900 font-semibold text-xl mb-6">Formulir Aspirasi</h4>

                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-center ${message.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-400'
                        : 'bg-red-100 text-red-800 border border-red-400'
                        }`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-blue-900 font-medium mb-2 text-sm">Nama</label>
                        <input
                            type="text"
                            value={formData.nama}
                            onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                            required
                            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-900"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-blue-900 font-medium mb-2 text-sm">NIM</label>
                        <input
                            type="text"
                            value={formData.nim}
                            onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                            required
                            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-900"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-blue-900 font-medium mb-2 text-sm">Jurusan</label>
                        <input
                            type="text"
                            value={formData.jurusan}
                            onChange={(e) => setFormData({ ...formData, jurusan: e.target.value })}
                            placeholder="Contoh: Teknik Informatika"
                            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-900"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-blue-900 font-medium mb-2 text-sm">Gedung / Lokasi</label>
                        <select
                            value={formData.gedungId}
                            onChange={(e) => setFormData({ ...formData, gedungId: e.target.value })}
                            required
                            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-900"
                        >
                            <option value="">-- Pilih Gedung --</option>
                            {gedungList.map((gedung) => (
                                <option key={gedung.id} value={gedung.id}>
                                    {gedung.namaGedung}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-blue-900 font-medium mb-2 text-sm">Kategori</label>
                        <select
                            value={formData.kategoriId}
                            onChange={(e) => setFormData({ ...formData, kategoriId: e.target.value })}
                            required
                            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm text-gray-900"
                        >
                            <option value="">-- Pilih Kategori Aspirasi --</option>
                            {kategoriList.map((kategori) => (
                                <option key={kategori.id} value={kategori.id}>
                                    {kategori.namaKategori}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-blue-900 font-medium mb-2 text-sm">Isi Aspirasi</label>
                        <textarea
                            value={formData.isiAspirasi}
                            onChange={(e) => setFormData({ ...formData, isiAspirasi: e.target.value })}
                            required
                            rows={3}
                            className="w-full px-3 py-2 border-2 border-blue-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none text-gray-900"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? 'Mengirim...' : 'Kirim Aspirasi'}
                    </button>
                </form>
            </div>
        </div>
    )
}
