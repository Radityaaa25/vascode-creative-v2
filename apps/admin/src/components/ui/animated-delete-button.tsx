'use client'
import { type MouseEventHandler, useId } from "react"
import { cn } from "@/lib/utils"

const sizeConfig = {
  sm: { btn: 28, pill: 80, svg: 7, svgHover: 28, textSize: 9, textTranslate: 22 },
  md: { btn: 50, pill: 140, svg: 12, svgHover: 50, textSize: 13, textTranslate: 30 },
} as const

export default function AnimatedDeleteButton({ onClick, size = "md", className }: {
  onClick?: MouseEventHandler<HTMLButtonElement>
  size?: "sm" | "md"
  className?: string
}) {
  const uid = useId().replace(/[:.]/g, "")
  const cfg = sizeConfig[size]
  const n = `${uid}adb`

  return (
    <>
      <style>{`
        .${n} {
          width: ${cfg.btn}px;
          height: ${cfg.btn}px;
          border-radius: 50%;
          background-color: rgb(20, 20, 20);
          border: none;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.164);
          cursor: pointer;
          transition-duration: .3s;
          overflow: hidden;
          position: relative;
        }
        .${n} svg {
          width: ${cfg.svg}px;
          transition-duration: .3s;
        }
        .${n} svg path {
          fill: white;
        }
        .${n}:hover {
          width: ${cfg.pill}px;
          border-radius: 50px;
          transition-duration: .3s;
          background-color: rgb(255, 69, 69);
          align-items: center;
        }
        .${n}:hover svg {
          width: ${cfg.svgHover}px;
          transition-duration: .3s;
          transform: translateY(60%);
        }
        .${n}::before {
          position: absolute;
          top: -20px;
          content: "Delete";
          color: white;
          transition-duration: .3s;
          font-size: 2px;
        }
        .${n}:hover::before {
          font-size: ${cfg.textSize}px;
          opacity: 1;
          transform: translateY(${cfg.textTranslate}px);
          transition-duration: .3s;
        }
      `}</style>
      <button
        type="button"
        onClick={onClick}
        className={cn(n, className)}
      >
        <svg viewBox="0 0 448 512">
          <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
        </svg>
      </button>
    </>
  )
}
