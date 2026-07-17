"use client"

import { useEffect, useId, useState } from "react"
import { useMobileDevice } from "@/hooks/use-mobile"

export function Sparkles({
  className,
  size = 1,
  minSize = null,
  density = 800,
  speed = 1,
  minSpeed = null,
  opacity = 1,
  opacitySpeed = 3,
  minOpacity = null,
  color = "#FFFFFF",
  background = "transparent",
  options = {},
}: {
  className?: string;
  size?: number;
  minSize?: number | null;
  density?: number;
  speed?: number;
  minSpeed?: number | null;
  opacity?: number;
  opacitySpeed?: number;
  minOpacity?: number | null;
  color?: string;
  background?: string;
  options?: any;
}) {
  const isMobile = useMobileDevice()
  const [isReady, setIsReady] = useState(false)
  const [Particles, setParticles] = useState<any>(null)
  const id = useId()

  useEffect(() => {
    if (isMobile) return
    let cancelled = false
    import("@tsparticles/react").then((mod) => {
      if (cancelled) return
      mod.initParticlesEngine(async (engine: any) => {
        const { loadSlim } = await import("@tsparticles/slim")
        await loadSlim(engine)
      }).then(() => {
        if (!cancelled) {
          setParticles(() => mod.default)
          setIsReady(true)
        }
      })
    })
    return () => { cancelled = true }
  }, [isMobile])

  if (isMobile) return null
  if (!Particles || !isReady) return null

  const defaultOptions = {
    background: {
      color: {
        value: background,
      },
    },
    fullScreen: {
      enable: false,
      zIndex: 1,
    },
    fpsLimit: 120,
    particles: {
      color: {
        value: color,
      },
      move: {
        enable: true,
        direction: "none",
        speed: {
          min: minSpeed || speed / 10,
          max: speed,
        },
        straight: false,
      },
      number: {
        value: density,
      },
      opacity: {
        value: {
          min: minOpacity || opacity / 10,
          max: opacity,
        },
        animation: {
          enable: true,
          sync: false,
          speed: opacitySpeed,
        },
      },
      size: {
        value: {
          min: minSize || size / 2.5,
          max: size,
        },
      },
    },
    detectRetina: true,
  }

  return <Particles id={id} options={{ ...defaultOptions, ...options }} className={className} />
}
