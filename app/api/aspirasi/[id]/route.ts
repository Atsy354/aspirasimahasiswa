import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PATCH - Update aspirasi status
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Check if admin can change status
        if (!session.user.canUbahStatus && !session.user.isSuperadmin) {
            return NextResponse.json({ error: 'No permission to change status' }, { status: 403 })
        }

        const { id } = await params
        const body = await request.json()
        const { status, isFlagged } = body

        const updateData: any = {}
        if (status) updateData.status = status
        if (typeof isFlagged === 'boolean') updateData.isFlagged = isFlagged

        const aspirasi = await prisma.aspirasi.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: {
                kategori: true,
                gedung: true
            }
        })

        return NextResponse.json(aspirasi)
    } catch (error) {
        console.error('Error updating aspirasi:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// DELETE - Delete aspirasi
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user.isSuperadmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params

        await prisma.aspirasi.delete({
            where: { id: parseInt(id) }
        })

        return NextResponse.json({ message: 'Aspirasi deleted successfully' })
    } catch (error) {
        console.error('Error deleting aspirasi:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
