import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  IconButton,
  Button,
  Text,
  Tooltip,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useToast,
} from '@chakra-ui/react';
import {
  FaPlus,
  FaMinus,
  FaRuler,
  FaExpand,
  FaCompress,
  FaCamera,
  FaUndo,
} from 'react-icons/fa';
import { useFloorPlan } from '@/hooks/useFloorPlan';

interface FloorPlanViewerProps {
  propertyId: string;
}

export const FloorPlanViewer: React.FC<FloorPlanViewerProps> = ({
  propertyId,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [isMeasuring, setIsMeasuring] = useState(false);

  const {
    floorPlan,
    isLoading,
    error,
    captureView,
    resetView,
  } = useFloorPlan(propertyId);

  const toast = useToast();

  useEffect(() => {
    if (!floorPlan || !canvasRef.current) return;

    // In a real application, this would use a proper floor plan
    // rendering library (e.g., SVG.js, Fabric.js, or Three.js)
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Set scale
    ctx.save();
    ctx.scale(scale, scale);

    // Draw floor plan
    // This is a simplified example - in reality, you would:
    // 1. Load and render SVG/DXF floor plan files
    // 2. Handle pan and zoom properly
    // 3. Implement proper measuring tools
    // 4. Support multiple floors
    // 5. Show room labels and dimensions
    // 6. Handle different view modes (2D/3D)

    // Example: Draw a simple rectangle for demonstration
    ctx.beginPath();
    ctx.strokeStyle = '#2B6CB0';
    ctx.lineWidth = 2;
    ctx.rect(50, 50, 300, 200);
    ctx.stroke();

    // Draw some room divisions
    ctx.beginPath();
    ctx.moveTo(200, 50);
    ctx.lineTo(200, 250);
    ctx.moveTo(50, 150);
    ctx.lineTo(350, 150);
    ctx.stroke();

    // Add room labels
    ctx.font = '14px Arial';
    ctx.fillStyle = '#2D3748';
    ctx.fillText('Living Room', 80, 110);
    ctx.fillText('Kitchen', 250, 110);
    ctx.fillText('Bedroom', 80, 210);
    ctx.fillText('Bathroom', 250, 210);

    // If measuring mode is active, draw measurement overlay
    if (isMeasuring) {
      ctx.strokeStyle = '#48BB78';
      ctx.setLineDash([5, 5]);
      // Draw measurement guide lines...
    }

    ctx.restore();
  }, [floorPlan, scale, isMeasuring]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleCapture = async () => {
    try {
      const imageUrl = await captureView();
      // In a real application, this would:
      // 1. Generate a high-quality image of the current view
      // 2. Allow downloading or sharing
      toast({
        title: 'View captured',
        description: 'Floor plan view has been saved.',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to capture view',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Box
        height="600px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.100"
        borderRadius="lg"
      >
        <Text>Loading floor plan...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        height="600px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="red.50"
        borderRadius="lg"
      >
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch" ref={containerRef}>
      <HStack justify="space-between">
        <Select
          value={selectedFloor}
          onChange={(e) => setSelectedFloor(e.target.value)}
          placeholder="Select floor"
          maxW="200px"
        >
          {floorPlan?.floors.map((floor) => (
            <option key={floor.id} value={floor.id}>
              {floor.name}
            </option>
          ))}
        </Select>

        <HStack>
          <Tooltip label="Zoom out">
            <IconButton
              aria-label="Zoom out"
              icon={<FaMinus />}
              onClick={handleZoomOut}
              isDisabled={scale <= 0.5}
            />
          </Tooltip>
          
          <Slider
            value={scale}
            min={0.5}
            max={3}
            step={0.1}
            onChange={setScale}
            w="100px"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
          
          <Tooltip label="Zoom in">
            <IconButton
              aria-label="Zoom in"
              icon={<FaPlus />}
              onClick={handleZoomIn}
              isDisabled={scale >= 3}
            />
          </Tooltip>

          <Tooltip label="Toggle measurement tool">
            <IconButton
              aria-label="Toggle measurement tool"
              icon={<FaRuler />}
              onClick={() => setIsMeasuring(!isMeasuring)}
              colorScheme={isMeasuring ? 'green' : 'gray'}
            />
          </Tooltip>

          <Tooltip label="Capture view">
            <IconButton
              aria-label="Capture view"
              icon={<FaCamera />}
              onClick={handleCapture}
            />
          </Tooltip>

          <Tooltip label="Reset view">
            <IconButton
              aria-label="Reset view"
              icon={<FaUndo />}
              onClick={() => {
                setScale(1);
                resetView();
              }}
            />
          </Tooltip>

          <Tooltip label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
            <IconButton
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              icon={isFullscreen ? <FaCompress /> : <FaExpand />}
              onClick={handleToggleFullscreen}
            />
          </Tooltip>
        </HStack>
      </HStack>

      <Box
        position="relative"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg="white"
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          style={{
            width: '100%',
            height: '100%',
            cursor: isMeasuring ? 'crosshair' : 'grab',
          }}
        />

        {isMeasuring && (
          <Text
            position="absolute"
            bottom={4}
            left={4}
            bg="green.100"
            color="green.700"
            px={3}
            py={1}
            borderRadius="md"
            fontSize="sm"
          >
            Click and drag to measure
          </Text>
        )}
      </Box>
    </VStack>
  );
};
