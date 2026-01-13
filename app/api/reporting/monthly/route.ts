import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const month = searchParams.get('month')
        const year = searchParams.get('year')

        if (!month || !year) {
            return NextResponse.json({ error: 'Month and year required' }, { status: 400 })
        }

        const monthNum = parseInt(month)
        const yearNum = parseInt(year)

        // Build where clause for date range
        const startDate = new Date(yearNum, monthNum - 1, 1)
        const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59)

        let whereClause: any = {
            tanggal: {
                gte: startDate,
                lte: endDate
            }
        }

        // Filter based on user role
        if (!session.user.isSuperadmin) {
            const penugasan = await prisma.adminPenugasan.findMany({
                where: { userId: parseInt(session.user.id) }
            })

            if (penugasan.length > 0) {
                const scopes = penugasan.map((p: { kategoriId: number; gedungId: number }) => ({
                    AND: [
                        { kategoriId: p.kategoriId },
                        { gedungId: p.gedungId }
                    ]
                }))
                whereClause.OR = scopes
            } else {
                return NextResponse.json({
                    success: true,
                    total: 0,
                    categories: [],
                    statusSummary: []
                })
            }
        }

        // Get all aspirasi for the month
        const aspirasi = await prisma.aspirasi.findMany({
            where: whereClause,
            include: {
                kategori: true
            }
        })

        const total = aspirasi.length

        // Group by kategori
        const kategoriMap = new Map<number, { kategori: string, total: number }>()
        aspirasi.forEach(item => {
            const existing = kategoriMap.get(item.kategoriId)
            if (existing) {
                existing.total++
            } else {
                kategoriMap.set(item.kategoriId, {
                    kategori: item.kategori.namaKategori,
                    total: 1
                })
            }
        })

        const categories = Array.from(kategoriMap.values()).map(item => ({
            ...item,
            percent: total > 0 ? (item.total / total) * 100 : 0
        }))

        // Group by status
        const statusMap = new Map<string, number>()
        statusMap.set('Menunggu', 0)
        statusMap.set('Diproses', 0)
        statusMap.set('Selesai', 0)

        aspirasi.forEach(item => {
            statusMap.set(item.status, (statusMap.get(item.status) || 0) + 1)
        })

        const statusSummary = Array.from(statusMap.entries()).map(([status, count]) => ({
            status,
            total: count,
            percent: total > 0 ? (count / total) * 100 : 0
        }))

        return NextResponse.json({
            success: true,
            total,
            categories,
            statusSummary
        })
    } catch (error) {
        console.error('Error fetching report data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
