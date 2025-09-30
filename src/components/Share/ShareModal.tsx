import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Button,
  IconButton,
  Input,
  Textarea,
  Text,
  Box,
  Image,
  SimpleGrid,
  Divider,
  useToast,
  useClipboard,
} from '@chakra-ui/react';
import {
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaEnvelope,
  FaCopy,
  FaCheck,
} from 'react-icons/fa';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    location: string;
  };
}

interface PropertyRecommendation {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  similarity: number;
  matchingFeatures: string[];
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  property,
}) => {
  const toast = useToast();
  const [emailRecipients, setEmailRecipients] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [recommendations, setRecommendations] = useState<PropertyRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const shareUrl = `https://flowgrow.com/properties/${property.id}`;
  const { hasCopied, onCopy } = useClipboard(shareUrl);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `/api/share?propertyId=${property.id}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data.recommendations);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    };

    if (isOpen) {
      fetchRecommendations();
    }
  }, [isOpen, property.id]);

  const handleShare = async (platform: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: property.id,
          platform,
          recipients: platform === 'email' ? emailRecipients.split(',') : undefined,
          message: emailMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to share property');
      }

      const data = await response.json();

      // Handle platform-specific sharing
      switch (platform) {
        case 'facebook':
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
          break;
        case 'twitter':
          window.open(
            `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Check out this property: ${property.title}`)}`,
            '_blank'
          );
          break;
        case 'linkedin':
          window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            '_blank'
          );
          break;
        case 'whatsapp':
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`Check out this property: ${property.title} ${shareUrl}`)}`,
            '_blank'
          );
          break;
        case 'email':
          // In a real app, this would be handled by the backend
          toast({
            title: 'Success',
            description: 'Property shared via email',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          break;
      }

      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share property',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Property</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Property Preview */}
            <HStack spacing={4}>
              <Image
                src={property.imageUrl}
                alt={property.title}
                boxSize="100px"
                objectFit="cover"
                borderRadius="md"
              />
              <Box>
                <Text fontWeight="bold" fontSize="lg">
                  {property.title}
                </Text>
                <Text color="blue.500" fontSize="lg">
                  {formatPrice(property.price)}
                </Text>
                <Text color="gray.600">{property.location}</Text>
              </Box>
            </HStack>

            {/* Share URL */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Share Link
              </Text>
              <HStack>
                <Input value={shareUrl} isReadOnly />
                <IconButton
                  aria-label="Copy link"
                  icon={hasCopied ? <FaCheck /> : <FaCopy />}
                  onClick={onCopy}
                />
              </HStack>
            </Box>

            {/* Social Share Buttons */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Share on Social Media
              </Text>
              <HStack spacing={4}>
                <IconButton
                  aria-label="Share on Facebook"
                  icon={<FaFacebook />}
                  colorScheme="facebook"
                  onClick={() => handleShare('facebook')}
                  isLoading={isLoading}
                />
                <IconButton
                  aria-label="Share on Twitter"
                  icon={<FaTwitter />}
                  colorScheme="twitter"
                  onClick={() => handleShare('twitter')}
                  isLoading={isLoading}
                />
                <IconButton
                  aria-label="Share on LinkedIn"
                  icon={<FaLinkedin />}
                  colorScheme="linkedin"
                  onClick={() => handleShare('linkedin')}
                  isLoading={isLoading}
                />
                <IconButton
                  aria-label="Share on WhatsApp"
                  icon={<FaWhatsapp />}
                  colorScheme="whatsapp"
                  onClick={() => handleShare('whatsapp')}
                  isLoading={isLoading}
                />
              </HStack>
            </Box>

            {/* Email Share Form */}
            <Box>
              <Text fontWeight="bold" mb={2}>
                Share via Email
              </Text>
              <VStack spacing={3}>
                <Input
                  placeholder="Enter email addresses (comma-separated)"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                />
                <Textarea
                  placeholder="Add a personal message (optional)"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={3}
                />
                <Button
                  leftIcon={<FaEnvelope />}
                  colorScheme="blue"
                  width="full"
                  onClick={() => handleShare('email')}
                  isLoading={isLoading}
                  isDisabled={!emailRecipients}
                >
                  Send Email
                </Button>
              </VStack>
            </Box>

            {recommendations.length > 0 && (
              <>
                <Divider />

                {/* Similar Properties */}
                <Box>
                  <Text fontWeight="bold" mb={4}>
                    Similar Properties
                  </Text>
                  <SimpleGrid columns={2} spacing={4}>
                    {recommendations.map((rec) => (
                      <Box
                        key={rec.id}
                        borderWidth={1}
                        borderRadius="lg"
                        overflow="hidden"
                        cursor="pointer"
                        onClick={() =>
                          window.open(`/properties/${rec.id}`, '_blank')
                        }
                      >
                        <Image
                          src={rec.imageUrl}
                          alt={rec.title}
                          height="120px"
                          width="100%"
                          objectFit="cover"
                        />
                        <Box p={3}>
                          <Text fontWeight="bold" noOfLines={1}>
                            {rec.title}
                          </Text>
                          <Text color="blue.500">
                            {formatPrice(rec.price)}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {Math.round(rec.similarity * 100)}% match
                          </Text>
                        </Box>
                      </Box>
                    ))}
                  </SimpleGrid>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};