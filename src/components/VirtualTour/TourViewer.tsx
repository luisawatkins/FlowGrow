import React, { useEffect, useRef } from 'react';
import {
  Box,
  AspectRatio,
  Spinner,
  Text,
  VStack,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaCompress,
  FaExpand,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaVolumeMute,
} from 'react-icons/fa';
import { useVirtualTour } from '@/hooks/useVirtualTour';

interface TourViewerProps {
  tourId: string;
  initialScene?: string;
}

export const TourViewer: React.FC<TourViewerProps> = ({
  tourId,
  initialScene,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    isLoading,
    error,
    tour,
    isPlaying,
    isMuted,
    isFullscreen,
    togglePlay,
    toggleMute,
    toggleFullscreen,
  } = useVirtualTour(tourId, initialScene);

  useEffect(() => {
    if (!tour) return;

    // In a real application, this is where you would initialize
    // your 360° viewer library (e.g., Marzipano, Pannellum, etc.)
    // with the tour data
  }, [tour]);

  if (error) {
    return (
      <VStack
        justify="center"
        align="center"
        h="400px"
        bg="gray.100"
        borderRadius="lg"
      >
        <Text color="red.500">{error}</Text>
      </VStack>
    );
  }

  if (isLoading) {
    return (
      <VStack
        justify="center"
        align="center"
        h="400px"
        bg="gray.100"
        borderRadius="lg"
      >
        <Spinner size="xl" color="blue.500" />
        <Text>Loading virtual tour...</Text>
      </VStack>
    );
  }

  return (
    <Box position="relative" ref={containerRef}>
      <AspectRatio ratio={16 / 9}>
        <Box
          bg="gray.900"
          borderRadius="lg"
          overflow="hidden"
          position="relative"
        >
          {/* This is where your 360° viewer would be rendered */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            p={4}
            bg="blackAlpha.700"
            color="white"
          >
            <HStack justify="space-between">
              <HStack spacing={2}>
                <Tooltip label={isPlaying ? 'Pause' : 'Play'}>
                  <IconButton
                    aria-label={isPlaying ? 'Pause tour' : 'Play tour'}
                    icon={isPlaying ? <FaPause /> : <FaPlay />}
                    variant="ghost"
                    color="white"
                    onClick={togglePlay}
                  />
                </Tooltip>
                <Tooltip label={isMuted ? 'Unmute' : 'Mute'}>
                  <IconButton
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                    icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                    variant="ghost"
                    color="white"
                    onClick={toggleMute}
                  />
                </Tooltip>
              </HStack>

              <Text>{tour?.currentScene?.name || 'Virtual Tour'}</Text>

              <Tooltip label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
                <IconButton
                  aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  icon={isFullscreen ? <FaCompress /> : <FaExpand />}
                  variant="ghost"
                  color="white"
                  onClick={toggleFullscreen}
                />
              </Tooltip>
            </HStack>
          </Box>
        </Box>
      </AspectRatio>

      {tour?.scenes && tour.scenes.length > 1 && (
        <HStack
          mt={4}
          spacing={4}
          overflowX="auto"
          pb={2}
          sx={{
            '&::-webkit-scrollbar': {
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              bg: 'gray.100',
              borderRadius: 'full',
            },
            '&::-webkit-scrollbar-thumb': {
              bg: 'gray.400',
              borderRadius: 'full',
            },
          }}
        >
          {tour.scenes.map((scene) => (
            <Box
              key={scene.id}
              cursor="pointer"
              onClick={() => {
                // In a real application, this would switch to the selected scene
                console.log('Switch to scene:', scene.id);
              }}
              position="relative"
              minW="200px"
            >
              <AspectRatio ratio={16 / 9}>
                <Box
                  borderRadius="md"
                  overflow="hidden"
                  borderWidth="2px"
                  borderColor={
                    tour.currentScene?.id === scene.id
                      ? 'blue.500'
                      : 'transparent'
                  }
                >
                  <Image
                    src={scene.thumbnail}
                    alt={scene.name}
                    objectFit="cover"
                  />
                </Box>
              </AspectRatio>
              <Text
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                p={2}
                bg="blackAlpha.700"
                color="white"
                fontSize="sm"
                noOfLines={1}
              >
                {scene.name}
              </Text>
            </Box>
          ))}
        </HStack>
      )}
    </Box>
  );
};
