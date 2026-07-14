'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loginAction } from './actions'
import { toast } from 'sonner'
import { Lock, User, ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onSubmit(formData: FormData) {
    setLoading(true)
    const result = await loginAction(formData)
    
    if (result.success) {
      toast.success('Access Granted', { description: 'Welcome to Vascode Admin.' })
      router.push('/')
    } else {
      toast.error('Access Denied', { description: result.error })
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Ambient Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-60" />
        <div
          className="absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, hsl(257 65% 57%) 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, hsl(77 100% 50%) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[-200px] left-1/3 h-[500px] w-[500px] rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, hsl(280 60% 60%) 0%, transparent 70%)" }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8">
          <div className="text-center mb-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 20 }}
              className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30 mb-5"
            >
              <Sparkles className="h-6 w-6 text-black" />
            </motion.div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-gradient">VASCODE</span>
            </h1>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-white/40">Admin Panel</p>
            <p className="mt-3 text-sm text-white/50">Sign in to manage your creative workspace</p>
          </div>

          <form action={onSubmit} className="space-y-5">
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input 
                    id="username" 
                    name="username" 
                    type="text" 
                    required 
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                    placeholder="Enter username"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-white/50">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-white/40 group-focus-within:text-primary transition-colors">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/5 pl-10 pr-4 text-sm text-foreground placeholder:text-white/30 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="group w-full h-11 rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition hover:brightness-110 disabled:opacity-60" 
              disabled={loading}
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? 'Authenticating...' : 'Sign In'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>
        </div>
        
        <p className="text-center text-white/30 text-[11px] mt-6">
          &copy; 2026 Vascode Creative. All rights reserved.
        </p>
      </motion.div>
    </div>
  )
}
