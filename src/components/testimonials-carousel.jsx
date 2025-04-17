"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TestimonialsCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const autoplayRef = useRef(null)

  // Sample testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Alex Morgan",
      role: "Content Creator",
      company: "TechTalks",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      quote:
        "ThumbnailMagic transformed my YouTube channel. My click-through rates increased by 42% in just one month after switching to AI-generated thumbnails. The interface is intuitive and the results are stunning!",
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "Marketing Director",
      company: "Innovate Inc.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      quote:
        "As a marketing team, we needed a solution that could scale with our content production. ThumbnailMagic delivers consistent, high-quality thumbnails that align perfectly with our brand identity. Worth every penny!",
      rating: 5,
    },
    {
      id: 3,
      name: "Marcus Johnson",
      role: "Gaming Streamer",
      company: "GamerZone",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      quote:
        "The cyberpunk style thumbnails are fire! My viewers immediately notice when I use ThumbnailMagic versus my old thumbnails. The AI understands exactly what gamers want to see. Absolutely recommend!",
      rating: 4,
    },
    {
      id: 4,
      name: "Priya Patel",
      role: "Travel Vlogger",
      company: "Wanderlust",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop",
      quote:
        "I was skeptical about AI-generated thumbnails, but ThumbnailMagic changed my mind. The cinematic landscapes it creates capture the essence of my travel videos perfectly. My audience has grown 3x since I started using it!",
      rating: 5,
    },
    {
      id: 5,
      name: "David Wilson",
      role: "Product Manager",
      company: "TechSolutions",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      quote:
        "We integrated ThumbnailMagic into our content workflow and it's been a game-changer. The time saved on thumbnail creation alone justifies the subscription. The quality is consistently excellent.",
      rating: 4,
    },
  ]

  const nextSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const prevSlide = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
    setTimeout(() => setIsAnimating(false), 500)
  }

  const goToSlide = (index) => {
    if (isAnimating || index === activeIndex) return
    setIsAnimating(true)
    setActiveIndex(index)
    setTimeout(() => setIsAnimating(false), 500)
  }

  // Auto-rotation
  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      nextSlide()
    }, 8000)

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current)
      }
    }
  }, [activeIndex])

  // Pause auto-rotation on hover
  const pauseAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current)
      autoplayRef.current = null
    }
  }

  // Resume auto-rotation on mouse leave
  const resumeAutoplay = () => {
    if (!autoplayRef.current) {
      autoplayRef.current = setInterval(() => {
        nextSlide()
      }, 8000)
    }
  }

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Users Say</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Join thousands of content creators who have transformed their thumbnails with our AI-powered platform
          </p>
        </div>

        <div
          className="relative max-w-5xl mx-auto"
          onMouseEnter={pauseAutoplay}
          onMouseLeave={resumeAutoplay}
          aria-live="polite"
        >
          {/* Testimonial cards */}
          <div className="relative h-[400px] md:h-[320px] overflow-hidden rounded-2xl">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={cn(
                  "absolute inset-0 w-full transition-all duration-500 ease-in-out",
                  index === activeIndex
                    ? "opacity-100 translate-x-0 z-10"
                    : index < activeIndex
                      ? "opacity-0 -translate-x-full z-0"
                      : "opacity-0 translate-x-full z-0",
                )}
                aria-hidden={index !== activeIndex}
              >
                <div className="h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                  {/* Left side - Avatar and info */}
                  <div className="flex flex-col items-center text-center md:items-start md:text-left md:w-1/3">
                    <div className="relative mb-4">
                      <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-70 blur-sm"></div>
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/10">
                        <img
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-1">{testimonial.name}</h3>
                    <p className="text-sm text-slate-400 mb-2">
                      {testimonial.role} at {testimonial.company}
                    </p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-4 w-4",
                            i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-600",
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right side - Quote */}
                  <div className="relative md:w-2/3">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-purple-500/20" />
                    <blockquote className="text-lg md:text-xl text-slate-300 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-800/70 hover:bg-purple-600/70 text-white z-20 transition-all duration-200 backdrop-blur-sm"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-800/70 hover:bg-purple-600/70 text-white z-20 transition-all duration-200 backdrop-blur-sm"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2.5 h-2.5 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 w-8"
                    : "bg-slate-700 hover:bg-slate-600",
                )}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === activeIndex ? "true" : "false"}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
