import { useEffect, useState } from "react";

export function CountUp({ to, duration = 1400, prefix = "", suffix = "" }: {
  to: number; duration?: number; prefix?: string; suffix?: string;
}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * to));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{prefix}{value.toLocaleString()}{suffix}</>;
}
