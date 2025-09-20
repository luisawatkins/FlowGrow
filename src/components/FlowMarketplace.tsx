'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PropertyCard } from '@/components/PropertyCard'
import { PropertyModal } from '@/components/PropertyModal'
import { useFlow } from '@/hooks/useFlow'
import { useNotifications } from '@/components/NotificationToast'
import { Property } from '@/types'

export function FlowMarketplace() {
  const { getMarketplaceData, getProperty, buyProperty, listProperty, isLoading } = useFlow()
  const { addNotification } = useNotifications()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buyingProperty, setBuyingProperty] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'price' | 'name' | 'date'>('date')

  // Load marketplace data
  useEffect(() => {
    loadMarketplaceData()
  }, [])

  const loadMarketplaceData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await getMarketplaceData()
      
      // Convert Flow data to Property format
      const flowProperties: Property[] = []
      
      for (const listingID of data.listings) {
        try {
          const property = await getProperty(listingID)
          if (property) {
            flowProperties.push({
              id: listingID.toString(),
              name: property.name || 'Unknown Property',
              description: property.description || 'No description available',
              address: property.physicalAddress || 'Address not available',
              squareFootage: property.squareFootage || 0,
              price: property.price?.toString() || '0',
              owner: property.owner || 'Unknown',
              isListed: true,
              tokenId: listingID.toString(),
              contractAddress: 'Flow Contract',
              createdAt: property.createdAt?.toString() || new Date().toISOString(),
            })
          }
        } catch (err) {
          console.error(`Failed to load property ${listingID}:`, err)
        }
      }
      
      setProperties(flowProperties)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load marketplace data')
    } finally {
      setLoading(false)
    }
  }

  const handleBuyProperty = async (property: Property) => {
    if (!property.tokenId) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Property token ID not available',
      })
      return
    }

    setBuyingProperty(property.id)
    
    try {
      const result = await buyProperty(
        parseInt(property.tokenId),
        property.owner
      )

      if (result.success) {
        addNotification({
          type: 'success',
          title: 'Property Purchased!',
          message: `Transaction: ${result.transactionId}`,
          action: {
            label: 'View on FlowScan',
            onClick: () => window.open(result.flowScanUrl, '_blank'),
          },
        })
        
        // Refresh marketplace data
        await loadMarketplaceData()
        setSelectedProperty(null)
      } else {
        addNotification({
          type: 'error',
          title: 'Purchase Failed',
          message: result.error || 'Failed to purchase property',
        })
      }
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Purchase Failed',
        message: err instanceof Error ? err.message : 'Failed to purchase property',
      })
    } finally {
      setBuyingProperty(null)
    }
  }

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property)
  }

  const handleListProperty = async (property: Property) => {
    if (!property.tokenId) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Property token ID not available',
      })
      return
    }

    try {
      const result = await listProperty(
        parseInt(property.tokenId),
        parseFloat(property.price)
      )

      if (result.success) {
        addNotification({
          type: 'success',
          title: 'Property Listed!',
          message: `Transaction: ${result.transactionId}`,
          action: {
            label: 'View on FlowScan',
            onClick: () => window.open(result.flowScanUrl, '_blank'),
          },
        })
        
        // Refresh marketplace data
        await loadMarketplaceData()
      } else {
        addNotification({
          type: 'error',
          title: 'Listing Failed',
          message: result.error || 'Failed to list property',
        })
      }
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Listing Failed',
        message: err instanceof Error ? err.message : 'Failed to list property',
      })
    }
  }

  const filteredAndSortedProperties = properties
    .filter(property => 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.price) - parseFloat(b.price)
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
        default:
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      }
    })

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading Flow marketplace...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="p-4 bg-red-50 border border-red-200 rounded-md max-w-md mx-auto">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadMarketplaceData} className="mt-2">
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Flow Property Marketplace</h2>
        <p className="text-gray-600">Browse and purchase property NFTs on Flow blockchain</p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'price' | 'name' | 'date')}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="price">Sort by Price</option>
                <option value="name">Sort by Name</option>
              </select>
              <Button
                onClick={loadMarketplaceData}
                variant="outline"
                size="sm"
              >
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredAndSortedProperties.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">
            {searchTerm ? 'No properties match your search' : 'No properties available on Flow marketplace'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onBuy={handleBuyProperty}
              onView={handleViewProperty}
              isBuying={buyingProperty === property.id}
              currentUser={null} // Flow doesn't have direct user context here
            />
          ))}
        </div>
      )}

      {/* Property Modal */}
      <PropertyModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBuy={handleBuyProperty}
        isBuying={buyingProperty === selectedProperty?.id}
        currentUser={null}
      />
    </div>
  )
}
