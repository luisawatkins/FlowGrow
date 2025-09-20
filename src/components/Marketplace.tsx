'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

interface Property {
  id: string
  name: string
  description: string
  address: string
  squareFootage: number
  price: string
  owner: string
  imageUrl?: string
  isListed: boolean
}

export function Marketplace() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      },
    ]

    // Simulate loading
    setTimeout(() => {
      setProperties(mockProperties)
      setLoading(false)
    }, 1000)
  }, [])

  const handleBuyProperty = async (propertyId: string) => {
    try {
      // TODO: Implement actual purchase logic
      console.log('Buying property:', propertyId)
      alert(`Purchase initiated for property ${propertyId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase property')
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
            <div key={property.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
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
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {property.name}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {property.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Address:</span>
                    <span className="text-gray-900">{property.address}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Square Feet:</span>
                    <span className="text-gray-900">{property.squareFootage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Owner:</span>
                    <span className="text-gray-900 font-mono text-xs">
                      {property.owner}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-blue-600">
                      {property.price} FLOW
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handleBuyProperty(property.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
