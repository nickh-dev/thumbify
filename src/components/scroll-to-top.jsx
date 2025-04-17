"use client"

import { useState, useEffect } from "react"
import { ChevronUp } from "lucide-react"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Function to handle scroll event
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Add event listener
    window.addEventListener("scroll", toggleVisibility)

    // Clean up on component unmount
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "top-4 opacity-100" : "top-0 opacity-0 pointer-events-none"
      }`}
    >
      <button
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="flex items-center justify-center w-10 h-10 bg-black/70 hover:bg-black backdrop-blur-sm border border-zinc-800 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
      >
        <ChevronUp className="h-5 w-5 text-white" />
      </button>
    </div>
  )
}
