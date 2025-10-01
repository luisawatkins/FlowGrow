import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Image,
  Button,
  IconButton,
  Text,
  Badge,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
} from '@chakra-ui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ViewIcon,
  DownloadIcon,
  EditIcon,
  DeleteIcon,
  StarIcon,
  StarOutlineIcon,
  ZoomIcon,
  ExternalLinkIcon,
} from '@chakra-ui/icons';
import { PropertyImage, ImageViewerSettings } from '@/types/gallery';
import { useEnhancedGallery } from '@/hooks/useEnhancedGallery';

interface EnhancedImageGalleryProps {
  images: PropertyImage[];
  propertyId: string;
  isEditable?: boolean;
  settings?: Partial<ImageViewerSettings>;
  onImageUpdate?: (image: PropertyImage) => void;
  onImageDelete?: (imageId: string) => void;
  className?: string;
}

export const EnhancedImageGallery: React.FC<EnhancedImageGalleryProps> = ({
  images,
  propertyId,
  isEditable = false,
  settings = {},
  onImageUpdate,
  onImageDelete,
  className = '',
}) => {
  const { updateImage, deleteImage, isLoading } = useEnhancedGallery();
  const toast = useToast();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editingImage, setEditingImage] = useState<PropertyImage | null>(null);
  const [editForm, setEditForm] = useState({
    caption: '',
    tags: '',
    isPrimary: false,
  });

  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const defaultSettings: ImageViewerSettings = {
    showThumbnails: true,
    showCaptions: true,
    autoPlay: false,
    autoPlayInterval: 5000,
    showFullscreen: true,
    showZoom: true,
    showSlideshow: true,
    transitionEffect: 'fade',
    ...settings,
  };

  const currentImage = images[currentIndex];

  // Auto-play functionality
  useEffect(() => {
    if (isSlideshow && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, defaultSettings.autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isSlideshow, defaultSettings.autoPlayInterval, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToNext();
          break;
        case 'Escape':
          event.preventDefault();
          setIsFullscreen(false);
          break;
        case ' ':
          event.preventDefault();
          toggleSlideshow();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const toggleSlideshow = useCallback(() => {
    setIsSlideshow(prev => !prev);
  }, []);

  const handleImageClick = useCallback(() => {
    if (defaultSettings.showFullscreen) {
      setIsFullscreen(true);
    }
  }, [defaultSettings.showFullscreen]);

  const handleEditImage = useCallback((image: PropertyImage) => {
    setEditingImage(image);
    setEditForm({
      caption: image.caption || '',
      tags: image.tags?.join(', ') || '',
      isPrimary: image.isPrimary || false,
    });
    onEditOpen();
  }, [onEditOpen]);

  const handleSaveEdit = useCallback(async () => {
    if (!editingImage) return;

    try {
      const updatedImage = await updateImage(editingImage.id, {
        caption: editForm.caption,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        isPrimary: editForm.isPrimary,
      });

      if (updatedImage) {
        onImageUpdate?.(updatedImage);
        toast({
          title: 'Image updated',
          description: 'Image details have been updated successfully.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Error updating image',
        description: 'Failed to update image details.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onEditClose();
    }
  }, [editingImage, editForm, updateImage, onImageUpdate, toast, onEditClose]);

  const handleDeleteImage = useCallback(async (imageId: string) => {
    try {
      await deleteImage(imageId);
      onImageDelete?.(imageId);
      toast({
        title: 'Image deleted',
        description: 'Image has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting image',
        description: 'Failed to delete image.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [deleteImage, onImageDelete, toast]);

  const handleDownload = useCallback(() => {
    if (currentImage) {
      const link = document.createElement('a');
      link.href = currentImage.url;
      link.download = currentImage.alt || `image-${currentImage.id}`;
      link.click();
    }
  }, [currentImage]);

  const handleZoomChange = useCallback((value: number) => {
    setZoomLevel(value);
  }, []);

  if (images.length === 0) {
    return (
      <Alert status="info">
        <AlertIcon />
        <AlertTitle>No images available</AlertTitle>
        <AlertDescription>This property doesn't have any images yet.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box className={className} ref={galleryRef}>
      {/* Main Image Display */}
      <Box position="relative" mb={4}>
        <Box
          position="relative"
          aspectRatio="16/9"
          bg="gray.100"
          borderRadius="md"
          overflow="hidden"
          cursor={defaultSettings.showFullscreen ? 'pointer' : 'default'}
          onClick={handleImageClick}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt || `Property image ${currentIndex + 1}`}
            width="100%"
            height="100%"
            objectFit="cover"
            transform={`scale(${zoomLevel})`}
            transition="transform 0.3s ease"
          />

          {/* Image Overlay Controls */}
          <Box
            position="absolute"
            top={4}
            right={4}
            display="flex"
            gap={2}
            opacity={0}
            _groupHover={{ opacity: 1 }}
            transition="opacity 0.3s ease"
          >
            {defaultSettings.showZoom && (
              <Tooltip label="Zoom">
                <IconButton
                  aria-label="Zoom"
                  icon={<ZoomIcon />}
                  size="sm"
                  variant="solid"
                  bg="white"
                  color="gray.700"
                  _hover={{ bg: 'gray.100' }}
                />
              </Tooltip>
            )}
            <Tooltip label="Download">
              <IconButton
                aria-label="Download"
                icon={<DownloadIcon />}
                size="sm"
                variant="solid"
                bg="white"
                color="gray.700"
                _hover={{ bg: 'gray.100' }}
                onClick={handleDownload}
              />
            </Tooltip>
            {isEditable && (
              <Tooltip label="Edit">
                <IconButton
                  aria-label="Edit"
                  icon={<EditIcon />}
                  size="sm"
                  variant="solid"
                  bg="white"
                  color="gray.700"
                  _hover={{ bg: 'gray.100' }}
                  onClick={() => handleEditImage(currentImage)}
                />
              </Tooltip>
            )}
          </Box>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <IconButton
                aria-label="Previous image"
                icon={<ChevronLeftIcon />}
                position="absolute"
                left={4}
                top="50%"
                transform="translateY(-50%)"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                variant="solid"
                bg="white"
                color="gray.700"
                _hover={{ bg: 'gray.100' }}
              />
              <IconButton
                aria-label="Next image"
                icon={<ChevronRightIcon />}
                position="absolute"
                right={4}
                top="50%"
                transform="translateY(-50%)"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                variant="solid"
                bg="white"
                color="gray.700"
                _hover={{ bg: 'gray.100' }}
              />
            </>
          )}

          {/* Image Counter */}
          <Box
            position="absolute"
            bottom={4}
            left="50%"
            transform="translateX(-50%)"
            bg="blackAlpha.700"
            color="white"
            px={3}
            py={1}
            borderRadius="full"
            fontSize="sm"
          >
            {currentIndex + 1} / {images.length}
          </Box>
        </Box>

        {/* Zoom Control */}
        {defaultSettings.showZoom && (
          <Box mt={4}>
            <FormControl>
              <FormLabel fontSize="sm">Zoom Level</FormLabel>
              <Slider
                value={zoomLevel}
                onChange={handleZoomChange}
                min={0.5}
                max={3}
                step={0.1}
                colorScheme="blue"
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
              <Text fontSize="xs" color="gray.600" textAlign="center">
                {Math.round(zoomLevel * 100)}%
              </Text>
            </FormControl>
          </Box>
        )}

        {/* Image Caption */}
        {defaultSettings.showCaptions && currentImage.caption && (
          <Box mt={4} p={4} bg="gray.50" borderRadius="md">
            <Text fontSize="sm" color="gray.700">
              {currentImage.caption}
            </Text>
          </Box>
        )}
      </Box>

      {/* Thumbnail Navigation */}
      {defaultSettings.showThumbnails && images.length > 1 && (
        <Box>
          <HStack spacing={2} overflowX="auto" pb={2}>
            {images.map((image, index) => (
              <Box
                key={image.id}
                position="relative"
                minW="80px"
                h="60px"
                borderRadius="md"
                overflow="hidden"
                cursor="pointer"
                border={index === currentIndex ? '2px solid' : '2px solid transparent'}
                borderColor={index === currentIndex ? 'blue.500' : 'transparent'}
                onClick={() => goToImage(index)}
                _hover={{ opacity: 0.8 }}
                transition="all 0.2s ease"
              >
                <Image
                  src={image.thumbnailUrl || image.url}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
                {image.isPrimary && (
                  <Box
                    position="absolute"
                    top={1}
                    right={1}
                    bg="yellow.400"
                    borderRadius="full"
                    p={1}
                  >
                    <StarIcon boxSize={2} color="white" />
                  </Box>
                )}
              </Box>
            ))}
          </HStack>
        </Box>
      )}

      {/* Control Buttons */}
      <HStack spacing={4} mt={4} justify="center">
        {defaultSettings.showSlideshow && (
          <Button
            leftIcon={isSlideshow ? <ViewIcon /> : <ExternalLinkIcon />}
            onClick={toggleSlideshow}
            colorScheme={isSlideshow ? 'red' : 'blue'}
            variant={isSlideshow ? 'solid' : 'outline'}
          >
            {isSlideshow ? 'Stop Slideshow' : 'Start Slideshow'}
          </Button>
        )}
        
        {defaultSettings.showFullscreen && (
          <Button
            leftIcon={<ViewIcon />}
            onClick={() => setIsFullscreen(true)}
            variant="outline"
          >
            Fullscreen
          </Button>
        )}
      </HStack>

      {/* Fullscreen Modal */}
      <Modal isOpen={isFullscreen} onClose={() => setIsFullscreen(false)} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack justify="space-between">
              <Text>Image Gallery</Text>
              <HStack spacing={2}>
                <IconButton
                  aria-label="Download"
                  icon={<DownloadIcon />}
                  onClick={handleDownload}
                />
                <IconButton
                  aria-label="Close"
                  icon={<ExternalLinkIcon />}
                  onClick={() => setIsFullscreen(false)}
                />
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Box position="relative" h="80vh">
              <Image
                src={currentImage.url}
                alt={currentImage.alt || `Property image ${currentIndex + 1}`}
                width="100%"
                height="100%"
                objectFit="contain"
                transform={`scale(${zoomLevel})`}
                transition="transform 0.3s ease"
              />
              
              {/* Fullscreen Controls */}
              <Box
                position="absolute"
                top="50%"
                left={4}
                transform="translateY(-50%)"
              >
                <IconButton
                  aria-label="Previous image"
                  icon={<ChevronLeftIcon />}
                  onClick={goToPrevious}
                  size="lg"
                  variant="solid"
                  bg="blackAlpha.700"
                  color="white"
                  _hover={{ bg: 'blackAlpha.800' }}
                />
              </Box>
              
              <Box
                position="absolute"
                top="50%"
                right={4}
                transform="translateY(-50%)"
              >
                <IconButton
                  aria-label="Next image"
                  icon={<ChevronRightIcon />}
                  onClick={goToNext}
                  size="lg"
                  variant="solid"
                  bg="blackAlpha.700"
                  color="white"
                  _hover={{ bg: 'blackAlpha.800' }}
                />
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Image Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Caption</FormLabel>
                <Textarea
                  value={editForm.caption}
                  onChange={(e) => setEditForm(prev => ({ ...prev, caption: e.target.value }))}
                  placeholder="Enter image caption..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>Tags (comma-separated)</FormLabel>
                <Input
                  value={editForm.tags}
                  onChange={(e) => setEditForm(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="Enter tags separated by commas..."
                />
              </FormControl>

              <FormControl>
                <HStack>
                  <input
                    type="checkbox"
                    checked={editForm.isPrimary}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isPrimary: e.target.checked }))}
                  />
                  <Text>Set as primary image</Text>
                </HStack>
              </FormControl>

              <HStack spacing={4} justify="flex-end">
                <Button variant="outline" onClick={onEditClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleSaveEdit}
                  isLoading={isLoading}
                  loadingText="Saving..."
                >
                  Save Changes
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
