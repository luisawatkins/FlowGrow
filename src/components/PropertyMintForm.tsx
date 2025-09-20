'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useWallet } from '@/hooks/useWallet'
import { ContractService } from '@/lib/contracts'

interface PropertyData {
  name: string
  description: string
  address: string
  squareFootage: string
  price: string
  images: File[]
}

export function PropertyMintForm() {
  const { provider, signer } = useWallet()
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
  const [success, setSuccess] = useState<string | null>(null)

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
    setSuccess(null)

    try {
      if (!provider || !signer) {
        throw new Error('Wallet not connected')
      }

      const contractService = new ContractService(provider, signer)
      
      // TODO: Upload images to IPFS and create metadata JSON
      const metadataURI = 'ipfs://placeholder' // This would be the actual IPFS hash
      
      // Mint the property NFT
      const tx = await contractService.mintProperty(
        formData.name,
        formData.description,
        formData.address,
        parseInt(formData.squareFootage),
        formData.price,
        metadataURI
      )
      
      setSuccess(`Property NFT minted successfully! Transaction: ${tx.transactionHash}`)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        address: '',
        squareFootage: '',
        price: '',
        images: []
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mint property')
    } finally {
      setIsMinting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Mint Property NFT</CardTitle>
          <CardDescription>
            Create a new property NFT with rich metadata and list it on the marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Property Name
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
                Description
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
                Physical Address
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
                  Square Footage
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
                  Price (FLOW)
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
              <label htmlFor="images" className="text-sm font-medium">
                Property Images
              </label>
              <Input
                type="file"
                id="images"
                name="images"
                onChange={handleImageChange}
                multiple
                accept="image/*"
              />
              <p className="text-sm text-muted-foreground">
                Upload multiple images of the property
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600">{success}</p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isMinting}
              className="w-full"
            >
              {isMinting ? 'Minting Property NFT...' : 'Mint Property NFT'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
