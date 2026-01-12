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

        // Get all categories
        const categories = await prisma.kategori.findMany({
            orderBy: { namaKategori: 'asc' }
        })

        let whereClause: any = {}

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
                return NextResponse.json([])
            }
        }

        // Get report data for each category
        const reportData = await Promise.all(
            categories.map(async (kategori: { id: number; namaKategori: string }) => {
                const categoryWhere = {
                    ...whereClause,
                    kategoriId: kategori.id
                }

                const [total, menunggu, diproses, selesai] = await Promise.all([
                    prisma.aspirasi.count({ where: categoryWhere }),
                    prisma.aspirasi.count({ where: { ...categoryWhere, status: 'Menunggu' } }),
                    prisma.aspirasi.count({ where: { ...categoryWhere, status: 'Diproses' } }),
                    prisma.aspirasi.count({ where: { ...categoryWhere, status: 'Selesai' } })
                ])

                return {
                    kategori: kategori.namaKategori,
                    total,
                    menunggu,
                    diproses,
                    selesai
                }
            })
        )

        // Filter out categories with no data
        const filteredData = reportData.filter(item => item.total > 0)

        return NextResponse.json(filteredData)
    } catch (error) {
        console.error('Error fetching reporting data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
