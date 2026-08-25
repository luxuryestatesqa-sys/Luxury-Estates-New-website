import type { Metadata } from "next";
import Image from "next/image";
import {
  Ruler,
  MapPin,
  Home,
  Gem,
  PencilRuler,
  LayoutGrid,
  ShieldCheck,
  ArrowLeft,
  Compass,
} from "lucide-react";
import { shimmerBlurDataURL } from "@/lib/image";
import JsonLd, { breadcrumbJsonLd } from "@/components/JsonLd";
import { SITE_URL } from "@/lib/site";
import TrustBadges from "@/components/TrustBadges";
import HuzoomAnnouncementBar from "../HuzoomAnnouncementBar";
import HuzoomMobileBar from "../HuzoomMobileBar";
import HuzoomWhatsAppButton from "../HuzoomWhatsAppButton";
import HuzoomLanguageSwitch from "../HuzoomLanguageSwitch";
import HuzoomLeadForm from "../HuzoomLeadForm";
import HuzoomFaq from "../HuzoomFaq";
import Reveal from "../Reveal";
import { buildWaLink, DEFAULT_WA_MESSAGE_AR, HUZOOM_PHONE } from "../constants";

const PAGE_URL = `${SITE_URL}/huzoom-lands-for-sale/ar`;
const PAGE_URL_EN = `${SITE_URL}/huzoom-lands-for-sale`;

export const metadata: Metadata = {
  title: "أراضي للبيع في حزوم لوسيل، قطر",
  description:
    "استكشف أراضي حزوم لوسيل، قطر، للبيع بالتملك الحر. تعرف على أحجام القطع والأسعار الاسترشادية وتفاصيل الاستثمار. تواصل مع مستشارينا العقاريين للحصول على أحدث المتاح.",
  alternates: {
    canonical: PAGE_URL,
    languages: { en: PAGE_URL_EN, ar: PAGE_URL },
  },
  openGraph: {
    title: "أراضي للبيع في حزوم لوسيل، قطر | Luxury Estates",
    description:
      "استكشف أراضي حزوم لوسيل، قطر، للبيع بالتملك الحر. تعرف على أحجام القطع والأسعار الاسترشادية وتفاصيل الاستثمار.",
    url: PAGE_URL,
    locale: "ar_QA",
    images: [{ url: `${SITE_URL}/images/huzoom/discover-community.jpg` }],
  },
  twitter: {
    card: "summary_large_image",
    title: "أراضي للبيع في حزوم لوسيل، قطر | Luxury Estates",
    description:
      "استكشف أراضي حزوم لوسيل، قطر، للبيع بالتملك الحر. تعرف على أحجام القطع والأسعار الاسترشادية وتفاصيل الاستثمار.",
  },
};

const MORE_VIEWS = [
  {
    src: "/images/huzoom/lusail-marina.jpg",
    alt: "لوسيل، قطر — الحي البحري",
    caption: "لوسيل، قطر — الحي البحري",
  },
  {
    src: "/images/huzoom/plot-555sqm.jpg",
    alt: "قطعة أرض بمساحة 555 م² للبيع في حزوم لوسيل",
    caption: "قطعة 555 م² — حزوم لوسيل",
  },
  {
    src: "/images/huzoom/community-living.jpg",
    alt: "الحياة المجتمعية في حزوم لوسيل",
    caption: "حزوم لوسيل — الحياة المجتمعية",
  },
];

const PRICING_TABLE = [
  {
    size: "400 م²",
    type: "قطعة وسطية قياسية (المرحلة 1 و 2)",
    priceRange: "1,850,000 ريال قطري",
    rate: "~4,625 ريال/م²",
  },
  {
    size: "400 م²",
    type: "زاوية مميزة / ملاصقة لحديقة",
    priceRange: "1,950,000 ريال قطري",
    rate: "~4,875 ريال/م²",
  },
  {
    size: "480 م²",
    type: "قطعة ملاصقة لحديقة",
    priceRange: "2,065,000 – 2,200,000 ريال قطري",
    rate: "~4,300 – 4,585 ريال/م²",
  },
  {
    size: "555 م²",
    type: "قطعة وسطية / شارع رئيسي",
    priceRange: "2,400,000 – 2,650,000 ريال قطري",
    rate: "~4,325 – 4,775 ريال/م²",
  },
  {
    size: "555 م²",
    type: "زاوية مميزة (المرحلة 2)",
    priceRange: "2,600,000 – 2,900,000 ريال قطري",
    rate: "~4,685 – 5,225 ريال/م²",
  },
  {
    size: "800 – 833 م²",
    type: "قطعة فيلا كبيرة / زاوية",
    priceRange: "3,600,000 – 3,900,000 ريال قطري",
    rate: "~4,320 – 4,875 ريال/م²",
  },
];

const TRUST_ITEMS: { icon: "shield" | "check" | "lock"; label: string }[] = [
  { icon: "shield", label: "استشارة عقارية موثوقة — Luxury Estates" },
  { icon: "check", label: "تملك حر 100% — منطقة تملك لوسيل" },
  { icon: "lock", label: "استفسار بدون التزام، رد سريع" },
];

const WHY_CARDS = [
  {
    icon: Compass,
    title: "موقع متميز",
    body: "وجهة سكنية استراتيجية الموقع في قطر.",
  },
  {
    icon: PencilRuler,
    title: "ابنِ فيلتك الخاصة",
    body: "أنشئ منزلاً مصمماً وفق أسلوب حياتك ومتطلباتك.",
  },
  {
    icon: LayoutGrid,
    title: "خيارات قطع مميزة",
    body: "اختر من بين أحجام ومواقع مختلفة للقطع حسب احتياجاتك.",
  },
  {
    icon: ShieldCheck,
    title: "ملكية طويلة الأمد",
    body: "امتلك أصلاً عقارياً سكنياً ملموساً.",
  },
];

const FAQ_ITEMS = [
  {
    q: "ما هي حزوم؟",
    a: "حزوم مجتمع سكني متميز يقدم قطع أراضٍ للمشترين الراغبين في بناء فللهم الخاصة ضمن بيئة مخطط لها بعناية.",
  },
  {
    q: "ما هي أنواع القطع المتاحة؟",
    a: "تتوفر مجموعة من خيارات القطع، تشمل قطع الفلل القياسية، القطع السكنية المتوسطة، القطع المميزة بزاوية أو شارعين، والقطع الكبيرة بحجم عقاري واسع.",
  },
  {
    q: "ما هي أحجام القطع المتاحة؟",
    a: "تبدأ أحجام القطع المتاحة من 400 متر مربع وتشمل خيارات تتراوح بين 480–555 متراً مربعاً، وقطعاً مميزة بمساحة 555 متراً مربعاً، وقطعاً أكبر بمساحة 800+ متر مربع، حسب التوفر.",
  },
  {
    q: "ما هي أسعار أراضي حزوم؟",
    a: "تبدأ الأسعار حالياً من نحو 1.85 مليون ريال قطري، حسب حجم القطعة وموقعها ووضعيتها ومدى توفرها.",
  },
  {
    q: "هل يمكنني بناء فيلتي الخاصة على قطعة في حزوم؟",
    a: "نعم، يمكن للمشترين تطوير فيلا سكنية على قطعتهم، وذلك وفقاً لأنظمة التخطيط والبناء ولوائح المجتمع المعمول بها.",
  },
  {
    q: "هل تتوفر قطع بزاوية أو على شارعين؟",
    a: "نعم، قد تتوفر بعض القطع المميزة بموقع زاوية أو على شارعين، مما يوفر خصوصية إضافية ووصولاً أوسع ومرونة معمارية أكبر.",
  },
  {
    q: "كيف يمكنني معرفة أحدث القطع المتاحة؟",
    a: "ببساطة، أرسل استفسارك عبر النموذج أو تواصل مع مستشار العقارات لدينا عبر واتساب للحصول على أحدث القطع المتاحة والأسعار.",
  },
  {
    q: "هل الأسعار المعروضة على الموقع نهائية؟",
    a: "الأسعار المعروضة استرشادية وقد تختلف حسب القطعة المحددة وتوفرها في السوق حالياً. يرجى التواصل معنا للحصول على السعر والتوفر النهائي المؤكد.",
  },
  {
    q: "كيف يمكنني حجز أو الاحتفاظ بقطعة؟",
    a: "أرسل استفسارك، وسيقوم مستشار العقارات لدينا بإرشادك خلال الخيارات المتاحة والأسعار وإجراءات الحجز والخطوات التالية.",
  },
];

export default function HuzoomLandsPageAr() {
  return (
    <div
      dir="rtl"
      lang="ar"
      className="bg-cream-50 pb-20 font-[family-name:var(--font-tajawal)] lg:pb-0"
    >
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "الرئيسية", url: SITE_URL },
          { name: "أراضي حزوم للبيع", url: PAGE_URL },
        ])}
      />

      <HuzoomAnnouncementBar lang="ar" />

      {/* HERO */}
      <section
        id="get-prices"
        className="relative isolate scroll-mt-16 overflow-hidden bg-gradient-to-b from-cream-100 via-cream-50 to-white"
      >
        <HuzoomLanguageSwitch lang="ar" />
        <div
          aria-hidden
          className="pointer-events-none absolute -end-32 -top-32 h-[26rem] w-[26rem] rounded-full bg-gold-300/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -start-32 bottom-0 h-[22rem] w-[22rem] rounded-full bg-gold-200/40 blur-3xl"
        />

        <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-14 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gold-600">
              حزوم لوسيل &middot; لوسيل، قطر
            </p>
            <h1 className="mt-4 max-w-xl text-[clamp(1.9rem,1.4rem+2.5vw,3.1rem)] font-bold leading-[1.25] tracking-tight text-ink-900">
              أراضي للبيع في حزوم لوسيل، قطر
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-600">
              اكتشف القطع السكنية في حزوم لوسيل بأحجام جذابة وأسعار تنافسية وفرص تملك حر للمشترين
              المؤهلين.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                "قطع سكنية من 400 م² إلى 800+ م²",
                "معدلات تقارب 4,300 – 5,225 ريال قطري للمتر المربع",
                "تملك حر 100% — متاح للمستثمرين الأجانب",
                "استشارة مستقلة — بدون ارتباط بالمطوّر",
              ].map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                  {pt}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href={buildWaLink(DEFAULT_WA_MESSAGE_AR)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-gold-500 px-7 py-3.5 text-center text-sm font-semibold text-ink-950 transition duration-200 hover:scale-[1.03] hover:bg-gold-600 active:scale-[0.98] sm:w-auto"
              >
                تواصل عبر واتساب
              </a>
              <a
                href={`tel:${HUZOOM_PHONE}`}
                className="rounded-full border border-gray-300 px-7 py-3.5 text-center text-sm font-semibold text-ink-900 transition hover:border-ink-900 sm:w-auto"
              >
                اتصل بمستشار العقارات
              </a>
            </div>
          </div>

          {/* Photo collage */}
          <div className="relative pb-8 ps-8 sm:pb-10 sm:ps-10">
            <div className="relative overflow-hidden rounded-3xl border border-gold-200 shadow-xl">
              <div className="relative aspect-[4/3]">
                <Image
                  src="/images/huzoom/discover-community.jpg"
                  alt="حزوم لوسيل — حي الفلل عند الغروب الذهبي"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute -bottom-1 end-5 flex items-center gap-2 rounded-full border border-gold-200 bg-white px-4 py-2 shadow-lg sm:end-6">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-gold-600" strokeWidth={2} />
              <p className="text-xs font-semibold text-ink-800">حزوم لوسيل — منظر جوي</p>
            </div>

            <div className="absolute -start-2 -top-6 w-32 -rotate-3 sm:-start-4 sm:-top-8 sm:w-40 lg:w-44">
              <div className="rounded-xl border-4 border-white bg-white p-1.5 shadow-2xl">
                <div className="relative aspect-[4/5] overflow-hidden rounded-md">
                  <Image
                    src="/images/huzoom/lusail-marina.jpg"
                    alt="مرسى وأفق لوسيل، قطر"
                    fill
                    loading="lazy"
                    sizes="176px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="absolute -bottom-1 start-2 flex items-center gap-2 rounded-full bg-gold-500 px-4 py-2 shadow-lg sm:start-4">
              <span aria-hidden className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-ink-950" />
              <p className="text-[11px] font-bold text-ink-950">إقبال كبير — كمية محدودة</p>
            </div>
          </div>
        </div>
      </section>

      {/* LAND OPTIONS & PRICES */}
      <section className="border-t border-gold-200 bg-white py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="المخزون المتاح"
            title="أحجام قطع حزوم لوسيل والأسعار الاسترشادية"
            subtitle="تتراوح القطع المتاحة عادة بين 400 م² و 800+ م²، بمعدل أسعار يتراوح بين 4,300 – 5,225 ريال قطري للمتر المربع حسب موقع القطعة."
          />

          {/* One real table at every width — below lg it scrolls horizontally
              (swipe) inside its bordered frame instead of reflowing into cards. */}
          <div className="mt-10 overflow-hidden rounded-2xl border border-gold-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-right text-sm">
                <thead>
                  <tr className="border-b border-gold-200 bg-cream-100">
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      حجم القطعة
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      نوع الوحدة / الموقع
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      متوسط نطاق السعر الإجمالي
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      متوسط السعر للمتر المربع
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {PRICING_TABLE.map((row) => (
                    <tr key={row.type} className="border-b border-gold-100 last:border-0">
                      <td className="px-6 py-4 font-semibold text-ink-900">{row.size}</td>
                      <td className="px-6 py-4 text-gray-600">{row.type}</td>
                      <td className="px-6 py-4 text-gray-600">{row.priceRange}</td>
                      <td className="px-6 py-4 font-medium text-gold-600">{row.rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-xs leading-relaxed text-gray-400">
            الأسعار استرشادية فقط. تختلف المعدلات حسب موقع القطعة الدقيق (وسطية أو زاوية، واجهة
            على شارع رئيسي، أو قطع ملاصقة لحدائق أو مساجد) وحسب ظروف السوق الحالية. يرجى التواصل
            معنا للحصول على أحدث الأسعار للوحدات المتاحة.
          </p>

          <a
            href={buildWaLink(
              "مرحباً، أرغب في معرفة أحدث أسعار قطع حزوم المتاحة. يرجى إرسال آخر الأسعار.",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center justify-center rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white transition duration-200 hover:scale-[1.03] hover:bg-gold-500 hover:text-ink-950 active:scale-[0.98] sm:inline-flex"
          >
            استفسر عن الأسعار
          </a>
        </Reveal>
      </section>

      {/* WHY HUZOOM + FORM */}
      <section id="huzoom-form" className="scroll-mt-24 border-t border-gold-200 bg-cream-50 py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:gap-16">
            <div>
              <SectionHeading eyebrow="المجتمع" title="لماذا تختار حزوم؟" />
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {WHY_CARDS.map((c) => (
                  <WhyCard key={c.title} icon={c.icon} title={c.title} body={c.body} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <HuzoomLeadForm idPrefix="hero-ar" sourceReference="hero" lang="ar" />
              <TrustBadges items={TRUST_ITEMS} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* QUICK HIGHLIGHTS */}
      <section className="border-t border-gold-200 bg-white py-10 lg:py-12">
        <Reveal className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-5 sm:grid-cols-4 lg:px-8">
          <Highlight icon={Ruler} title="400 م²+" subtitle="خيارات القطع السكنية" />
          <Highlight icon={MapPin} title="مواقع متميزة" subtitle="قطع في مواقع مميزة" />
          <Highlight icon={Home} title="تطوير الفلل" subtitle="البناء وفق الأنظمة المعمول بها" />
          <Highlight icon={Gem} title="كمية محدودة" subtitle="اطلب أحدث المتاح" />
        </Reveal>
      </section>

      {/* GALLERY */}
      <section className="border-t border-gold-200 bg-cream-50 py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="استكشف"
            title="اكتشف حزوم"
            subtitle="نظرة عن قرب على البيئة السكنية وأسلوب الحياة الذي تقدمه حزوم لوسيل."
          />
          <div className="relative mt-10 overflow-hidden rounded-2xl border border-gold-200 shadow-lg">
            <div className="relative aspect-[16/8]">
              <Image
                src="/images/huzoom/discover-community.jpg"
                alt="حزوم لوسيل — المجتمع السكني عند الغسق"
                fill
                loading="lazy"
                sizes="100vw"
                placeholder="blur"
                blurDataURL={shimmerBlurDataURL(800, 400)}
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-5 pb-4 pt-10">
                <p className="text-xs font-medium text-white">حزوم لوسيل — البيئة السكنية</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* MORE VIEWS */}
      <section className="border-t border-gold-200 bg-white py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="لوسيل، قطر" title="المزيد من إطلالات حزوم لوسيل" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {MORE_VIEWS.map((img) => (
              <div
                key={img.src}
                className="relative overflow-hidden rounded-2xl border border-gold-200 shadow-sm"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    placeholder="blur"
                    blurDataURL={shimmerBlurDataURL(300, 225)}
                    className="object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent px-4 pb-3 pt-8">
                    <p className="text-xs font-medium text-white">{img.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* LOCATION */}
      <section className="relative overflow-hidden border-t border-gold-200 bg-cream-50 py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="الموقع" title="موقع مصمم لحياة عصرية" />

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold-200">
              <Image
                src="/images/huzoom/hero-location-map.jpg"
                alt="خريطة حدود قطعة حزوم لوسيل"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL={shimmerBlurDataURL(400, 300)}
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-base leading-relaxed text-gray-600">
                تقع حزوم ضمن النسيج السكني لدولة قطر كمجتمع مخصص لحياة الفلل الخاصة. توفر قطعاً
                سكنية مخصصة لتطوير الفلل ضمن بيئة سكنية متكاملة.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                    <Home className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  قطع سكنية مخصصة لتطوير الفلل الخاصة
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                    <MapPin className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  جزء من مجتمع سكني متكامل
                </li>
                <li className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-50 text-gold-600">
                    <Compass className="h-3.5 w-3.5" strokeWidth={2} />
                  </span>
                  الوصول للطرق والمسافات والمعالم القريبة يؤكدها مستشارنا
                </li>
              </ul>
              <a
                href={buildWaLink("مرحباً، هل يمكنكم إرسال معلومات تفصيلية عن موقع قطع حزوم؟")}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 flex items-center justify-center rounded-full bg-ink-900 px-7 py-3.5 text-sm font-semibold text-white transition duration-200 hover:scale-[1.03] hover:bg-gold-500 hover:text-ink-950 active:scale-[0.98] sm:inline-flex"
              >
                احصل على تفاصيل الموقع
              </a>
            </div>
          </div>
        </Reveal>
      </section>

      {/* INVESTMENT */}
      <section className="border-t border-gold-200 bg-white py-16 lg:py-20">
        <Reveal className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="الملكية" title="أكثر من مجرد أرض. أصل طويل الأمد." />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-stretch">
            <Step number="01" title="اقتنِ" body="أمّن قطعتك السكنية." />
            <StepArrow />
            <Step number="02" title="طوّر" body="ابنِ وفق الأنظمة التطويرية المعمول بها." />
            <StepArrow />
            <Step number="03" title="امتلك" body="أنشئ أصلاً عقارياً مصمماً وفق متطلباتك." />
            <StepArrow />
            <Step
              number="04"
              title="احتفظ أو استثمر"
              body="استكشف خياراتك طويلة الأمد وفقاً لظروف السوق والأنظمة المعمول بها."
            />
          </div>
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="border-t border-gold-200 bg-cream-50 px-5 py-16 lg:px-8 lg:py-20">
        <Reveal className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="الأسئلة الشائعة" title="الأسئلة المتكررة" />
          <div className="mt-10">
            <HuzoomFaq items={FAQ_ITEMS} />
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
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-600">
              ابدأ الآن
            </p>
            <h2 className="gold-underline mt-3 pb-3 text-h2 font-bold tracking-tight text-ink-900">
              اعثر على قطعتك المثالية في حزوم
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-gray-600">
              احصل على أحدث معلومات توفر القطع والأسعار والأحجام وتفاصيل الدفع من مستشارينا
              العقاريين.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#final-form"
                className="rounded-full bg-gold-500 px-7 py-3.5 text-center text-sm font-semibold text-ink-950 transition duration-200 hover:scale-[1.03] hover:bg-gold-600 active:scale-[0.98] sm:w-auto"
              >
                احصل على أسعار حزوم
              </a>
              <a
                href={buildWaLink(DEFAULT_WA_MESSAGE_AR)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-gray-300 px-7 py-3.5 text-center text-sm font-semibold text-ink-900 transition hover:border-ink-900 sm:w-auto"
              >
                تواصل مع مستشار عبر واتساب
              </a>
            </div>
          </div>
          <div id="final-form" className="scroll-mt-24 space-y-4">
            <HuzoomLeadForm idPrefix="final-ar" sourceReference="final-cta" lang="ar" />
            <TrustBadges items={TRUST_ITEMS} />
          </div>
        </Reveal>
      </section>

      <footer className="border-t border-gold-200 bg-white px-5 py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} Luxury Estates. صفحة تسويقية مخصصة لأراضي حزوم المعروضة
        للبيع.
      </footer>

      <HuzoomMobileBar lang="ar" />
      <HuzoomWhatsAppButton lang="ar" />
    </div>
  );
}

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
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold-500">{eyebrow}</p>
      <h2 className="gold-underline mt-2 pb-3 font-[family-name:var(--font-amiri)] text-h2 font-semibold text-ink-900">
        {title}
      </h2>
      {subtitle && <p className="mt-4 text-base text-gray-600">{subtitle}</p>}
    </div>
  );
}

function Highlight({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Ruler;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-gold-200 p-5 text-center transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-md sm:items-start sm:text-start">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cream-100 text-gold-600">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <p className="font-[family-name:var(--font-amiri)] text-base font-semibold text-ink-900">
        {title}
      </p>
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
}

function WhyCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Ruler;
  title: string;
  body: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-gold-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-lg">
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

function Step({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <div className="flex flex-col rounded-2xl border border-gold-200 bg-cream-50 p-6 transition hover:-translate-y-1 hover:border-gold-400 hover:shadow-md">
      <p className="font-[family-name:var(--font-amiri)] text-3xl font-semibold text-gold-500">
        {number}
      </p>
      <p className="mt-3 font-[family-name:var(--font-amiri)] text-lg font-semibold text-ink-900">
        {title}
      </p>
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
