import React, { useState, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
  Text,
  Progress,
  Image,
  IconButton,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useDropzone } from 'react-dropzone';
import { AddIcon, DeleteIcon, EditIcon, StarIcon, StarOutlineIcon } from '@chakra-ui/icons';
import { ImageUpload } from '@/types/gallery';
import { useEnhancedGallery } from '@/hooks/useEnhancedGallery';

interface ImageUploaderProps {
  propertyId: string;
  onUploadComplete?: (images: any[]) => void;
  maxFiles?: number;
  maxSize?: number;
  acceptedTypes?: string[];
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  propertyId,
  onUploadComplete,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
}) => {
  const { uploadImages, isLoading } = useEnhancedGallery();
  const toast = useToast();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const [uploadQueue, setUploadQueue] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [editingImage, setEditingImage] = useState<File | null>(null);
  const [editForm, setEditForm] = useState({
    caption: '',
    tags: '',
    isPrimary: false,
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: 'File too large',
          description: `${file.name} is larger than ${Math.round(maxSize / 1024 / 1024)}MB`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return false;
      }
      return true;
    });

    if (validFiles.length + uploadQueue.length > maxFiles) {
      toast({
        title: 'Too many files',
        description: `Maximum ${maxFiles} files allowed`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setUploadQueue(prev => [...prev, ...validFiles]);
  }, [maxFiles, maxSize, uploadQueue.length, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    multiple: true,
    disabled: isLoading,
  });

  const handleUpload = useCallback(async () => {
    if (uploadQueue.length === 0) return;

    try {
      const uploads: ImageUpload[] = uploadQueue.map(file => ({
        file,
        caption: '',
        tags: [],
        isPrimary: false,
        order: 0,
      }));

      const uploadedImages = await uploadImages(propertyId, uploads);
      setUploadedImages(prev => [...prev, ...uploadedImages]);
      setUploadQueue([]);
      
      toast({
        title: 'Upload successful',
        description: `${uploadedImages.length} images uploaded successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onUploadComplete?.(uploadedImages);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload images. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [uploadQueue, uploadImages, propertyId, toast, onUploadComplete]);

  const handleRemoveFromQueue = useCallback((index: number) => {
    setUploadQueue(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleEditImage = useCallback((file: File, index: number) => {
    setEditingImage(file);
    setEditForm({
      caption: '',
      tags: '',
      isPrimary: index === 0, // First image is primary by default
    });
    onEditOpen();
  }, [onEditOpen]);

  const handleSaveEdit = useCallback(() => {
    // Update the upload queue with edited information
    setUploadQueue(prev => prev.map((file, index) => {
      if (file === editingImage) {
        // In a real implementation, you would store this metadata
        return file;
      }
      return file;
    }));
    onEditClose();
  }, [editingImage, onEditClose]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box>
      {/* Upload Area */}
      <Box
        {...getRootProps()}
        border="2px dashed"
        borderColor={isDragActive ? 'blue.400' : 'gray.300'}
        borderRadius="md"
        p={8}
        textAlign="center"
        cursor="pointer"
        bg={isDragActive ? 'blue.50' : 'gray.50'}
        _hover={{ bg: 'blue.50' }}
        transition="all 0.2s ease"
      >
        <input {...getInputProps()} />
        <VStack spacing={4}>
          <AddIcon boxSize={8} color="gray.400" />
          <Text fontSize="lg" fontWeight="medium" color="gray.600">
            {isDragActive ? 'Drop images here' : 'Drag & drop images here, or click to select'}
          </Text>
          <Text fontSize="sm" color="gray.500">
            Maximum {maxFiles} files, {Math.round(maxSize / 1024 / 1024)}MB each
          </Text>
          <Text fontSize="xs" color="gray.400">
            Supported formats: {acceptedTypes.join(', ')}
          </Text>
        </VStack>
      </Box>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <Box mt={6}>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Upload Queue ({uploadQueue.length} files)
          </Text>
          <VStack spacing={3} align="stretch">
            {uploadQueue.map((file, index) => (
              <Box
                key={`${file.name}-${index}`}
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
              >
                <HStack spacing={4} align="center">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    boxSize="60px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <VStack align="start" flex={1} spacing={1}>
                    <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                      {file.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatFileSize(file.size)}
                    </Text>
                    {index === 0 && (
                      <Badge colorScheme="yellow" size="sm">
                        Primary
                      </Badge>
                    )}
                  </VStack>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Edit image details"
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditImage(file, index)}
                    />
                    <IconButton
                      aria-label="Remove from queue"
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleRemoveFromQueue(index)}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>

          <HStack spacing={4} mt={4} justify="flex-end">
            <Button
              variant="outline"
              onClick={() => setUploadQueue([])}
              disabled={isLoading}
            >
              Clear Queue
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleUpload}
              isLoading={isLoading}
              loadingText="Uploading..."
            >
              Upload {uploadQueue.length} Images
            </Button>
          </HStack>
        </Box>
      )}

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <Box mt={6}>
          <Text fontSize="lg" fontWeight="semibold" mb={4}>
            Uploaded Images ({uploadedImages.length})
          </Text>
          <VStack spacing={3} align="stretch">
            {uploadedImages.map((image, index) => (
              <Box
                key={image.id}
                p={4}
                border="1px solid"
                borderColor="gray.200"
                borderRadius="md"
                bg="white"
              >
                <HStack spacing={4} align="center">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    boxSize="60px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <VStack align="start" flex={1} spacing={1}>
                    <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                      {image.alt}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {formatFileSize(image.fileSize || 0)}
                    </Text>
                    {image.isPrimary && (
                      <Badge colorScheme="yellow" size="sm">
                        Primary
                      </Badge>
                    )}
                  </VStack>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Set as primary"
                      icon={image.isPrimary ? <StarIcon /> : <StarOutlineIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme={image.isPrimary ? 'yellow' : 'gray'}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        </Box>
      )}

      {/* Edit Image Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Image Details</ModalHeader>
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
                  <Checkbox
                    isChecked={editForm.isPrimary}
                    onChange={(e) => setEditForm(prev => ({ ...prev, isPrimary: e.target.checked }))}
                  />
                  <Text>Set as primary image</Text>
                </HStack>
              </FormControl>

              <HStack spacing={4} justify="flex-end">
                <Button variant="outline" onClick={onEditClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleSaveEdit}>
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
