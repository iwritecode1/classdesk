'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { GraduationCap, Loader2, ArrowRight } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    instituteName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validation
      if (!formData.instituteName || !formData.firstName || !formData.email || !formData.password) {
        toast.error('Please fill in all required fields')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        return
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }

      if (!formData.agreeTerms) {
        toast.error('Please agree to the terms and conditions')
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Store user session
      localStorage.setItem('user', JSON.stringify({ 
        email: formData.email, 
        name: formData.firstName,
        institute: formData.instituteName,
        phone: formData.phone
      }))

      toast.success('Account created successfully')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Failed to create account. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 justify-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-bg">
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold gradient-text">ClassDesk</span>
        </Link>

        {/* Card */}
        <Card className="border-border/50 shadow-xl">
          <CardHeader className="space-y-2 pb-6">
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>
              Join 500+ coaching institutes using ClassDesk
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Institute Name */}
              <div className="space-y-2">
                <Label htmlFor="instituteName">Institute Name *</Label>
                <Input
                  id="instituteName"
                  name="instituteName"
                  placeholder="Your coaching institute name"
                  value={formData.instituteName}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-secondary/50 border-border"
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-secondary/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="bg-secondary/50 border-border"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@institute.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-secondary/50 border-border"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-secondary/50 border-border"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-secondary/50 border-border"
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="bg-secondary/50 border-border"
                />
              </div>

              {/* Terms */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, agreeTerms: checked as boolean }))
                  }
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to the Terms of Service and Privacy Policy
                </label>
              </div>

              {/* Sign Up Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-bg border-0 h-10 text-base mt-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/auth/signin" className="font-medium text-primary hover:underline">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
