'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useWallet } from '@/hooks/useWallet'
import { ContractService } from '@/lib/contracts'
import { Property } from '@/types'

export function Marketplace() {
  const { provider, signer, address } = useWallet()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buyingProperty, setBuyingProperty] = useState<string | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockProperties: Property[] = [
      {
        id: '1',
        name: 'Downtown Luxury Condo',
        description: 'Modern 2-bedroom condo with city views, granite countertops, and hardwood floors.',
        address: '123 Main St, Downtown, NY 10001',
        squareFootage: 1200,
        price: '150.50',
        owner: '0x1234...5678',
        isListed: true,
        tokenId: '1',
        contractAddress: '0x1234...5678',
      },
      {
        id: '2',
        name: 'Suburban Family Home',
        description: 'Spacious 4-bedroom home with large backyard, perfect for families.',
        address: '456 Oak Ave, Suburbia, CA 90210',
        squareFootage: 2500,
        price: '300.75',
        owner: '0x9876...5432',
        isListed: true,
        tokenId: '2',
        contractAddress: '0x1234...5678',
      },
      {
        id: '3',
        name: 'Beachfront Villa',
        description: 'Stunning oceanfront property with private beach access and panoramic views.',
        address: '789 Ocean Dr, Seaside, FL 33101',
        squareFootage: 3500,
        price: '500.00',
        owner: '0xabcd...efgh',
        isListed: true,
        tokenId: '3',
        contractAddress: '0x1234...5678',
      },
    ]

    // Simulate loading
    setTimeout(() => {
      setProperties(mockProperties)
      setLoading(false)
    }, 1000)
  }, [])

  const handleBuyProperty = async (property: Property) => {
    if (!provider || !signer) {
      setError('Wallet not connected')
      return
    }

    setBuyingProperty(property.id)
    setError(null)

    try {
      const contractService = new ContractService(provider, signer)
      
      // Buy the property
      const tx = await contractService.buyProperty(property.tokenId!, property.price)
      
      // Update local state
      setProperties(prev => 
        prev.map(p => 
          p.id === property.id 
            ? { ...p, owner: address!, isListed: false }
            : p
        )
      )
      
      alert(`Property purchased successfully! Transaction: ${tx.transactionHash}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase property')
    } finally {
      setBuyingProperty(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading properties...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md max-w-md mx-auto">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Property Marketplace</h2>
        <p className="text-gray-600">Browse and purchase property NFTs</p>
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">No properties available for sale</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {property.imageUrl ? (
                  <img 
                    src={property.imageUrl} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-4xl">🏠</div>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{property.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {property.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium">{property.address}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Square Feet:</span>
                    <span className="font-medium">{property.squareFootage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Owner:</span>
                    <span className="font-mono text-xs">
                      {property.owner}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      {property.price} FLOW
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handleBuyProperty(property)}
                    disabled={buyingProperty === property.id || property.owner === address}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {buyingProperty === property.id 
                      ? 'Buying...' 
                      : property.owner === address 
                        ? 'Your Property' 
                        : 'Buy Now'
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
