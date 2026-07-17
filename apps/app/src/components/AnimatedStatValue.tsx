import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function AnimatedStatValue({ value: raw, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')

  const match = raw.match(/^(\d+)(.*)$/)
  const num = match ? parseInt(match[1], 10) : null
  const suffix = match ? match[2] : ''

  useEffect(() => {
    if (num === null || !inView) return
    let rafId = 0
    const timeout = setTimeout(() => {
      const duration = 1400
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        setDisplay(Math.round(eased * num).toLocaleString())
        if (t < 1) rafId = requestAnimationFrame(tick)
      }
      rafId = requestAnimationFrame(tick)
    }, delay)
    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(rafId)
    }
  }, [num, inView, delay])

  if (num === null) return <>{raw}</>

  return <span ref={ref}>{display}{suffix}</span>
}
