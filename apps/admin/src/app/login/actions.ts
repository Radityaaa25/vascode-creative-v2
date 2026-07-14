'use server'

import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

export async function loginAction(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  const validUsername = process.env.ADMIN_USERNAME || 'admin'
  const validPassword = process.env.ADMIN_PASSWORD || 'password_rahasia_lo'

  if (username === validUsername && password === validPassword) {
    const secret = new TextEncoder().encode(validPassword)
    const alg = 'HS256'
    
    // Bikin JWT yang umurnya 1 hari
    const token = await new SignJWT({ user: username })
      .setProtectedHeader({ alg })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(secret)

    // Set cookie, await resolved cookies (Next.js 15 requires awaiting cookies())
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    })

    return { success: true }
  }

  return { success: false, error: 'Username atau Password salah!' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}
