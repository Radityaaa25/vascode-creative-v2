'use client'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useMobileDevice } from '@/hooks/use-mobile'

const K = 12
const H = 100 / (K - 1)

function kf(max: number) {
  return Array.from({ length: K }, () => (Math.random() - 0.5) * 2 * max)
}
function kfScale(amp: number) {
  return Array.from({ length: K }, () => 1 + (Math.random() - 0.5) * 2 * amp)
}
function kfOpacity() {
  return Array.from({ length: K }, () => +(0.78 + Math.random() * 0.22).toFixed(2))
}

type OrbConfig = {
  className: string
  dur: number
  xAmp: number
  yAmp: number
  sAmp: number
  pulseOpa: boolean
}

const orbs: OrbConfig[] = [
  { className: 'absolute top-[10%] left-[8%] w-72 h-72 rounded-full bg-primary/20 blur-3xl', dur: 18, xAmp: 55, yAmp: 45, sAmp: 0.15, pulseOpa: false },
  { className: 'absolute top-[60%] right-[5%] w-96 h-96 rounded-full bg-secondary/10 blur-3xl', dur: 22, xAmp: 50, yAmp: 50, sAmp: 0.18, pulseOpa: false },
  { className: 'absolute top-[35%] left-[50%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl', dur: 15, xAmp: 0, yAmp: 0, sAmp: 0.08, pulseOpa: true },
  { className: 'absolute bottom-[15%] left-[12%] w-80 h-80 rounded-full bg-secondary/8 blur-3xl', dur: 20, xAmp: 45, yAmp: 40, sAmp: 0.1, pulseOpa: false },
]

type OrbKF = { x: number[]; y: number[]; scale: number[]; opacity: number[] }

export default function BackgroundEffects() {
  const isMobile = useMobileDevice()
  const kfs = useRef<OrbKF[] | null>(null)

  if (isMobile) {
    return (
      <div className="fixed inset-0 -z-10 pointer-events-none" style={{ backgroundColor: 'hsl(var(--background))' }} aria-hidden="true">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    )
  }

  if (!kfs.current) {
    kfs.current = orbs.map(o => ({
      x: o.xAmp === 0 ? Array(K).fill(0) : kf(o.xAmp),
      y: o.yAmp === 0 ? Array(K).fill(0) : kf(o.yAmp),
      scale: kfScale(o.sAmp),
      opacity: o.pulseOpa ? kfOpacity() : Array(K).fill(1),
    }))
  }

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none" style={{ backgroundColor: 'hsl(var(--background))' }} aria-hidden="true">
      {orbs.map((o, i) => {
        const anim = kfs.current![i]
        return (
          <motion.div
            key={i}
            className={o.className}
            animate={{ x: anim.x, y: anim.y, scale: anim.scale, opacity: anim.opacity }}
            transition={{ duration: o.dur, repeat: Infinity, ease: 'easeInOut' }}
          />
        )
      })}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  )
}
