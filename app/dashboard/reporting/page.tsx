'use client'

import { useEffect, useState } from 'react'

interface ReportData {
    kategori: string
    total: number
    menunggu: number
    diproses: number
    selesai: number
}

export default function ReportingPage() {
    const [reportData, setReportData] = useState<ReportData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchReportData()
    }, [])

    const fetchReportData = async () => {
        try {
            const response = await fetch('/api/reporting')

            if (response.ok) {
                const data = await response.json()
                setReportData(data)
            }
        } catch (error) {
            console.error('Error fetching report data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    if (loading) {
        return <div className="text-center py-8">Loading...</div>
    }

    return (
        <div className="py-6 px-4">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold text-blue-700">Laporan Aspirasi</h3>
                <button
                    onClick={handlePrint}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition print:hidden shadow-md"
                >
                    🖨️ Cetak Laporan
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-blue-500 text-white">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold">Kategori</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold">Total</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold">Menunggu</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold">Diproses</th>
                                <th className="px-4 py-3 text-center text-sm font-semibold">Selesai</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reportData.length > 0 ? (
                                reportData.map((item, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                                        <td className="px-4 py-3 text-sm font-medium">{item.kategori}</td>
                                        <td className="px-4 py-3 text-sm text-center font-semibold">{item.total}</td>
                                        <td className="px-4 py-3 text-sm text-center">
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                                                {item.menunggu}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center">
                                            <span className="px-2 py-1 bg-cyan-100 text-cyan-800 rounded-full text-xs font-semibold">
                                                {item.diproses}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-center">
                                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                                {item.selesai}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                        Tidak ada data laporan
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        <tfoot className="bg-gray-100 font-semibold">
                            <tr>
                                <td colSpan={2} className="px-4 py-3 text-sm">TOTAL</td>
                                <td className="px-4 py-3 text-sm text-center">
                                    {reportData.reduce((sum, item) => sum + item.total, 0)}
                                </td>
                                <td className="px-4 py-3 text-sm text-center">
                                    {reportData.reduce((sum, item) => sum + item.menunggu, 0)}
                                </td>
                                <td className="px-4 py-3 text-sm text-center">
                                    {reportData.reduce((sum, item) => sum + item.diproses, 0)}
                                </td>
                                <td className="px-4 py-3 text-sm text-center">
                                    {reportData.reduce((sum, item) => sum + item.selesai, 0)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            <div className="mt-6 text-sm text-gray-600 print:block">
                <p>Laporan dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                <p>Sistem Aspirasi Mahasiswa - Universitas Dian Nuswantoro</p>
            </div>
        </div>
    )
}
