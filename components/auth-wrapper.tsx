'use client'

import { useEffect, ReactNode, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/use-auth'
import { Loader2 } from 'lucide-react'

interface AuthWrapperProps {
  children: ReactNode
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Small delay to ensure localStorage is read correctly
    const timer = setTimeout(() => {
      setIsChecking(false)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isLoading || isChecking) return

    // Redirect to signin if not authenticated and trying to access dashboard
    if (!user && pathname.startsWith('/dashboard')) {
      router.push('/auth/signin')
    } else if (user && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
      // Redirect to dashboard if authenticated and on auth pages
      router.push('/dashboard')
    }
  }, [user, isLoading, isChecking, pathname, router])

  // Show loading state while checking auth
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
