'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { PropertyCard } from './PropertyCard'
import { FavoriteProperty, Property } from '@/types'
import { useUserProfile } from '@/hooks/useUserProfile'

interface FavoritesManagerProps {
  userAddress: string
  onViewProperty?: (property: Property) => void
  onBuyProperty?: (property: Property) => void
  className?: string
}

export function FavoritesManager({ 
  userAddress, 
  onViewProperty, 
  onBuyProperty,
  className = '' 
}: FavoritesManagerProps) {
  const { favorites, removeFromFavorites, isLoading } = useUserProfile(userAddress)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'added' | 'price' | 'name'>('added')
  const [filterTag, setFilterTag] = useState<string>('')

  // Get all unique tags from favorites
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    favorites.forEach(fav => {
      fav.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [favorites])

  // Filter and sort favorites
  const filteredFavorites = useMemo(() => {
    let filtered = favorites.filter(fav => {
      const matchesSearch = fav.property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fav.property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fav.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesTag = !filterTag || fav.tags?.includes(filterTag)
      
      return matchesSearch && matchesTag
    })

    // Sort favorites
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseFloat(a.property.price) - parseFloat(b.property.price)
        case 'name':
          return a.property.name.localeCompare(b.property.name)
        case 'added':
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })

    return filtered
  }, [favorites, searchTerm, filterTag, sortBy])

  const handleRemoveFavorite = async (favoriteId: string) => {
    if (confirm('Are you sure you want to remove this property from your favorites?')) {
      await removeFromFavorites(favoriteId)
    }
  }

  const handleAddTag = (favoriteId: string, tag: string) => {
    // In a real app, this would update the favorite with the new tag
    console.log('Adding tag:', tag, 'to favorite:', favoriteId)
  }

  const handleRemoveTag = (favoriteId: string, tag: string) => {
    // In a real app, this would remove the tag from the favorite
    console.log('Removing tag:', tag, 'from favorite:', favoriteId)
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>My Favorites</CardTitle>
          <CardDescription>
            Properties you've saved for later ({favorites.length} total)
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Search and Filter Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search favorites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'added' | 'price' | 'name')}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="added">Sort by Date Added</option>
                <option value="price">Sort by Price</option>
                <option value="name">Sort by Name</option>
              </select>
              <select
                value={filterTag}
                onChange={(e) => setFilterTag(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Tags</option>
                {allTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterTag) && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filterTag && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tag: {filterTag}
                  <button
                    onClick={() => setFilterTag('')}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Favorites List */}
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">❤️</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {favorites.length === 0 ? 'No favorites yet' : 'No matching favorites'}
              </h3>
              <p className="text-gray-600">
                {favorites.length === 0 
                  ? 'Start exploring properties and add them to your favorites!'
                  : 'Try adjusting your search or filter criteria.'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFavorites.map((favorite) => (
                <FavoriteItem
                  key={favorite.id}
                  favorite={favorite}
                  onRemove={() => handleRemoveFavorite(favorite.id)}
                  onView={onViewProperty}
                  onBuy={onBuyProperty}
                  onAddTag={handleAddTag}
                  onRemoveTag={handleRemoveTag}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface FavoriteItemProps {
  favorite: FavoriteProperty
  onRemove: () => void
  onView?: (property: Property) => void
  onBuy?: (property: Property) => void
  onAddTag: (favoriteId: string, tag: string) => void
  onRemoveTag: (favoriteId: string, tag: string) => void
}

function FavoriteItem({ 
  favorite, 
  onRemove, 
  onView, 
  onBuy,
  onAddTag,
  onRemoveTag 
}: FavoriteItemProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false)
  const [notes, setNotes] = useState(favorite.notes || '')
  const [newTag, setNewTag] = useState('')

  const handleSaveNotes = () => {
    // In a real app, this would save the notes
    console.log('Saving notes:', notes)
    setIsEditingNotes(false)
  }

  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(favorite.id, newTag.trim())
      setNewTag('')
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex">
        {/* Property Image */}
        <div className="w-32 h-24 bg-gray-100 flex-shrink-0">
          {favorite.property.images && favorite.property.images.length > 0 ? (
            <img
              src={favorite.property.images[0].url}
              alt={favorite.property.name}
              className="w-full h-full object-cover"
            />
          ) : favorite.property.imageUrl ? (
            <img
              src={favorite.property.imageUrl}
              alt={favorite.property.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-400">
              🏠
            </div>
          )}
        </div>

        {/* Property Details */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{favorite.property.name}</h3>
              <p className="text-gray-600 text-sm">{favorite.property.address}</p>
              <p className="text-green-600 font-semibold">
                {favorite.property.price} FLOW
              </p>
              
              {/* Notes */}
              <div className="mt-2">
                {isEditingNotes ? (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes..."
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                    />
                    <Button size="sm" onClick={handleSaveNotes}>
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditingNotes(false)}>
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      {favorite.notes || 'No notes'}
                    </span>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditingNotes(true)}>
                      {favorite.notes ? 'Edit' : 'Add Notes'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="mt-2">
                <div className="flex flex-wrap items-center gap-1">
                  {favorite.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        onClick={() => onRemoveTag(favorite.id, tag)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                  <div className="flex items-center space-x-1">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag..."
                      className="px-2 py-1 text-xs border border-gray-300 rounded w-20"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button size="sm" variant="ghost" onClick={handleAddTag}>
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-2 ml-4">
              <div className="flex space-x-2">
                {onView && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(favorite.property)}
                  >
                    View
                  </Button>
                )}
                {onBuy && favorite.property.isListed && (
                  <Button
                    size="sm"
                    onClick={() => onBuy(favorite.property)}
                  >
                    Buy
                  </Button>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
