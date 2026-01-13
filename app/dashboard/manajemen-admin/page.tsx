'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Kategori {
    id: number
    namaKategori: string
}

interface Gedung {
    id: number
    namaGedung: string
}

interface Penugasan {
    id: number
    kategoriId: number
    gedungId: number
    kategori: Kategori
    gedung: Gedung
}

interface Admin {
    id: number
    username: string
    canUbahStatus: boolean
    isSuperadmin: boolean
    penugasan: Penugasan[]
}

export default function ManajemenAdminPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [admins, setAdmins] = useState<Admin[]>([])
    const [kategoriList, setKategoriList] = useState<Kategori[]>([])
    const [gedungList, setGedungList] = useState<Gedung[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        canUbahStatus: false,
        isSuperadmin: false,
        penugasan: [] as Array<{ kategoriId: number; gedungId: number }>
    })

    useEffect(() => {
        if (session && !session.user.isSuperadmin) {
            router.push('/dashboard')
            return
        }
        fetchData()
    }, [session])

    const fetchData = async () => {
        try {
            const [adminsRes, kategoriRes, gedungRes] = await Promise.all([
                fetch('/api/admin'),
                fetch('/api/kategori'),
                fetch('/api/gedung')
            ])

            if (adminsRes.ok) {
                const data = await adminsRes.json()
                setAdmins(data)
            }
            if (kategoriRes.ok) {
                const data = await kategoriRes.json()
                setKategoriList(data)
            }
            if (gedungRes.ok) {
                const data = await gedungRes.json()
                setGedungList(data)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleOpenModal = (admin?: Admin) => {
        if (admin) {
            setEditingAdmin(admin)
            setFormData({
                username: admin.username,
                password: '',
                canUbahStatus: admin.canUbahStatus,
                isSuperadmin: admin.isSuperadmin,
                penugasan: admin.penugasan.map(p => ({
                    kategoriId: p.kategoriId,
                    gedungId: p.gedungId
                }))
            })
        } else {
            setEditingAdmin(null)
            setFormData({
                username: '',
                password: '',
                canUbahStatus: false,
                isSuperadmin: false,
                penugasan: []
            })
        }
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setEditingAdmin(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)

        try {
            const url = editingAdmin ? `/api/admin/${editingAdmin.id}` : '/api/admin'
            const method = editingAdmin ? 'PATCH' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: editingAdmin ? 'Admin berhasil diupdate' : 'Admin berhasil ditambahkan' })
                handleCloseModal()
                fetchData()
            } else {
                setMessage({ type: 'error', text: data.error || 'Terjadi kesalahan' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' })
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus admin ini?')) return

        try {
            const response = await fetch(`/api/admin/${id}`, {
                method: 'DELETE'
            })

            if (response.ok) {
                setMessage({ type: 'success', text: 'Admin berhasil dihapus' })
                fetchData()
            } else {
                const data = await response.json()
                setMessage({ type: 'error', text: data.error || 'Gagal menghapus admin' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Terjadi kesalahan' })
        }
    }

    const addPenugasan = () => {
        if (kategoriList.length > 0 && gedungList.length > 0) {
            setFormData(prev => ({
                ...prev,
                penugasan: [...prev.penugasan, { kategoriId: kategoriList[0].id, gedungId: gedungList[0].id }]
            }))
        }
    }

    const removePenugasan = (index: number) => {
        setFormData(prev => ({
            ...prev,
            penugasan: prev.penugasan.filter((_, i) => i !== index)
        }))
    }

    const updatePenugasan = (index: number, field: 'kategoriId' | 'gedungId', value: number) => {
        setFormData(prev => ({
            ...prev,
            penugasan: prev.penugasan.map((p, i) => i === index ? { ...p, [field]: value } : p)
        }))
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div className="py-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-blue-700">Manajemen Admin</h3>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-md transition"
                >
                    ➕ Tambah Admin
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg ${message.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-400'
                        : 'bg-red-100 text-red-800 border border-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Admin Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="w-full">
                    <thead className="bg-blue-500 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Username</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Permissions</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Penugasan</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {admins.map((admin, index) => (
                            <tr key={admin.id} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm">{index + 1}</td>
                                <td className="px-4 py-3 text-sm font-medium">{admin.username}</td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="flex gap-2">
                                        {admin.isSuperadmin && (
                                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-semibold">
                                                Superadmin
                                            </span>
                                        )}
                                        {admin.canUbahStatus && (
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                                Eksekutor
                                            </span>
                                        )}
                                        {!admin.canUbahStatus && !admin.isSuperadmin && (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-semibold">
                                                Monitor
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    {admin.penugasan.length > 0 ? (
                                        <div className="space-y-1">
                                            {admin.penugasan.map((p, idx) => (
                                                <div key={idx} className="text-xs bg-blue-50 px-2 py-1 rounded">
                                                    {p.kategori.namaKategori} - {p.gedung.namaGedung}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 text-xs">Tidak ada penugasan</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpenModal(admin)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs"
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(admin.id)}
                                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                                            disabled={admin.id === parseInt(session?.user.id || '0')}
                                        >
                                            🗑️ Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {admins.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                    Belum ada admin
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="bg-blue-500 text-white px-6 py-4 flex justify-between items-center">
                            <h4 className="text-lg font-semibold">
                                {editingAdmin ? 'Edit Admin' : 'Tambah Admin Baru'}
                            </h4>
                            <button onClick={handleCloseModal} className="text-white hover:text-gray-200">
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Username */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
                                />
                            </div>

                            {/* Password */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Password {editingAdmin && '(Kosongkan jika tidak ingin mengubah)'}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingAdmin}
                                    minLength={6}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
                                />
                            </div>

                            {/* Permissions */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">Permissions</label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.canUbahStatus}
                                            onChange={(e) => setFormData({ ...formData, canUbahStatus: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">Can Ubah Status (Eksekutor)</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={formData.isSuperadmin}
                                            onChange={(e) => setFormData({ ...formData, isSuperadmin: e.target.checked })}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">Is Superadmin</span>
                                    </label>
                                </div>
                            </div>

                            {/* Penugasan */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-gray-700 font-medium">Penugasan</label>
                                    <button
                                        type="button"
                                        onClick={addPenugasan}
                                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                                    >
                                        ➕ Tambah
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.penugasan.map((p, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <select
                                                value={p.kategoriId}
                                                onChange={(e) => updatePenugasan(idx, 'kategoriId', parseInt(e.target.value))}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                                            >
                                                {kategoriList.map(k => (
                                                    <option key={k.id} value={k.id}>{k.namaKategori}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={p.gedungId}
                                                onChange={(e) => updatePenugasan(idx, 'gedungId', parseInt(e.target.value))}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm text-gray-900 bg-white"
                                            >
                                                {gedungList.map(g => (
                                                    <option key={g.id} value={g.id}>{g.namaGedung}</option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => removePenugasan(idx)}
                                                className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    ))}
                                    {formData.penugasan.length === 0 && (
                                        <p className="text-sm text-gray-500">Belum ada penugasan. Klik "Tambah" untuk menambahkan.</p>
                                    )}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    {editingAdmin ? 'Update' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
