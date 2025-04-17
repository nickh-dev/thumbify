"use client"

import { useState } from "react"
import { X, Search, Calendar, Filter, Download, Trash2, ExternalLink, Clock, ImageIcon } from "lucide-react"

export default function HistoryModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  // Sample history data
  const historyItems = [
    {
      id: "hist-1",
      title: "Gaming Stream Thumbnail",
      date: "Today, 2:30 PM",
      thumbnail: "/placeholder.svg?height=120&width=200",
      prompt: "Cyberpunk gaming setup with neon lights and futuristic UI",
      style: "Neon Cyberpunk",
    },
    {
      id: "hist-2",
      title: "Product Review Video",
      date: "Yesterday, 10:15 AM",
      thumbnail: "/placeholder.svg?height=120&width=200",
      prompt: "Minimalist product showcase with soft shadows and clean background",
      style: "Minimal Clean",
    },
    {
      id: "hist-3",
      title: "Travel Vlog Episode",
      date: "Apr 12, 2025",
      thumbnail: "/placeholder.svg?height=120&width=200",
      prompt: "Cinematic landscape view of mountains with warm sunset colors",
      style: "Cinematic Landscape",
    },
    {
      id: "hist-4",
      title: "Cooking Tutorial",
      date: "Apr 10, 2025",
      thumbnail: "/placeholder.svg?height=120&width=200",
      prompt: "Overhead view of colorful ingredients with soft lighting",
      style: "Food Photography",
    },
    {
      id: "hist-5",
      title: "Tech News Update",
      date: "Apr 5, 2025",
      thumbnail: "/placeholder.svg?height=120&width=200",
      prompt: "Futuristic tech collage with abstract digital elements",
      style: "Tech Abstract",
    },
  ]

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.style.toLowerCase().includes(searchQuery.toLowerCase())

    if (selectedFilter === "all") return matchesSearch
    return matchesSearch && item.style.toLowerCase().includes(selectedFilter.toLowerCase())
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-4xl h-[80vh] overflow-hidden rounded-2xl">
        {/* Background effects */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pink-600/20 rounded-full blur-3xl"></div>

        {/* Modal content */}
        <div className="relative bg-slate-900/90 backdrop-blur-md border border-slate-800/50 rounded-2xl shadow-2xl h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-800/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-400" />
                Your Generation History
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full bg-slate-800/50 hover:bg-slate-700/70 text-slate-400 hover:text-white transition-colors duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search and filters */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search your history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700/50 focus:border-purple-500/50 rounded-lg pl-9 pr-4 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:ring-0"
                />
              </div>

              <div className="flex gap-2">
                <div className="relative">
                  <button className="flex items-center gap-1.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 rounded-lg px-3 py-2 text-slate-300 text-sm">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span>Date</span>
                  </button>
                </div>

                <div className="relative">
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="appearance-none flex items-center gap-1.5 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/50 rounded-lg px-8 py-2 text-slate-300 text-sm focus:outline-none focus:ring-0 focus:border-purple-500/50"
                  >
                    <option value="all">All Styles</option>
                    <option value="cyberpunk">Cyberpunk</option>
                    <option value="minimal">Minimal</option>
                    <option value="cinematic">Cinematic</option>
                    <option value="food">Food</option>
                    <option value="tech">Tech</option>
                  </select>
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* History list */}
          <div className="flex-grow overflow-y-auto p-6 space-y-4">
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ImageIcon className="h-12 w-12 text-slate-700 mb-3" />
                <h3 className="text-lg font-medium text-slate-300 mb-1">No results found</h3>
                <p className="text-slate-500 max-w-md">
                  We couldn't find any thumbnails matching your search. Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 rounded-xl p-4 transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail */}
                    <div className="relative w-full sm:w-40 h-24 overflow-hidden rounded-lg">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-lg font-medium text-white">{item.title}</h3>
                        <span className="text-xs text-slate-400 bg-slate-800/70 px-2 py-1 rounded-full">
                          {item.date}
                        </span>
                      </div>

                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">{item.prompt}</p>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-medium text-purple-400 bg-purple-500/10 px-2 py-1 rounded-full">
                          {item.style}
                        </span>

                        <div className="flex items-center gap-2">
                          <button className="p-1.5 rounded-full bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors duration-200">
                            <Download className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-full bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors duration-200">
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button className="p-1.5 rounded-full bg-slate-800/70 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors duration-200">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800/50 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              Showing {filteredItems.length} of {historyItems.length} items
            </span>
            <button className="text-sm text-purple-400 hover:text-purple-300 font-medium">View all history</button>
          </div>
        </div>
      </div>
    </div>
  )
}
