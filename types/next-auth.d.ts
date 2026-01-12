import 'next-auth'

declare module 'next-auth' {
    interface User {
        id: string
        username: string
        role: string
        isSuperadmin: boolean
        canUbahStatus: boolean
    }

    interface Session {
        user: {
            id: string
            username: string
            role: string
            isSuperadmin: boolean
            canUbahStatus: boolean
        }
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        username: string
        role: string
        isSuperadmin: boolean
        canUbahStatus: boolean
    }
}
