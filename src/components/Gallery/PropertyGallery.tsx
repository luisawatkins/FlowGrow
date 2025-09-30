import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Grid,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useDisclosure,
  VStack,
  HStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FaChevronLeft, FaChevronRight, FaTrash } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';

interface PropertyImage {
  id: string;
  url: string;
  thumbnail: string;
}

interface PropertyGalleryProps {
  propertyId: string;
  isEditable?: boolean;
  initialImages?: PropertyImage[];
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({
  propertyId,
  isEditable = false,
  initialImages = [],
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [images, setImages] = useState<PropertyImage[]>(initialImages);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!session?.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to upload images',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      acceptedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch(`/api/properties/${propertyId}/images`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();
      setImages((prev) => [...prev, ...data.images]);

      toast({
        title: 'Success',
        description: 'Images uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload images',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  }, [propertyId, session, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
    },
    disabled: !isEditable || isUploading,
  });

  const handleDelete = async (imageId: string) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}/images`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setImages((prev) => prev.filter((img) => img.id !== imageId));

      toast({
        title: 'Success',
        description: 'Image deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Box>
      {isEditable && (
        <Box
          {...getRootProps()}
          p={6}
          mb={4}
          borderWidth={2}
          borderRadius="lg"
          borderStyle="dashed"
          borderColor={isDragActive ? 'blue.500' : 'gray.200'}
          bg={isDragActive ? 'blue.50' : 'white'}
          cursor="pointer"
          transition="all 0.2s"
          _hover={{
            borderColor: 'blue.500',
          }}
        >
          <input {...getInputProps()} />
          <VStack spacing={2}>
            <Text textAlign="center">
              {isDragActive
                ? 'Drop the files here...'
                : 'Drag and drop images here, or click to select files'}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Supported formats: JPEG, PNG, WebP
            </Text>
          </VStack>
        </Box>
      )}

      <Grid
        templateColumns={{
          base: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
        gap={4}
      >
        {images.map((image, index) => (
          <Box
            key={image.id}
            position="relative"
            cursor="pointer"
            onClick={() => {
              setSelectedImageIndex(index);
              onOpen();
            }}
          >
            <Image
              src={image.thumbnail}
              alt={`Property image ${index + 1}`}
              borderRadius="md"
              objectFit="cover"
              w="100%"
              h="200px"
            />
            {isEditable && (
              <IconButton
                aria-label="Delete image"
                icon={<FaTrash />}
                size="sm"
                position="absolute"
                top={2}
                right={2}
                colorScheme="red"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(image.id);
                }}
              />
            )}
          </Box>
        ))}
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton zIndex="modal" />
          <ModalBody p={0}>
            <Box position="relative">
              <Image
                src={images[selectedImageIndex]?.url}
                alt={`Property image ${selectedImageIndex + 1}`}
                w="100%"
                h="auto"
                maxH="80vh"
                objectFit="contain"
              />
              <HStack
                position="absolute"
                bottom={4}
                left="50%"
                transform="translateX(-50%)"
                spacing={4}
              >
                <IconButton
                  aria-label="Previous image"
                  icon={<FaChevronLeft />}
                  onClick={handlePrevious}
                  colorScheme="blackAlpha"
                />
                <Text color="white" fontWeight="bold">
                  {selectedImageIndex + 1} / {images.length}
                </Text>
                <IconButton
                  aria-label="Next image"
                  icon={<FaChevronRight />}
                  onClick={handleNext}
                  colorScheme="blackAlpha"
                />
              </HStack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};