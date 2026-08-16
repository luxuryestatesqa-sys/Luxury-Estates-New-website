"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    question: "Do I need to be a resident to buy property in Qatar?",
    answer:
      "No. Qatar permits foreign nationals to buy freehold and usufruct property in designated areas, including The Pearl, Lusail and West Bay Lagoon. Our advisors can walk you through the eligibility requirements for your nationality.",
  },
  {
    question: "How long does a typical purchase take from offer to title transfer?",
    answer:
      "Most resale transactions complete within 4–8 weeks once financing and legal checks are in place. Off-plan purchases follow the developer's payment and handover schedule, which we'll outline before you commit.",
  },
  {
    question: "Can Luxury Estates help with financing?",
    answer:
      "Yes. We work alongside a small panel of banks and mortgage brokers who understand foreign-buyer and expatriate lending in Qatar, and can introduce you directly.",
  },
  {
    question: "Do you handle property management for rented units?",
    answer:
      "We do, for a select portfolio of landlord clients — including tenant sourcing, rent collection and maintenance coordination. Ask your advisor whether your property qualifies.",
  },
  {
    question: "What fees should I expect as a buyer?",
    answer:
      "Buyers typically budget for registration fees, agency commission and any applicable legal fees. Your advisor will provide an itemized estimate specific to your transaction before you make an offer.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl divide-y divide-[#e8e8e8]">
      {faqs.map((faq, i) => {
        const open = openIndex === i;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span className="text-base font-semibold text-ink-900">{faq.question}</span>
              <Plus
                className={`h-5 w-5 shrink-0 text-ink-700 transition-transform duration-300 ${
                  open ? "rotate-45" : ""
                }`}
                strokeWidth={1.8}
              />
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-300 ease-out ${
                open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <p className="min-h-0 text-base leading-relaxed text-[#6b7280]">{faq.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
