import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export function AnimatedStatValue({ value: raw }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState('0')

  const match = raw.match(/^(\d+)(.*)$/)
  const num = match ? parseInt(match[1], 10) : null
  const suffix = match ? match[2] : ''

  useEffect(() => {
    if (num === null || !inView) return
    const duration = 1400
    const start = performance.now()
    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(eased * num).toLocaleString())
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [num, inView])

  if (num === null) return <>{raw}</>

  return <span ref={ref}>{display}{suffix}</span>
}
