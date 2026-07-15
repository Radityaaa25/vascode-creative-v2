'use client'
import { type MouseEventHandler, useId } from "react"
import { cn } from "@/lib/utils"

const sizeConfig = {
  sm: { btn: 28, pill: 80, svg: 8, svgHover: 30, textSize: 10, textTranslate: 21 },
  md: { btn: 50, pill: 140, svg: 13, svgHover: 52, textSize: 14, textTranslate: 29 },
} as const

export default function AnimatedEditButton({ onClick, size = "md", className }: {
  onClick?: MouseEventHandler<HTMLButtonElement>
  size?: "sm" | "md"
  className?: string
}) {
  const uid = useId().replace(/[:.]/g, "")
  const cfg = sizeConfig[size]
  const n = `${uid}aeb`

  return (
    <>
      <style>{`
        .${n} {
          width: ${cfg.btn}px;
          height: ${cfg.btn}px;
          border-radius: 50%;
          background-color: rgb(30, 30, 30);
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
          color: white;
          filter: drop-shadow(0 0 2px rgba(255,255,255,0.3));
        }
        .${n}:hover {
          width: ${cfg.pill}px;
          border-radius: 50px;
          transition-duration: .3s;
          background-color: rgb(59, 130, 246);
          align-items: center;
        }
        .${n}:hover svg {
          width: ${cfg.svgHover}px;
          transition-duration: .3s;
          transform: translateY(60%) rotate(-45deg);
        }
        .${n}::before {
          position: absolute;
          top: -20px;
          content: "Edit";
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
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
        </svg>
      </button>
    </>
  )
}
