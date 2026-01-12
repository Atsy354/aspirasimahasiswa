import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const gedung = await prisma.gedung.findMany({
            orderBy: {
                namaGedung: 'asc'
            }
        })

        return NextResponse.json(gedung)
    } catch (error) {
        console.error('Error fetching gedung:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
