'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PropertyCard } from '@/components/PropertyCard'
import { Property } from '@/types'
import { useWallet } from '@/hooks/useWallet'
import { ContractService } from '@/lib/contracts'

export function UserDashboard() {
  const { provider, signer, address } = useWallet()
  const [userProperties, setUserProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'owned' | 'listed' | 'sold'>('owned')

  useEffect(() => {
    if (address) {
      fetchUserProperties()
    }
  }, [address])

  const fetchUserProperties = async () => {
    if (!address) return

    setLoading(true)
    setError(null)

    try {
      // Mock data for demonstration
      const mockProperties: Property[] = [
        {
          id: '1',
          name: 'My Downtown Condo',
          description: 'Modern 2-bedroom condo with city views',
          address: '123 Main St, Downtown, NY 10001',
          squareFootage: 1200,
          price: '150.50',
          owner: address,
          isListed: true,
          tokenId: '1',
          contractAddress: '0x1234...5678',
        },
        {
          id: '2',
          name: 'Suburban House',
          description: 'Spacious family home with large backyard',
          address: '456 Oak Ave, Suburbia, CA 90210',
          squareFootage: 2500,
          price: '300.75',
          owner: address,
          isListed: false,
          tokenId: '2',
          contractAddress: '0x1234...5678',
        },
      ]

      setUserProperties(mockProperties)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }

  const handleListProperty = async (property: Property) => {
    if (!provider || !signer) {
      setError('Wallet not connected')
      return
    }

    try {
      const contractService = new ContractService(provider, signer)
      
      // List the property on marketplace
      await contractService.listProperty(property.tokenId!, property.price)
      
      // Update local state
      setUserProperties(prev =>
        prev.map(p =>
          p.id === property.id ? { ...p, isListed: true } : p
        )
      )
      
      alert('Property listed successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to list property')
    }
  }

  const handleDelistProperty = async (property: Property) => {
    if (!provider || !signer) {
      setError('Wallet not connected')
      return
    }

    try {
      const contractService = new ContractService(provider, signer)
      
      // Delist the property
      await contractService.cancelListing(property.tokenId!)
      
      // Update local state
      setUserProperties(prev =>
        prev.map(p =>
          p.id === property.id ? { ...p, isListed: false } : p
        )
      )
      
      alert('Property delisted successfully!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delist property')
    }
  }

  const filteredProperties = userProperties.filter(property => {
    switch (activeTab) {
      case 'owned':
        return true
      case 'listed':
        return property.isListed
      case 'sold':
        return false // Mock data doesn't include sold properties
      default:
        return true
    }
  })

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your properties...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md max-w-md mx-auto">
          <p className="text-red-600">{error}</p>
          <Button onClick={fetchUserProperties} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Properties</h2>
        <p className="text-gray-600">Manage your property NFTs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProperties.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Listed for Sale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProperties.filter(p => p.isListed).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userProperties.reduce((sum, p) => sum + parseFloat(p.price), 0).toFixed(2)} FLOW
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('owned')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'owned'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Properties
          </button>
          <button
            onClick={() => setActiveTab('listed')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'listed'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Listed
          </button>
          <button
            onClick={() => setActiveTab('sold')}
            className={`px-6 py-2 rounded-md transition-colors ${
              activeTab === 'sold'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sold
          </button>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">
            {activeTab === 'owned' && 'You don\'t own any properties yet'}
            {activeTab === 'listed' && 'You don\'t have any properties listed for sale'}
            {activeTab === 'sold' && 'You haven\'t sold any properties yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                {property.imageUrl ? (
                  <img 
                    src={property.imageUrl} 
                    alt={property.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-6xl text-blue-300">🏠</div>
                )}
                {property.isListed && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Listed
                  </div>
                )}
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl line-clamp-1">{property.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {property.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Address:</span>
                    <span className="font-medium text-right max-w-[200px] truncate" title={property.address}>
                      {property.address}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Square Feet:</span>
                    <span className="font-medium">{property.squareFootage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-bold text-blue-600">{property.price} FLOW</span>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4 border-t">
                  {property.isListed ? (
                    <Button
                      onClick={() => handleDelistProperty(property)}
                      variant="outline"
                      className="flex-1"
                    >
                      Delist
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleListProperty(property)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      List for Sale
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
