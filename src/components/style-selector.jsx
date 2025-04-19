"use client"

import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

export default function StyleSelector({ selectedStyle, onSelectStyle }) {
  const [styleImages, setStyleImages] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Sample style options with fallback images
  const styles = [
    {
      id: "minimal",
      name: "Minimal",
      description: "Clean, simple design with ample white space",
      query: "minimal design",
      fallback: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=300&fit=crop"
    },
    {
      id: "neon",
      name: "Neon Cyberpunk",
      description: "Vibrant neon colors with futuristic elements",
      query: "neon cyberpunk",
      fallback: "https://images.unsplash.com/photo-1515630278258-407f66498911?w=400&h=300&fit=crop"
    },
    {
      id: "cinematic",
      name: "Cinematic",
      description: "Movie-like quality with dramatic lighting",
      query: "cinematic lighting",
      fallback: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop"
    },
    {
      id: "retro",
      name: "Retro",
      description: "Vintage aesthetic with nostalgic elements",
      query: "vintage retro",
      fallback: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=400&h=300&fit=crop"
    },
    {
      id: "abstract",
      name: "Abstract",
      description: "Non-representational designs with shapes and colors",
      query: "abstract art",
      fallback: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=400&h=300&fit=crop"
    },
    {
      id: "3d",
      name: "3D Rendered",
      description: "Three-dimensional objects with realistic textures",
      query: "3d render",
      fallback: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop"
    },
  ]

  useEffect(() => {
    const fetchStyleImages = async () => {
      setIsLoading(true)
      const newStyleImages = {}
      
      for (const style of styles) {
        try {
          // Use the Unsplash Source API which doesn't require authentication
          const imageUrl = `https://source.unsplash.com/featured/400x300?${encodeURIComponent(style.query)}`
          newStyleImages[style.id] = imageUrl
        } catch (error) {
          console.error(`Error fetching image for ${style.id}:`, error)
          newStyleImages[style.id] = style.fallback
        }
      }
      
      setStyleImages(newStyleImages)
      setIsLoading(false)
    }

    fetchStyleImages()
  }, [])

  return (
    <div className="grid grid-cols-2 gap-3">
      {styles.map((style) => (
        <div
          key={style.id}
          className={cn(
            "border rounded-md p-3 cursor-pointer transition-all duration-200",
            selectedStyle === style.id ? "border-white bg-zinc-800" : "border-zinc-700 hover:border-zinc-500",
          )}
          onClick={() => onSelectStyle(style.id)}
        >
          <div className="flex items-start gap-3">
            <div className="w-[100px] h-[60px] rounded overflow-hidden shrink-0 bg-zinc-800">
              {isLoading ? (
                <div className="w-full h-full animate-pulse bg-zinc-700" />
              ) : (
                <img 
                  src={styleImages[style.id] || style.fallback} 
                  alt={style.name} 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">{style.name}</h3>
              <p className="text-zinc-400 text-xs mt-1">{style.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
