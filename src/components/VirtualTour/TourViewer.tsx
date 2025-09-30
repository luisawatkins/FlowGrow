import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  IconButton,
  Tooltip,
  VStack,
  HStack,
  Text,
  useToast,
  Spinner,
  Badge,
} from '@chakra-ui/react';
import {
  FaCompass,
  FaExpand,
  FaCompress,
  FaInfoCircle,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface TourViewerProps {
  tourId: string;
}

interface Hotspot {
  id: string;
  position: { x: number; y: number; z: number };
  tooltip: string;
  type: 'info' | 'navigation';
  targetSceneId?: string;
}

interface Scene {
  id: string;
  name: string;
  imageUrl: string;
  hotspots: Hotspot[];
}

interface VirtualTour {
  id: string;
  title: string;
  description: string;
  scenes: Scene[];
  defaultSceneId: string;
}

export const TourViewer: React.FC<TourViewerProps> = ({ tourId }) => {
  const toast = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const [tour, setTour] = useState<VirtualTour | null>(null);
  const [currentSceneId, setCurrentSceneId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/virtual-tours/${tourId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch virtual tour');
        }

        const data = await response.json();
        setTour(data);
        setCurrentSceneId(data.defaultSceneId);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load virtual tour',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTour();
  }, [tourId, toast]);

  useEffect(() => {
    if (!containerRef.current || !tour || !currentSceneId) return;

    // Initialize Three.js scene
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Create scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);
    cameraRef.current = camera;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = -0.5;
    controlsRef.current = controls;

    // Load panorama texture
    const currentScene = tour.scenes.find((s) => s.id === currentSceneId);
    if (currentScene) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        currentScene.imageUrl,
        (texture) => {
          const geometry = new THREE.SphereGeometry(500, 60, 40);
          geometry.scale(-1, 1, 1);

          const material = new THREE.MeshBasicMaterial({
            map: texture,
          });

          const sphere = new THREE.Mesh(geometry, material);
          scene.add(sphere);

          // Add hotspots
          currentScene.hotspots.forEach((hotspot) => {
            const sprite = new THREE.Sprite(
              new THREE.SpriteMaterial({
                map: textureLoader.load(
                  hotspot.type === 'navigation'
                    ? '/icons/navigation-hotspot.png'
                    : '/icons/info-hotspot.png'
                ),
              })
            );

            sprite.position.set(
              hotspot.position.x * 10,
              hotspot.position.y * 10,
              hotspot.position.z * 10
            );
            sprite.scale.set(1, 1, 1);
            sprite.userData = hotspot;
            scene.add(sprite);
          });
        },
        undefined,
        (error) => {
          console.error('Error loading panorama:', error);
          toast({
            title: 'Error',
            description: 'Failed to load panorama image',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      );
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Handle click events
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object instanceof THREE.Sprite && object.userData) {
          const hotspot = object.userData as Hotspot;
          if (hotspot.type === 'navigation' && hotspot.targetSceneId) {
            setCurrentSceneId(hotspot.targetSceneId);
          } else if (hotspot.type === 'info') {
            toast({
              title: 'Info',
              description: hotspot.tooltip,
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
          }
        }
      }
    };
    container.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('click', handleClick);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [tour, currentSceneId, toast]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (isLoading) {
    return (
      <Box
        height="600px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!tour) {
    return (
      <Box
        height="600px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>Virtual tour not found</Text>
      </Box>
    );
  }

  const currentScene = tour.scenes.find((s) => s.id === currentSceneId);

  return (
    <Box position="relative">
      <Box
        ref={containerRef}
        height="600px"
        borderRadius="lg"
        overflow="hidden"
        position="relative"
      >
        {/* Controls overlay */}
        <VStack
          position="absolute"
          top={4}
          right={4}
          spacing={2}
          zIndex={1}
        >
          <Tooltip label="Toggle fullscreen">
            <IconButton
              aria-label="Toggle fullscreen"
              icon={isFullscreen ? <FaCompress /> : <FaExpand />}
              onClick={toggleFullscreen}
              colorScheme="blackAlpha"
            />
          </Tooltip>
          <Tooltip label="Reset view">
            <IconButton
              aria-label="Reset view"
              icon={<FaCompass />}
              onClick={() => controlsRef.current?.reset()}
              colorScheme="blackAlpha"
            />
          </Tooltip>
        </VStack>

        {/* Scene navigation */}
        <HStack
          position="absolute"
          bottom={4}
          left="50%"
          transform="translateX(-50%)"
          spacing={2}
          zIndex={1}
        >
          {tour.scenes.map((scene) => (
            <Button
              key={scene.id}
              size="sm"
              colorScheme={scene.id === currentSceneId ? 'blue' : 'blackAlpha'}
              leftIcon={<FaMapMarkerAlt />}
              onClick={() => setCurrentSceneId(scene.id)}
            >
              {scene.name}
            </Button>
          ))}
        </HStack>

        {/* Scene info */}
        <Box
          position="absolute"
          top={4}
          left={4}
          zIndex={1}
          bg="blackAlpha.700"
          p={2}
          borderRadius="md"
          color="white"
        >
          <Text fontWeight="bold">{currentScene?.name}</Text>
          <HStack mt={1}>
            <Badge colorScheme="blue">
              {currentScene?.hotspots.filter((h) => h.type === 'navigation').length} Connections
            </Badge>
            <Badge colorScheme="green">
              {currentScene?.hotspots.filter((h) => h.type === 'info').length} Info Points
            </Badge>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
};