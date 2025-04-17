"use client"

import { useState } from "react"
import { ArrowRight, Upload, Wand2 } from "lucide-react"

export default function DemoSection({ onSignUpClick }) {
  const [activeTab, setActiveTab] = useState("before")
  const [isHovering, setIsHovering] = useState(false)

  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">See It In Action</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Watch how ThumbnailMagic transforms ordinary images into eye-catching thumbnails
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-zinc-800">
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                >
                  {/* Before/After Tabs */}
                  <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-sm rounded-lg p-1 flex">
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "before" ? "bg-white text-black" : "text-zinc-400"}`}
                      onClick={() => setActiveTab("before")}
                    >
                      Before
                    </button>
                    <button
                      className={`px-4 py-2 text-sm font-medium rounded-md ${activeTab === "after" ? "bg-white text-black" : "text-zinc-400"}`}
                      onClick={() => setActiveTab("after")}
                    >
                      After
                    </button>
                  </div>

                  {/* Before Image */}
                  <img
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop"
                    alt="Before thumbnail"
                    className={`w-full h-full object-cover transition-opacity duration-500 ${activeTab === "before" ? "opacity-100" : "opacity-0"}`}
                  />

                  {/* After Image */}
                  <img
                    src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop"
                    alt="After thumbnail"
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeTab === "after" ? "opacity-100" : "opacity-0"}`}
                  />

                  {/* Hover Overlay */}
                  <div
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"}`}
                  >
                    <button className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors duration-200">
                      View Full Size
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4">Transform Your Content</h3>
              <p className="text-zinc-400 mb-6">
                Our advanced technology analyzes your content and creates thumbnails that are proven to increase
                click-through rates by up to 40%. Simply upload your image, describe your vision, and let our system do
                the rest.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Upload Your Image</h4>
                    <p className="text-zinc-500 text-sm">Start with any image or screenshot from your content</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Wand2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Describe Your Vision</h4>
                    <p className="text-zinc-500 text-sm">Tell us what style and elements you want in your thumbnail</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center shrink-0 mt-1">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Get Results Instantly</h4>
                    <p className="text-zinc-500 text-sm">Receive your professionally designed thumbnail in seconds</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onSignUpClick}
                className="mt-8 px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors duration-200 flex items-center gap-2"
              >
                Try It Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
