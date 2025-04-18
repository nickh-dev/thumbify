"use client"

import { useState, useRef } from "react"
import { Upload, Trash2, Wand2, AlertCircle, Check, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import StyleSelector from "./style-selector"
import DeleteConfirmDialog from "./delete-confirm-dialog"

export default function ThumbnailGenerator() {
  const [uploadedImages, setUploadedImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [trigger, setTrigger] = useState("")
  const [selectedStyle, setSelectedStyle] = useState(null)

  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    setError(null)
    setIsUploading(true)

    const newImages = []
    let loadedCount = 0

    files.forEach(file => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please upload only image files")
        setIsUploading(false)
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Each image must be less than 5MB")
        setIsUploading(false)
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        newImages.push({
          file,
          preview: event.target.result,
          name: file.name
        })
        
        loadedCount++
        if (loadedCount === files.length) {
          setUploadedImages(prev => [...prev, ...newImages])
          setIsUploading(false)
        }
      }

      reader.onerror = () => {
        setError("Failed to read image file")
        setIsUploading(false)
      }

      reader.readAsDataURL(file)
    })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files?.length > 0) {
      const fileList = new DataTransfer()
      Array.from(e.dataTransfer.files).forEach(file => {
        if (file.type.startsWith("image/")) {
          fileList.items.add(file)
        }
      })
      
      if (fileList.files.length > 0 && fileInputRef.current) {
        fileInputRef.current.files = fileList.files
        handleFileChange({ target: { files: fileList.files } })
      } else {
        setError("Please drop image files only")
      }
    }
  }

  const handleDeleteImage = (index) => {
    setSelectedImageIndex(index)
    setShowDeleteConfirm(true)
  }

  const confirmDeleteImage = () => {
    if (selectedImageIndex !== null) {
      setUploadedImages(prev => prev.filter((_, i) => i !== selectedImageIndex))
    }
    setShowDeleteConfirm(false)
    setSelectedImageIndex(null)
  }

  const handleGenerateThumbnail = async () => {
    if (uploadedImages.length === 0) {
      setError("Please upload at least one image")
      return
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt for thumbnail generation")
      return
    }

    if (!selectedStyle) {
      setError("Please select a style for your thumbnail")
      return
    }

    setError(null)
    setSuccess(null)
    setIsGenerating(true)

    try {
      // Simulate API call for thumbnail generation
      await new Promise((resolve) => setTimeout(resolve, 2500))
      setSuccess("Thumbnails generated successfully!")
    } catch (err) {
      setError("Failed to generate thumbnails. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="flex flex-col">
      <div className="max-w-5xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-white mb-8">Create New Thumbnails</h1>

        {/* Error and Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-800 rounded-lg flex items-start gap-3">
            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <p className="text-green-200">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Image Upload */}
          <div className="space-y-6">
            <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Upload Images</h2>

              {/* Image Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200",
                  uploadedImages.length > 0 ? "border-zinc-700 bg-zinc-800/30" : "border-zinc-700 hover:border-zinc-500",
                )}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  multiple
                />
                
                {/* Uploaded Images Grid */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md flex items-center justify-center">
                          <button
                            onClick={() => handleDeleteImage(index)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 rounded-full transition-colors duration-200"
                            title="Delete image"
                          >
                            <Trash2 className="h-4 w-4 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add More Button */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-32 border-2 border-dashed border-zinc-700 hover:border-zinc-500 rounded-md flex flex-col items-center justify-center text-zinc-400 hover:text-white transition-colors duration-200"
                    >
                      <Plus className="h-8 w-8 mb-2" />
                      <span className="text-sm">Add More</span>
                    </button>
                  </div>
                )}

                {/* Empty State Upload UI */}
                {uploadedImages.length === 0 && (
                  <div className="py-8">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                        <Upload className="h-8 w-8 text-zinc-400" />
                      </div>
                      <p className="text-zinc-300 mb-2">Drag and drop your images here</p>
                      <p className="text-zinc-500 text-sm mb-4">or</p>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition-colors duration-200"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <span className="flex items-center">
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Uploading...
                          </span>
                        ) : (
                          "Browse Files"
                        )}
                      </button>
                      <p className="text-zinc-500 text-xs mt-4">Supported formats: JPG, PNG, GIF (Max size: 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Trigger Input */}
            <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
              <div className="mb-4">
                <label htmlFor="trigger" className="block text-white font-medium mb-2">
                  Trigger Keyword
                </label>
                <input
                  type="text"
                  id="trigger"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder="Enter a keyword to associate with these thumbnails"
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-zinc-500 rounded-md px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none"
                />
                <p className="text-zinc-500 text-xs mt-2">
                  This keyword will help you find and organize your thumbnails
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Prompt and Style */}
          <div className="space-y-6">
            {/* Prompt Input */}
            <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
              <div className="mb-4">
                <label htmlFor="prompt" className="block text-white font-medium mb-2">
                  Prompt
                </label>
                <textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe how you want your thumbnails to look..."
                  rows={5}
                  className="w-full bg-zinc-900 border border-zinc-700 focus:border-zinc-500 rounded-md px-4 py-2.5 text-white placeholder:text-zinc-500 focus:outline-none resize-none"
                />
                <p className="text-zinc-500 text-xs mt-2">
                  Be specific about colors, mood, composition, and elements you want to include
                </p>
              </div>
            </div>

            {/* Style Selection */}
            <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Choose a Style</h2>
              <StyleSelector selectedStyle={selectedStyle} onSelectStyle={setSelectedStyle} />
            </div>

            {/* Generate Button */}
            <div className="bg-[#1a1a1a] border border-zinc-800 rounded-lg p-6">
              <button
                onClick={handleGenerateThumbnail}
                disabled={isGenerating || uploadedImages.length === 0}
                className={cn(
                  "w-full py-3 rounded-md font-medium text-center transition-all duration-300 flex items-center justify-center gap-2",
                  isGenerating || uploadedImages.length === 0
                    ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                    : "bg-white text-black hover:bg-zinc-200",
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    Generate Thumbnails
                  </>
                )}
              </button>

              {uploadedImages.length === 0 && (
                <p className="text-zinc-500 text-xs text-center mt-2">Please upload at least one image</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setSelectedImageIndex(null)
        }}
        onConfirm={confirmDeleteImage}
      />
    </div>
  )
}
