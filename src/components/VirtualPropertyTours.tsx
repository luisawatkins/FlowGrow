'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'

interface VirtualPropertyToursProps {
  property: Property
  onTourComplete: (tourData: TourData) => void
  className?: string
}

interface TourData {
  id: string
  propertyId: string
  tourType: TourType
  duration: number
  views: number
  completionRate: number
  hotspots: Hotspot[]
  path: TourPath[]
  metadata: TourMetadata
  createdAt: string
  updatedAt: string
}

interface Hotspot {
  id: string
  position: { x: number; y: number; z: number }
  type: HotspotType
  title: string
  description: string
  mediaUrl?: string
  action?: HotspotAction
  isInteractive: boolean
}

interface TourPath {
  id: string
  from: { x: number; y: number; z: number }
  to: { x: number; y: number; z: number }
  duration: number
  transition: TransitionType
}

interface TourMetadata {
  totalRooms: number
  totalArea: number
  highlights: string[]
  accessibility: AccessibilityInfo
  features: string[]
}

interface AccessibilityInfo {
  wheelchairAccessible: boolean
  elevatorAccess: boolean
  accessibleBathrooms: number
  accessibleParking: boolean
  notes: string[]
}

type TourType = 'virtual' | '360' | 'video' | 'interactive' | 'ar'
type HotspotType = 'info' | 'media' | 'navigation' | 'feature' | 'measurement' | 'comparison'
type HotspotAction = 'navigate' | 'show-info' | 'play-media' | 'measure' | 'compare'
type TransitionType = 'fade' | 'slide' | 'zoom' | 'rotate' | 'instant'

export function VirtualPropertyTours({
  property,
  onTourComplete,
  className = ''
}: VirtualPropertyToursProps) {
  const [tours, setTours] = useState<TourData[]>([])
  const [activeTour, setActiveTour] = useState<TourData | null>(null)
  const [currentView, setCurrentView] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHotspots, setShowHotspots] = useState(true)
  const [tourMode, setTourMode] = useState<'view' | 'create' | 'edit'>('view')
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Mock tour data
  useEffect(() => {
    const mockTours: TourData[] = [
      {
        id: '1',
        propertyId: property.id,
        tourType: 'virtual',
        duration: 180, // 3 minutes
        views: 45,
        completionRate: 0.78,
        hotspots: [
          {
            id: '1',
            position: { x: 0, y: 0, z: 0 },
            type: 'info',
            title: 'Living Room',
            description: 'Spacious living room with natural light and modern finishes',
            isInteractive: true,
            action: 'show-info'
          },
          {
            id: '2',
            position: { x: 5, y: 0, z: 0 },
            type: 'media',
            title: 'Kitchen Tour',
            description: 'Take a closer look at the modern kitchen',
            mediaUrl: '/tours/kitchen-360.jpg',
            isInteractive: true,
            action: 'play-media'
          },
          {
            id: '3',
            position: { x: 10, y: 0, z: 0 },
            type: 'navigation',
            title: 'Go to Bedroom',
            description: 'Navigate to the master bedroom',
            isInteractive: true,
            action: 'navigate'
          }
        ],
        path: [
          {
            id: '1',
            from: { x: 0, y: 0, z: 0 },
            to: { x: 5, y: 0, z: 0 },
            duration: 2000,
            transition: 'fade'
          },
          {
            id: '2',
            from: { x: 5, y: 0, z: 0 },
            to: { x: 10, y: 0, z: 0 },
            duration: 2000,
            transition: 'slide'
          }
        ],
        metadata: {
          totalRooms: 5,
          totalArea: 1500,
          highlights: ['Modern kitchen', 'Master suite', 'Private garden'],
          accessibility: {
            wheelchairAccessible: true,
            elevatorAccess: false,
            accessibleBathrooms: 1,
            accessibleParking: true,
            notes: ['Ground floor access', 'Wide doorways']
          },
          features: ['360° views', 'Interactive hotspots', 'Audio narration']
        },
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15'
      },
      {
        id: '2',
        propertyId: property.id,
        tourType: '360',
        duration: 120,
        views: 32,
        completionRate: 0.85,
        hotspots: [],
        path: [],
        metadata: {
          totalRooms: 5,
          totalArea: 1500,
          highlights: ['360° panoramic views', 'High-resolution imagery'],
          accessibility: {
            wheelchairAccessible: true,
            elevatorAccess: false,
            accessibleBathrooms: 1,
            accessibleParking: true,
            notes: []
          },
          features: ['360° photography', 'VR compatibility']
        },
        createdAt: '2024-01-10',
        updatedAt: '2024-01-10'
      }
    ]

    setTours(mockTours)
    if (mockTours.length > 0) {
      setActiveTour(mockTours[0])
    }
  }, [property.id])

  const handleStartTour = (tour: TourData) => {
    setActiveTour(tour)
    setCurrentView(0)
    setIsPlaying(true)
    onTourComplete(tour)
  }

  const handleNextView = () => {
    if (activeTour && currentView < activeTour.path.length) {
      setCurrentView(prev => prev + 1)
    }
  }

  const handlePreviousView = () => {
    if (currentView > 0) {
      setCurrentView(prev => prev - 1)
    }
  }

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot)
    
    switch (hotspot.action) {
      case 'navigate':
        // Navigate to specific location
        break
      case 'show-info':
        // Show information modal
        break
      case 'play-media':
        // Play media content
        break
      case 'measure':
        // Open measurement tool
        break
      case 'compare':
        // Open comparison tool
        break
    }
  }

  const getTourIcon = (type: TourType) => {
    switch (type) {
      case 'virtual': return '🏠'
      case '360': return '🌐'
      case 'video': return '🎥'
      case 'interactive': return '🎮'
      case 'ar': return '📱'
      default: return '🏠'
    }
  }

  const getHotspotIcon = (type: HotspotType) => {
    switch (type) {
      case 'info': return 'ℹ️'
      case 'media': return '🎬'
      case 'navigation': return '🧭'
      case 'feature': return '⭐'
      case 'measurement': return '📏'
      case 'comparison': return '⚖️'
      default: return '📍'
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏠 Virtual Property Tours
        </CardTitle>
        <CardDescription>
          Experience {property.name} through immersive virtual tours and 360° views
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Tour Selection */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Available Tours</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTourMode('create')}
              >
                Create Tour
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTourMode('edit')}
              >
                Edit Tour
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tours.map(tour => (
              <div
                key={tour.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  activeTour?.id === tour.id ? 'border-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveTour(tour)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl">{getTourIcon(tour.tourType)}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold capitalize">
                      {tour.tourType} Tour
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDuration(tour.duration)} • {tour.views} views
                    </p>
                    <p className="text-sm text-gray-500">
                      {Math.round(tour.completionRate * 100)}% completion rate
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {tour.hotspots.length} hotspots • {tour.metadata.totalRooms} rooms
                  </div>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleStartTour(tour)
                    }}
                  >
                    Start Tour
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Tour Viewer */}
        {activeTour && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {getTourIcon(activeTour.tourType)} {activeTour.tourType} Tour
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowHotspots(!showHotspots)}
                >
                  {showHotspots ? 'Hide' : 'Show'} Hotspots
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? '⏸️' : '▶️'} {isPlaying ? 'Pause' : 'Play'}
                </Button>
              </div>
            </div>

            {/* Tour Canvas/Viewer */}
            <div className="relative bg-gray-100 rounded-lg h-96 overflow-hidden">
              <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)' }}
              />
              
              {/* Hotspots Overlay */}
              {showHotspots && activeTour.hotspots.map(hotspot => (
                <button
                  key={hotspot.id}
                  className="absolute w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-blue-600 transition-colors"
                  style={{
                    left: `${hotspot.position.x * 10}%`,
                    top: `${hotspot.position.y * 10}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => handleHotspotClick(hotspot)}
                  title={hotspot.title}
                >
                  {getHotspotIcon(hotspot.type)}
                </button>
              ))}

              {/* Tour Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-white/90 rounded-lg px-4 py-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousView}
                  disabled={currentView === 0}
                >
                  ⬅️
                </Button>
                <span className="text-sm font-medium">
                  {currentView + 1} / {activeTour.path.length + 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextView}
                  disabled={currentView >= activeTour.path.length}
                >
                  ➡️
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{
                    width: `${((currentView + 1) / (activeTour.path.length + 1)) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Tour Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600 font-medium">Duration</div>
                <div className="text-lg font-bold text-blue-800">
                  {formatDuration(activeTour.duration)}
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600 font-medium">Views</div>
                <div className="text-lg font-bold text-green-800">
                  {activeTour.views}
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600 font-medium">Completion Rate</div>
                <div className="text-lg font-bold text-purple-800">
                  {Math.round(activeTour.completionRate * 100)}%
                </div>
              </div>
            </div>

            {/* Tour Highlights */}
            <div>
              <h4 className="font-semibold mb-2">Tour Highlights</h4>
              <div className="flex flex-wrap gap-2">
                {activeTour.metadata.highlights.map((highlight, index) => (
                  <span
                    key={index}
                    className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>

            {/* Accessibility Information */}
            <div>
              <h4 className="font-semibold mb-2">Accessibility Features</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span>{activeTour.metadata.accessibility.wheelchairAccessible ? '✅' : '❌'}</span>
                  <span>Wheelchair Accessible</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{activeTour.metadata.accessibility.elevatorAccess ? '✅' : '❌'}</span>
                  <span>Elevator Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🚽</span>
                  <span>{activeTour.metadata.accessibility.accessibleBathrooms} Accessible Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{activeTour.metadata.accessibility.accessibleParking ? '✅' : '❌'}</span>
                  <span>Accessible Parking</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hotspot Detail Modal */}
        {selectedHotspot && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {getHotspotIcon(selectedHotspot.type)} {selectedHotspot.title}
              </h3>
              <p className="text-gray-600 mb-4">{selectedHotspot.description}</p>
              
              {selectedHotspot.mediaUrl && (
                <div className="mb-4">
                  <img
                    src={selectedHotspot.mediaUrl}
                    alt={selectedHotspot.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedHotspot(null)}
                  className="flex-1"
                >
                  Close
                </Button>
                {selectedHotspot.isInteractive && (
                  <Button className="flex-1">
                    Interact
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create Tour Modal */}
        {tourMode === 'create' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Create New Tour</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create a new virtual tour for {property.name}
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tour Type
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-md">
                    <option value="virtual">Virtual Tour</option>
                    <option value="360">360° Tour</option>
                    <option value="video">Video Tour</option>
                    <option value="interactive">Interactive Tour</option>
                    <option value="ar">AR Tour</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tour Name
                  </label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    placeholder="Enter tour name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Enter tour description"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setTourMode('view')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button className="flex-1">
                  Create Tour
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
