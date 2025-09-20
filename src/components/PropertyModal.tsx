'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'
import { getFlowExplorerAddressUrl, getFlowExplorerUrl } from '@/lib/contracts'

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
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{property.name}</CardTitle>
              <CardDescription>{property.address}</CardDescription>
            </div>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Property Image */}
          <div className="h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
            {property.imageUrl ? (
              <img 
                src={property.imageUrl} 
                alt={property.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-8xl text-blue-300">🏠</div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{property.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-700">Square Footage</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {property.squareFootage.toLocaleString()} sq ft
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Price</h4>
                <p className="text-2xl font-bold text-green-600">
                  {property.price} FLOW
                </p>
                <p className="text-sm text-gray-500">
                  ≈ ${(parseFloat(property.price) * 0.5).toFixed(2)} USD
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Property Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Owner:</span>
                  <a
                    href={getFlowExplorerAddressUrl(property.owner)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 font-mono text-blue-600 hover:underline"
                  >
                    {property.owner}
                  </a>
                </div>
                {property.tokenId && (
                  <div>
                    <span className="text-gray-500">Token ID:</span>
                    <span className="ml-2 font-mono">{property.tokenId}</span>
                  </div>
                )}
                {property.contractAddress && (
                  <div>
                    <span className="text-gray-500">Contract:</span>
                    <a
                      href={getFlowExplorerAddressUrl(property.contractAddress)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 font-mono text-blue-600 hover:underline"
                    >
                      {property.contractAddress.slice(0, 10)}...
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    property.isListed 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {property.isListed ? 'Listed' : 'Not Listed'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            {canBuy && onBuy && (
              <Button
                onClick={() => onBuy(property)}
                disabled={isBuying}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                {isBuying ? 'Processing Purchase...' : 'Buy Property'}
              </Button>
            )}
            {isOwner && (
              <Button
                variant="outline"
                className="flex-1"
                disabled
              >
                Your Property
              </Button>
            )}
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
