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
    const [statusChanges, setStatusChanges] = useState<{ [key: number]: string }>({})

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
                setStatusChanges(prev => {
                    const newChanges = { ...prev }
                    delete newChanges[id]
                    return newChanges
                })
                fetchAspirasi()
            } else {
                setMessage({ type: 'error', text: 'Gagal mengubah status' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' })
        }
    }

    const handleFlagToggle = async (id: number, currentFlag: boolean, item: Aspirasi) => {
        // Complex flag logic from PHP
        const canFlag = () => {
            if (session?.user.isSuperadmin) return true
            // Monitor (admin without can_ubah_status) can only flag, not unflag
            if (!session?.user.canUbahStatus && !currentFlag) return true
            return false
        }

        const canUnflag = () => {
            if (session?.user.isSuperadmin) return true
            // Eksekutor can unflag only if status is "Selesai"
            if (session?.user.canUbahStatus && currentFlag && item.status === 'Selesai') return true
            return false
        }

        if (!canFlag() && !canUnflag()) {
            let errorMsg = 'Anda tidak memiliki izin untuk mengubah flag'
            if (currentFlag && session?.user.canUbahStatus && item.status !== 'Selesai') {
                errorMsg = 'Hanya bisa Un-Flag jika status aspirasi sudah Selesai'
            } else if (currentFlag && !session?.user.canUbahStatus) {
                errorMsg = 'Hanya Eksekutor/Superadmin yang bisa Un-Flag'
            } else if (!currentFlag && session?.user.canUbahStatus) {
                errorMsg = 'Hanya Monitor/Superadmin yang bisa Flag'
            }
            setMessage({ type: 'error', text: errorMsg })
            return
        }

        try {
            const response = await fetch(`/api/aspirasi/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isFlagged: !currentFlag }),
            })

            if (response.ok) {
                setMessage({ type: 'success', text: `Aspirasi berhasil ${!currentFlag ? 'ditandai' : 'dibatalkan'}` })
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

    // Group aspirasi by kategori and sort by is_flagged
    const groupedByKategori: KategoriGroup[] = aspirasi
        .sort((a, b) => {
            // Sort by is_flagged DESC, then by tanggal DESC
            if (a.isFlagged !== b.isFlagged) return a.isFlagged ? -1 : 1
            return new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
        })
        .reduce((acc: KategoriGroup[], curr) => {
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
                {selectedKategori === null ? (
                    <>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            {session?.user.role === 'admin' ? 'Kategori Aspirasi (Sesuai Scope Anda)' : 'Kategori Aspirasi'}
                        </h4>

                        {/* Category Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {groupedByKategori.map((group) => (
                                <div key={group.kategoriId} className="relative">
                                    <button
                                        onClick={() => setSelectedKategori(group.kategoriId)}
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

                        {groupedByKategori.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                {session?.user.role === 'admin'
                                    ? 'Tidak ada aspirasi yang sesuai dengan penugasan Anda.'
                                    : 'Belum ada aspirasi yang masuk.'}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Breadcrumb */}
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h5 className="text-lg font-semibold mb-0">
                                    Kategori: <span className="text-blue-600">
                                        {groupedByKategori.find(g => g.kategoriId === selectedKategori)?.kategori}
                                    </span>
                                </h5>
                                <small className="text-gray-600">
                                    {groupedByKategori.find(g => g.kategoriId === selectedKategori)?.count || 0} laporan
                                    {session?.user.role === 'admin' && ' (sesuai scope Anda)'}
                                </small>
                            </div>
                            <button
                                onClick={() => setSelectedKategori(null)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                            >
                                Kembali ke Kategori
                            </button>
                        </div>

                        {/* Detail Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse table-auto">
                                <thead className="bg-gray-50 border-b">
                                    <tr className="text-center">
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700" style={{ width: '40px' }}>#</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Nama</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">NIM</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Jurusan</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Kategori</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Gedung</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700">Aspirasi</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700" style={{ width: '120px' }}>Status</th>
                                        <th className="px-4 py-3 text-sm font-semibold text-gray-700" style={{ width: '150px' }}>Tanggal</th>
                                        {(session?.user.canUbahStatus || session?.user.isSuperadmin) && (
                                            <th className="px-4 py-3 text-sm font-semibold text-gray-700" style={{ width: '160px' }}>Aksi Eksekutor</th>
                                        )}
                                        {session?.user.role === 'admin' && (
                                            <th className="px-4 py-3 text-sm font-semibold text-gray-700" style={{ width: '100px' }}>Aksi Lain</th>
                                        )}
                                        {session?.user.isSuperadmin && (
                                            <th className="px-4 py-3 text-sm font-semibold text-gray-700" style={{ width: '80px' }}>Aksi Hapus</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedByKategori
                                        .find(g => g.kategoriId === selectedKategori)
                                        ?.aspirasi.map((item, index) => (
                                            <tr key={item.id} className="border-b hover:bg-gray-50 align-middle">
                                                <td className="px-4 py-3 text-sm text-center">{index + 1}</td>
                                                <td className="px-4 py-3 text-sm text-center">{item.nama}</td>
                                                <td className="px-4 py-3 text-sm text-center">{item.nim}</td>
                                                <td className="px-4 py-3 text-sm text-center">{item.jurusan || '-'}</td>
                                                <td className="px-4 py-3 text-sm text-center">{item.kategori.namaKategori}</td>
                                                <td className="px-4 py-3 text-sm text-center">{item.gedung.namaGedung}</td>
                                                <td className="px-4 py-3 text-sm" style={{ maxWidth: '380px' }}>
                                                    <div className="flex flex-col items-center justify-center">
                                                        {item.isFlagged && (
                                                            <span className="badge bg-red-500 text-white px-2 py-1 rounded text-xs mb-1">
                                                                🚩 PERLU TINDAKAN
                                                            </span>
                                                        )}
                                                        <div>{item.isiAspirasi}</div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${item.status === 'Menunggu' ? 'bg-yellow-400 text-white' :
                                                            item.status === 'Diproses' ? 'bg-cyan-400 text-white' :
                                                                'bg-green-500 text-white'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-center whitespace-nowrap">
                                                    {new Date(item.tanggal).toLocaleDateString('id-ID', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </td>
                                                {/* Aksi Eksekutor */}
                                                {(session?.user.canUbahStatus || session?.user.isSuperadmin) && (
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        <div className="flex gap-1 justify-center items-center">
                                                            <select
                                                                value={statusChanges[item.id] || item.status}
                                                                onChange={(e) => setStatusChanges(prev => ({ ...prev, [item.id]: e.target.value }))}
                                                                className="form-select text-xs px-2 py-1 border border-gray-300 rounded text-gray-900 bg-white"
                                                                style={{ width: '110px' }}
                                                            >
                                                                <option value="Menunggu">Menunggu</option>
                                                                <option value="Diproses">Diproses</option>
                                                                <option value="Selesai">Selesai</option>
                                                            </select>
                                                            <button
                                                                onClick={() => handleStatusChange(item.id, statusChanges[item.id] || item.status)}
                                                                disabled={!statusChanges[item.id] || statusChanges[item.id] === item.status}
                                                                className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                            >
                                                                Ubah
                                                            </button>
                                                        </div>
                                                    </td>
                                                )}
                                                {/* Aksi Lain (Flag) */}
                                                {session?.user.role === 'admin' && (
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        <button
                                                            onClick={() => handleFlagToggle(item.id, item.isFlagged, item)}
                                                            className={`px-2 py-1 rounded text-xs ${item.isFlagged
                                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                                }`}
                                                            title={item.isFlagged ? 'Un-Flag' : 'Flag'}
                                                        >
                                                            🚩 {item.isFlagged ? 'Un-Flag' : 'Flag'}
                                                        </button>
                                                    </td>
                                                )}
                                                {/* Aksi Hapus */}
                                                {session?.user.isSuperadmin && (
                                                    <td className="px-4 py-3 text-sm text-center">
                                                        <button
                                                            onClick={() => handleDelete(item.id)}
                                                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                                                            title="Hapus Aspirasi Permanen"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" className="inline">
                                                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
