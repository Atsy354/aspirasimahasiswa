import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// PATCH - Update admin
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.isSuperadmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: paramId } = await params
        const id = parseInt(paramId)
        const body = await request.json()
        const { username, password, canUbahStatus, isSuperadmin, penugasan } = body

        // Check if admin exists
        const admin = await prisma.user.findUnique({
            where: { id }
        })

        if (!admin || admin.role !== 'admin') {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
        }

        // Prepare update data
        const updateData: any = {
            canUbahStatus: canUbahStatus || false,
            isSuperadmin: isSuperadmin || false
        }

        if (username && username !== admin.username) {
            // Check if new username exists
            const existing = await prisma.user.findUnique({
                where: { username }
            })
            if (existing) {
                return NextResponse.json({ error: 'Username already exists' }, { status: 400 })
            }
            updateData.username = username
        }

        if (password && password.length >= 6) {
            updateData.password = await bcrypt.hash(password, 10)
        }

        // Update admin
        const updatedAdmin = await prisma.user.update({
            where: { id },
            data: updateData
        })

        // Update penugasan
        if (penugasan !== undefined) {
            // Delete existing penugasan
            await prisma.adminPenugasan.deleteMany({
                where: { userId: id }
            })

            // Create new penugasan
            if (Array.isArray(penugasan) && penugasan.length > 0) {
                await prisma.adminPenugasan.createMany({
                    data: penugasan.map((p: { kategoriId: number; gedungId: number }) => ({
                        userId: id,
                        kategoriId: p.kategoriId,
                        gedungId: p.gedungId
                    }))
                })
            }
        }

        return NextResponse.json({ success: true, admin: updatedAdmin })
    } catch (error) {
        console.error('Error updating admin:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Delete admin
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.isSuperadmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id: paramId } = await params
        const id = parseInt(paramId)

        // Check if admin exists
        const admin = await prisma.user.findUnique({
            where: { id }
        })

        if (!admin || admin.role !== 'admin') {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
        }

        // Prevent deleting yourself
        if (id === parseInt(session.user.id)) {
            return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
        }

        // Delete penugasan first
        await prisma.adminPenugasan.deleteMany({
            where: { userId: id }
        })

        // Delete admin
        await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting admin:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
