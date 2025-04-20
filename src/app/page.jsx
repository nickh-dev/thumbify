"use client"

import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { ArrowRight, Menu, X, Instagram, Twitter, Youtube, Linkedin } from "lucide-react"
import SignUpModal from "@/components/sign-up-modal"
import LoginModal from "@/components/login-modal"
import PricingCards from "@/components/pricing-cards"
import DemoSection from "@/components/demo-section"
import FaqSection from "@/components/faq-section"
import ScrollToTop from "@/components/scroll-to-top"
import ContactForm from "@/components/contact-form"
import LegalModal from "@/components/legal-modal"
import ThumbnailShowcase from "@/components/thumbnail-showcase"

export default function ThumbnailMagic() {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [legalModal, setLegalModal] = useState({ isOpen: false, title: "", content: null })

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  const handleSignUpClick = () => {
    setIsSignUpModalOpen(true)
  }

  const openLegalModal = (title, content) => {
    setLegalModal({
      isOpen: true,
      title,
      content,
    })
  }

  const closeLegalModal = () => {
    setLegalModal({
      ...legalModal,
      isOpen: false,
    })
  }

  // Legal content
  const termsContent = (
    <>
      <h2>Terms of Service</h2>
      <p>Last updated: April 18, 2025</p>
      <p>
        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the ThumbnailMagic
        website and service operated by ThumbnailMagic, Inc.
      </p>
      <h3>1. Agreement to Terms</h3>
      <p>
        By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the
        terms, then you may not access the Service.
      </p>
      <h3>2. Intellectual Property</h3>
      <p>
        The Service and its original content, features, and functionality are and will remain the exclusive property of
        ThumbnailMagic, Inc. and its licensors. The Service is protected by copyright, trademark, and other laws.
      </p>
      <h3>3. User Accounts</h3>
      <p>
        When you create an account with us, you must provide information that is accurate, complete, and current at all
        times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your
        account on our Service.
      </p>
      <h3>4. Content Usage</h3>
      <p>
        Our Service allows you to create and generate thumbnails. You retain all rights to your content. However, by
        using our Service, you grant us a license to use, modify, and display the content solely for the purpose of
        providing and improving the Service.
      </p>
    </>
  )

  const privacyContent = (
    <>
      <h2>Privacy Policy</h2>
      <p>Last updated: April 18, 2025</p>
      <p>
        ThumbnailMagic, Inc. ("us", "we", or "our") operates the ThumbnailMagic website and service. This page informs
        you of our policies regarding the collection, use, and disclosure of Personal Information when you use our
        Service.
      </p>
      <h3>1. Information Collection and Use</h3>
      <p>
        While using our Service, we may ask you to provide us with certain personally identifiable information that can
        be used to contact or identify you. This may include, but is not limited to, your email address, name, and
        payment information.
      </p>
      <h3>2. Log Data</h3>
      <p>
        We collect information that your browser sends whenever you visit our Service ("Log Data"). This Log Data may
        include information such as your computer's Internet Protocol ("IP") address, browser type, browser version, the
        pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other
        statistics.
      </p>
      <h3>3. Cookies</h3>
      <p>
        Cookies are files with a small amount of data, which may include an anonymous unique identifier. Cookies are
        sent to your browser from a web site and stored on your computer's hard drive. We use cookies to collect
        information and improve our Service.
      </p>
      <h3>4. Service Providers</h3>
      <p>
        We may employ third-party companies and individuals to facilitate our Service, to provide the Service on our
        behalf, to perform Service-related services, or to assist us in analyzing how our Service is used.
      </p>
    </>
  )

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      {/* Scroll to Top Button */}
      <ScrollToTop />

      {/* Elegant Navbar */}
      <nav className="flex items-center justify-between p-6 border-b border-zinc-800 bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <img
            src="./images/icon.png"
            alt="Thumbify Logo"
            className="h-10 w-10"
          />
          <span className="font-bold text-xl tracking-tight">Thumbify</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <button
            onClick={() => scrollToSection("demo")}
            className="text-zinc-300 hover:text-white transition-colors duration-200"
          >
            Demo
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="text-zinc-300 hover:text-white transition-colors duration-200"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="text-zinc-300 hover:text-white transition-colors duration-200"
          >
            FAQ
          </button>
        </div>

        {/* Login Button */}
        <div className="hidden md:block">
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="px-4 py-2 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors duration-200"
          >
            Sign In
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-zinc-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#0a0a0a] border-b border-zinc-800 py-4 px-6 space-y-4">
          <button
            onClick={() => scrollToSection("demo")}
            className="block w-full text-left py-2 text-zinc-300 hover:text-white transition-colors duration-200"
          >
            Demo
          </button>
          <button
            onClick={() => scrollToSection("pricing")}
            className="block w-full text-left py-2 text-zinc-300 hover:text-white transition-colors duration-200"
          >
            Pricing
          </button>
          <button
            onClick={() => scrollToSection("faq")}
            className="block w-full text-left py-2 text-zinc-300 hover:text-white transition-colors duration-200"
          >
            FAQ
          </button>
          <button
            onClick={() => setIsLoginModalOpen(true)}
            className="block w-full py-2 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors duration-200 text-center"
          >
            Sign In
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-3/5">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Create Stunning Thumbnails for Your Content
                </h1>
                <p className="text-xl text-zinc-400 mb-8">
                  Professional thumbnails that drive engagement across all your social platforms. Stand out from the
                  crowd and boost your click-through rates.
                </p>
                <div className="flex flex-wrap gap-6">
                  {/* Get Started Button */}
                  <button
                    onClick={handleSignUpClick}
                    className="px-8 py-3 bg-white text-black font-medium rounded-md hover:bg-zinc-200 transition-colors duration-200 flex items-center gap-2"
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Platform Logos */}
                <div className="mt-12">
                  <p className="text-sm text-zinc-500 mb-4">PERFECT FOR CREATORS ON</p>
                  <div className="flex items-center gap-8">
                    {/* YouTube Logo */}
                    <div className="grayscale hover:grayscale-0 transition-all duration-300">
                      <svg className="h-8" viewBox="0 0 90 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z"
                          fill="#FF0000"
                        />
                        <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white" />
                        <path
                          d="M34.6024 13.0036L31.3945 1.41846H34.1932L35.3174 6.6701C35.6043 7.96361 35.8136 9.06662 35.95 9.97913H36.0323C36.1264 9.32532 36.3381 8.22937 36.665 6.68892L37.8291 1.41846H40.6278L37.3799 13.0036V18.561H34.6001V13.0036H34.6024Z"
                          fill="white"
                        />
                        <path
                          d="M41.4697 18.1937C40.9053 17.8127 40.5031 17.22 40.2632 16.4157C40.0257 15.6114 39.9058 14.5437 39.9058 13.2078V11.3898C39.9058 10.0422 40.0422 8.95805 40.315 8.14196C40.5878 7.32588 41.0135 6.72851 41.592 6.35457C42.1706 5.98063 42.9302 5.79248 43.871 5.79248C44.7976 5.79248 45.5384 5.98298 46.0981 6.36398C46.6555 6.74497 47.0647 7.34234 47.3234 8.15137C47.5821 8.96275 47.7115 10.0422 47.7115 11.3898V13.2078C47.7115 14.5437 47.5845 15.6161 47.3329 16.4251C47.0812 17.2365 46.672 17.8292 46.1075 18.2031C45.5431 18.5771 44.7764 18.7652 43.8098 18.7652C42.8126 18.7675 42.0342 18.5747 41.4697 18.1937ZM44.6353 16.2323C44.7905 15.8231 44.8705 15.1575 44.8705 14.2309V10.3292C44.8705 9.43077 44.7929 8.77225 44.6353 8.35833C44.4777 7.94206 44.2026 7.7351 43.8074 7.7351C43.4265 7.7351 43.156 7.94206 43.0008 8.35833C42.8432 8.77461 42.7656 9.43077 42.7656 10.3292V14.2309C42.7656 15.1575 42.8408 15.8254 42.9914 16.2323C43.1419 16.6415 43.4123 16.8461 43.8074 16.8461C44.2026 16.8461 44.4777 16.6415 44.6353 16.2323Z"
                          fill="white"
                        />
                        <path
                          d="M56.8154 18.5634H54.6094L54.3648 17.03H54.3037C53.7039 18.1871 52.8055 18.7656 51.6061 18.7656C50.7759 18.7656 50.1621 18.4928 49.767 17.9496C49.3719 17.4039 49.1743 16.5526 49.1743 15.3955V6.03751H51.9942V15.2308C51.9942 15.7906 52.0553 16.188 52.1776 16.4256C52.2999 16.6631 52.5045 16.783 52.7914 16.783C53.036 16.783 53.2712 16.7078 53.497 16.5573C53.7228 16.4067 53.8874 16.2162 53.9979 15.9858V6.03516H56.8154V18.5634Z"
                          fill="white"
                        />
                        <path
                          d="M64.4755 3.68758H61.6768V18.5629H58.9181V3.68758H56.1194V1.42041H64.4755V3.68758Z"
                          fill="white"
                        />
                        <path
                          d="M71.2768 18.5634H69.0708L68.8262 17.03H68.7651C68.1654 18.1871 67.267 18.7656 66.0675 18.7656C65.2373 18.7656 64.6235 18.4928 64.2284 17.9496C63.8333 17.4039 63.6357 16.5526 63.6357 15.3955V6.03751H66.4556V15.2308C66.4556 15.7906 66.5167 16.188 66.639 16.4256C66.7613 16.6631 66.9659 16.783 67.2529 16.783C67.4974 16.783 67.7326 16.7078 67.9584 16.5573C68.1842 16.4067 68.3488 16.2162 68.4593 15.9858V6.03516H71.2768V18.5634Z"
                          fill="white"
                        />
                        <path
                          d="M80.609 8.0387C80.4373 7.24849 80.1621 6.67699 79.7812 6.32186C79.4002 5.96674 78.8757 5.79035 78.2078 5.79035C77.6904 5.79035 77.2059 5.93616 76.7567 6.23014C76.3075 6.52412 75.9594 6.90747 75.7148 7.38489H75.6937V0.785645H72.9773V18.5608H75.3056L75.5925 17.3755H75.6537C75.8724 17.7988 76.1993 18.1304 76.6344 18.3774C77.0695 18.622 77.554 18.7443 78.0855 18.7443C79.038 18.7443 79.7412 18.3045 80.1904 17.4272C80.6396 16.5476 80.8653 15.1765 80.8653 13.3092V11.3266C80.8653 9.92722 80.7783 8.82892 80.609 8.0387ZM78.0243 13.1492C78.0243 14.0617 77.9867 14.7767 77.9114 15.2941C77.8362 15.8115 77.7115 16.1808 77.5328 16.3971C77.3564 16.6158 77.1165 16.724 76.8178 16.724C76.585 16.724 76.371 16.6699 76.1734 16.5594C75.9759 16.4512 75.816 16.2866 75.6937 16.0702V8.96062C75.7877 8.6196 75.9524 8.34209 76.1852 8.12337C76.4157 7.90465 76.6697 7.79646 76.9401 7.79646C77.2271 7.79646 77.4481 7.90935 77.6034 8.13278C77.7609 8.35855 77.8691 8.73485 77.9303 9.26636C77.9914 9.79787 78.022 10.5528 78.022 11.5335V13.1492H78.0243Z"
                          fill="white"
                        />
                        <path
                          d="M84.8657 13.8712C84.8657 14.6755 84.8892 15.2776 84.9363 15.6798C84.9833 16.0819 85.0821 16.3736 85.2326 16.5594C85.3831 16.7428 85.6136 16.8345 85.9264 16.8345C86.3474 16.8345 86.639 16.6699 86.8022 16.343C86.9654 16.016 87.0821 15.4705 87.1528 14.7085L89.4044 14.8519C89.4747 14.9601 89.5094 15.1106 89.5094 15.3011C89.5094 16.4582 89.186 17.3237 88.5395 17.8952C87.8929 18.4667 86.9799 18.7536 85.8034 18.7536C84.4353 18.7536 83.4248 18.3185 82.7719 17.446C82.1189 16.5735 81.7913 15.2259 81.7913 13.4008V11.2136C81.7913 9.33452 82.1363 7.96105 82.8264 7.09558C83.5142 6.23011 84.5393 5.79736 85.9075 5.79736C86.7424 5.79736 87.4329 5.97375 87.9781 6.32888C88.5232 6.684 88.9257 7.23433 89.1841 7.98457C89.4425 8.7348 89.5712 9.76961 89.5712 11.0913V13.2362H84.8657V13.8712ZM85.2232 7.96811C85.0797 8.14449 84.9857 8.43377 84.9363 8.83593C84.8892 9.2381 84.8657 9.84722 84.8657 10.6657V11.5641H86.9283V10.6657C86.9283 9.86133 86.9001 9.25221 86.846 8.83593C86.7919 8.41966 86.6931 8.12803 86.5496 7.95635C86.4062 7.78702 86.1851 7.7 85.8864 7.7C85.5854 7.70235 85.3643 7.79172 85.2232 7.96811Z"
                          fill="white"
                        />
                      </svg>
                    </div>

                    {/* Instagram Logo */}
                    <div className="grayscale hover:grayscale-0 transition-all duration-300">
                      <svg className="h-7" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </div>

                    {/* TikTok Logo */}
                    <div className="grayscale hover:grayscale-0 transition-all duration-300">
                      <svg className="h-7" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-2/5 mt-8 md:mt-0">
                <ThumbnailShowcase />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#121212]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose ThumbnailMagic</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Our platform offers everything you need to create professional thumbnails that drive engagement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-zinc-800 rounded-lg">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-zinc-400">Generate professional thumbnails in seconds, not hours.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 border border-zinc-800 rounded-lg">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customizable</h3>
              <p className="text-zinc-400">Tailor thumbnails to match your brand and style.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 border border-zinc-800 rounded-lg">
              <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">One-Click Magic</h3>
              <p className="text-zinc-400">
                Transform ordinary images into eye-catching thumbnails with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-[#0a0a0a]">
        <DemoSection onSignUpClick={handleSignUpClick} />
      </section>

      {/* Pricing Cards */}
      <section id="pricing" className="py-20 bg-[#121212]">
        <PricingCards />
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#0a0a0a]">
        <FaqSection />
      </section>

      {/* Redesigned Footer */}
      <footer className="py-16 bg-[#0a0a0a] border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Company Info */}
            <div>
              <div className="mb-5">
                <span className="font-bold text-xl tracking-tight">ThumbnailMagic</span>
              </div>
              <p className="text-zinc-400 text-sm mb-6">
                Create stunning thumbnails for your content with our AI-powered platform.
              </p>
              <div className="flex items-center gap-4">
                <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">YouTube</span>
                </a>
                <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-200">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </a>
              </div>
              <p className="text-zinc-500 text-sm mt-6">© 2025 ThumbnailMagic. All rights reserved.</p>
            </div>

            {/* Legal Section */}
            <div>
              <h3 className="text-lg font-medium mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => openLegalModal("Terms of Service", termsContent)}
                    className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openLegalModal("Privacy Policy", privacyContent)}
                    className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm">
                    Cookies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-zinc-400 hover:text-white transition-colors duration-200 text-sm">
                    Legal
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us */}
            <div>
              <ContactForm />
            </div>
          </div>
        </div>
      </footer>

      {/* Sign Up Modal */}
      <SignUpModal isOpen={isSignUpModalOpen} onClose={() => setIsSignUpModalOpen(false)} />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Legal Modal */}
      <LegalModal
        isOpen={legalModal.isOpen}
        onClose={closeLegalModal}
        title={legalModal.title}
        content={legalModal.content}
      />
    </div>
  )
}
