'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, Plus, Trash2, User, MapPin, GraduationCap, Users } from 'lucide-react'
import { createStudent } from '@/lib/api'
import { mockInstitute } from '@/lib/mock-data'
import { toast } from 'sonner'
import type { Student, Parent } from '@/lib/types'

interface FormData {
  firstName: string
  lastName: string
  phone: string
  email: string
  addressLine1: string
  city: string
  state: string
  pincode: string
  schoolName: string
  class: string
  subjectsOpted: string[]
  batchIds: string[]
  parents: Parent[]
  status: 'active' | 'inactive'
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  addressLine1: '',
  city: '',
  state: 'Maharashtra',
  pincode: '',
  schoolName: '',
  class: '',
  subjectsOpted: [],
  batchIds: [],
  parents: [{ name: '', relation: 'father', phone: '' }],
  status: 'active',
}

export default function NewStudentPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
    if (formData.phone && !/^(\+91)?[\s-]?\d{5}[\s-]?\d{5}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number'
    }
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address'
    }
    if (!formData.class) newErrors.class = 'Class is required'
    if (formData.batchIds.length === 0) newErrors.batchIds = 'Select at least one batch'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setLoading(true)

    const studentData: Omit<Student, '_id' | 'tenantId' | 'createdAt' | 'updatedAt'> = {
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
      },
      address: {
        line1: formData.addressLine1,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
      },
      academicInfo: {
        schoolName: formData.schoolName,
        class: formData.class,
        subjectsOpted: formData.subjectsOpted,
        batchIds: formData.batchIds,
      },
      parents: formData.parents.filter(p => p.name.trim() !== ''),
      status: formData.status,
    }

    const res = await createStudent(studentData)

    if (res.success) {
      toast.success('Student added successfully')
      router.push('/dashboard/students')
    } else {
      toast.error(res.error || 'Failed to add student')
    }

    setLoading(false)
  }

  const addParent = () => {
    setFormData({
      ...formData,
      parents: [...formData.parents, { name: '', relation: 'guardian', phone: '' }],
    })
  }

  const removeParent = (index: number) => {
    setFormData({
      ...formData,
      parents: formData.parents.filter((_, i) => i !== index),
    })
  }

  const updateParent = (index: number, field: keyof Parent, value: string) => {
    const newParents = [...formData.parents]
    newParents[index] = { ...newParents[index], [field]: value }
    setFormData({ ...formData, parents: newParents })
  }

  const toggleSubject = (subject: string) => {
    setFormData({
      ...formData,
      subjectsOpted: formData.subjectsOpted.includes(subject)
        ? formData.subjectsOpted.filter(s => s !== subject)
        : [...formData.subjectsOpted, subject],
    })
  }

  const toggleBatch = (batchId: string) => {
    setFormData({
      ...formData,
      batchIds: formData.batchIds.includes(batchId)
        ? formData.batchIds.filter(id => id !== batchId)
        : [...formData.batchIds, batchId],
    })
    if (errors.batchIds) {
      setErrors({ ...errors, batchIds: '' })
    }
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Add New Student" 
        description="Create a new student profile" 
      />

      <div className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {/* Back Button */}
          <Link href="/dashboard/students">
            <Button variant="ghost" size="sm" type="button">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Students
            </Button>
          </Link>

          {/* Personal Info */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-5 w-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>Basic details about the student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Enter first name"
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Enter last name"
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className={errors.phone ? 'border-destructive' : ''}
                  />
                  {errors.phone && (
                    <p className="text-xs text-destructive">{errors.phone}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="student@email.com"
                    className={errors.email ? 'border-destructive' : ''}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-5 w-5 text-primary" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="addressLine1">Address Line 1</Label>
                <Input
                  id="addressLine1"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  placeholder="Street address"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select 
                    value={formData.state} 
                    onValueChange={(value) => setFormData({ ...formData, state: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="Karnataka">Karnataka</SelectItem>
                      <SelectItem value="Delhi">Delhi</SelectItem>
                      <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="Gujarat">Gujarat</SelectItem>
                      <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="411001"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Info */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-5 w-5 text-primary" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="School name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="class">Class *</Label>
                  <Select 
                    value={formData.class} 
                    onValueChange={(value) => setFormData({ ...formData, class: value })}
                  >
                    <SelectTrigger className={errors.class ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {['8th', '9th', '10th', '11th', '12th'].map(cls => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.class && (
                    <p className="text-xs text-destructive">{errors.class}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Subjects</Label>
                <div className="flex flex-wrap gap-2">
                  {mockInstitute.academics.subjects.map((subject) => (
                    <label
                      key={subject}
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 cursor-pointer hover:bg-secondary/50 transition-colors"
                    >
                      <Checkbox
                        checked={formData.subjectsOpted.includes(subject)}
                        onCheckedChange={() => toggleSubject(subject)}
                      />
                      <span className="text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Batches *</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {mockInstitute.academics.batches.map((batch) => (
                    <label
                      key={batch._id}
                      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                        formData.batchIds.includes(batch._id) 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border hover:bg-secondary/50'
                      }`}
                    >
                      <Checkbox
                        checked={formData.batchIds.includes(batch._id)}
                        onCheckedChange={() => toggleBatch(batch._id)}
                      />
                      <div>
                        <p className="font-medium text-sm">{batch.name}</p>
                        <p className="text-xs text-muted-foreground">{batch.timing}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.batchIds && (
                  <p className="text-xs text-destructive">{errors.batchIds}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Parents */}
          <Card className="rounded-2xl border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Users className="h-5 w-5 text-primary" />
                    Parents / Guardian
                  </CardTitle>
                  <CardDescription>Contact details for parents or guardians</CardDescription>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={addParent}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.parents.map((parent, index) => (
                <div key={index} className="grid gap-4 sm:grid-cols-4 items-end p-4 rounded-xl bg-secondary/30">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={parent.name}
                      onChange={(e) => updateParent(index, 'name', e.target.value)}
                      placeholder="Parent name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relation</Label>
                    <Select 
                      value={parent.relation} 
                      onValueChange={(value) => updateParent(index, 'relation', value as Parent['relation'])}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="father">Father</SelectItem>
                        <SelectItem value="mother">Mother</SelectItem>
                        <SelectItem value="guardian">Guardian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={parent.phone}
                      onChange={(e) => updateParent(index, 'phone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    {formData.parents.length > 1 && (
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeParent(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex gap-4 justify-end">
            <Link href="/dashboard/students">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="gradient-bg border-0" disabled={loading}>
              {loading ? 'Adding Student...' : 'Add Student'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
