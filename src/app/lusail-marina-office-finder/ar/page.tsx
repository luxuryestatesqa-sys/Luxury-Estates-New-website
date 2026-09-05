import type { Metadata } from "next";
import Image from "next/image";
import {
  Briefcase,
  Building2,
  Car,
  CalendarClock,
  Globe2,
  Landmark,
  MapPin,
  Percent,
  ShieldCheck,
  TrainFront,
  TrendingUp,
  Waves,
} from "lucide-react";
import { shimmerBlurDataURL } from "@/lib/image";
import JsonLd, { breadcrumbJsonLd, faqJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import MobileStickyBar from "../MobileStickyBar";
import WhatsAppBubble from "../WhatsAppBubble";
import OfficeQualifierForm from "../OfficeQualifierForm";
import TrackedWhatsAppLink from "../TrackedWhatsAppLink";
import LanguageSwitch from "../LanguageSwitch";
import Reveal from "../Reveal";
import Faq from "../Faq";
import { DEFAULT_WA_MESSAGE_AR, buildWaLink } from "../constants";

const PAGE_URL = `${SITE_URL}/lusail-marina-office-finder/ar`;
const PAGE_URL_EN = `${SITE_URL}/lusail-marina-office-finder`;

const TITLE = "مكاتب تجارية للبيع في لوسيل والمارينا، قطر | تملك بالإيجار";
const DESCRIPTION =
  "امتلك مكتباً تجارياً درجة أولى للبيع في لوسيل ومنطقة المارينا، قطر، بدءاً من 180 متراً مربعاً. دفعة أولى 4% فقط وخطط تملك بالإيجار مرنة من 7 إلى 8 سنوات. استشارة مرخصة رسمياً — احصل على المخططات والأسعار عبر واتساب.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "مكاتب للبيع في قطر",
    "مكتب تجاري للبيع في لوسيل",
    "مكتب للبيع في المارينا قطر",
    "شراء مكتب في قطر",
    "مكاتب درجة أولى قطر",
    "تملك بالإيجار مكتب قطر",
    "عقارات تجارية للبيع قطر",
    "مكاتب مركز قطر للمال",
  ],
  alternates: {
    canonical: PAGE_URL,
    languages: { en: PAGE_URL_EN, ar: PAGE_URL },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: PAGE_URL,
    locale: "ar_QA",
    images: [{ url: `${SITE_URL}/images/huzoom/lusail-marina.jpg` }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const BADGES = [
  { icon: Percent, label: "دفعة أولى 4% فقط" },
  { icon: CalendarClock, label: "خطط دفع مرنة تصل إلى 8 سنوات" },
  { icon: ShieldCheck, label: "استشارة عقارية مرخصة رسمياً في قطر" },
  { icon: Building2, label: "مساحات درجة أولى في أرقى الأحياء التجارية بقطر" },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "استشارة مرخصة رسمياً", sublabel: "من Luxury Estates" },
  { icon: Percent, label: "دفعة أولى 4%", sublabel: "خطط تملك بالإيجار" },
  { icon: Briefcase, label: "استفسار بدون التزام", sublabel: "رد سريع عبر واتساب" },
];

const BENEFIT_CARDS = [
  {
    icon: TrendingUp,
    title: "رأس مال أولي منخفض",
    body: "انتقل بدفعة أولى 4% فقط دون تجميد رأس المال التشغيلي لشركتك.",
  },
  {
    icon: Landmark,
    title: "ملكية طويلة الأمد",
    body: "تُسهم دفعاتك الشهرية مباشرة في سداد أصل قيمة العقار.",
  },
  {
    icon: ShieldCheck,
    title: "حماية السعر",
    body: "ثبّت سعر الشراء الحالي لمدة 7 إلى 8 سنوات، بمنأى عن ارتفاع الإيجارات.",
  },
  {
    icon: MapPin,
    title: "مواقع استراتيجية",
    body: "أمّن حضوراً مميزاً في أبرز الأحياء التجارية بقطر — لوسيل والمارينا.",
  },
];

const OFFICES = [
  {
    slug: "marina-district-office",
    tag: "مقر تجاري متميز",
    title: "مكتب درجة أولى – منطقة المارينا",
    seoDescription:
      "مكتب تجاري درجة أولى للبيع في منطقة المارينا، لوسيل، قطر، بدءاً من 290 متراً مربعاً. إطلالات بحرية، مواقف تنفيذية، مؤهل لملكية مركز قطر للمال والأجانب.",
    size: "بدءاً من 290 متراً مربعاً",
    price: "بدءاً من 3,900,000 ريال قطري",
    startingPrice: 3900000,
    downPayment: "4% (156,000 ريال قطري)",
    monthly: "25,000 – 35,000 ريال قطري / شهرياً",
    term: "خطة 8 سنوات",
    highlights: [
      { icon: Waves, label: "إطلالات بحرية / على المارينا" },
      { icon: Building2, label: "ظهور مميز على طابق عالٍ" },
      { icon: Car, label: "مواقف تنفيذية مخصصة" },
      { icon: Globe2, label: "مؤهل لملكية مركز قطر للمال / الأجانب" },
    ],
    cta: "استفسر عن مكتب المارينا",
    message:
      "مرحباً، أنا مهتم بالمكتب درجة أولى في منطقة المارينا — بدءاً من 290 متراً مربعاً، بإجمالي 3,900,000 ريال قطري، دفعة أولى 4% (156,000 ريال قطري)، 25,000–35,000 ريال قطري شهرياً، خطة 8 سنوات. يرجى إرسال مزيد من التفاصيل.",
  },
  {
    slug: "lusail-office",
    tag: "مساحة نمو للشركات",
    title: "وحدة تجارية مميزة – لوسيل",
    seoDescription:
      "مكتب تجاري للبيع في لوسيل، قطر، بدءاً من 180 متراً مربعاً. تصاميم عملية، وصول مباشر للترام والمترو، رأس مال دخول منخفض، خطة تملك بالإيجار 7 سنوات.",
    size: "بدءاً من 180 متراً مربعاً",
    price: "بدءاً من 2,900,000 ريال قطري",
    startingPrice: 2900000,
    downPayment: "4% (116,000 ريال قطري)",
    monthly: null,
    term: "خطة 7 سنوات",
    highlights: [
      { icon: Building2, label: "تصاميم طوابق عملية" },
      { icon: TrainFront, label: "وصول مباشر للترام والمترو" },
      { icon: Percent, label: "رأس مال دخول منخفض" },
      { icon: Briefcase, label: "خيارات جاهزة أو تشطيب أساسي" },
    ],
    cta: "استفسر عن مكتب لوسيل",
    message:
      "مرحباً، أنا مهتم بالمكتب التجاري في لوسيل — بدءاً من 180 متراً مربعاً، بإجمالي 2,900,000 ريال قطري، دفعة أولى 4% (116,000 ريال قطري)، خطة 7 سنوات. يرجى إرسال مزيد من التفاصيل.",
  },
];

function officeJsonLd(office: (typeof OFFICES)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: office.title,
    description: office.seoDescription,
    url: `${PAGE_URL}#offices`,
    image: `${SITE_URL}/images/huzoom/lusail-marina.jpg`,
    brand: { "@type": "Organization", name: "Luxury Estates Real Estate" },
    offers: {
      "@type": "Offer",
      price: office.startingPrice,
      priceCurrency: "QAR",
      availability: "https://schema.org/InStock",
      url: `${PAGE_URL}#offices`,
    },
  };
}

const FAQ_ITEMS = [
  {
    q: "هل أحتاج إلى تمويل بنكي أو رهن عقاري؟",
    a: "لا. هذه خطط تملك بالإيجار مباشرة مع البائع — بدون تمويل بنكي أو موافقة رهن عقاري أو فحص ائتماني.",
  },
  {
    q: "هل يمكن للشركات الأجنبية امتلاك مساحة مكتبية تجارية في لوسيل أو منطقة المارينا؟",
    a: "نعم. لوسيل ومنطقة المارينا التابعة لها من مناطق التملك الحر المعتمدة في قطر، ووحدات منطقة المارينا مؤهلة لملكية مركز قطر للمال (QFC) / الأجانب — يمكن لمستشارنا تأكيد الأهلية لكيانك.",
  },
  {
    q: "ما الفرق بين مكاتب لوسيل ومنطقة المارينا؟",
    a: "توفر لوسيل سعر دخول أقل بدءاً من 180 متراً مربعاً على خطة 7 سنوات، مثالية للشركات الناشئة والصغيرة والمتوسطة. بينما توفر منطقة المارينا مساحات أكبر وأكثر ظهوراً بدءاً من 290 متراً مربعاً على خطة 8 سنوات، مناسبة لمقرات الشركات والمؤسسات المالية.",
  },
  {
    q: "هل الأسعار وخطط الدفع المعروضة نهائية؟",
    a: "هي استرشادية وتختلف حسب الوحدة والطابق والتوفر الحالي. سيؤكد لك مستشارنا السعر الدقيق وخطة الدفع والأهلية لأي وحدة تهمك.",
  },
  {
    q: "ماذا يحدث بعد إرسال بياناتي؟",
    a: "يصل استفسارك مباشرة إلى مستشار تأجير تجاري يرد عليك عبر واتساب — عادة خلال دقائق — بالمخططات والأسعار والخطوات التالية. بدون أي التزام بالمتابعة.",
  },
];

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">{eyebrow}</p>
      <h2 className="gold-underline mx-auto mt-3 w-fit pb-3 font-[family-name:var(--font-amiri)] text-h2 font-semibold text-ink-900">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base leading-relaxed text-gray-600">{subtitle}</p>}
    </div>
  );
}

function BenefitCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Percent;
  title: string;
  body: string;
}) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gold-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-lg">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <p className="mt-4 font-[family-name:var(--font-amiri)] text-lg font-semibold text-ink-900">
        {title}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

export default function LusailMarinaOfficeFinderPageAr() {
  return (
    <div
      dir="rtl"
      lang="ar"
      className="bg-cream-50 pb-20 font-[family-name:var(--font-tajawal)] lg:pb-0"
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "الرئيسية", url: SITE_URL },
          { name: "دليل مكاتب لوسيل والمارينا", url: PAGE_URL },
        ])}
      />
      {OFFICES.map((office) => (
        <JsonLd key={office.slug} data={officeJsonLd(office)} />
      ))}
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white py-12 sm:py-20 lg:py-24">
        <LanguageSwitch lang="ar" />
        <div
          aria-hidden
          className="pointer-events-none absolute -end-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-gold-300/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -start-32 bottom-0 h-[22rem] w-[22rem] rounded-full bg-gold-200/40 blur-3xl"
        />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-start gap-8 px-5 sm:gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:px-8">
          <div className="text-center lg:pt-2 lg:text-end">
            <p
              className="animate-fade-up text-eyebrow font-medium uppercase tracking-[0.12em] text-gold-600 sm:tracking-[0.3em] md:tracking-[0.4em]"
              style={{ animationDelay: "40ms" }}
            >
              دفعة أولى 4% · تملك بالإيجار تجاري
            </p>
            <span
              className="animate-fade-up mx-auto mt-2.5 block h-px w-14 bg-gradient-to-r from-gold-500 to-transparent sm:mt-3 lg:mx-0"
              style={{ animationDelay: "60ms" }}
            />

            <h1
              className="animate-fade-up mx-auto mt-3 max-w-full text-balance font-bold leading-[1.15] tracking-tight text-ink-900 sm:max-w-xl sm:mt-4 sm:leading-[1.05] lg:mx-0"
              style={{ fontSize: "clamp(1.125rem, 0.6rem + 3.2vw, 3.25rem)", animationDelay: "90ms" }}
            >
              ابحث عن <span className="text-gold-600">مساحتك المكتبية التجارية</span> في لوسيل
              ومنطقة المارينا
            </h1>

            <p
              className="animate-fade-up mx-auto mt-4 max-w-md text-balance text-base leading-relaxed text-gray-600 sm:mt-5 sm:text-lg lg:mx-0"
              style={{ animationDelay: "140ms" }}
            >
              كفى دفع إيجار بلا عائد.{" "}
              <span className="font-[family-name:var(--font-amiri)] text-lg text-gold-600 sm:text-xl">
                امتلك مساحة تجارية درجة أولى بدفعة أولى 4% فقط.
              </span>{" "}
              خطط دفع مرنة تصل إلى 8 سنوات.
            </p>

            <div
              className="animate-fade-up mx-auto mt-5 grid max-w-md grid-cols-1 gap-2 sm:mt-6 sm:gap-2.5 lg:mx-0 lg:flex lg:flex-col lg:gap-2.5"
              style={{ animationDelay: "190ms" }}
            >
              {BADGES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-2.5 rounded-xl border border-gold-200 bg-white/70 px-3 py-2.5 text-end text-[13px] font-medium leading-snug text-ink-800 shadow-sm sm:gap-3 sm:px-3.5 sm:text-sm lg:rounded-none lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:justify-start"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600 sm:h-7 sm:w-7 lg:h-auto lg:w-auto lg:rounded-none lg:bg-transparent">
                    <Icon className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" strokeWidth={1.8} />
                  </span>
                  {label}
                </span>
              ))}
            </div>

            <div
              className="animate-fade-up mt-6 flex justify-center sm:mt-7 lg:justify-start"
              style={{ animationDelay: "240ms" }}
            >
              <TrackedWhatsAppLink
                href={buildWaLink(DEFAULT_WA_MESSAGE_AR)}
                className="group relative flex items-center whitespace-nowrap rounded-full border border-gold-300 bg-white py-3 pe-14 ps-5 text-sm font-semibold text-ink-900 shadow-sm transition hover:border-gold-500 sm:ps-6"
              >
                <span className="sm:hidden">تحدث مع مستشار</span>
                <span className="hidden sm:inline">تفضل التواصل عبر واتساب؟ تحدث مع مستشار</span>
                <span className="absolute -end-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-black/20 transition group-hover:scale-105">
                  <svg viewBox="0 0 32 32" className="h-5 w-5 shrink-0 fill-white">
                    <path d="M16.004 3C9.376 3 4 8.373 4 15c0 2.31.65 4.47 1.78 6.31L4 29l7.86-1.74A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm0 21.6c-1.98 0-3.83-.55-5.4-1.5l-.39-.23-4.66 1.03 1.05-4.54-.25-.4A9.55 9.55 0 0 1 6.4 15c0-5.3 4.31-9.6 9.6-9.6 5.3 0 9.6 4.3 9.6 9.6 0 5.3-4.3 9.6-9.6 9.6Zm5.3-7.19c-.29-.15-1.7-.84-1.96-.94-.26-.1-.46-.15-.65.15-.19.29-.75.94-.92 1.13-.17.19-.34.22-.63.07-.29-.15-1.22-.45-2.32-1.43-.86-.77-1.44-1.71-1.61-2-.17-.29-.02-.45.13-.59.13-.13.29-.34.44-.51.15-.17.19-.29.29-.48.1-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.23-.56-.47-.48-.65-.49-.17-.01-.36-.01-.55-.01-.19 0-.51.07-.78.36-.26.29-1.02 1-1.02 2.44 0 1.44 1.05 2.83 1.19 3.03.15.19 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.11.56-.08 1.7-.7 1.94-1.36.24-.67.24-1.24.17-1.36-.07-.12-.26-.19-.55-.34Z" />
                  </svg>
                </span>
              </TrackedWhatsAppLink>
            </div>
          </div>

          {/* QUICK FILTER / LEAD QUALIFIER */}
          <div
            id="office-finder-form"
            className="animate-fade-up scroll-mt-16 lg:self-center"
            style={{ animationDelay: "160ms" }}
          >
            <div className="overflow-hidden rounded-2xl border border-gold-200 shadow-xl">
              <div className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 px-6 py-3.5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-950 sm:tracking-[0.25em]">
                  ابحث في مخزون المكاتب
                </p>
              </div>
              <div className="bg-white p-6 sm:p-7">
                <OfficeQualifierForm idPrefix="hero-ar" lang="ar" />
              </div>
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-gray-500 sm:mt-4 lg:text-end">
              مجاني · بدون التزام. خطط الدفع والأهلية استرشادية — تأكد من الشروط الحالية مع
              مستشارنا.
            </p>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-gold-200 bg-cream-50 py-10 sm:py-12">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-5 sm:grid-cols-3 sm:gap-6 lg:px-8">
          {TRUST_ITEMS.map(({ icon: Icon, label, sublabel }) => (
            <div key={label} className="flex items-center gap-4 sm:flex-col sm:text-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-gold-600 shadow-sm ring-1 ring-gold-200">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <div>
                <p className="font-[family-name:var(--font-amiri)] text-base font-semibold text-ink-900">
                  {label}
                </p>
                <p className="text-xs text-gray-500">{sublabel}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COMPARISON / OFFER CARDS */}
      <section id="offices" className="scroll-mt-16 border-t border-gold-200 bg-white py-16 sm:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="المخزون المتاح"
            title="قارن بين مكاتب لوسيل والمارينا"
            subtitle="عنوانان تجاريان مميزان، لكل منهما خطة دفع مرنة بنظام التملك بالإيجار."
          />
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 px-5 lg:grid-cols-2 lg:px-8">
          {OFFICES.map((office) => (
            <Reveal key={office.title}>
              <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border-2 border-gold-400 bg-ink-950 p-7 sm:p-8">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -start-16 -top-16 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl"
                />
                <div className="relative flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                    {office.tag}
                  </p>
                  <p className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
                    {office.title}
                  </p>

                  <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-white/10 py-5">
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-white/50">المساحة</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-white">{office.size}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-white/50">
                        السعر الإجمالي
                      </dt>
                      <dd className="mt-0.5 text-sm font-semibold text-white">{office.price}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-white/50">
                        الدفعة الأولى
                      </dt>
                      <dd className="mt-0.5 text-sm font-semibold text-white">{office.downPayment}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-white/50">خطة الدفع</dt>
                      <dd className="mt-0.5 text-sm font-semibold text-white">{office.term}</dd>
                    </div>
                    {office.monthly && (
                      <div className="col-span-2">
                        <dt className="text-[11px] uppercase tracking-wide text-white/50">
                          القسط الشهري
                        </dt>
                        <dd className="mt-0.5 text-sm font-semibold text-gold-400">{office.monthly}</dd>
                      </div>
                    )}
                  </dl>

                  <ul className="mt-5 space-y-2.5">
                    {office.highlights.map(({ icon: Icon, label }) => (
                      <li key={label} className="flex items-center gap-2.5 text-sm text-white/80">
                        <Icon className="h-4 w-4 shrink-0 text-gold-400" strokeWidth={1.8} />
                        {label}
                      </li>
                    ))}
                  </ul>
                </div>

                <TrackedWhatsAppLink
                  href={buildWaLink(office.message)}
                  className="relative mt-6 flex items-center justify-center rounded-full bg-gold-500 px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-ink-950 transition duration-200 hover:scale-[1.02] hover:bg-gold-600 active:scale-[0.98]"
                >
                  {office.cta}
                </TrackedWhatsAppLink>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="mx-auto mt-6 max-w-6xl px-5 text-center text-xs text-gray-400 lg:px-8">
          الأسعار والمساحات والتوفر استرشادية وتتغير باستمرار — تأكد من أحدث الشروط وحالة الوحدة
          مع مستشارنا.
        </p>
      </section>

      {/* LEASE-TO-OWN BENEFIT GRID */}
      <section className="border-t border-gold-200 bg-cream-50 py-16 sm:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="نموذج التملك بالإيجار"
            title="لماذا التملك بالإيجار لمساحتك التجارية"
          />
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 px-5 sm:grid-cols-2 lg:px-8 lg:grid-cols-4">
          {BENEFIT_CARDS.map((card) => (
            <Reveal key={card.title}>
              <BenefitCard {...card} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gold-200 bg-cream-50 px-5 py-16 lg:px-8 lg:py-20">
        <Reveal className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="أسئلة" title="الأسئلة الشائعة" />
          <div className="mt-10">
            <Faq items={FAQ_ITEMS} />
          </div>
        </Reveal>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-gold-200 bg-cream-50 py-16 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute -start-40 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-gold-300/20 blur-3xl"
        />
        <Reveal className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-5 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600">
              ابدأ الآن
            </p>
            <h2 className="gold-underline mt-3 pb-3 text-h2 font-bold tracking-tight text-ink-900">
              أمّن مكتبك اليوم
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600">
              احصل على أحدث المخططات والأسعار وجداول الدفع بنظام التملك بالإيجار للوسيل ومنطقة
              المارينا من مستشارينا في التأجير التجاري.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#office-finder-form"
                className="rounded-full bg-gold-500 px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-ink-950 transition duration-200 hover:scale-[1.03] hover:bg-gold-600 active:scale-[0.98] sm:w-auto"
              >
                اطلب الكتيّب
              </a>
              <TrackedWhatsAppLink
                href={buildWaLink(DEFAULT_WA_MESSAGE_AR)}
                className="rounded-full border border-gray-300 px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-ink-900 transition hover:border-ink-900 sm:w-auto"
              >
                تواصل مع مستشار عبر واتساب
              </TrackedWhatsAppLink>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold-200 shadow-xl">
            <Image
              src="/images/about/office-boardroom-view.jpg"
              alt="مكتب درجة أولى بإطلالة على أفق المدينة"
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 45vw"
              placeholder="blur"
              blurDataURL={shimmerBlurDataURL(600, 450)}
              className="object-cover"
            />
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-gold-200 bg-white px-5 py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Luxury Estates. صفحة تسويقية مخصصة لمساحات مكتبية
        تجارية بنظام التملك بالإيجار في لوسيل ومنطقة المارينا، قطر. الأسعار والأهلية وشروط الدفع
        استرشادية وتخضع للتأكيد.
      </footer>

      <WhatsAppBubble lang="ar" />
      <MobileStickyBar lang="ar" />
    </div>
  );
}
