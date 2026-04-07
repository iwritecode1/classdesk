'use client'

import { useEffect, useState } from 'react'

export interface User {
  email: string
  name: string
  institute: string
  phone?: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const userJson = localStorage.getItem('user')
    if (userJson) {
      try {
        setUser(JSON.parse(userJson))
      } catch (error) {
        console.error('Failed to parse user data')
      }
    }
    setIsLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return { user, isLoading, logout }
}
