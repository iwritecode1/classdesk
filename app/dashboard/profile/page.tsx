'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useAuth } from '@/lib/use-auth'
import { ChevronLeft, Save, Loader2 } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    institute: user?.institute || '',
    phone: user?.phone || '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update user data in localStorage
      localStorage.setItem('user', JSON.stringify({
        ...user,
        ...formData
      }))
      
      toast.success('Profile updated successfully')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const getUserInitials = (name?: string) => {
    if (!name) return 'U'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Profile" 
        description="Manage your account information" 
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Back Link */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Profile Card */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>
              Update your profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="gradient-bg text-primary-foreground text-xl font-bold">
                  {getUserInitials(formData.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm">
                  Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-secondary/50 border-border"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-secondary/50 border-border"
                />
              </div>

              {/* Institute */}
              <div className="space-y-2">
                <Label htmlFor="institute">Institute Name</Label>
                <Input
                  id="institute"
                  name="institute"
                  placeholder="Your coaching institute"
                  value={formData.institute}
                  onChange={handleInputChange}
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
                  className="bg-secondary/50 border-border"
                />
              </div>

              {/* Save Button */}
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="w-full gradient-bg border-0 mt-6"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Card */}
        <Card className="rounded-2xl border-border/50">
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>
              Manage your password and security settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
