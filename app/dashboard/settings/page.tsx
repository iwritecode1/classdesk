'use client'

import { useState } from 'react'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Building2,
  User,
  Bell,
  CreditCard,
  Shield,
  Save,
  Plus,
  Trash2,
} from 'lucide-react'
import { mockInstitute } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  
  // Institute settings
  const [instituteName, setInstituteName] = useState(mockInstitute.name)
  const [phone, setPhone] = useState(mockInstitute.contact.phone)
  const [email, setEmail] = useState(mockInstitute.contact.email)
  const [address, setAddress] = useState(mockInstitute.contact.address.line1)
  const [city, setCity] = useState(mockInstitute.contact.address.city)
  const [state, setState] = useState(mockInstitute.contact.address.state)
  const [pincode, setPincode] = useState(mockInstitute.contact.address.pincode)

  // Payment settings
  const [upiId, setUpiId] = useState(mockInstitute.paymentConfig.upi)
  
  // Notification settings
  const [whatsappEnabled, setWhatsappEnabled] = useState(mockInstitute.communicationConfig.whatsapp)
  const [emailReminders, setEmailReminders] = useState(true)
  const [autoReminders, setAutoReminders] = useState(true)
  const [reminderDays, setReminderDays] = useState('3')

  // Batches
  const [batches, setBatches] = useState(mockInstitute.academics.batches)

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Settings saved successfully')
    setSaving(false)
  }

  const addBatch = () => {
    setBatches([
      ...batches,
      { _id: `batch_${Date.now()}`, name: '', subject: '', timing: '' },
    ])
  }

  const removeBatch = (id: string) => {
    setBatches(batches.filter(b => b._id !== id))
  }

  const updateBatch = (id: string, field: string, value: string) => {
    setBatches(batches.map(b => 
      b._id === id ? { ...b, [field]: value } : b
    ))
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Settings" 
        description="Manage your institute settings" 
      />

      <div className="p-4 md:p-6">
        <Tabs defaultValue="institute" className="max-w-3xl mx-auto space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="institute" className="gap-2">
              <Building2 className="h-4 w-4 hidden sm:block" />
              Institute
            </TabsTrigger>
            <TabsTrigger value="batches" className="gap-2">
              <User className="h-4 w-4 hidden sm:block" />
              Batches
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="h-4 w-4 hidden sm:block" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4 hidden sm:block" />
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Institute Tab */}
          <TabsContent value="institute" className="space-y-6">
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-5 w-5 text-primary" />
                  Institute Information
                </CardTitle>
                <CardDescription>
                  Basic details about your coaching institute
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instituteName">Institute Name</Label>
                  <Input
                    id="instituteName"
                    value={instituteName}
                    onChange={(e) => setInstituteName(e.target.value)}
                    placeholder="Enter institute name"
                  />
                </div>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="institute@email.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="Karnataka">Karnataka</SelectItem>
                        <SelectItem value="Delhi">Delhi</SelectItem>
                        <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="gradient-bg border-0" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </TabsContent>

          {/* Batches Tab */}
          <TabsContent value="batches" className="space-y-6">
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="h-5 w-5 text-primary" />
                      Batches & Classes
                    </CardTitle>
                    <CardDescription>
                      Manage your batch schedules and timings
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={addBatch}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Batch
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {batches.map((batch, index) => (
                  <div 
                    key={batch._id} 
                    className="grid gap-4 sm:grid-cols-4 items-end p-4 rounded-xl bg-secondary/30"
                  >
                    <div className="space-y-2">
                      <Label>Batch Name</Label>
                      <Input
                        value={batch.name}
                        onChange={(e) => updateBatch(batch._id, 'name', e.target.value)}
                        placeholder="JEE 2026 Morning"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subject/Course</Label>
                      <Input
                        value={batch.subject}
                        onChange={(e) => updateBatch(batch._id, 'subject', e.target.value)}
                        placeholder="JEE Main"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Timing</Label>
                      <Input
                        value={batch.timing}
                        onChange={(e) => updateBatch(batch._id, 'timing', e.target.value)}
                        placeholder="6:00 AM - 9:00 AM"
                      />
                    </div>
                    <div>
                      {batches.length > 1 && (
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeBatch(batch._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="gradient-bg border-0" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Payment Configuration
                </CardTitle>
                <CardDescription>
                  Configure UPI and payment gateway settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourbusiness@upi"
                  />
                  <p className="text-xs text-muted-foreground">
                    This UPI ID will be shared with parents for fee payments
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/30 border border-dashed border-border">
                  <div className="flex items-center gap-3">
                    <Shield className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-medium">Payment Gateway Integration</p>
                      <p className="text-sm text-muted-foreground">
                        Connect Razorpay, Paytm, or other payment gateways for online payments.
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">
                    Connect Payment Gateway
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="gradient-bg border-0" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="rounded-2xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Bell className="h-5 w-5 text-primary" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Configure how and when reminders are sent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>WhatsApp Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send payment reminders via WhatsApp
                    </p>
                  </div>
                  <Switch
                    checked={whatsappEnabled}
                    onCheckedChange={setWhatsappEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send payment reminders via Email
                    </p>
                  </div>
                  <Switch
                    checked={emailReminders}
                    onCheckedChange={setEmailReminders}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automatic Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically send reminders before due dates
                    </p>
                  </div>
                  <Switch
                    checked={autoReminders}
                    onCheckedChange={setAutoReminders}
                  />
                </div>

                {autoReminders && (
                  <div className="space-y-2">
                    <Label>Send reminders before due date</Label>
                    <Select value={reminderDays} onValueChange={setReminderDays}>
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 day before</SelectItem>
                        <SelectItem value="3">3 days before</SelectItem>
                        <SelectItem value="5">5 days before</SelectItem>
                        <SelectItem value="7">7 days before</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button className="gradient-bg border-0" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
