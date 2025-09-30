import { useState, useEffect, useCallback } from 'react';

interface Floor {
  id: string;
  name: string;
  level: number;
  imageUrl: string;
  dimensions: {
    width: number;
    height: number;
    unit: 'meters' | 'feet';
  };
  rooms: Array<{
    id: string;
    name: string;
    type: string;
    area: number;
    coordinates: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }>;
}

interface FloorPlan {
  id: string;
  propertyId: string;
  floors: Floor[];
  scale: number;
  unit: 'meters' | 'feet';
  createdAt: string;
  updatedAt: string;
}

export function useFloorPlan(propertyId: string) {
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewState, setViewState] = useState({
    scale: 1,
    panX: 0,
    panY: 0,
    selectedFloorId: '',
  });

  const fetchFloorPlan = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/floor-plans/${propertyId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch floor plan');
      }

      const data = await response.json();
      setFloorPlan(data);
      
      if (data.floors.length > 0) {
        setViewState(prev => ({
          ...prev,
          selectedFloorId: data.floors[0].id,
        }));
      }
    } catch (error) {
      console.error('Error fetching floor plan:', error);
      setError('Failed to load floor plan');
    } finally {
      setIsLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchFloorPlan();
  }, [fetchFloorPlan]);

  const updateView = (updates: Partial<typeof viewState>) => {
    setViewState(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const resetView = () => {
    setViewState({
      scale: 1,
      panX: 0,
      panY: 0,
      selectedFloorId: floorPlan?.floors[0]?.id || '',
    });
  };

  const captureView = async () => {
    try {
      const response = await fetch(`/api/floor-plans/${propertyId}/capture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(viewState),
      });

      if (!response.ok) {
        throw new Error('Failed to capture view');
      }

      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      console.error('Error capturing view:', error);
      throw error;
    }
  };

  const getMeasurements = (start: { x: number; y: number }, end: { x: number; y: number }) => {
    if (!floorPlan) return null;

    const pixelsToUnit = (pixels: number) => {
      return (pixels * floorPlan.scale) / viewState.scale;
    };

    const width = Math.abs(end.x - start.x);
    const height = Math.abs(end.y - start.y);

    return {
      width: pixelsToUnit(width),
      height: pixelsToUnit(height),
      diagonal: pixelsToUnit(Math.sqrt(width * width + height * height)),
      unit: floorPlan.unit,
    };
  };

  return {
    floorPlan,
    isLoading,
    error,
    viewState,
    updateView,
    resetView,
    captureView,
    getMeasurements,
  };
}
