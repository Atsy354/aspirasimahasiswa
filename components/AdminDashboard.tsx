'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Statistics {
    total: number
    menunggu: number
    diproses: number
    selesai: number
}

interface Aspirasi {
    id: number
    nama: string
    nim: string
    jurusan: string | null
    isiAspirasi: string
    status: 'Menunggu' | 'Diproses' | 'Selesai'
    tanggal: string
    kategori: {
        namaKategori: string
    }
    gedung: {
        namaGedung: string
    }
}

export default function AdminDashboard() {
    const { data: session } = useSession()
    const [stats, setStats] = useState<Statistics>({ total: 0, menunggu: 0, diproses: 0, selesai: 0 })
    const [recentAspirasi, setRecentAspirasi] = useState<Aspirasi[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const [statsRes, aspirasiRes] = await Promise.all([
                fetch('/api/statistics'),
                fetch('/api/aspirasi')
            ])

            if (statsRes.ok) {
                const data = await statsRes.json()
                setStats(data)
            }

            if (aspirasiRes.ok) {
                const data = await aspirasiRes.json()
                setRecentAspirasi(data.slice(0, 5))
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-gray-100 py-6 px-4">
            {/* Page Title */}
            <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                Dashboard Aspirasi Mahasiswa
            </h2>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Total Aspirasi */}
                <div className="bg-blue-500 text-white rounded-lg shadow-lg p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Total Aspirasi</h3>
                    <p className="text-5xl font-bold">{stats.total}</p>
                </div>

                {/* Menunggu */}
                <div className="bg-yellow-400 text-white rounded-lg shadow-lg p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Menunggu</h3>
                    <p className="text-5xl font-bold">{stats.menunggu}</p>
                </div>

                {/* Diproses */}
                <div className="bg-cyan-400 text-white rounded-lg shadow-lg p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Diproses</h3>
                    <p className="text-5xl font-bold">{stats.diproses}</p>
                </div>

                {/* Selesai */}
                <div className="bg-green-500 text-white rounded-lg shadow-lg p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Selesai</h3>
                    <p className="text-5xl font-bold">{stats.selesai}</p>
                </div>
            </div>

            {/* Recent Aspirasi Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-blue-500 text-white px-4 py-3">
                    <h4 className="font-semibold flex items-center">
                        <span className="mr-2">📋</span>
                        Aspirasi Terbaru (Scope: Semua)
                    </h4>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">#</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">NIM</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Jurusan</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Gedung</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Kategori</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Aspirasi</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tanggal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentAspirasi.length > 0 ? (
                                recentAspirasi.map((item, index) => (
                                    <tr key={item.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.nama}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.nim}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.jurusan || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.gedung.namaGedung}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900">{item.kategori.namaKategori}</td>
                                        <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                                            <div className="line-clamp-1">{item.isiAspirasi}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Menunggu' ? 'bg-yellow-400 text-white' :
                                                    item.status === 'Diproses' ? 'bg-cyan-400 text-white' :
                                                        'bg-green-500 text-white'
                                                }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                                            {new Date(item.tanggal).toLocaleString('id-ID', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                                        Belum ada aspirasi
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* View All Button */}
                {recentAspirasi.length > 0 && (
                    <div className="p-4 text-center border-t">
                        <Link
                            href="/dashboard/aspirasi"
                            className="inline-block px-6 py-2 bg-white border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 font-medium transition"
                        >
                            Lihat Semua
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
