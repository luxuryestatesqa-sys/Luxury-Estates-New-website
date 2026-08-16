import type { Metadata } from "next";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import FeaturedProperties from "@/components/FeaturedProperties";
import TrustedBy from "@/components/TrustedBy";
import OffPlanTeaser from "@/components/OffPlanTeaser";
import AreaHighlights from "@/components/AreaHighlights";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import BlogTeaser from "@/components/BlogTeaser";
import CtaSection from "@/components/CtaSection";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Luxury Estates | Fine Properties in Qatar",
  description:
    "Luxury Estates connects discerning buyers, tenants and investors with Qatar's finest apartments, villas and commercial properties in Doha, Lusail and The Pearl.",
  alternates: { canonical: SITE_URL },
};

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedProperties />
      <TrustedBy />
      <OffPlanTeaser />
      <AreaHighlights />
      <WhyChooseUs />
      <Testimonials />
      <BlogTeaser />
      <CtaSection />
    </>
  );
}
