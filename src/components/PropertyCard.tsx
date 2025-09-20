'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'
import { getFlowExplorerAddressUrl } from '@/lib/contracts'

interface PropertyCardProps {
  property: Property
  onBuy?: (property: Property) => void
  onView?: (property: Property) => void
  isBuying?: boolean
  currentUser?: string | null
}

export function PropertyCard({ 
  property, 
  onBuy, 
  onView, 
  isBuying = false, 
  currentUser 
}: PropertyCardProps) {
  const isOwner = currentUser === property.owner
  const canBuy = !isOwner && property.isListed && !isBuying

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center relative">
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
            For Sale
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
