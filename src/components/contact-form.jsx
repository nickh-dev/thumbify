"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"

export default function ContactForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate form submission
    setTimeout(() => {
      setStatus("success")
      setIsLoading(false)
    }, 1200)
  }

  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Contact Us</h3>
      {status === "success" ? (
        <div className="text-sm text-green-400">Thanks for reaching out! We'll be in touch soon.</div>
      ) : (
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-grow bg-[#1a1a1a] border border-zinc-800 focus:border-zinc-600 rounded-l-md px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-white text-black hover:bg-zinc-200 rounded-r-md px-3 transition-colors duration-200 disabled:bg-zinc-700 disabled:text-zinc-400"
          >
            {isLoading ? <span className="px-1">...</span> : <ArrowRight className="h-4 w-4" />}
          </button>
        </form>
      )}
      <p className="text-xs text-zinc-500 mt-2">We'll respond to your inquiry as soon as possible.</p>
    </div>
  )
}
