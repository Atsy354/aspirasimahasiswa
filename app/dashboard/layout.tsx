'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router])

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (!session) {
        return null
    }

    const isAdmin = session.user.role === 'admin'
    const isSuperadmin = session.user.isSuperadmin

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between py-3">
                        {/* Logo & Brand */}
                        <Link href="/dashboard" className="flex items-center space-x-3">
                            <Image
                                src="/logo.jpg"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <span className="text-white font-semibold text-lg hidden md:block">
                                Aspirasi Mahasiswa
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden lg:flex items-center space-x-6">
                            <Link href="/dashboard" className="text-white hover:text-blue-100 font-medium transition">
                                Dashboard
                            </Link>
                            {isAdmin && (
                                <>
                                    <Link href="/dashboard/aspirasi" className="text-white hover:text-blue-100 font-medium transition">
                                        List Aspirasi
                                    </Link>
                                    <Link href="/dashboard/reporting" className="text-white hover:text-blue-100 font-medium transition">
                                        Reporting
                                    </Link>
                                    {isSuperadmin && (
                                        <Link href="/dashboard/manajemen-admin" className="text-white hover:text-blue-100 font-medium transition">
                                            Manajemen Admin
                                        </Link>
                                    )}
                                </>
                            )}

                            {/* User Dropdown */}
                            <div className="relative group">
                                <button className="text-white font-semibold hover:text-blue-100 transition flex items-center space-x-1">
                                    <span>{session.user.username}</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/login' })}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden text-white p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden pb-4 space-y-2">
                            <Link
                                href="/dashboard"
                                className="block text-white hover:bg-blue-600 px-4 py-2 rounded transition"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            {isAdmin && (
                                <>
                                    <Link
                                        href="/dashboard/aspirasi"
                                        className="block text-white hover:bg-blue-600 px-4 py-2 rounded transition"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        List Aspirasi
                                    </Link>
                                    <Link
                                        href="/dashboard/reporting"
                                        className="block text-white hover:bg-blue-600 px-4 py-2 rounded transition"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Reporting
                                    </Link>
                                    {isSuperadmin && (
                                        <Link
                                            href="/dashboard/manajemen-admin"
                                            className="block text-white hover:bg-blue-600 px-4 py-2 rounded transition"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Manajemen Admin
                                        </Link>
                                    )}
                                </>
                            )}
                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="block w-full text-left text-white hover:bg-blue-600 px-4 py-2 rounded transition"
                            >
                                Logout ({session.user.username})
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto">
                {children}
            </main>

            {/* Footer */}
            <footer className="text-center py-6 mt-12 text-blue-700 text-sm">
                © {new Date().getFullYear()} Universitas Dian Nuswantoro | Sistem Aspirasi Mahasiswa
            </footer>
        </div>
    )
}
