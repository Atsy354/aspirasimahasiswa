import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { username, password } = body

        // Validation
        if (!username || !password) {
            return NextResponse.json({ error: 'Username dan password harus diisi' }, { status: 400 })
        }

        if (username.length < 3) {
            return NextResponse.json({ error: 'Username minimal 3 karakter' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password minimal 6 karakter' }, { status: 400 })
        }

        // Check if username already exists
        const existingUser = await prisma.user.findUnique({
            where: { username }
        })

        if (existingUser) {
            return NextResponse.json({ error: 'Username sudah digunakan' }, { status: 400 })
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                role: 'mahasiswa',
                isSuperadmin: false,
                canUbahStatus: false
            }
        })

        return NextResponse.json({
            message: 'Registrasi berhasil',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        }, { status: 201 })
    } catch (error) {
        console.error('Error during registration:', error)
        return NextResponse.json({ error: 'Terjadi kesalahan saat registrasi' }, { status: 500 })
    }
}
