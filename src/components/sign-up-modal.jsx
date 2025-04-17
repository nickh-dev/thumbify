"use client"

import { useState } from "react"
import { X, CheckCircle2, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"

export default function SignUpModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formStep, setFormStep] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
  
    const { email, password } = formData
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  
    if (error) {
      console.error(error)
      alert("Ошибка: " + error.message)
    } else {
      setFormStep(1)
    }
  
    setIsLoading(false)
  }

  const handleGoogleSignUp = async () => {
    setIsLoading(true)
  
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  
    if (error) {
      console.error(error)
      alert("Ошибка при входе через Google")
      setIsLoading(false)
    }
  }
  

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative w-full max-w-md">
        {/* Modal content */}
        <div className="relative bg-[#121212] rounded-lg shadow-2xl overflow-hidden">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-zinc-400 hover:text-white transition-colors duration-200 z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Form content */}
          <div className="p-8">
            {formStep === 0 ? (
              <>
                <div className="flex items-center justify-center mb-6">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xl tracking-tight">ThumbnailMagic</span>
                  </div>
                </div>

                {/* Google sign up button */}
                <button
                  onClick={handleGoogleSignUp}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-[#1a1a1a] hover:bg-[#222222] border border-zinc-800 rounded-md text-white font-medium transition-all duration-200 mb-6"
                >
                  {/* Google logo */}
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign up with Google
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative bg-[#121212] px-4 text-sm text-zinc-500">or</div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email input */}
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-medium text-zinc-300">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1a1a1a] border border-zinc-800 focus:border-zinc-600 rounded-md px-3 py-2.5 text-white focus:outline-none"
                    />
                  </div>

                  {/* Password input */}
                  <div className="space-y-1.5">
                    <label htmlFor="password" className="text-sm font-medium text-zinc-300">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full bg-[#1a1a1a] border border-zinc-800 focus:border-zinc-600 rounded-md px-3 py-2.5 text-white focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-zinc-500">Must be at least 8 characters</p>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "w-full py-2.5 rounded-md font-medium text-center transition-all duration-300 mt-2",
                      isLoading
                        ? "bg-zinc-700 text-zinc-400 cursor-not-allowed"
                        : "bg-white text-black hover:bg-zinc-200",
                    )}
                  >
                    {isLoading ? "Creating account..." : "Sign up with email"}
                  </button>
                </form>

                {/* Terms */}
                <p className="text-xs text-zinc-500 text-center mt-6">
                  By signing up, you agree to our{" "}
                  <a href="#" className="text-zinc-400 hover:text-white underline">
                    Terms of Service
                  </a>
                </p>

                {/* Login link */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-zinc-400">
                    Already have an account?{" "}
                    <a href="#" className="text-white hover:underline font-medium">
                      Login
                    </a>
                  </p>
                </div>
              </>
            ) : (
              // Success state
              <div className="py-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-6">
                  <CheckCircle2 className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                <p className="text-zinc-400 mb-6">Your account has been successfully created.</p>
                <button
                  onClick={onClose}
                  className="bg-white text-black font-medium py-2.5 px-6 rounded-md hover:bg-zinc-200 transition-all duration-300"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
