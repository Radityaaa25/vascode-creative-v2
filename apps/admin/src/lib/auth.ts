'use server'

import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

/**
 * Verifies the admin JWT token from cookies.
 * Throws if missing, expired, or invalid signature.
 */
export async function verifyAdmin(): Promise<true> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token) {
    throw new Error('Unauthorized')
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.error('JWT_SECRET is not configured')
    throw new Error('Server configuration error')
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret))
  } catch {
    throw new Error('Unauthorized')
  }

  return true
}

/**
 * Sanitize error messages before returning to client.
 * Logs the full error server-side, returns a generic message to the client.
 */
export async function sanitizeError(error: unknown, context: string): Promise<string> {
  const message = error instanceof Error ? error.message : String(error)
  
  // These are safe to pass through
  const safeMessages = ['Unauthorized', 'Server configuration error']
  if (safeMessages.includes(message)) return message

  console.error(`[${context}]`, error)
  return 'An unexpected error occurred. Please try again.'
}
