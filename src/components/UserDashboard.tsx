'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { UserProfileComponent, UserPreferencesComponent } from './UserProfile'
import { FavoritesManager } from './FavoritesManager'
import { PropertyCard } from './PropertyCard'
import { PropertyModal } from './PropertyModal'
import { useUserProfile } from '@/hooks/useUserProfile'
import { Property } from '@/types'

interface UserDashboardProps {
  userAddress: string
  className?: string
}

type DashboardTab = 'overview' | 'profile' | 'favorites' | 'properties' | 'settings'

export function UserDashboard({ userAddress, className = '' }: UserDashboardProps) {
  const { profile, updatePreferences, activities, isLoading } = useUserProfile(userAddress)
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
    { id: 'properties', label: 'My Properties', icon: '🏠' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property)
  }

  const handleBuyProperty = (property: Property) => {
    // In a real app, this would handle the purchase
    console.log('Buying property:', property)
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className={`text-center p-8 ${className}`}>
        <p className="text-gray-600">Profile not found</p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.displayName || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-lg text-gray-400">👤</div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{profile.displayName || 'User'}</h3>
                  <p className="text-sm text-gray-600">@{profile.username}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as DashboardTab)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'overview' && (
            <OverviewTab profile={profile} activities={activities} />
          )}
          
          {activeTab === 'profile' && (
            <UserProfileComponent userAddress={userAddress} />
          )}
          
          {activeTab === 'favorites' && (
            <FavoritesManager
              userAddress={userAddress}
              onViewProperty={handleViewProperty}
              onBuyProperty={handleBuyProperty}
            />
          )}
          
          {activeTab === 'properties' && (
            <MyPropertiesTab userAddress={userAddress} />
          )}
          
          {activeTab === 'settings' && (
            <UserPreferencesComponent
              preferences={profile.preferences}
              onUpdate={updatePreferences}
            />
          )}
        </div>
      </div>

      {/* Property Modal */}
      <PropertyModal
        property={selectedProperty}
        isOpen={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onBuy={handleBuyProperty}
        currentUser={userAddress}
      />
    </div>
  )
}

// Overview Tab Component
interface OverviewTabProps {
  profile: any
  activities: any[]
}

function OverviewTab({ profile, activities }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome back, {profile.displayName || 'User'}!</CardTitle>
          <CardDescription>
            Here's what's happening with your properties and account.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {profile.stats.totalProperties}
              </div>
              <div className="text-sm text-gray-600">Total Properties</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {profile.stats.propertiesSold}
              </div>
              <div className="text-sm text-gray-600">Properties Sold</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {profile.stats.favoritesCount}
              </div>
              <div className="text-sm text-gray-600">Favorites</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {profile.stats.totalEarned}
              </div>
              <div className="text-sm text-gray-600">Total Earned (FLOW)</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest property-related activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// My Properties Tab Component
interface MyPropertiesTabProps {
  userAddress: string
}

function MyPropertiesTab({ userAddress }: MyPropertiesTabProps) {
  // In a real app, this would fetch the user's properties
  const [properties] = useState<Property[]>([])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Properties</CardTitle>
          <CardDescription>
            Properties you own or have listed for sale
          </CardDescription>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-300 mb-4">🏠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No properties yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start by minting your first property NFT!
              </p>
              <Button>
                Mint Property
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  currentUser={userAddress}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Helper function to get activity icons
function getActivityIcon(type: string): string {
  switch (type) {
    case 'property_minted':
      return '🏗️'
    case 'property_listed':
      return '📋'
    case 'property_bought':
      return '💰'
    case 'property_sold':
      return '💸'
    case 'favorite_added':
      return '❤️'
    case 'profile_updated':
      return '✏️'
    default:
      return '📝'
  }
}