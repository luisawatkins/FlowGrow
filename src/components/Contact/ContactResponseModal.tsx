import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Divider,
  Box,
  Badge,
} from '@chakra-ui/react';
import { ContactForm } from '@/types/contact';
import { useEnhancedContact } from '@/hooks/useEnhancedContact';

interface ContactResponseModalProps {
  contact: ContactForm;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ContactResponseModal: React.FC<ContactResponseModalProps> = ({
  contact,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { addResponse, isLoading } = useEnhancedContact();
  const toast = useToast();
  
  const [responseData, setResponseData] = useState({
    responderName: '',
    responderEmail: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!responseData.responderName.trim() || !responseData.responderEmail.trim() || !responseData.message.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await addResponse(contact.id, responseData);
      
      toast({
        title: 'Response sent',
        description: 'Your response has been sent successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      toast({
        title: 'Error sending response',
        description: 'Failed to send response. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResponseData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Respond to Contact</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Contact Information */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Contact Information
              </Text>
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="medium">Name:</Text>
                  <Text>{contact.name}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="medium">Email:</Text>
                  <Text>{contact.email}</Text>
                </HStack>
                {contact.phone && (
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Phone:</Text>
                    <Text>{contact.phone}</Text>
                  </HStack>
                )}
                <HStack justify="space-between">
                  <Text fontWeight="medium">Preferred Contact:</Text>
                  <Badge colorScheme="blue">{contact.preferredContactMethod}</Badge>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            {/* Original Message */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Original Message
              </Text>
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text>{contact.message}</Text>
              </Box>
            </Box>

            <Divider />

            {/* Response Form */}
            <Box as="form" onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <Text fontSize="lg" fontWeight="semibold">
                  Your Response
                </Text>

                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Your Name</FormLabel>
                    <Input
                      name="responderName"
                      value={responseData.responderName}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Your Email</FormLabel>
                    <Input
                      name="responderEmail"
                      type="email"
                      value={responseData.responderEmail}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Response Message</FormLabel>
                  <Textarea
                    name="message"
                    value={responseData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your response message..."
                    rows={6}
                  />
                </FormControl>

                <HStack spacing={4} justify="flex-end">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isLoading}
                    loadingText="Sending..."
                  >
                    Send Response
                  </Button>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
