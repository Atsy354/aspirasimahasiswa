'use client'

import { useSession } from 'next-auth/react'
import AdminDashboard from '@/components/AdminDashboard'
import MahasiswaDashboard from '@/components/MahasiswaDashboard'

export default function DashboardPage() {
    const { data: session } = useSession()

    if (!session) {
        return null
    }

    return session.user.role === 'admin' ? <AdminDashboard /> : <MahasiswaDashboard />
}
