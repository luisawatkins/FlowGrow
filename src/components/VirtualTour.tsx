'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property, PropertyImage } from '@/types'

interface VirtualTourProps {
  property: Property
  className?: string
}

interface TourStep {
  id: string
  title: string
  description: string
  imageUrl: string
  hotspots: Hotspot[]
  audioUrl?: string
}

interface Hotspot {
  id: string
  x: number // Percentage from left
  y: number // Percentage from top
  title: string
  description: string
  type: 'info' | 'navigation' | 'media'
  targetStepId?: string
  mediaUrl?: string
}

export function VirtualTour({ property, className = '' }: VirtualTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHotspots, setShowHotspots] = useState(true)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)
  const [audioProgress, setAudioProgress] = useState(0)
  const [audioDuration, setAudioDuration] = useState(0)
  
  const audioRef = useRef<HTMLAudioElement>(null)
  const tourRef = useRef<HTMLDivElement>(null)

  // Mock tour steps - in a real app, this would come from the property data
  const tourSteps: TourStep[] = [
    {
      id: 'entrance',
      title: 'Property Entrance',
      description: 'Welcome to this beautiful property. Let\'s start our virtual tour.',
      imageUrl: property.images?.[0]?.url || property.imageUrl || '/placeholder-property.jpg',
      hotspots: [
        {
          id: 'entrance-door',
          x: 50,
          y: 60,
          title: 'Main Entrance',
          description: 'Beautiful wooden door with modern hardware',
          type: 'info',
        },
        {
          id: 'entrance-to-living',
          x: 80,
          y: 40,
          title: 'Enter Living Room',
          description: 'Click to enter the living room',
          type: 'navigation',
          targetStepId: 'living-room',
        },
      ],
    },
    {
      id: 'living-room',
      title: 'Living Room',
      description: 'Spacious living room with natural light and modern furnishings.',
      imageUrl: property.images?.[1]?.url || property.imageUrl || '/placeholder-living-room.jpg',
      hotspots: [
        {
          id: 'living-window',
          x: 20,
          y: 30,
          title: 'Large Windows',
          description: 'Floor-to-ceiling windows with city views',
          type: 'info',
        },
        {
          id: 'living-to-kitchen',
          x: 70,
          y: 20,
          title: 'Go to Kitchen',
          description: 'Modern open-concept kitchen',
          type: 'navigation',
          targetStepId: 'kitchen',
        },
        {
          id: 'living-to-bedroom',
          x: 30,
          y: 80,
          title: 'Go to Bedroom',
          description: 'Master bedroom with ensuite',
          type: 'navigation',
          targetStepId: 'bedroom',
        },
      ],
    },
    {
      id: 'kitchen',
      title: 'Kitchen',
      description: 'Modern kitchen with high-end appliances and granite countertops.',
      imageUrl: property.images?.[2]?.url || property.imageUrl || '/placeholder-kitchen.jpg',
      hotspots: [
        {
          id: 'kitchen-island',
          x: 50,
          y: 50,
          title: 'Kitchen Island',
          description: 'Large island with seating for 4',
          type: 'info',
        },
        {
          id: 'kitchen-appliances',
          x: 80,
          y: 30,
          title: 'Appliances',
          description: 'Stainless steel appliances included',
          type: 'info',
        },
      ],
    },
    {
      id: 'bedroom',
      title: 'Master Bedroom',
      description: 'Spacious master bedroom with walk-in closet and ensuite bathroom.',
      imageUrl: property.images?.[3]?.url || property.imageUrl || '/placeholder-bedroom.jpg',
      hotspots: [
        {
          id: 'bedroom-closet',
          x: 20,
          y: 40,
          title: 'Walk-in Closet',
          description: 'Large walk-in closet with custom shelving',
          type: 'info',
        },
        {
          id: 'bedroom-bathroom',
          x: 80,
          y: 60,
          title: 'Ensuite Bathroom',
          description: 'Private bathroom with double vanity',
          type: 'navigation',
          targetStepId: 'bathroom',
        },
      ],
    },
    {
      id: 'bathroom',
      title: 'Master Bathroom',
      description: 'Luxurious master bathroom with double vanity and walk-in shower.',
      imageUrl: property.images?.[4]?.url || property.imageUrl || '/placeholder-bathroom.jpg',
      hotspots: [
        {
          id: 'bathroom-shower',
          x: 30,
          y: 50,
          title: 'Walk-in Shower',
          description: 'Large walk-in shower with rain head',
          type: 'info',
        },
        {
          id: 'bathroom-vanity',
          x: 70,
          y: 30,
          title: 'Double Vanity',
          description: 'His and hers sinks with marble countertop',
          type: 'info',
        },
      ],
    },
  ]

  const currentStepData = tourSteps[currentStep]

  const goToStep = useCallback((stepId: string) => {
    const stepIndex = tourSteps.findIndex(step => step.id === stepId)
    if (stepIndex !== -1) {
      setCurrentStep(stepIndex)
      setSelectedHotspot(null)
    }
  }, [tourSteps])

  const goToNextStep = useCallback(() => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setSelectedHotspot(null)
    }
  }, [currentStep, tourSteps.length])

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
      setSelectedHotspot(null)
    }
  }, [currentStep])

  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    setSelectedHotspot(hotspot)
    
    if (hotspot.type === 'navigation' && hotspot.targetStepId) {
      goToStep(hotspot.targetStepId)
    }
  }, [goToStep])

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev)
  }, [])

  const toggleAudio = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(prev => !prev)
    }
  }, [isPlaying])

  const handleAudioTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setAudioProgress(audioRef.current.currentTime)
      setAudioDuration(audioRef.current.duration)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isFullscreen) return

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault()
        goToPreviousStep()
        break
      case 'ArrowRight':
        e.preventDefault()
        goToNextStep()
        break
      case 'Escape':
        e.preventDefault()
        setIsFullscreen(false)
        break
      case ' ':
        e.preventDefault()
        toggleAudio()
        break
    }
  }, [isFullscreen, goToPreviousStep, goToNextStep, toggleAudio])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Virtual Tour - {property.name}</CardTitle>
              <CardDescription>
                {currentStepData.title} - Step {currentStep + 1} of {tourSteps.length}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
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
                onClick={toggleFullscreen}
              >
                {isFullscreen ? 'Exit' : 'Enter'} Fullscreen
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tour Image */}
          <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-black' : ''}`}>
            <div className={`relative ${isFullscreen ? 'h-full' : 'aspect-video'} bg-gray-100 rounded-lg overflow-hidden`}>
              <img
                src={currentStepData.imageUrl}
                alt={currentStepData.title}
                className="w-full h-full object-cover"
              />

              {/* Hotspots */}
              {showHotspots && currentStepData.hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  className="absolute w-6 h-6 bg-blue-600 rounded-full border-2 border-white shadow-lg hover:bg-blue-700 transition-colors"
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => handleHotspotClick(hotspot)}
                  title={hotspot.title}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </button>
              ))}

              {/* Navigation Arrows */}
              <Button
                variant="outline"
                size="sm"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
              >
                ‹
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={goToNextStep}
                disabled={currentStep === tourSteps.length - 1}
              >
                ›
              </Button>

              {/* Step Counter */}
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded text-sm">
                {currentStep + 1} / {tourSteps.length}
              </div>

              {/* Audio Controls */}
              {currentStepData.audioUrl && (
                <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAudio}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? '⏸️' : '▶️'}
                  </Button>
                  <div className="text-xs mt-1">
                    {formatTime(audioProgress)} / {formatTime(audioDuration)}
                  </div>
                </div>
              )}
            </div>

            {/* Audio Element */}
            {currentStepData.audioUrl && (
              <audio
                ref={audioRef}
                src={currentStepData.audioUrl}
                onTimeUpdate={handleAudioTimeUpdate}
                onLoadedMetadata={handleAudioTimeUpdate}
              />
            )}
          </div>

          {/* Tour Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {tourSteps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={step.title}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextStep}
                disabled={currentStep === tourSteps.length - 1}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Step Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-2">{currentStepData.title}</h3>
              <p className="text-gray-600">{currentStepData.description}</p>
            </div>

            <div>
              <h4 className="font-medium mb-3">Tour Steps</h4>
              <div className="space-y-2">
                {tourSteps.map((step, index) => (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(index)}
                    className={`w-full text-left p-2 rounded transition-colors ${
                      index === currentStep
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium text-sm">{step.title}</div>
                    <div className="text-xs text-gray-500">
                      Step {index + 1}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Hotspot Information */}
          {selectedHotspot && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{selectedHotspot.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{selectedHotspot.description}</p>
                {selectedHotspot.type === 'navigation' && (
                  <Button
                    className="mt-3"
                    onClick={() => selectedHotspot.targetStepId && goToStep(selectedHotspot.targetStepId)}
                  >
                    Go to {selectedHotspot.targetStepId}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tour Controls */}
          <div className="flex items-center justify-center space-x-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              Use arrow keys to navigate • Space to play/pause audio • Esc to exit fullscreen
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
