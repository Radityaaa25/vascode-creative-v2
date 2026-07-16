'use client'

import React from 'react'

export function ViewAllButton({ text }: { text: string }) {
  return (
    <span className="group inline-flex items-center gap-3 rounded-full bg-primary px-4 py-2 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-[4px_4px_0_hsl(240,5%,5%)] transition-all duration-500 hover:shadow-[6px_6px_0_hsl(var(--accent))] -skew-x-[15deg] cursor-pointer select-none">
      <span className="skew-x-[15deg]">{text}</span>
      <span className="flex items-center transition-all duration-500 group-hover:mr-3">
        <svg width="20" height="10" viewBox="0 0 66 43" fill="none" xmlns="http://www.w3.org/2000/svg" className="[&>g>path]:fill-white">
          <g>
            <path className="transition-all duration-400 -translate-x-[60%] group-hover:translate-x-0" d="M40.154 3.895l3.822-3.756a.636.636 0 01.9.001l20.815 20.646a.7.7 0 01.012 1.014l-20.815 20.65a.636.636 0 01-.9 0l-3.822-3.754a.638.638 0 01-.006-.908l16.84-16.536a.637.637 0 00.006-.907L40.154 4.608a.638.638 0 01.001-.713z" />
            <path className="transition-all duration-500 -translate-x-[30%] group-hover:translate-x-0" d="M20.154 3.895l3.822-3.756a.636.636 0 01.9.001l20.815 20.646a.7.7 0 01.012 1.014l-20.815 20.65a.636.636 0 01-.9 0l-3.822-3.754a.638.638 0 01-.006-.908l16.84-16.536a.637.637 0 00.006-.907L20.154 4.608a.638.638 0 01.001-.713z" />
            <path className="transition-all duration-600 [animation:color_anim_1s_infinite_0.2s] group-hover:[animation:color_anim_1s_infinite_0.2s]" d="M.154 3.895L3.976.139a.636.636 0 01.9.001l20.816 20.646a.7.7 0 01.012 1.014L4.677 42.86a.636.636 0 01-.9 0L.155 39.107a.638.638 0 01-.006-.908L16.994 21.66a.637.637 0 000-.908L.155 4.608a.638.638 0 010-.713z" />
          </g>
        </svg>
      </span>
    </span>
  )
}
