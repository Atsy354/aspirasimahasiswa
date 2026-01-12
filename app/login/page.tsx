'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
    const router = useRouter()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                username,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Username atau password salah')
            } else {
                router.push('/dashboard')
                router.refresh()
            }
        } catch (err) {
            setError('Terjadi kesalahan. Silakan coba lagi.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center px-4 py-8">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-blue-50 text-center py-6 px-6">
                    <div className="w-20 h-20 mx-auto mb-4">
                        <Image
                            src="/logo.jpg"
                            alt="Logo Kampus"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                    </div>
                    <h5 className="text-xl font-semibold text-gray-800">Login Aspirasi Mahasiswa</h5>
                </div>

                {/* Body */}
                <div className="p-8">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Masukkan username"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-900 bg-white"
                                placeholder="Masukkan password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-400 hover:bg-cyan-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>

                        <div className="mt-3">
                            <Link
                                href="/register"
                                className="block w-full text-center border border-blue-400 text-blue-400 hover:bg-blue-50 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Registrasi
                            </Link>
                        </div>

                        <div className="text-center mt-4">
                            <Link
                                href="/"
                                className="text-gray-500 hover:text-gray-700 text-sm"
                            >
                                ← Kembali ke Beranda
                            </Link>
                        </div>
                    </form>

                    <hr className="my-4" />
                </div>
            </div>
        </div>
    )
}
