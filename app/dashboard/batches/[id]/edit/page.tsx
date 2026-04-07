'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group'
import { ArrowLeft } from 'lucide-react'
import { fetchBatch, updateBatch, formatCurrency } from '@/lib/api'
import type { Batch, BatchFeeConfig } from '@/lib/types'

export default function EditBatchPage() {
  const router = useRouter()
  const params = useParams()
  const batchId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [batch, setBatch] = useState<Batch | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    timing: '',
    description: '',
    capacity: 30,
    status: 'active' as 'active' | 'archived' | 'planned',
  })

  const [feeConfig, setFeeConfig] = useState<BatchFeeConfig>({
    mode: 'quarterly',
    frequency: 3,
    baseAmount: 120000,
    discount: 0,
    finalAmount: 120000,
    startDate: new Date(),
  })

  useEffect(() => {
    async function loadBatch() {
      const response = await fetchBatch(batchId)
      if (response.success && response.data) {
        const batchData = response.data
        setBatch(batchData)
        setFormData({
          name: batchData.name,
          subject: batchData.subject,
          timing: batchData.timing,
          description: batchData.description || '',
          capacity: batchData.capacity,
          status: batchData.status,
        })
        setFeeConfig(batchData.feeConfig)
      }
      setLoading(false)
    }
    loadBatch()
  }, [batchId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value,
    }))
  }

  const handleFeeConfigChange = (field: string, value: any) => {
    let updated = { ...feeConfig }
    
    if (field === 'baseAmount' || field === 'discount') {
      const base = field === 'baseAmount' ? value : feeConfig.baseAmount
      const discount = field === 'discount' ? value : feeConfig.discount
      updated = {
        ...updated,
        baseAmount: base,
        discount: discount,
        finalAmount: base - discount,
      }
    } else {
      updated = { ...updated, [field]: value }
    }
    
    setFeeConfig(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const response = await updateBatch(batchId, {
        ...formData,
        feeConfig,
      })

      if (response.success) {
        router.push(`/dashboard/batches/${batchId}`)
      } else {
        alert('Error updating batch: ' + response.error)
      }
    } catch (error) {
      alert('An error occurred while updating the batch')
      console.error(error)
    } finally {
      setSubmitting(false)
    }
  }

  const modeDescriptions = {
    monthly: 'Student pays in 12 equal monthly installments',
    quarterly: 'Student pays in 4 equal quarterly installments',
    yearly: 'Student pays entire amount at the beginning of the year',
    custom: 'Define a custom payment schedule',
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header title="Edit Batch" description="" />
        <div className="flex justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!batch) {
    return (
      <div className="min-h-screen">
        <Header title="Batch Not Found" description="" />
        <div className="p-6 text-center">
          <p className="text-muted-foreground mb-4">The batch you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/dashboard/batches">
            <Button>Back to Batches</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header 
        title="Edit Batch" 
        description="Update batch information and fee configuration" 
      />

      <div className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <Link href={`/dashboard/batches/${batchId}`}>
            <Button variant="ghost" size="sm" className="px-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Batch
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Batch Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g., JEE 2026 Morning"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="e.g., JEE Main"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="timing">Class Timing *</Label>
                      <Input
                        id="timing"
                        name="timing"
                        placeholder="e.g., 6:00 AM - 9:00 AM"
                        value={formData.timing}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="capacity">Batch Capacity *</Label>
                      <Input
                        id="capacity"
                        name="capacity"
                        type="number"
                        min="1"
                        value={formData.capacity}
                        onChange={handleInputChange}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="planned">Planned</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Add any details about this batch..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Fee Configuration */}
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Fee Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Payment Mode */}
                  <div>
                    <Label className="text-base font-medium">Payment Mode *</Label>
                    <RadioGroup value={feeConfig.mode} onValueChange={(value: any) => handleFeeConfigChange('mode', value)}>
                      <div className="mt-3 space-y-3">
                        {Object.entries(modeDescriptions).map(([mode, description]) => (
                          <div key={mode} className="flex items-start space-x-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-secondary/30">
                            <RadioGroupItem value={mode} id={mode} className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor={mode} className="capitalize font-medium cursor-pointer">{mode}</Label>
                              <p className="text-sm text-muted-foreground">{description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Fee Amounts */}
                  <div className="border-t border-border pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <Label htmlFor="baseAmount">Base Amount (₹) *</Label>
                        <Input
                          id="baseAmount"
                          type="number"
                          min="0"
                          value={feeConfig.baseAmount}
                          onChange={(e) => handleFeeConfigChange('baseAmount', parseInt(e.target.value) || 0)}
                          required
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="discount">Discount (₹)</Label>
                        <Input
                          id="discount"
                          type="number"
                          min="0"
                          max={feeConfig.baseAmount}
                          value={feeConfig.discount}
                          onChange={(e) => handleFeeConfigChange('discount', parseInt(e.target.value) || 0)}
                          className="mt-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Final Amount Summary */}
                  <div className="rounded-lg gradient-bg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-primary-foreground font-medium">Final Amount:</span>
                      <span className="text-2xl font-bold text-primary-foreground">{formatCurrency(feeConfig.finalAmount)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link href={`/dashboard/batches/${batchId}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={submitting} className="flex-1 gradient-bg text-primary-foreground">
                  {submitting ? 'Updating...' : 'Update Batch'}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview */}
          <div className="md:col-span-1">
            <Card className="rounded-2xl sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Batch Name</p>
                  <p className="font-semibold">{formData.name || 'Not set'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Subject</p>
                  <p className="font-semibold">{formData.subject || 'Not set'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Timing</p>
                  <p className="font-semibold text-sm">{formData.timing || 'Not set'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-semibold capitalize">{formData.status}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Batch Capacity</p>
                  <p className="font-semibold">{formData.capacity} students</p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">Payment Mode</p>
                  <p className="font-semibold capitalize">{feeConfig.mode}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Fee Structure</p>
                  <div className="space-y-2 text-sm mt-2">
                    <div className="flex justify-between">
                      <span>Base:</span>
                      <span>{formatCurrency(feeConfig.baseAmount)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Discount:</span>
                      <span>-{formatCurrency(feeConfig.discount)}</span>
                    </div>
                    <div className="border-t border-border pt-2 mt-2">
                      <div className="flex justify-between font-bold text-green-600">
                        <span>Final:</span>
                        <span>{formatCurrency(feeConfig.finalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
