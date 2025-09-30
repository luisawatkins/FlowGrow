import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
  Divider,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaCopy } from 'react-icons/fa';
import { useShare } from '@/hooks/useShare';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
}) => {
  const [email, setEmail] = useState('');
  const { shareViaEmail, getShareLink } = useShare();
  const toast = useToast();

  const handleEmailShare = async () => {
    try {
      await shareViaEmail(propertyId, email);
      toast({
        title: 'Property shared successfully',
        status: 'success',
        duration: 3000,
      });
      setEmail('');
    } catch (error) {
      toast({
        title: 'Failed to share property',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleCopyLink = async () => {
    const shareLink = getShareLink(propertyId);
    try {
      await navigator.clipboard.writeText(shareLink);
      toast({
        title: 'Link copied to clipboard',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to copy link',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const shareUrl = getShareLink(propertyId);
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(propertyTitle);

  const socialShareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Property</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} pb={6}>
            <VStack spacing={3} w="100%">
              <Text fontWeight="bold">Share via Email</Text>
              <InputGroup size="md">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    onClick={handleEmailShare}
                    isDisabled={!email}
                  >
                    Send
                  </Button>
                </InputRightElement>
              </InputGroup>
            </VStack>

            <Divider />

            <VStack spacing={3} w="100%">
              <Text fontWeight="bold">Share Link</Text>
              <InputGroup>
                <Input
                  value={shareUrl}
                  isReadOnly
                  pr="4.5rem"
                />
                <InputRightElement>
                  <IconButton
                    aria-label="Copy link"
                    icon={<FaCopy />}
                    size="sm"
                    onClick={handleCopyLink}
                  />
                </InputRightElement>
              </InputGroup>
            </VStack>

            <Divider />

            <VStack spacing={3} w="100%">
              <Text fontWeight="bold">Share on Social Media</Text>
              <HStack spacing={4}>
                <IconButton
                  aria-label="Share on Facebook"
                  icon={<FaFacebook />}
                  colorScheme="facebook"
                  onClick={() => window.open(socialShareLinks.facebook, '_blank')}
                />
                <IconButton
                  aria-label="Share on Twitter"
                  icon={<FaTwitter />}
                  colorScheme="twitter"
                  onClick={() => window.open(socialShareLinks.twitter, '_blank')}
                />
                <IconButton
                  aria-label="Share on LinkedIn"
                  icon={<FaLinkedin />}
                  colorScheme="linkedin"
                  onClick={() => window.open(socialShareLinks.linkedin, '_blank')}
                />
                <IconButton
                  aria-label="Share on WhatsApp"
                  icon={<FaWhatsapp />}
                  colorScheme="whatsapp"
                  onClick={() => window.open(socialShareLinks.whatsapp, '_blank')}
                />
              </HStack>
            </VStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
