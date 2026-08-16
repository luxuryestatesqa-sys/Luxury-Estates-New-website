export function formatPrice(price: number, unit: "total" | "month") {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "QAR",
    maximumFractionDigits: 0,
  }).format(price);

  return unit === "month" ? `${formatted}/mo` : formatted;
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-US").format(n);
}

export function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatLocation(area: string, city: string) {
  return [area, city].filter(Boolean).join(", ");
}

/** Strips everything but digits so `https://wa.me/{n}` links never break on a stray "+" or space. */
export function sanitizeWhatsapp(raw: string | null | undefined): string {
  return (raw ?? "").replace(/\D/g, "");
}
