import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Fetch all aspirasi (with filtering for admin)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        let whereClause: any = {}

        // Filter based on user role
        if (session.user.role === 'admin' && !session.user.isSuperadmin) {
            // Get admin's assigned categories and buildings
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
                // No assignments, return empty
                return NextResponse.json([])
            }
        }

        // Add status filter if provided
        if (status && status !== 'all') {
            whereClause.status = status
        }

        const aspirasi = await prisma.aspirasi.findMany({
            where: whereClause,
            include: {
                kategori: true,
                gedung: true
            },
            orderBy: {
                tanggal: 'desc'
            }
        })

        return NextResponse.json(aspirasi)
    } catch (error) {
        console.error('Error fetching aspirasi:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create new aspirasi
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { nama, nim, jurusan, kategoriId, gedungId, isiAspirasi } = body

        // Validation
        if (!nama || !nim || !kategoriId || !gedungId || !isiAspirasi) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const aspirasi = await prisma.aspirasi.create({
            data: {
                nama,
                nim,
                jurusan: jurusan || null,
                kategoriId: parseInt(kategoriId),
                gedungId: parseInt(gedungId),
                isiAspirasi,
                status: 'Menunggu'
            },
            include: {
                kategori: true,
                gedung: true
            }
        })

        return NextResponse.json(aspirasi, { status: 201 })
    } catch (error) {
        console.error('Error creating aspirasi:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
