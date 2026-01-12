import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const kategori = await prisma.kategori.findMany({
            orderBy: {
                namaKategori: 'asc'
            }
        })

        return NextResponse.json(kategori)
    } catch (error) {
        console.error('Error fetching kategori:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
