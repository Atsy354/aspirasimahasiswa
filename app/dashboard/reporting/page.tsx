'use client'

import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface ReportData {
    success: boolean
    total: number
    categories: Array<{
        kategori: string
        total: number
        percent: number
    }>
    statusSummary: Array<{
        status: string
        total: number
        percent: number
    }>
}

export default function ReportingPage() {
    const currentMonth = new Date().getMonth() + 1
    const currentYear = new Date().getFullYear()

    const [month, setMonth] = useState(currentMonth)
    const [year, setYear] = useState(currentYear)
    const [reportData, setReportData] = useState<ReportData | null>(null)
    const [loading, setLoading] = useState(false)

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]

    const fetchReportData = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/reporting/monthly?month=${month}&year=${year}`)
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

    useEffect(() => {
        fetchReportData()
    }, [])

    const handlePrint = () => {
        window.print()
    }

    const kategoriChartData = {
        labels: reportData?.categories.map(c => `${c.kategori} (${c.total})`) || [],
        datasets: [{
            data: reportData?.categories.map(c => c.total) || [],
            backgroundColor: ['#004c97', '#6ec6ff', '#7fc97f', '#fdc086', '#beaed4'],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    }

    const statusChartData = {
        labels: reportData?.statusSummary.map(s => `${s.status} (${s.total})`) || [],
        datasets: [{
            data: reportData?.statusSummary.map(s => s.total) || [],
            backgroundColor: ['#f1c40f', '#3498db', '#2ecc71'],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    }

    const chartOptions: ChartOptions<'pie'> = {
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }

    return (
        <div className="py-6 px-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h5 className="text-xl font-bold text-blue-600 mb-4 flex items-center">
                    <span className="mr-2">📊</span>
                    Statistik Aspirasi Bulanan
                </h5>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 print:hidden">
                    <div className="md:col-span-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Pilih Bulan</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
                        >
                            {months.map((m, idx) => (
                                <option key={idx} value={idx + 1}>{m}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-3">
                        <label className="block text-sm font-semibold text-gray-600 mb-2">Pilih Tahun</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-blue-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-900 bg-white"
                        >
                            {Array.from({ length: 5 }, (_, i) => currentYear - 3 + i).map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-3 flex items-end">
                        <button
                            onClick={fetchReportData}
                            disabled={loading}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Loading...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <span className="mr-1">🔄</span> Tampilkan
                                </span>
                            )}
                        </button>
                    </div>
                    <div className="md:col-span-2 flex items-end">
                        <button
                            onClick={handlePrint}
                            className="w-full px-4 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition"
                        >
                            🖨️ Cetak
                        </button>
                    </div>
                </div>

                {/* Charts */}
                {reportData && (
                    <>
                        {/* Kategori Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                            <div>
                                {reportData.categories.length > 0 ? (
                                    <Pie data={kategoriChartData} options={chartOptions} />
                                ) : (
                                    <div className="border rounded-lg p-8 bg-gray-50 text-center">
                                        <span className="text-yellow-600 text-2xl">⚠️</span>
                                        <p className="text-gray-600 mt-2">Tidak ada data aspirasi untuk bulan ini</p>
                                    </div>
                                )}
                            </div>
                            <div className="border rounded-lg p-4 bg-gray-50">
                                {reportData.categories.length > 0 ? (
                                    <>
                                        <h6 className="font-bold text-blue-600 mb-3">
                                            Ringkasan ({reportData.total} laporan)
                                        </h6>
                                        <ul className="space-y-2">
                                            {reportData.categories.map((c, idx) => (
                                                <li key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded border">
                                                    <span className="text-gray-700">{c.kategori}</span>
                                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        {c.total} ({c.percent.toFixed(1)}%)
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <span className="text-4xl">ℹ️</span>
                                        <p className="mt-2">Pilih bulan & tahun untuk menampilkan grafik</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <hr className="my-6" />

                        {/* Status Chart */}
                        <h6 className="text-lg font-bold text-blue-600 mb-4 flex items-center">
                            <span className="mr-2">📈</span>
                            Status Laporan Bulanan
                        </h6>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                {reportData.statusSummary.length > 0 && reportData.total > 0 ? (
                                    <Pie data={statusChartData} options={chartOptions} />
                                ) : (
                                    <div className="border rounded-lg p-8 bg-gray-50 text-center">
                                        <span className="text-yellow-600 text-2xl">⚠️</span>
                                        <p className="text-gray-600 mt-2">Tidak ada data status laporan untuk bulan ini</p>
                                    </div>
                                )}
                            </div>
                            <div className="border rounded-lg p-4 bg-gray-50">
                                {reportData.statusSummary.length > 0 && reportData.total > 0 ? (
                                    <>
                                        <h6 className="font-bold text-blue-600 mb-3">
                                            Status ({reportData.total} laporan)
                                        </h6>
                                        <ul className="space-y-2">
                                            {reportData.statusSummary.map((s, idx) => (
                                                <li key={idx} className="flex justify-between items-center bg-white px-3 py-2 rounded border">
                                                    <span className="text-gray-700">{s.status}</span>
                                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                        {s.total} ({s.percent.toFixed(1)}%)
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-500 py-8">
                                        <span className="text-4xl">ℹ️</span>
                                        <p className="mt-2">Statistik status laporan akan tampil di sini</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Print Footer */}
            <div className="hidden print:block mt-6 text-sm text-gray-600">
                <p>Laporan dicetak pada: {new Date().toLocaleString('id-ID')}</p>
                <p>Sistem Aspirasi Mahasiswa - Universitas Dian Nuswantoro</p>
            </div>
        </div>
    )
}
