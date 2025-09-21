'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { UserProfile, UserPreferences } from '@/types'
import { useUserProfile } from '@/hooks/useUserProfile'

interface UserProfileProps {
  userAddress: string
  onClose?: () => void
  className?: string
}

export function UserProfileComponent({ userAddress, onClose, className = '' }: UserProfileProps) {
  const { profile, updateProfile, updatePreferences, isLoading } = useUserProfile(userAddress)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<UserProfile>>({})

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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

  const handleEdit = () => {
    setEditData({
      displayName: profile.displayName,
      username: profile.username,
      bio: profile.bio,
      email: profile.email,
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    await updateProfile(editData)
    setIsEditing(false)
    setEditData({})
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditData({})
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Manage your account settings and preferences
              </CardDescription>
            </div>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.displayName || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl text-gray-400">👤</div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">
                {profile.displayName || 'Anonymous User'}
              </h3>
              <p className="text-gray-600">@{profile.username || 'username'}</p>
              <p className="text-sm text-gray-500 font-mono">
                {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
              </p>
            </div>
            <Button onClick={handleEdit} variant="outline">
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Profile Information</h4>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <Input
                    value={editData.displayName || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Enter display name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <Input
                    value={editData.username || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <Textarea
                    value={editData.bio || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Tell us about yourself"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={editData.email || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Display Name:</span>
                  <p className="text-gray-900">{profile.displayName || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Username:</span>
                  <p className="text-gray-900">@{profile.username || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Bio:</span>
                  <p className="text-gray-900">{profile.bio || 'No bio available'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Email:</span>
                  <p className="text-gray-900">{profile.email || 'Not provided'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Member Since:</span>
                  <p className="text-gray-900">
                    {new Date(profile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Stats */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {profile.stats.totalProperties}
                </div>
                <div className="text-sm text-gray-600">Properties</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {profile.stats.propertiesSold}
                </div>
                <div className="text-sm text-gray-600">Sold</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {profile.stats.propertiesBought}
                </div>
                <div className="text-sm text-gray-600">Bought</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {profile.stats.favoritesCount}
                </div>
                <div className="text-sm text-gray-600">Favorites</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// User Preferences Component
interface UserPreferencesProps {
  preferences: UserPreferences
  onUpdate: (preferences: Partial<UserPreferences>) => void
  className?: string
}

export function UserPreferencesComponent({ 
  preferences, 
  onUpdate, 
  className = '' 
}: UserPreferencesProps) {
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences)

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const updated = { ...localPreferences, [key]: value }
    setLocalPreferences(updated)
    onUpdate({ [key]: value })
  }

  const handleNotificationChange = (key: keyof UserPreferences['notifications'], value: boolean) => {
    const updated = {
      ...localPreferences,
      notifications: { ...localPreferences.notifications, [key]: value }
    }
    setLocalPreferences(updated)
    onUpdate({ notifications: updated.notifications })
  }

  const handlePrivacyChange = (key: keyof UserPreferences['privacy'], value: boolean) => {
    const updated = {
      ...localPreferences,
      privacy: { ...localPreferences.privacy, [key]: value }
    }
    setLocalPreferences(updated)
    onUpdate({ privacy: updated.privacy })
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>
            Customize your experience
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={localPreferences.theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={localPreferences.currency}
              onChange={(e) => handlePreferenceChange('currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="FLOW">FLOW</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>

          {/* Notifications */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Notifications</h4>
            <div className="space-y-3">
              {Object.entries(localPreferences.notifications).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handleNotificationChange(key as keyof UserPreferences['notifications'], e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Privacy */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Privacy</h4>
            <div className="space-y-3">
              {Object.entries(localPreferences.privacy).map(([key, value]) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => handlePrivacyChange(key as keyof UserPreferences['privacy'], e.target.checked)}
                    className="mr-3"
                  />
                  <span className="text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
