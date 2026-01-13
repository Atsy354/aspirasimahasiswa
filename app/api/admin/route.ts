import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// GET - Fetch all admins (superadmin only)
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.isSuperadmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const admins = await prisma.user.findMany({
            where: {
                role: 'admin'
            },
            include: {
                adminPenugasan: {
                    include: {
                        kategori: true,
                        gedung: true
                    }
                }
            },
            orderBy: {
                username: 'asc'
            }
        })

        return NextResponse.json(admins)
    } catch (error) {
        console.error('Error fetching admins:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// POST - Create new admin (superadmin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.isSuperadmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { username, password, canUbahStatus, isSuperadmin, penugasan } = body

        // Validation
        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password required' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
        }

        // Check if username exists
        const existing = await prisma.user.findUnique({
            where: { username }
        })

        if (existing) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create admin
        const admin = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: 'admin',
                canUbahStatus: canUbahStatus || false,
                isSuperadmin: isSuperadmin || false
            }
        })

        // Create penugasan if provided
        if (penugasan && Array.isArray(penugasan) && penugasan.length > 0) {
            await prisma.adminPenugasan.createMany({
                data: penugasan.map((p: { kategoriId: number; gedungId: number }) => ({
                    userId: admin.id,
                    kategoriId: p.kategoriId,
                    gedungId: p.gedungId
                }))
            })
        }

        return NextResponse.json({ success: true, admin }, { status: 201 })
    } catch (error) {
        console.error('Error creating admin:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
