"use client"

import { createContext, useContext, useState } from 'react'
import { translations } from './translations'

const LanguageContext = createContext({})

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("english")

  const t = (path) => {
    const keys = path.split('.')
    let value = translations[language]
    
    for (const key of keys) {
      if (!value || !value[key]) {
        // Fallback to English if translation is missing
        value = translations.english
        for (const fallbackKey of keys) {
          value = value?.[fallbackKey]
        }
        break
      }
      value = value[key]
    }
    
    return value || path
  }

  const value = {
    language,
    setLanguage,
    t
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => {
  return useContext(LanguageContext)
} 