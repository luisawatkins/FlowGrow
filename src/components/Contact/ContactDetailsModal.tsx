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
  Badge,
  Divider,
  Box,
  Button,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { ContactForm, ContactStatus } from '@/types/contact';
import { useEnhancedContact } from '@/hooks/useEnhancedContact';

interface ContactDetailsModalProps {
  contact: ContactForm;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({
  contact,
  isOpen,
  onClose,
  onUpdate,
}) => {
  const { updateContact, isLoading } = useEnhancedContact();
  const toast = useToast();
  const [status, setStatus] = useState(contact.status);
  const [notes, setNotes] = useState('');

  const handleStatusUpdate = async () => {
    try {
      await updateContact(contact.id, { status });
      toast({
        title: 'Status updated',
        description: 'Contact status has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onUpdate();
      onClose();
    } catch (error) {
      toast({
        title: 'Error updating status',
        description: 'Failed to update contact status.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status: ContactStatus) => {
    switch (status) {
      case ContactStatus.NEW:
        return 'blue';
      case ContactStatus.CONTACTED:
        return 'green';
      case ContactStatus.SCHEDULED:
        return 'purple';
      case ContactStatus.VIEWING_SCHEDULED:
        return 'orange';
      case ContactStatus.FOLLOW_UP:
        return 'yellow';
      case ContactStatus.CLOSED:
        return 'gray';
      case ContactStatus.SPAM:
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Contact Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={6} align="stretch">
            {/* Contact Information */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Contact Information
              </Text>
              <VStack spacing={3} align="stretch">
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
                  <Text>{contact.preferredContactMethod}</Text>
                </HStack>
                {contact.preferredViewingTime && (
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Preferred Viewing Time:</Text>
                    <Text>{contact.preferredViewingTime}</Text>
                  </HStack>
                )}
                {contact.budget && (
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Budget:</Text>
                    <Text>${contact.budget.toLocaleString()}</Text>
                  </HStack>
                )}
                {contact.timeline && (
                  <HStack justify="space-between">
                    <Text fontWeight="medium">Timeline:</Text>
                    <Text>{contact.timeline}</Text>
                  </HStack>
                )}
                <HStack justify="space-between">
                  <Text fontWeight="medium">Pre-approved:</Text>
                  <Badge colorScheme={contact.isPreApproved ? 'green' : 'gray'}>
                    {contact.isPreApproved ? 'Yes' : 'No'}
                  </Badge>
                </HStack>
              </VStack>
            </Box>

            <Divider />

            {/* Message */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Message
              </Text>
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text>{contact.message}</Text>
              </Box>
            </Box>

            {contact.additionalInfo && (
              <>
                <Divider />
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>
                    Additional Information
                  </Text>
                  <Box p={4} bg="gray.50" borderRadius="md">
                    <Text>{contact.additionalInfo}</Text>
                  </Box>
                </Box>
              </>
            )}

            {/* Attachments */}
            {contact.attachments && contact.attachments.length > 0 && (
              <>
                <Divider />
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>
                    Attachments
                  </Text>
                  <VStack spacing={2} align="stretch">
                    {contact.attachments.map((attachment, index) => (
                      <HStack key={index} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                        <Text fontSize="sm">{attachment.filename}</Text>
                        <Badge colorScheme="blue" size="sm">
                          {attachment.type}
                        </Badge>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </>
            )}

            {/* Status Management */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Status Management
              </Text>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="medium">Current Status:</Text>
                  <Badge colorScheme={getStatusColor(contact.status)}>
                    {contact.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </HStack>

                <FormControl>
                  <FormLabel>Update Status</FormLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ContactStatus)}
                  >
                    {Object.values(ContactStatus).map(statusOption => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Button
                  colorScheme="blue"
                  onClick={handleStatusUpdate}
                  isLoading={isLoading}
                  loadingText="Updating..."
                >
                  Update Status
                </Button>
              </VStack>
            </Box>

            {/* Response History */}
            {contact.response && (
              <>
                <Divider />
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>
                    Response History
                  </Text>
                  <Box p={4} bg="green.50" borderRadius="md">
                    <VStack align="stretch" spacing={2}>
                      <HStack justify="space-between">
                        <Text fontWeight="medium">Responder:</Text>
                        <Text>{contact.response.responderName}</Text>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontWeight="medium">Date:</Text>
                        <Text>{contact.response.createdAt.toLocaleDateString()}</Text>
                      </HStack>
                      <Box>
                        <Text fontWeight="medium" mb={2}>Response:</Text>
                        <Text>{contact.response.message}</Text>
                      </Box>
                    </VStack>
                  </Box>
                </Box>
              </>
            )}

            {/* Timestamps */}
            <Divider />
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Timestamps
              </Text>
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontWeight="medium">Created:</Text>
                  <Text>{contact.createdAt.toLocaleString()}</Text>
                </HStack>
                <HStack justify="space-between">
                  <Text fontWeight="medium">Last Updated:</Text>
                  <Text>{contact.updatedAt.toLocaleString()}</Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
