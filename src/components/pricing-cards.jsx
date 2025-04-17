"use client"

import { useState } from "react"
import { Check, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

export default function PricingCards() {
  const [billingType, setBillingType] = useState("monthly")

  const monthlyPlans = [
    {
      name: "Starter",
      description: "Best for beginner creators",
      price: 12,
      period: "month",
      features: [
        "50 thumbnails per month",
        "Basic styles",
        "Standard quality (720p)",
        "Email support",
        "Basic editing tools",
      ],
      limitations: ["No premium styles", "No priority generation"],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Pro Creator",
      description: "Ideal for content creators and agencies",
      price: 29,
      period: "month",
      features: [
        "200 thumbnails per month",
        "Access to premium styles",
        "High quality (1080p)",
        "Priority generation",
        "History access",
        "Advanced editing tools",
        "Priority support",
      ],
      limitations: [],
      cta: "Upgrade to Pro",
      popular: true,
    },
  ]

  const lifetimePlans = [
    {
      name: "Lifetime Access",
      description: "One-time payment for lifetime access",
      price: 99,
      period: "one-time",
      features: [
        "Unlimited thumbnails forever",
        "All Pro features included",
        "Access to premium styles",
        "High quality (1080p)",
        "Priority generation",
        "History access",
        "Advanced editing tools",
        "Priority support",
        "Future updates included",
      ],
      limitations: [],
      cta: "Get Lifetime Access",
      popular: true,
    },
  ]

  const plans = billingType === "monthly" ? monthlyPlans : lifetimePlans

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          Select the perfect plan for your needs. Start creating stunning thumbnails today.
        </p>

        {/* Billing toggle */}
        <div className="flex items-center justify-center mt-8">
          <div className="bg-zinc-900 p-1 rounded-full inline-flex relative">
            <button
              onClick={() => setBillingType("monthly")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                billingType === "monthly" ? "bg-white text-black" : "text-zinc-400 hover:text-white",
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingType("lifetime")}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                billingType === "lifetime" ? "bg-white text-black" : "text-zinc-400 hover:text-white",
              )}
            >
              Lifetime
            </button>
            {billingType === "lifetime" && (
              <span className="absolute -top-6 right-0 bg-zinc-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                Save
              </span>
            )}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "grid gap-8 max-w-5xl mx-auto",
          billingType === "monthly" ? "grid-cols-1 md:grid-cols-2 max-w-3xl" : "grid-cols-1 max-w-xl",
        )}
      >
        {plans.map((plan, index) => (
          <div
            key={index}
            className={cn(
              "relative rounded-xl overflow-hidden transition-all duration-300 hover:translate-y-[-4px]",
              plan.popular ? "border-2 border-white" : "border border-zinc-800",
            )}
          >
            {/* Popular badge */}
            {plan.popular && (
              <div className="absolute top-4 right-4 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">
                {billingType === "monthly" ? "Most Popular" : "Best Value"}
              </div>
            )}

            {/* Card content */}
            <div className="p-6 bg-zinc-900 h-full flex flex-col">
              <div className="mb-6 mt-4">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-sm text-zinc-400">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-zinc-400 ml-2">/ {plan.period}</span>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-zinc-800">
                <h4 className="text-sm font-semibold text-zinc-300 mb-3">What's included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-white mr-2 shrink-0" />
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.limitations.length > 0 && (
                <div className="mb-6 flex-grow">
                  <h4 className="text-sm font-semibold text-zinc-300 mb-3">Limitations:</h4>
                  <ul className="space-y-3">
                    {plan.limitations.map((limitation, i) => (
                      <li key={i} className="flex items-start">
                        <X className="h-5 w-5 text-zinc-600 mr-2 shrink-0" />
                        <span className="text-sm text-zinc-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-auto">
                <button
                  className={cn(
                    "w-full py-3 rounded-md font-medium text-center transition-all duration-300",
                    plan.popular ? "bg-white text-black hover:bg-zinc-200" : "bg-zinc-800 text-white hover:bg-zinc-700",
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    {plan.cta}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <p className="text-sm text-zinc-500">All plans include a 14-day money-back guarantee. No questions asked.</p>
      </div>
    </div>
  )
}
