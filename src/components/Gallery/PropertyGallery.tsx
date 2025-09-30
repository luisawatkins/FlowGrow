import React, { useState } from 'react';
import {
  Box,
  SimpleGrid,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Flex,
  Text,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
}

interface PropertyGalleryProps {
  images: PropertyImage[];
}

export const PropertyGallery: React.FC<PropertyGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setIsLightboxOpen(false);
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null && selectedImage < images.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const showPreviousImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  return (
    <Box>
      <SimpleGrid columns={[2, 3, 4]} spacing={4}>
        {images.map((image, index) => (
          <Box
            key={image.id}
            cursor="pointer"
            onClick={() => openLightbox(index)}
            position="relative"
            overflow="hidden"
            borderRadius="md"
            _hover={{
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bg: 'blackAlpha.300',
              },
            }}
          >
            <Image
              src={image.url}
              alt={image.caption || `Property image ${index + 1}`}
              width="100%"
              height="200px"
              objectFit="cover"
            />
          </Box>
        ))}
      </SimpleGrid>

      <Modal
        isOpen={isLightboxOpen}
        onClose={closeLightbox}
        size="6xl"
        isCentered
      >
        <ModalOverlay bg="blackAlpha.900" />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" />
          <ModalBody p={0}>
            {selectedImage !== null && (
              <Box position="relative">
                <Image
                  src={images[selectedImage].url}
                  alt={images[selectedImage].caption || `Property image ${selectedImage + 1}`}
                  width="100%"
                  height="80vh"
                  objectFit="contain"
                />
                
                <Flex
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  p={4}
                  justify="space-between"
                  align="center"
                  bg="blackAlpha.700"
                >
                  <IconButton
                    aria-label="Previous image"
                    icon={<ChevronLeftIcon />}
                    onClick={showPreviousImage}
                    isDisabled={selectedImage === 0}
                    variant="ghost"
                    color="white"
                  />
                  
                  <Text color="white">
                    {images[selectedImage].caption || `Image ${selectedImage + 1} of ${images.length}`}
                  </Text>
                  
                  <IconButton
                    aria-label="Next image"
                    icon={<ChevronRightIcon />}
                    onClick={showNextImage}
                    isDisabled={selectedImage === images.length - 1}
                    variant="ghost"
                    color="white"
                  />
                </Flex>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
