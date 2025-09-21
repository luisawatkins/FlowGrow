'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'
import { getFlowExplorerAddressUrl, getFlowExplorerUrl } from '@/lib/contracts'
import { ImageGallery } from './ImageGallery'
import { OptimizedImage } from './OptimizedImage'

interface PropertyModalProps {
  property: Property | null
  isOpen: boolean
  onClose: () => void
  onBuy?: (property: Property) => void
  isBuying?: boolean
  currentUser?: string | null
}

export function PropertyModal({ 
  property, 
  isOpen, 
  onClose, 
  onBuy, 
  isBuying = false, 
  currentUser 
}: PropertyModalProps) {
  if (!isOpen || !property) return null

  const isOwner = currentUser === property.owner
  const canBuy = !isOwner && property.isListed && !isBuying

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{property.name}</CardTitle>
              <CardDescription className="flex items-center space-x-2">
                <span>📍</span>
                <span>{property.address}</span>
              </CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Enhanced Image Gallery */}
          <div className="space-y-4">
            {property.images && property.images.length > 0 ? (
              <ImageGallery 
                images={property.images} 
                className="w-full"
                showThumbnails={true}
              />
            ) : property.imageUrl ? (
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <OptimizedImage
                  src={property.imageUrl}
                  alt={property.name}
                  className="w-full h-full"
                  priority={true}
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                <div className="text-8xl text-blue-300">🏠</div>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {property.squareFootage.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Square Feet</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {property.price} FLOW
                </div>
                <div className="text-sm text-gray-600">Price</div>
                <div className="text-xs text-gray-500">
                  ≈ ${(parseFloat(property.price) * 0.5).toFixed(2)} USD
                </div>
              </div>
              {property.bedrooms && (
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {property.bedrooms}
                  </div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
              )}
              {property.bathrooms && (
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {property.bathrooms}
                  </div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
              )}
            </div>

            {/* Enhanced Property Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Details */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Property Details</h4>
                <div className="space-y-3">
                  {property.propertyType && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium capitalize">{property.propertyType}</span>
                    </div>
                  )}
                  {property.yearBuilt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Year Built:</span>
                      <span className="font-medium">{property.yearBuilt}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Square Footage:</span>
                    <span className="font-medium">{property.squareFootage.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      property.isListed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {property.isListed ? 'Listed for Sale' : 'Not Listed'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location & Ownership */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-800">Location & Ownership</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Address:</span>
                    <p className="font-medium">{property.address}</p>
                  </div>
                  {property.location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">
                        {property.location.city}, {property.location.state}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Owner:</span>
                    <a
                      href={getFlowExplorerAddressUrl(property.owner)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 font-mono text-blue-600 hover:underline"
                    >
                      {property.owner.slice(0, 6)}...{property.owner.slice(-4)}
                    </a>
                  </div>
                  {property.tokenId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Token ID:</span>
                      <span className="font-mono text-sm">{property.tokenId}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Features & Amenities */}
            {(property.features && property.features.length > 0) || 
             (property.amenities && property.amenities.length > 0) ? (
              <div className="space-y-4">
                {property.features && property.features.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {property.amenities && property.amenities.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h4>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}

          </div>

          {/* Enhanced Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
            {canBuy && onBuy && (
              <Button
                onClick={() => onBuy(property)}
                disabled={isBuying}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3"
                size="lg"
              >
                {isBuying ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing Purchase...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>💰</span>
                    <span>Buy Property for {property.price} FLOW</span>
                  </div>
                )}
              </Button>
            )}
            {isOwner && (
              <Button
                variant="outline"
                className="flex-1 py-3"
                disabled
                size="lg"
              >
                <div className="flex items-center space-x-2">
                  <span>🏠</span>
                  <span>Your Property</span>
                </div>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
              className="py-3"
              size="lg"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
