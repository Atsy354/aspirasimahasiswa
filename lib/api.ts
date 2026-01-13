// API utility functions

export async function fetchAPI<T = any>(
    url: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
}

export async function getAspirasi() {
    return fetchAPI('/api/aspirasi')
}

export async function getKategori() {
    return fetchAPI('/api/kategori')
}

export async function getGedung() {
    return fetchAPI('/api/gedung')
}

export async function getStatistics() {
    return fetchAPI('/api/statistics')
}

export async function createAspirasi(data: {
    nama: string
    nim: string
    jurusan?: string
    kategoriId: number
    gedungId: number
    isiAspirasi: string
}) {
    return fetchAPI('/api/aspirasi', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateAspirasiStatus(id: number, status: string) {
    return fetchAPI(`/api/aspirasi/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
    })
}

export async function updateAspirasiFlag(id: number, isFlagged: boolean) {
    return fetchAPI(`/api/aspirasi/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isFlagged }),
    })
}

export async function deleteAspirasi(id: number) {
    return fetchAPI(`/api/aspirasi/${id}`, {
        method: 'DELETE',
    })
}

export async function getReportingData(month: number, year: number) {
    return fetchAPI(`/api/reporting/monthly?month=${month}&year=${year}`)
}

export async function getAdmins() {
    return fetchAPI('/api/admin')
}

export async function createAdmin(data: {
    username: string
    password: string
    canUbahStatus: boolean
    isSuperadmin: boolean
    penugasan: Array<{ kategoriId: number; gedungId: number }>
}) {
    return fetchAPI('/api/admin', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

export async function updateAdmin(id: number, data: {
    username?: string
    password?: string
    canUbahStatus?: boolean
    isSuperadmin?: boolean
    penugasan?: Array<{ kategoriId: number; gedungId: number }>
}) {
    return fetchAPI(`/api/admin/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
    })
}

export async function deleteAdmin(id: number) {
    return fetchAPI(`/api/admin/${id}`, {
        method: 'DELETE',
    })
}
