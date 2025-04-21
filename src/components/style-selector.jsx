"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"

export default function StyleSelector({ selectedStyle, onSelectStyle }) {
  const [instagramMode, setInstagramMode] = useState('feed')

  const formats = [
    {
      id: "youtube",
      name: "YouTube",
      dimensions: "1280 × 720",
      aspectRatio: "16:9",
      image: "/images/youtube.png",
      description: "Perfect for video thumbnails, channel art, and engaging preview images. Optimized for desktop and mobile viewing.",
      color: "bg-gradient-to-br from-red-950/50 to-red-900/30",
      borderColor: "border-red-800/30",
      iconColor: "text-red-400",
      hoverBorder: "hover:border-red-700/50"
    },
    {
      id: "instagram",
      name: "Instagram",
      modes: {
        feed: {
          dimensions: "1080 × 1080",
          displaySize: "510 × 510",
          aspectRatio: "1:1",
          description: "Square format for feed preview"
        },
        post: {
          dimensions: "1080 × 1440",
          aspectRatio: "3:4",
          description: "Vertical format for optimal viewing"
        }
      },
      image: "/images/instagram.png",
      color: "bg-gradient-to-br from-purple-950/50 to-fuchsia-900/30",
      borderColor: "border-purple-800/30",
      iconColor: "text-purple-400",
      hoverBorder: "hover:border-purple-700/50"
    },
    {
      id: "tiktok",
      name: "TikTok",
      dimensions: "1080 × 1920",
      aspectRatio: "9:16",
      image: "/images/tiktok.png",
      description: "Vertical format for short-form content",
      color: "bg-gradient-to-br from-emerald-950/50 to-teal-900/30",
      borderColor: "border-emerald-800/30",
      iconColor: "text-emerald-400",
      hoverBorder: "hover:border-emerald-700/50"
    }
  ]

  const handleInstagramClick = (format) => {
    if (format.id === 'instagram') {
      onSelectStyle('instagram-' + instagramMode)
    } else {
      onSelectStyle(format.id)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {formats.map((format) => (
        <div
          key={format.id}
          className={cn(
            "relative border rounded-xl p-6 cursor-pointer transition-all duration-300 flex flex-col min-h-[420px] backdrop-blur-sm bg-black/20",
            format.color,
            format.borderColor,
            format.hoverBorder,
            (selectedStyle === format.id || 
             (format.id === 'instagram' && 
              (selectedStyle === 'instagram-feed' || selectedStyle === 'instagram-post'))) 
              ? "ring-1 ring-white/10" : "",
          )}
          onClick={() => handleInstagramClick(format)}
        >
          {/* Header Section */}
          <div className="relative mb-6">
            {/* Platform Icon */}
            <div className={cn("absolute -top-1 right-0 w-8 h-8 flex items-center justify-center bg-transparent")}>
              <img 
                src={format.image} 
                alt={`${format.name} logo`}
                className={cn(
                  "object-contain",
                  format.id === "tiktok" ? "w-6 h-6" : "w-5 h-5"
                )}
              />
            </div>
            
            {/* Title and Description */}
            <div>
              <h3 className="text-white font-medium text-lg mb-2">{format.name}</h3>
              <p className="text-zinc-400 text-sm h-12">
                {format.id === 'instagram' 
                  ? format.modes[instagramMode].description
                  : format.description
                }
              </p>
            </div>
          </div>

          {/* Format Controls */}
          {format.id === 'instagram' && (
            <div className="mb-6">
              <div className="inline-flex items-center bg-zinc-800/50 rounded-lg p-1">
                <button
                  className={cn(
                    "text-sm px-4 py-1.5 rounded-md transition-all duration-200",
                    instagramMode === 'feed' 
                      ? "bg-purple-500/20 text-purple-200 shadow-sm" 
                      : "text-zinc-400 hover:text-white"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    setInstagramMode('feed')
                    onSelectStyle('instagram-feed')
                  }}
                >
                  Feed
                </button>
                <button
                  className={cn(
                    "text-sm px-4 py-1.5 rounded-md transition-all duration-200 ml-1",
                    instagramMode === 'post' 
                      ? "bg-purple-500/20 text-purple-200 shadow-sm" 
                      : "text-zinc-400 hover:text-white"
                  )}
                  onClick={(e) => {
                    e.stopPropagation()
                    setInstagramMode('post')
                    onSelectStyle('instagram-post')
                  }}
                >
                  Post
                </button>
              </div>
            </div>
          )}

          {/* Preview Section */}
          <div className="flex-grow flex flex-col justify-end">
            {/* Aspect Ratio Visualization */}
            <div className="relative mb-4">
              <div 
                className={cn(
                  "w-full aspect-ratio-box transition-transform duration-300 transform hover:scale-105 backdrop-blur-sm bg-black/10",
                  format.id === "youtube" && "aspect-video",
                  format.id === "instagram" && instagramMode === "feed" && "aspect-square",
                  format.id === "instagram" && instagramMode === "post" && "aspect-[3/4]",
                  format.id === "tiktok" && "aspect-[9/16]",
                  format.color
                )}
              >
                {/* Dimension Lines */}
                <div className="absolute inset-0 border border-dashed border-white/10" />
              </div>
            </div>

            {/* Dimensions Text */}
            <div className="text-center">
              {format.id === 'instagram' ? (
                <>
                  <span className="text-sm font-mono text-zinc-400">
                    {format.modes[instagramMode].dimensions}
                  </span>
                  {format.modes[instagramMode].displaySize && (
                    <span className="text-xs text-zinc-500 block">
                      Display: {format.modes[instagramMode].displaySize}
                    </span>
                  )}
                  <span className="text-xs text-zinc-500 block">
                    {format.modes[instagramMode].aspectRatio}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-mono text-zinc-400">{format.dimensions}</span>
                  <span className="text-xs text-zinc-500 block">{format.aspectRatio}</span>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
