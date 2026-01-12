'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Aspirasi {
    id: number
    nama: string
    nim: string
    jurusan: string | null
    isiAspirasi: string
    status: 'Menunggu' | 'Diproses' | 'Selesai'
    isFlagged: boolean
    tanggal: string
    kategori: {
        id: number
        namaKategori: string
    }
    gedung: {
        namaGedung: string
    }
}

interface KategoriGroup {
    kategori: string
    kategoriId: number
    count: number
    aspirasi: Aspirasi[]
}

export default function AspirasiPage() {
    const { data: session } = useSession()
    const [aspirasi, setAspirasi] = useState<Aspirasi[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedKategori, setSelectedKategori] = useState<number | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        fetchAspirasi()
    }, [])

    const fetchAspirasi = async () => {
        try {
            const response = await fetch('/api/aspirasi')

            if (response.ok) {
                const data = await response.json()
                setAspirasi(data)
            }
        } catch (error) {
            console.error('Error fetching aspirasi:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (id: number, newStatus: string) => {
        if (!session?.user.canUbahStatus && !session?.user.isSuperadmin) {
            setMessage({ type: 'error', text: 'Anda tidak memiliki izin untuk mengubah status' })
            return
        }

        try {
            const response = await fetch(`/api/aspirasi/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Status berhasil diubah' })
                fetchAspirasi()
            } else {
                setMessage({ type: 'error', text: 'Gagal mengubah status' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' })
        }
    }

    const handleFlagToggle = async (id: number, currentFlag: boolean) => {
        try {
            const response = await fetch(`/api/aspirasi/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isFlagged: !currentFlag }),
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Flag berhasil diubah' })
                fetchAspirasi()
            } else {
                setMessage({ type: 'error', text: 'Gagal mengubah flag' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' })
        }
    }

    const handleDelete = async (id: number) => {
        if (!session?.user.isSuperadmin) {
            setMessage({ type: 'error', text: 'Hanya superadmin yang dapat menghapus aspirasi' })
            return
        }

        if (!confirm('Apakah Anda yakin ingin menghapus aspirasi ini?')) {
            return
        }

        try {
            const response = await fetch(`/api/aspirasi/${id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Aspirasi berhasil dihapus' })
                fetchAspirasi()
            } else {
                setMessage({ type: 'error', text: 'Gagal menghapus aspirasi' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' })
        }
    }

    // Group aspirasi by kategori
    const groupedByKategori: KategoriGroup[] = aspirasi.reduce((acc: KategoriGroup[], curr) => {
        const existing = acc.find(g => g.kategoriId === curr.kategori.id)
        if (existing) {
            existing.count++
            existing.aspirasi.push(curr)
        } else {
            acc.push({
                kategori: curr.kategori.namaKategori,
                kategoriId: curr.kategori.id,
                count: 1,
                aspirasi: [curr]
            })
        }
        return acc
    }, [])

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div className="py-6 px-4">
            <h3 className="text-3xl font-bold text-blue-700 mb-6">Article</h3>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-400'
                    : 'bg-red-100 text-red-800 border border-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Card Container */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">
                    Kategori Aspirasi (Sesuai Scope Anda)
                </h4>

                {/* Category Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {groupedByKategori.map((group) => (
                        <div key={group.kategoriId} className="relative">
                            <button
                                onClick={() => setSelectedKategori(selectedKategori === group.kategoriId ? null : group.kategoriId)}
                                className="w-full text-left p-4 border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h5 className="font-semibold text-blue-600 mb-1">{group.kategori}</h5>
                                        <p className="text-xs text-gray-600">Klik untuk lihat detail</p>
                                    </div>
                                    <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full font-bold">
                                        {group.count}
                                    </div>
                                </div>
                            </button>
                        </div>
                    ))}
                </div>

                {/* Detail Section */}
                {selectedKategori && (
                    <div className="mt-6 border-t pt-6">
                        <h5 className="text-lg font-semibold text-gray-800 mb-4">
                            Detail Aspirasi - {groupedByKategori.find(g => g.kategoriId === selectedKategori)?.kategori}
                        </h5>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Nama</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">NIM</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Gedung</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Aspirasi</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Tanggal</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedByKategori
                                        .find(g => g.kategoriId === selectedKategori)
                                        ?.aspirasi.map((item, index) => (
                                            <tr key={item.id} className={`border-b hover:bg-gray-50 ${item.isFlagged ? 'bg-red-50' : ''}`}>
                                                <td className="px-4 py-3 text-sm">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="font-medium">{item.nama}</div>
                                                    <div className="text-xs text-gray-500">{item.jurusan || '-'}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">{item.nim}</td>
                                                <td className="px-4 py-3 text-sm">{item.gedung.namaGedung}</td>
                                                <td className="px-4 py-3 text-sm max-w-xs">
                                                    <div className="line-clamp-2">{item.isiAspirasi}</div>
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    {session?.user.canUbahStatus || session?.user.isSuperadmin ? (
                                                        <select
                                                            value={item.status}
                                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold border-0 text-gray-900 ${item.status === 'Menunggu' ? 'bg-yellow-100' :
                                                                item.status === 'Diproses' ? 'bg-cyan-100' :
                                                                    'bg-green-100'
                                                                }`}
                                                        >
                                                            <option value="Menunggu">Menunggu</option>
                                                            <option value="Diproses">Diproses</option>
                                                            <option value="Selesai">Selesai</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                                                            item.status === 'Diproses' ? 'bg-cyan-100 text-cyan-800' :
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                            {item.status}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-sm whitespace-nowrap text-xs">
                                                    {new Date(item.tanggal).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleFlagToggle(item.id, item.isFlagged)}
                                                            className={`px-2 py-1 rounded text-xs ${item.isFlagged
                                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                }`}
                                                            title={item.isFlagged ? 'Unflag' : 'Flag'}
                                                        >
                                                            🚩
                                                        </button>
                                                        {session?.user.isSuperadmin && (
                                                            <button
                                                                onClick={() => handleDelete(item.id)}
                                                                className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                                                title="Hapus"
                                                            >
                                                                🗑️
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {groupedByKategori.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Belum ada aspirasi yang masuk
                    </div>
                )}
            </div>
        </div>
    )
}
