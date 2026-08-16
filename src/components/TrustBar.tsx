const items = [
  {
    label: "Licensed Real Estate Brokerage",
    detail: "Qatar",
  },
  {
    label: "40K+",
    detail: "Social Media Followers",
  },
  {
    label: "QAR 1.6B+",
    detail: "Sales in 2025",
  },
  {
    label: "15+ Years",
    detail: "Combined Advisory Experience",
  },
];

// TODO: "15+ Years" is still a placeholder — confirm the real combined
// advisory experience figure before launch.
export default function TrustBar() {
  return (
    <section className="border-b border-cream-100/10 bg-ink-950">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-8 sm:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item.label} className="text-center sm:text-left">
            <p className="font-serif text-lg font-semibold text-gold-300 sm:text-xl">
              {item.label}
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-cream-200/60">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
