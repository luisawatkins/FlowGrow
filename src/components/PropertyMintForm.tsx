'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface PropertyData {
  name: string
  description: string
  address: string
  squareFootage: string
  price: string
  images: File[]
}

export function PropertyMintForm() {
  const [formData, setFormData] = useState<PropertyData>({
    name: '',
    description: '',
    address: '',
    squareFootage: '',
    price: '',
    images: []
  })
  const [isMinting, setIsMinting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({ ...prev, images: files }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsMinting(true)
    setError(null)

    try {
      // TODO: Implement actual minting logic
      console.log('Minting property with data:', formData)
      
      // Simulate minting delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        address: '',
        squareFootage: '',
        price: '',
        images: []
      })
      
      alert('Property NFT minted successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint property')
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Mint Property NFT</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Property Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Downtown Luxury Condo"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the property features, amenities, etc."
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Physical Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main St, City, State, ZIP"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage
              </label>
              <input
                type="number"
                id="squareFootage"
                name="squareFootage"
                value={formData.squareFootage}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="1500"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price (FLOW)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="100.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
              Property Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              onChange={handleImageChange}
              multiple
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload multiple images of the property
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isMinting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
          >
            {isMinting ? 'Minting Property NFT...' : 'Mint Property NFT'}
          </Button>
        </form>
      </div>
    </div>
  )
}
