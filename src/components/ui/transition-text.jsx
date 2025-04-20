"use client"

import { useState, useEffect } from "react"

export default function TransitionText({ children }) {
  const [isVisible, setIsVisible] = useState(true)
  const [content, setContent] = useState(children)

  useEffect(() => {
    if (children !== content) {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setContent(children)
        setIsVisible(true)
      }, 200) // Half of the transition duration
      return () => clearTimeout(timer)
    }
  }, [children, content])

  return (
    <span
      className="inline-block transition-opacity duration-400"
      style={{
        opacity: isVisible ? 1 : 0,
      }}
    >
      {content}
    </span>
  )
} 