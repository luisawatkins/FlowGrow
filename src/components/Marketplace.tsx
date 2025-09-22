'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { PropertyCard } from '@/components/PropertyCard'
import { PropertyModal } from '@/components/PropertyModal'
import { FilterBar, usePropertyFilters, FilterOptions } from '@/components/FilterBar'
import { useWallet } from '@/hooks/useWallet'
import { ContractService } from '@/lib/contracts'
import { Property } from '@/types'
import { filterProperties, getFilterSummary } from '@/lib/searchUtils'

export function Marketplace() {
  const { provider, signer, address } = useWallet()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [buyingProperty, setBuyingProperty] = useState<string | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  
  // Use the new filter system
  const { filters, updateFilters, clearFilters } = usePropertyFilters()

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
      setSelectedProperty(null) // Close modal
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to purchase property')
    } finally {
      setBuyingProperty(null)
    }
  }

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property)
  }

  // Use the new filtering system
  const searchResults = filterProperties(properties, filters)
  const filterSummary = getFilterSummary(filters)

  const handleSearchPerformed = (query: string, resultCount: number) => {
    // This will be called when a search is performed
    console.log(`Search performed: "${query}" found ${resultCount} results`)
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

      {/* Enhanced Search and Filter Controls */}
      <FilterBar
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
        totalResults={searchResults.length}
        properties={properties}
        onSearchPerformed={handleSearchPerformed}
        className="mb-6"
      />

      {/* Active Filters Summary */}
      {filterSummary.length > 0 && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Active filters:</span>
              {filterSummary.map((filter, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {filter}
                </span>
              ))}
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
              >
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {searchResults.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600">
            {filters.searchTerm || filterSummary.length > 0 
              ? 'No properties match your search criteria' 
              : 'No properties available for sale'
            }
          </p>
          {(filters.searchTerm || filterSummary.length > 0) && (
            <Button
              onClick={clearFilters}
              variant="outline"
              className="mt-4"
            >
              Clear all filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((searchResult) => (
            <PropertyCard
              key={searchResult.property.id}
              property={searchResult.property}
              onBuy={handleBuyProperty}
              onView={handleViewProperty}
              isBuying={buyingProperty === searchResult.property.id}
              currentUser={address}
              searchResult={searchResult}
              showHighlights={!!filters.searchTerm}
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
        currentUser={address}
      />
    </div>
  )
}
