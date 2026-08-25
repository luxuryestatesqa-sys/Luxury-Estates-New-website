const MESSAGE = "🚨 HIGH-DEMAND HUZOOM PLOTS — LIMITED AVAILABILITY";

// Doubled for a seamless looping marquee (same technique as TrustedBy.tsx).
const base = Array(4).fill(MESSAGE);
const items = [...base, ...base];

export default function HuzoomAnnouncementBar() {
  return (
    <div className="group overflow-hidden bg-ink-950">
      <div className="flex w-max animate-marquee items-center gap-10 py-2.5 group-hover:[animation-play-state:paused]">
        {items.map((msg, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            <span className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-white">
              {msg}
            </span>
            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
}
