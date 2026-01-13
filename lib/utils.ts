// Common utility functions

/**
 * Format date to Indonesian locale
 */
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        ...options
    }
    return new Date(date).toLocaleDateString('id-ID', defaultOptions)
}

/**
 * Format date for display (short version)
 */
export function formatDateShort(date: string | Date): string {
    return formatDate(date, {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    })
}

/**
 * Get status badge color classes
 */
export function getStatusBadgeClass(status: 'Menunggu' | 'Diproses' | 'Selesai'): string {
    const classes = {
        'Menunggu': 'bg-yellow-400 text-white',
        'Diproses': 'bg-cyan-400 text-white',
        'Selesai': 'bg-green-500 text-white'
    }
    return classes[status] || 'bg-gray-400 text-white'
}

/**
 * Get role badge info
 */
export function getRoleBadge(user: { isSuperadmin: boolean; canUbahStatus: boolean }) {
    if (user.isSuperadmin) {
        return { text: 'Superadmin', class: 'bg-red-100 text-red-800' }
    }
    if (user.canUbahStatus) {
        return { text: 'Eksekutor', class: 'bg-green-100 text-green-800' }
    }
    return { text: 'Monitor', class: 'bg-gray-100 text-gray-800' }
}

/**
 * Check if user can flag aspirasi
 */
export function canFlag(user: { isSuperadmin: boolean; canUbahStatus: boolean }, isFlagged: boolean): boolean {
    if (user.isSuperadmin) return true
    // Monitor can only flag, not unflag
    if (!user.canUbahStatus && !isFlagged) return true
    return false
}

/**
 * Check if user can unflag aspirasi
 */
export function canUnflag(
    user: { isSuperadmin: boolean; canUbahStatus: boolean },
    aspirasi: { isFlagged: boolean; status: string }
): boolean {
    if (user.isSuperadmin) return true
    // Eksekutor can unflag only if status is "Selesai"
    if (user.canUbahStatus && aspirasi.isFlagged && aspirasi.status === 'Selesai') return true
    return false
}

/**
 * Get flag error message
 */
export function getFlagErrorMessage(
    user: { isSuperadmin: boolean; canUbahStatus: boolean },
    aspirasi: { isFlagged: boolean; status: string }
): string {
    if (aspirasi.isFlagged && user.canUbahStatus && aspirasi.status !== 'Selesai') {
        return 'Hanya bisa Un-Flag jika status aspirasi sudah Selesai'
    }
    if (aspirasi.isFlagged && !user.canUbahStatus) {
        return 'Hanya Eksekutor/Superadmin yang bisa Un-Flag'
    }
    if (!aspirasi.isFlagged && user.canUbahStatus) {
        return 'Hanya Monitor/Superadmin yang bisa Flag'
    }
    return 'Anda tidak memiliki izin untuk mengubah flag'
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

/**
 * Class name helper (simple version of clsx)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ')
}
