import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { EnhancedImageGallery } from '@/components/Gallery/EnhancedImageGallery';
import { ImageUploader } from '@/components/Gallery/ImageUploader';
import { GalleryAnalytics } from '@/components/Gallery/GalleryAnalytics';
import { useEnhancedGallery } from '@/hooks/useEnhancedGallery';
import { PropertyImage } from '@/types/gallery';

export default function EnhancedGalleryPage() {
  const { images, getImages, isLoading, error } = useEnhancedGallery();
  const { isOpen: isUploadOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      await getImages();
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  const handleUploadComplete = (uploadedImages: PropertyImage[]) => {
    // Refresh the image list when new images are uploaded
    loadImages();
    onUploadClose();
  };

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error loading gallery!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize="3xl" fontWeight="bold">
              Enhanced Image Gallery
            </Text>
            <Text color="gray.600">
              Manage property images with advanced viewing and editing features
            </Text>
          </VStack>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onUploadOpen}
          >
            Upload Images
          </Button>
        </HStack>

        {/* Tabs */}
        <Tabs index={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab>Gallery</Tab>
            <Tab>Analytics</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              {isLoading ? (
                <Box textAlign="center" py={8}>
                  <Text>Loading images...</Text>
                </Box>
              ) : images.length > 0 ? (
                <EnhancedImageGallery
                  images={images}
                  propertyId="demo-property"
                  isEditable={true}
                  settings={{
                    showThumbnails: true,
                    showCaptions: true,
                    autoPlay: false,
                    showFullscreen: true,
                    showZoom: true,
                    showSlideshow: true,
                    transitionEffect: 'fade',
                  }}
                />
              ) : (
                <Box textAlign="center" py={8}>
                  <Text color="gray.500">No images found</Text>
                  <Text fontSize="sm" color="gray.400" mt={2}>
                    Upload some images to get started
                  </Text>
                </Box>
              )}
            </TabPanel>
            <TabPanel px={0}>
              <GalleryAnalytics />
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* Upload Modal */}
        <Modal isOpen={isUploadOpen} onClose={onUploadClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload Images</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <ImageUploader
                propertyId="demo-property"
                onUploadComplete={handleUploadComplete}
                maxFiles={20}
                maxSize={10 * 1024 * 1024} // 10MB
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
