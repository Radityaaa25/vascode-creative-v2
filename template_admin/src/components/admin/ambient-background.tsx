export function AmbientBackground() {
  return (
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
  );
}
