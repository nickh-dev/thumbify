"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { cn } from "@/lib/utils"

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Which plan should I choose?",
      answer:
        "The best plan depends on your needs. The Starter plan is ideal for beginners, while the Pro Creator plan offers more features for serious content creators. If you're looking for long-term value, the Lifetime Access plan provides unlimited thumbnails forever with a one-time payment.",
    },
    {
      question: "What happens if I get more thumbnails than my plan?",
      answer:
        "If you reach your monthly thumbnail limit, you can upgrade to a higher plan at any time. We'll also notify you when you're approaching your limit so you can plan accordingly.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes, we offer a 7-day free trial with access to all Pro Creator features. No credit card is required to start your trial, and you can cancel anytime.",
    },
    {
      question: "Is ThumbnailMagic GDPR compliant?",
      answer:
        "Yes, ThumbnailMagic is fully GDPR compliant. We take data privacy seriously and have implemented all necessary measures to protect your personal information in accordance with GDPR regulations.",
    },
    {
      question: "Do I need to make money to use ThumbnailMagic?",
      answer:
        "No, ThumbnailMagic is for everyone. Whether you're a hobbyist, a growing creator, or a professional, our platform is designed to help you create better thumbnails regardless of your monetization status.",
    },
    {
      question: "Do I need to code to use ThumbnailMagic?",
      answer:
        "Absolutely not. ThumbnailMagic is designed with a user-friendly interface that requires no coding knowledge. Simply upload your image, describe your vision, and our AI will generate professional thumbnails for you.",
    },
    {
      question: "Can I migrate my existing data?",
      answer:
        "Yes, if you have existing thumbnails or designs, you can easily upload and enhance them with ThumbnailMagic. Our platform is compatible with all major image formats.",
    },
    {
      question: "Which payment providers are supported?",
      answer:
        "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. All payments are processed securely through our payment partners.",
    },
    {
      question: "Do you have an affiliate program?",
      answer:
        "Yes, we offer an affiliate program with competitive commission rates. You can earn up to 30% on each referral that signs up for a paid plan. Contact our support team for more details.",
    },
  ]

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">Find answers to common questions about ThumbnailMagic</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-[#1a1a1a] rounded-xl overflow-hidden transition-all duration-300">
            <button
              className="flex justify-between items-center w-full p-5 text-left"
              onClick={() => toggleFaq(index)}
              aria-expanded={openIndex === index}
            >
              <span className="text-white font-medium">{faq.question}</span>
              <Plus
                className={cn(
                  "h-5 w-5 text-white transition-transform duration-200",
                  openIndex === index && "transform rotate-45",
                )}
              />
            </button>
            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                openIndex === index ? "max-h-96 pb-5 px-5" : "max-h-0",
              )}
            >
              <p className="text-zinc-400">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
