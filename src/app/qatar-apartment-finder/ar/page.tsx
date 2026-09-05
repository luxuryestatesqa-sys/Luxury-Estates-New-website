import type { Metadata } from "next";
import { Fragment } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  Building2,
  CalendarClock,
  CheckCircle2,
  Flame,
  Home,
  Landmark,
  MapPin,
  MessageCircleMore,
  Percent,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { shimmerBlurDataURL } from "@/lib/image";
import JsonLd, { breadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import MobileStickyBar from "../MobileStickyBar";
import WhatsAppBubble from "../WhatsAppBubble";
import ApartmentFinderForm from "../ApartmentFinderForm";
import TrackedWhatsAppLink from "../TrackedWhatsAppLink";
import LanguageSwitch from "../LanguageSwitch";
import Reveal from "../Reveal";
import Faq from "../Faq";
import { DEFAULT_WA_MESSAGE_AR, buildWaLink } from "../constants";

const PAGE_URL = `${SITE_URL}/qatar-apartment-finder/ar`;
const PAGE_URL_EN = `${SITE_URL}/qatar-apartment-finder`;

export const metadata: Metadata = {
  title: "شقق بالتقسيط تملّك بالإيجار وعلى الخارطة في لوسيل واللؤلؤة، قطر",
  description:
    "كفى إيجاراً وابدأ التملك. استكشف شققاً بنظام التملك بالإيجار وعلى الخارطة بالتقسيط بفائدة 0% في لوسيل واللؤلؤة، قطر، بدفعة أولى من 2% فقط. احصل على أفضل الخيارات المناسبة لك عبر واتساب.",
  alternates: {
    canonical: PAGE_URL,
    languages: { en: PAGE_URL_EN, ar: PAGE_URL },
  },
  openGraph: {
    title: "شقق تملك بالإيجار وعلى الخارطة في لوسيل واللؤلؤة | دليل شقق قطر",
    description:
      "خطط دفع مرنة بفائدة 0% بدءاً من دفعة أولى 2%. أقساط تصل إلى 6 سنوات بعد التسليم. مؤهلة للحصول على الإقامة القطرية.",
    url: PAGE_URL,
    locale: "ar_QA",
    images: [{ url: `${SITE_URL}/images/areas/lusail.jpg` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "شقق تملك بالإيجار وعلى الخارطة في لوسيل واللؤلؤة | دليل شقق قطر",
    description:
      "خطط دفع مرنة بفائدة 0% بدءاً من دفعة أولى 2%. أقساط تصل إلى 6 سنوات بعد التسليم. مؤهلة للحصول على الإقامة القطرية.",
  },
};

const BADGES = [
  { icon: Percent, label: "الدفعة الأولى تبدأ من 2%" },
  { icon: Landmark, label: "بدون فائدة بنكية 0%" },
  { icon: CalendarClock, label: "أقساط تصل إلى 6 سنوات بعد التسليم" },
  { icon: MapPin, label: "مؤهلة للإقامة القطرية (730 ألف ريال قطري فأكثر)" },
];

const TRUST_ITEMS = [
  { icon: ShieldCheck, label: "استشارة عقارية موثوقة", sublabel: "من Luxury Estates" },
  { icon: Percent, label: "فائدة 0%", sublabel: "خطط دفع من المطوّر" },
  { icon: MessageCircleMore, label: "استفسار بدون التزام", sublabel: "رد سريع عبر واتساب" },
];

const WHY_CARDS = [
  {
    icon: Percent,
    title: "فائدة 0%",
    body: "خطط دفع من المطوّر بدون تمويل بنكي وبدون أي فوائد على أقساطك.",
  },
  {
    icon: Home,
    title: "ملكية عبر التملك بالإيجار",
    body: "كل قسط تدفعه يبني ملكية حقيقية نحو التملك الكامل، بدلاً من أن يذهب هباءً في الإيجار.",
  },
  {
    icon: ShieldCheck,
    title: "الإقامة القطرية",
    body: "عمليات الشراء المؤهلة بقيمة 730,000 ريال قطري فأكثر تمنحك أنت وعائلتك أهلية الحصول على الإقامة القطرية.",
  },
  {
    icon: TrendingUp,
    title: "مواقع عالية العائد",
    body: "فوكس هيلز، المارينا، ياسمين واللؤلؤة — أسرع أحياء التملك الحر ارتفاعاً في قيمتها بقطر.",
  },
];

const LIMITED_DEAL = {
  eyebrow: "تملك بالإيجار · وحدتان فقط متبقيتان",
  title: "شقة غرفتي نوم جاهزة للسكن، لوسيل",
  points: [
    "تملك بالإيجار — ابنِ ملكيتك من اليوم الأول",
    "دفعة أولى 2% فقط",
    "قسط شهري 11,000 ريال قطري",
    "خطة سداد على 6 سنوات",
    "جاهزة للسكن فوراً",
  ],
  message:
    "مرحباً، أنا مهتم بشقة غرفتي النوم الجاهزة للسكن في لوسيل — دفعة أولى 2%، قسط شهري 11,000 ريال قطري، خطة 6 سنوات. هل ما زالت متاحة؟",
};

const OWNERSHIP_PATHS = [
  {
    icon: Home,
    title: "التملك بالإيجار",
    points: [
      "انتقل الآن — ابنِ ملكيتك مع كل دفعة شهرية",
      "وحدات جاهزة في لوسيل واللؤلؤة",
      "بدون تمويل بنكي أو موافقة رهن عقاري",
    ],
    cta: "اسأل عن التملك بالإيجار",
    message: "مرحباً، أنا مهتم بشقق التملك بالإيجار في لوسيل واللؤلؤة.",
  },
  {
    icon: Building2,
    title: "التقسيط على الخارطة",
    points: [
      "احجز عنوان الغد بسعر اليوم",
      "خطط دفع ممتدة من المطوّر بفائدة 0%",
      "أقساط بعد التسليم تصل إلى 6 سنوات",
    ],
    cta: "اسأل عن خطط الشراء على الخارطة",
    message: "مرحباً، أنا مهتم بشقق التقسيط على الخارطة في لوسيل واللؤلؤة.",
  },
];

const PROCESS_STEPS = [
  { number: "01", title: "أخبرنا باحتياجاتك", body: "أجب عن بضعة أسئلة سريعة حول ميزانيتك وموقعك المفضل وجدولك الزمني." },
  { number: "02", title: "احصل على مطابقة", body: "يرسل لك مستشارنا خيارات مخصصة مباشرة عبر واتساب." },
  { number: "03", title: "جولة ومقارنة", body: "شاهد الوحدات المختارة للتملك بالإيجار وعلى الخارطة، حضورياً أو عن بُعد." },
  { number: "04", title: "احجز وتملّك", body: "أمّن وحدتك بخطة دفع مرنة تناسب ميزانيتك." },
];

const FAQ_ITEMS = [
  {
    q: "هل أحتاج إلى تمويل بنكي أو رهن عقاري؟",
    a: "لا. هذه خطط دفع من المطوّر بفائدة 0% — بدون تمويل بنكي أو موافقة رهن عقاري أو فحص ائتماني.",
  },
  {
    q: "هل يمكن للأجانب شراء شقة في لوسيل أو اللؤلؤة؟",
    a: "نعم. لوسيل واللؤلؤة منطقتا تملك حر معتمدتان في قطر، ومتاحتان للمشترين الأجانب.",
  },
  {
    q: "ما الفرق بين التملك بالإيجار والشراء على الخارطة؟",
    a: "وحدات التملك بالإيجار جاهزة للسكن الفوري — تبني دفعاتك الشهرية ملكيتك من اليوم الأول. أما وحدات الخارطة فتُحجز بسعر اليوم وتُسلَّم ضمن الجدول الزمني لمشروع المطوّر.",
  },
  {
    q: "كيف أتأهل للحصول على الإقامة القطرية من خلال هذا الشراء؟",
    a: "عمليات شراء العقارات المؤهلة بقيمة 730,000 ريال قطري فأكثر تتيح للمشترين التقدم للحصول على الإقامة القطرية، وفق الشروط الحكومية. يمكن لمستشارنا تأكيد أهليتك لوحدة معينة.",
  },
  {
    q: "هل الأسعار وخطط الدفع المعروضة نهائية؟",
    a: "هي استرشادية وتختلف حسب المطوّر والوحدة والتوفر الحالي. سيؤكد لك مستشارنا السعر الدقيق وخطة الدفع والأهلية لأي وحدة تهمك.",
  },
  {
    q: "ماذا يحدث بعد إرسال بياناتي؟",
    a: "يصل استفسارك مباشرة إلى مستشار عقاري يرد عليك عبر واتساب — عادة خلال دقائق — بالوحدات المطابقة والأسعار والخطوات التالية. بدون أي التزام بالمتابعة.",
  },
];

const LOCATIONS = [
  {
    name: "لوسيل",
    areas: "فوكس هيلز ومدينة ياسمين",
    img: "/images/areas/lusail.jpg",
    alt: "أفق مدينة لوسيل ومرسى اليخوت، قطر",
    blurb:
      "المدينة الذكية الرائدة في قطر — أبراج على الواجهة البحرية، حي المارينا، وأهم مركز للترفيه والأعمال في قطر.",
  },
  {
    name: "اللؤلؤة",
    areas: "بورتو أرابيا وفيفا بحرية",
    img: "/images/areas/pearl-qatar.jpg",
    alt: "مرسى وأبراج اللؤلؤة قطر",
    blurb:
      "جزيرة اصطناعية حصرية بمراسٍ ومحلات فاخرة وحياة على الشاطئ — أحد أكثر عناوين الدوحة طلباً.",
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

function WhyCard({
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
      <p className="mt-4 font-[family-name:var(--font-amiri)] text-lg font-semibold text-ink-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gold-200 bg-cream-50 p-6 transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-md">
      <p className="font-[family-name:var(--font-amiri)] text-3xl font-semibold text-gold-500">{number}</p>
      <p className="mt-3 font-[family-name:var(--font-amiri)] text-lg font-semibold text-ink-900">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
    </div>
  );
}

function StepArrow() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <ArrowLeft className="h-5 w-5 text-gold-400" strokeWidth={1.8} />
    </div>
  );
}

export default function QatarApartmentFinderPageAr() {
  return (
    <div
      dir="rtl"
      lang="ar"
      className="bg-cream-50 pb-20 font-[family-name:var(--font-tajawal)] lg:pb-0"
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "الرئيسية", url: SITE_URL },
          { name: "دليل شقق قطر", url: PAGE_URL },
        ])}
      />

      {/* HERO */}
      <section
        id="match-form"
        className="relative scroll-mt-16 overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white py-12 sm:py-20 lg:py-24"
      >
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
              فائدة 0% · تملك بالإيجار وعلى الخارطة
            </p>
            <span
              className="animate-fade-up mx-auto mt-2.5 block h-px w-14 bg-gradient-to-r from-gold-500 to-transparent sm:mt-3 lg:mx-0"
              style={{ animationDelay: "60ms" }}
            />

            <h1
              className="animate-fade-up mx-auto mt-3 max-w-full text-balance font-bold leading-[1.15] tracking-tight text-ink-900 sm:max-w-xl sm:mt-4 sm:leading-[1.05] lg:mx-0"
              style={{ fontSize: "clamp(1.125rem, 0.6rem + 3.2vw, 3.25rem)", animationDelay: "90ms" }}
            >
              <span className="text-gold-600">كفى إيجاراً.</span> امتلك منزلك في لوسيل ولؤلؤة قطر.
            </h1>

            <p
              className="animate-fade-up mx-auto mt-4 max-w-md text-balance text-base leading-relaxed text-gray-600 sm:mt-5 sm:text-lg lg:mx-0"
              style={{ animationDelay: "140ms" }}
            >
              بدون تمويل بنكي وبدون موافقات طويلة —{" "}
              <span className="font-[family-name:var(--font-amiri)] text-lg text-gold-600 sm:text-xl">
                فائدة 0%، ودفعة أولى 2% فقط.
              </span>
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

          <div className="animate-fade-up lg:self-center" style={{ animationDelay: "160ms" }}>
            <div className="overflow-hidden rounded-2xl border border-gold-200 shadow-xl">
              <div className="bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 px-6 py-3.5 text-center">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-950 sm:tracking-[0.25em]">
                  دليلك الحصري للمطابقة
                </p>
              </div>
              <div className="bg-white p-6 sm:p-7">
                <ApartmentFinderForm idPrefix="hero-ar" lang="ar" />
              </div>
            </div>
            <p className="mt-3 text-center text-xs leading-relaxed text-gray-500 sm:mt-4 lg:text-end">
              مجاني · بدون التزام · يستغرق حوالي دقيقة. خطط الدفع والأهلية استرشادية — تأكد من
              الشروط الحالية مع مستشارنا.
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

      {/* WHY BUY NOW */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="لماذا تشتري الآن" title="الطريقة الأذكى للتملك في قطر" />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CARDS.map((card) => (
            <Reveal key={card.title}>
              <WhyCard {...card} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* STARTING PRICES */}
      <section className="border-t border-gold-200 bg-cream-50 py-16 sm:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="عرض محدود"
            title="عرض تقسيط حصري، الآن"
            subtitle="وحدة جاهزة مع واحدة من أكثر خطط الدفع مرونة لدينا — لفترة محدودة."
          />
        </Reveal>

        <Reveal className="mx-auto mt-10 max-w-5xl px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border-2 border-gold-400 bg-ink-950 p-7 sm:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute -start-16 -top-16 h-64 w-64 rounded-full bg-gold-500/20 blur-3xl"
            />
            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
                  <Flame className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                  {LIMITED_DEAL.eyebrow}
                </p>
                <p className="mt-3 text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {LIMITED_DEAL.title}
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
                  {LIMITED_DEAL.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-white/80">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-400" strokeWidth={2} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <TrackedWhatsAppLink
                href={buildWaLink(LIMITED_DEAL.message)}
                className="flex shrink-0 items-center justify-center rounded-full bg-gold-500 px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-ink-950 transition duration-200 hover:scale-[1.03] hover:bg-gold-600 active:scale-[0.98]"
              >
                احجز هذه الوحدة
              </TrackedWhatsAppLink>
            </div>
          </div>
        </Reveal>

        <p className="mx-auto mt-6 max-w-5xl px-5 text-center text-xs text-gray-400 lg:px-8">
          الأسعار والتوفر استرشادية وتتغير باستمرار — تأكد من أحدث الأسعار وحالة الوحدة مع
          مستشارنا.
        </p>
      </section>

      {/* TWO WAYS TO OWN */}
      <section className="border-t border-gold-200 bg-white py-16 sm:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="طريقان للتملك"
            title="اختر الطريقة التي تناسبك"
            subtitle="سواء أردت الانتقال اليوم أو حجز عنوانك القادم، هناك خطة بفائدة 0% مصممة لك."
          />
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-6 px-5 sm:grid-cols-2 lg:px-8">
          {OWNERSHIP_PATHS.map((path) => (
            <Reveal key={path.title}>
              <div className="flex h-full flex-col rounded-2xl border border-gold-200 bg-cream-50 p-7 transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-lg">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-gold-600 shadow-sm">
                  <path.icon className="h-6 w-6" strokeWidth={1.8} />
                </span>
                <p className="mt-5 font-[family-name:var(--font-amiri)] text-xl font-semibold text-ink-900">
                  {path.title}
                </p>
                <ul className="mt-4 flex-1 space-y-3">
                  {path.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2.5 text-sm text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <TrackedWhatsAppLink
                  href={buildWaLink(path.message)}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-ink-900 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-white transition duration-200 hover:scale-[1.02] hover:bg-gold-500 hover:text-ink-950 active:scale-[0.98]"
                >
                  {path.cta}
                </TrackedWhatsAppLink>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FEATURED LOCATIONS */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8">
        <Reveal>
          <SectionHeading eyebrow="مواقع مميزة" title="أين يمكن أن تعيش" />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {LOCATIONS.map((loc) => (
            <Reveal key={loc.name}>
              <div className="group overflow-hidden rounded-2xl border border-gold-200 bg-white shadow-sm transition hover:shadow-lg">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={loc.img}
                    alt={loc.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    placeholder="blur"
                    blurDataURL={shimmerBlurDataURL(640, 400)}
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-[family-name:var(--font-amiri)] text-xl font-semibold text-ink-900">
                    {loc.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-gold-600">
                    <MapPin className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                    {loc.areas}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{loc.blurb}</p>
                  <TrackedWhatsAppLink
                    href={buildWaLink(
                      `مرحباً، أنا مهتم بشقق التملك بالإيجار والتقسيط على الخارطة في ${loc.name} (${loc.areas}).`,
                    )}
                    className="mt-5 inline-flex rounded-full bg-ink-900 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gold-500 hover:text-ink-950"
                  >
                    اسأل عن {loc.name}
                  </TrackedWhatsAppLink>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-gold-200 bg-white py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="كيف تسير العملية" title="من الاستفسار إلى التملك" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
            {PROCESS_STEPS.map((s, i) => (
              <Fragment key={s.title}>
                <Step {...s} />
                {i < PROCESS_STEPS.length - 1 && <StepArrow />}
              </Fragment>
            ))}
          </div>
        </Reveal>
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
              اعثر على شقتك المثالية اليوم
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600">
              احصل على أحدث المتاح من شقق التملك بالإيجار وعلى الخارطة، والأسعار وخطط الدفع من
              مستشارينا العقاريين.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#match-form"
                className="rounded-full bg-gold-500 px-7 py-3.5 text-center text-sm font-semibold uppercase tracking-wide text-ink-950 transition duration-200 hover:scale-[1.03] hover:bg-gold-600 active:scale-[0.98] sm:w-auto"
              >
                ابحث عن شقتي
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
              src="/images/areas/pearl-qatar.jpg"
              alt="مرسى وأبراج اللؤلؤة قطر عند الغسق"
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
        &copy; {new Date().getFullYear()} Luxury Estates. صفحة تسويقية مخصصة لشقق التملك بالإيجار
        والتقسيط على الخارطة في لوسيل واللؤلؤة، قطر. الأسعار والأهلية وشروط الدفع استرشادية وتخضع
        لتأكيد المطوّر.
      </footer>

      <WhatsAppBubble lang="ar" />
      <MobileStickyBar lang="ar" />
    </div>
  );
}
