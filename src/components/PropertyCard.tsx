'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'
import { getFlowExplorerAddressUrl } from '@/lib/contracts'
import { SearchResult } from '@/lib/searchUtils'
import { OptimizedImage } from './OptimizedImage'

interface PropertyCardProps {
  property: Property
  onBuy?: (property: Property) => void
  onView?: (property: Property) => void
  isBuying?: boolean
  currentUser?: string | null
  searchResult?: SearchResult
  showHighlights?: boolean
}

export function PropertyCard({ 
  property, 
  onBuy, 
  onView, 
  isBuying = false, 
  currentUser,
  searchResult,
  showHighlights = false
}: PropertyCardProps) {
  const isOwner = currentUser === property.owner
  const canBuy = !isOwner && property.isListed && !isBuying

  // Helper function to highlight search terms
  const highlightText = (text: string, highlights: string[] = []) => {
    if (!showHighlights || !highlights.length) {
      return text
    }

    let highlightedText = text
    highlights.forEach(term => {
      const regex = new RegExp(`(${term})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
    })
    
    return highlightedText
  }

  const nameHighlights = searchResult?.highlights.name || []
  const descHighlights = searchResult?.highlights.description || []
  const addrHighlights = searchResult?.highlights.address || []

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <OptimizedImage
            src={property.images.find(img => img.isPrimary)?.url || property.images[0].url}
            alt={property.name}
            className="w-full h-full"
            width={400}
            height={192}
          />
        ) : property.imageUrl ? (
          <OptimizedImage
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full"
            width={400}
            height={192}
          />
        ) : (
          <div className="text-6xl text-blue-300">🏠</div>
        )}
        {property.isListed && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            For Sale
          </div>
        )}
        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
            +{property.images.length - 1} more
          </div>
        )}
      </div>
      
      <CardHeader>
        <CardTitle 
          className="text-xl line-clamp-1"
          dangerouslySetInnerHTML={{ 
            __html: highlightText(property.name, nameHighlights) 
          }}
        />
        <CardDescription 
          className="line-clamp-2"
          dangerouslySetInnerHTML={{ 
            __html: highlightText(property.description, descHighlights) 
          }}
        />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Address:</span>
            <span 
              className="font-medium text-right max-w-[200px] truncate" 
              title={property.address}
              dangerouslySetInnerHTML={{ 
                __html: highlightText(property.address, addrHighlights) 
              }}
            />
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Square Feet:</span>
            <span className="font-medium">{property.squareFootage.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Owner:</span>
            <a
              href={getFlowExplorerAddressUrl(property.owner)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-blue-600 hover:underline"
            >
              {property.owner.slice(0, 6)}...{property.owner.slice(-4)}
            </a>
          </div>
          {property.tokenId && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Token ID:</span>
              <span className="font-mono text-xs">{property.tokenId}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <span className="text-2xl font-bold text-blue-600">
              {property.price} FLOW
            </span>
            <div className="text-xs text-muted-foreground">
              ≈ ${(parseFloat(property.price) * 0.5).toFixed(2)} USD
            </div>
          </div>
          
          <div className="flex space-x-2">
            {onView && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(property)}
              >
                View Details
              </Button>
            )}
            {canBuy && onBuy && (
              <Button
                onClick={() => onBuy(property)}
                disabled={isBuying}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isBuying ? 'Buying...' : 'Buy Now'}
              </Button>
            )}
            {isOwner && (
              <Button
                variant="outline"
                size="sm"
                disabled
              >
                Your Property
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
