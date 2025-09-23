'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Property } from '@/types'

interface PropertyCommunityProps {
  property: Property
  currentUserId: string
  onJoinCommunity: (communityId: string) => void
  onLeaveCommunity: (communityId: string) => void
  className?: string
}

interface CommunityMember {
  id: string
  name: string
  avatar?: string
  role: 'owner' | 'resident' | 'neighbor' | 'visitor'
  joinDate: string
  isOnline: boolean
  properties: number
  contributions: number
}

interface CommunityPost {
  id: string
  authorId: string
  author: CommunityMember
  content: string
  type: 'update' | 'question' | 'announcement' | 'event' | 'recommendation'
  timestamp: string
  likes: number
  comments: Comment[]
  images?: string[]
  tags: string[]
  isPinned: boolean
}

interface Comment {
  id: string
  authorId: string
  author: CommunityMember
  content: string
  timestamp: string
  likes: number
}

interface CommunityEvent {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  organizer: CommunityMember
  attendees: CommunityMember[]
  maxAttendees?: number
  category: 'social' | 'maintenance' | 'safety' | 'community' | 'other'
}

interface NeighborNetwork {
  id: string
  name: string
  distance: number
  relationship: 'friendly' | 'neutral' | 'unknown'
  lastInteraction: string
  sharedInterests: string[]
  mutualConnections: number
}

export function PropertyCommunity({
  property,
  currentUserId,
  onJoinCommunity,
  onLeaveCommunity,
  className = ''
}: PropertyCommunityProps) {
  const [activeTab, setActiveTab] = useState<'feed' | 'neighbors' | 'events' | 'directory'>('feed')
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [events, setEvents] = useState<CommunityEvent[]>([])
  const [neighbors, setNeighbors] = useState<NeighborNetwork[]>([])
  const [newPost, setNewPost] = useState('')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [showCreateEvent, setShowCreateEvent] = useState(false)

  // Mock data initialization
  useEffect(() => {
    const mockMembers: CommunityMember[] = [
      {
        id: '1',
        name: 'John Smith',
        role: 'owner',
        joinDate: '2023-01-15',
        isOnline: true,
        properties: 1,
        contributions: 25
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        role: 'resident',
        joinDate: '2023-03-20',
        isOnline: false,
        properties: 1,
        contributions: 18
      },
      {
        id: '3',
        name: 'Mike Chen',
        role: 'neighbor',
        joinDate: '2023-02-10',
        isOnline: true,
        properties: 2,
        contributions: 12
      }
    ]

    const mockPosts: CommunityPost[] = [
      {
        id: '1',
        authorId: '1',
        author: mockMembers[0],
        content: 'Great news! The new playground equipment has been installed in the community park. Kids are loving it!',
        type: 'update',
        timestamp: '2024-01-15T10:30:00Z',
        likes: 12,
        comments: [],
        tags: ['community', 'playground', 'update'],
        isPinned: true
      },
      {
        id: '2',
        authorId: '2',
        author: mockMembers[1],
        content: 'Does anyone know a good plumber in the area? My kitchen sink is acting up.',
        type: 'question',
        timestamp: '2024-01-14T15:45:00Z',
        likes: 3,
        comments: [
          {
            id: '1',
            authorId: '3',
            author: mockMembers[2],
            content: 'I recommend ABC Plumbing. They fixed my bathroom last month. Great service!',
            timestamp: '2024-01-14T16:20:00Z',
            likes: 2
          }
        ],
        tags: ['plumber', 'recommendation', 'help'],
        isPinned: false
      }
    ]

    const mockEvents: CommunityEvent[] = [
      {
        id: '1',
        title: 'Community Cleanup Day',
        description: 'Join us for our monthly community cleanup. We\'ll provide supplies and refreshments.',
        date: '2024-02-15',
        time: '9:00 AM',
        location: 'Community Center',
        organizer: mockMembers[0],
        attendees: [mockMembers[0], mockMembers[1]],
        maxAttendees: 20,
        category: 'community'
      },
      {
        id: '2',
        title: 'Neighborhood Watch Meeting',
        description: 'Monthly safety meeting to discuss neighborhood security and recent incidents.',
        date: '2024-02-20',
        time: '7:00 PM',
        location: 'Community Center',
        organizer: mockMembers[2],
        attendees: [mockMembers[2]],
        category: 'safety'
      }
    ]

    const mockNeighbors: NeighborNetwork[] = [
      {
        id: '1',
        name: 'Oak Street Community',
        distance: 0.3,
        relationship: 'friendly',
        lastInteraction: '2024-01-10',
        sharedInterests: ['gardening', 'sustainability'],
        mutualConnections: 5
      },
      {
        id: '2',
        name: 'Maple Avenue Residents',
        distance: 0.8,
        relationship: 'neutral',
        lastInteraction: '2023-12-15',
        sharedInterests: ['sports', 'events'],
        mutualConnections: 2
      }
    ]

    setMembers(mockMembers)
    setPosts(mockPosts)
    setEvents(mockEvents)
    setNeighbors(mockNeighbors)
  }, [property.id])

  const handleCreatePost = () => {
    if (!newPost.trim()) return

    const currentUser = members.find(m => m.id === currentUserId)
    if (!currentUser) return

    const post: CommunityPost = {
      id: Date.now().toString(),
      authorId: currentUserId,
      author: currentUser,
      content: newPost,
      type: 'update',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      tags: [],
      isPinned: false
    }

    setPosts(prev => [post, ...prev])
    setNewPost('')
    setShowCreatePost(false)
  }

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ))
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'update': return '📢'
      case 'question': return '❓'
      case 'announcement': return '📢'
      case 'event': return '📅'
      case 'recommendation': return '💡'
      default: return '📝'
    }
  }

  const getEventIcon = (category: string) => {
    switch (category) {
      case 'social': return '🎉'
      case 'maintenance': return '🔧'
      case 'safety': return '🛡️'
      case 'community': return '🏘️'
      case 'other': return '📅'
      default: return '📅'
    }
  }

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case 'friendly': return 'text-green-600 bg-green-100'
      case 'neutral': return 'text-yellow-600 bg-yellow-100'
      case 'unknown': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏘️ Property Community
        </CardTitle>
        <CardDescription>
          Connect with neighbors and build community around {property.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: 'feed', label: 'Community Feed', icon: '📱' },
            { id: 'neighbors', label: 'Neighbors', icon: '👥' },
            { id: 'events', label: 'Events', icon: '📅' },
            { id: 'directory', label: 'Directory', icon: '📋' }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Community Feed */}
        {activeTab === 'feed' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Community Feed</h3>
              <Button onClick={() => setShowCreatePost(true)}>
                Create Post
              </Button>
            </div>

            {/* Create Post */}
            {showCreatePost && (
              <div className="p-4 border rounded-lg bg-gray-50">
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's happening in your neighborhood?"
                  rows={3}
                />
                <div className="flex gap-2 mt-3">
                  <Button onClick={handleCreatePost} size="sm">
                    Post
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setShowCreatePost(false)
                      setNewPost('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Posts */}
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {post.author.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{post.author.name}</span>
                        <span className="text-sm text-gray-500">
                          {getPostIcon(post.type)} {post.type}
                        </span>
                        {post.isPinned && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                            PINNED
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatTimestamp(post.timestamp)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-gray-800">{post.content}</p>
                    {post.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className="flex items-center gap-1 hover:text-red-500"
                    >
                      <span>👍</span>
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500">
                      <span>💬</span>
                      <span>{post.comments.length}</span>
                    </button>
                    <button className="hover:text-blue-500">Share</button>
                  </div>
                  
                  {/* Comments */}
                  {post.comments.length > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-2 mb-2">
                          <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs">
                            {comment.author.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{comment.author.name}</span>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(comment.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Neighbors */}
        {activeTab === 'neighbors' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Neighbor Network</h3>
            
            <div className="space-y-3">
              {neighbors.map(neighbor => (
                <div key={neighbor.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{neighbor.name}</h4>
                      <p className="text-sm text-gray-600">
                        {neighbor.distance} miles away • {neighbor.mutualConnections} mutual connections
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRelationshipColor(neighbor.relationship)}`}>
                      {neighbor.relationship.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Last interaction: </span>
                      <span className="text-gray-600">{neighbor.lastInteraction}</span>
                    </div>
                    <div>
                      <span className="text-sm font-medium">Shared interests: </span>
                      <div className="flex gap-1 mt-1">
                        {neighbor.sharedInterests.map(interest => (
                          <span
                            key={interest}
                            className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                    <Button variant="outline" size="sm">
                      Message
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {activeTab === 'events' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Community Events</h3>
              <Button onClick={() => setShowCreateEvent(true)}>
                Create Event
              </Button>
            </div>
            
            <div className="space-y-3">
              {events.map(event => (
                <div key={event.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{getEventIcon(event.category)}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <div className="text-gray-600">Date</div>
                      <div className="font-medium">{event.date}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Time</div>
                      <div className="font-medium">{event.time}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Location</div>
                      <div className="font-medium">{event.location}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Attendees</div>
                      <div className="font-medium">
                        {event.attendees.length}
                        {event.maxAttendees && `/${event.maxAttendees}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Organized by {event.organizer.name}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        RSVP
                      </Button>
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Directory */}
        {activeTab === 'directory' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Community Directory</h3>
            
            <div className="space-y-3">
              {members.map(member => (
                <div key={member.id} className="p-4 border rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{member.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.isOnline ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                        }`}>
                          {member.isOnline ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                      <div className="flex gap-4 text-sm text-gray-500 mt-1">
                        <span>Joined {member.joinDate}</span>
                        <span>{member.properties} properties</span>
                        <span>{member.contributions} contributions</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm">
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
