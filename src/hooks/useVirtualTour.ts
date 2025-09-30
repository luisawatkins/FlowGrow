import { useState, useEffect, useCallback } from 'react';

interface Scene {
  id: string;
  name: string;
  thumbnail: string;
  panoramaUrl: string;
  initialViewParameters?: {
    pitch: number;
    yaw: number;
    zoom: number;
  };
  hotspots?: Array<{
    id: string;
    type: 'scene' | 'info';
    pitch: number;
    yaw: number;
    targetSceneId?: string;
    title?: string;
    description?: string;
  }>;
}

interface Tour {
  id: string;
  title: string;
  scenes: Scene[];
  currentScene?: Scene;
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

export function useVirtualTour(tourId: string, initialSceneId?: string) {
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const fetchTour = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/virtual-tours/${tourId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch virtual tour');
      }

      const data = await response.json();
      
      // Set initial scene
      const initialScene = initialSceneId
        ? data.scenes.find((s: Scene) => s.id === initialSceneId)
        : data.scenes[0];

      setTour({
        ...data,
        currentScene: initialScene,
      });
    } catch (error) {
      console.error('Error fetching virtual tour:', error);
      setError('Failed to load virtual tour');
    } finally {
      setIsLoading(false);
    }
  }, [tourId, initialSceneId]);

  useEffect(() => {
    fetchTour();
  }, [fetchTour]);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
    // In a real application, this would control the auto-rotation
    // of the panorama viewer
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    // In a real application, this would control the background
    // music or ambient sounds
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const switchScene = async (sceneId: string) => {
    if (!tour) return;

    try {
      const scene = tour.scenes.find(s => s.id === sceneId);
      if (!scene) throw new Error('Scene not found');

      // In a real application, you would:
      // 1. Load the new panorama
      // 2. Apply transition effects
      // 3. Update view parameters
      // 4. Handle loading states

      setTour(prev => prev ? {
        ...prev,
        currentScene: scene,
      } : null);
    } catch (error) {
      console.error('Error switching scene:', error);
      // Handle error appropriately
    }
  };

  return {
    tour,
    isLoading,
    error,
    isPlaying,
    isMuted,
    isFullscreen,
    togglePlay,
    toggleMute,
    toggleFullscreen,
    switchScene,
  };
}
