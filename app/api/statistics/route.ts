import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let whereClause: any = {}

        // Filter based on user role
        if (!session.user.isSuperadmin) {
            const penugasan = await prisma.adminPenugasan.findMany({
                where: { userId: parseInt(session.user.id) }
            })

            if (penugasan.length > 0) {
                const scopes = penugasan.map(p => ({
                    AND: [
                        { kategoriId: p.kategoriId },
                        { gedungId: p.gedungId }
                    ]
                }))
                whereClause.OR = scopes
            } else {
                return NextResponse.json({
                    total: 0,
                    menunggu: 0,
                    diproses: 0,
                    selesai: 0
                })
            }
        }

        const [total, menunggu, diproses, selesai] = await Promise.all([
            prisma.aspirasi.count({ where: whereClause }),
            prisma.aspirasi.count({ where: { ...whereClause, status: 'Menunggu' } }),
            prisma.aspirasi.count({ where: { ...whereClause, status: 'Diproses' } }),
            prisma.aspirasi.count({ where: { ...whereClause, status: 'Selesai' } })
        ])

        return NextResponse.json({
            total,
            menunggu,
            diproses,
            selesai
        })
    } catch (error) {
        console.error('Error fetching statistics:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
