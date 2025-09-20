'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useFlow } from '@/hooks/useFlow'
import { useNotifications } from '@/components/NotificationToast'

interface PropertyData {
  name: string
  description: string
  address: string
  squareFootage: string
  price: string
  imageURL: string
}

export function FlowPropertyMintForm() {
  const { mintProperty, isLoading } = useFlow()
  const { addNotification } = useNotifications()
  const [formData, setFormData] = useState<PropertyData>({
    name: '',
    description: '',
    address: '',
    squareFootage: '',
    price: '',
    imageURL: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description || !formData.address || !formData.squareFootage || !formData.price) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Please fill in all required fields',
      })
      return
    }

    const result = await mintProperty(
      formData.name,
      formData.description,
      formData.address,
      parseInt(formData.squareFootage),
      parseFloat(formData.price),
      formData.imageURL || undefined
    )

    if (result.success) {
      addNotification({
        type: 'success',
        title: 'Property Minted Successfully!',
        message: `Transaction: ${result.transactionId}`,
        action: {
          label: 'View on FlowScan',
          onClick: () => window.open(result.flowScanUrl, '_blank'),
        },
      })
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        address: '',
        squareFootage: '',
        price: '',
        imageURL: '',
      })
    } else {
      addNotification({
        type: 'error',
        title: 'Minting Failed',
        message: result.error || 'Failed to mint property',
      })
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Mint Property NFT on Flow</CardTitle>
          <CardDescription>
            Create a new property NFT using Flow blockchain with Cadence smart contracts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Property Name *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Downtown Luxury Condo"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description *
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Describe the property features, amenities, etc."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Physical Address *
              </label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="squareFootage" className="text-sm font-medium">
                  Square Footage *
                </label>
                <Input
                  type="number"
                  id="squareFootage"
                  name="squareFootage"
                  value={formData.squareFootage}
                  onChange={handleInputChange}
                  required
                  placeholder="1500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price (FLOW) *
                </label>
                <Input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  placeholder="100.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="imageURL" className="text-sm font-medium">
                Image URL (Optional)
              </label>
              <Input
                id="imageURL"
                name="imageURL"
                value={formData.imageURL}
                onChange={handleInputChange}
                placeholder="https://example.com/property-image.jpg"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Minting Property NFT...' : 'Mint Property NFT on Flow'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
