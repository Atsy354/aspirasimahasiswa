import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                    include: {
                        adminPenugasan: {
                            include: {
                                kategori: true,
                                gedung: true
                            }
                        }
                    }
                })

                if (!user) {
                    return null
                }

                // Support both MD5 (legacy) and bcrypt passwords
                let isPasswordValid = false

                if (user.password.length === 32) {
                    // MD5 hash (legacy from PHP)
                    const md5Hash = crypto.createHash('md5').update(credentials.password).digest('hex')
                    isPasswordValid = md5Hash === user.password
                } else {
                    // bcrypt hash
                    isPasswordValid = await bcrypt.compare(credentials.password, user.password)
                }

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id.toString(),
                    username: user.username,
                    role: user.role,
                    isSuperadmin: user.isSuperadmin,
                    canUbahStatus: user.canUbahStatus,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.role = user.role
                token.isSuperadmin = user.isSuperadmin
                token.canUbahStatus = user.canUbahStatus
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.username = token.username as string
                session.user.role = token.role as string
                session.user.isSuperadmin = token.isSuperadmin as boolean
                session.user.canUbahStatus = token.canUbahStatus as boolean
            }
            return session
        }
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
}
