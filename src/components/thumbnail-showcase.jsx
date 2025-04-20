"use client"

import { Card } from "@/components/ui/card"

export default function ThumbnailShowcase() {
  return (
    <div className="relative w-full h-full">
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
      
      {/* Thumbnails stack */}
      <div className="relative grid grid-cols-2 gap-4">
        {/* Main large thumbnail */}
        <div className="col-span-2">
          <div className="relative">
            <div className="absolute inset-0 border border-zinc-800 rounded-lg transform rotate-2"></div>
            <div className="absolute inset-0 border border-zinc-800 rounded-lg transform -rotate-2"></div>
            <Card className="relative z-10 overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
              <img
                src="/images/thumb1.png"
                alt="Gaming Stream Thumbnail"
                className="w-full aspect-video object-cover"
              />
            </Card>
          </div>
        </div>

        {/* Smaller thumbnails */}
        <div className="relative">
          <div className="absolute inset-0 border border-zinc-800 rounded-lg transform rotate-2"></div>
          <div className="absolute inset-0 border border-zinc-800 rounded-lg transform -rotate-2"></div>
          <Card className="relative z-10 overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <img
              src="/images/thumb2.png"
              alt="Product Review Thumbnail"
              className="w-full aspect-video object-cover"
            />
          </Card>
        </div>

        <div className="relative">
          <div className="absolute inset-0 border border-zinc-800 rounded-lg transform rotate-2"></div>
          <div className="absolute inset-0 border border-zinc-800 rounded-lg transform -rotate-2"></div>
          <Card className="relative z-10 overflow-hidden border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
            <img
              src="/images/thumb3.png"
              alt="Travel Vlog Thumbnail"
              className="w-full aspect-video object-cover"
            />
          </Card>
        </div>
      </div>
    </div>
  )
} 