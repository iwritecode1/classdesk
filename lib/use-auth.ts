'use client'

import { useEffect, useState, useCallback } from 'react'

export interface User {
  email: string
  name: string
  institute: string
  phone?: string
}

const loadUserFromStorage = (): User | null => {
  if (typeof window === 'undefined') return null
  const userJson = localStorage.getItem('user')
  if (userJson) {
    try {
      return JSON.parse(userJson)
    } catch (error) {
      console.error('Failed to parse user data')
      return null
    }
  }
  return null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => loadUserFromStorage())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Set loading to false after initial render
    setIsLoading(false)

    // Listen for storage changes (user logged in from another tab)
    const handleStorageChange = () => {
      const updatedUser = loadUserFromStorage()
      setUser(updatedUser)
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('user')
    setUser(null)
  }, [])

  return { user, isLoading, logout }
}
