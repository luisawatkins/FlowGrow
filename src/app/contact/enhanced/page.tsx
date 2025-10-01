import React from 'react';
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
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { EnhancedContactForm } from '@/components/Contact/EnhancedContactForm';
import { ContactManager } from '@/components/Contact/ContactManager';
import { ContactAnalytics } from '@/components/Contact/ContactAnalytics';

export default function EnhancedContactPage() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activeTab, setActiveTab] = React.useState(0);

  const handleContactSuccess = (contact: any) => {
    // Refresh the contact list when a new contact is created
    setActiveTab(0); // Switch to contacts tab
    onClose();
  };

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize="3xl" fontWeight="bold">
              Enhanced Contact Management
            </Text>
            <Text color="gray.600">
              Manage property inquiries and customer communications
            </Text>
          </VStack>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={onOpen}
          >
            New Contact
          </Button>
        </HStack>

        {/* Tabs */}
        <Tabs index={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab>All Contacts</Tab>
            <Tab>Analytics</Tab>
          </TabList>

          <TabPanels>
            <TabPanel px={0}>
              <ContactManager />
            </TabPanel>
            <TabPanel px={0}>
              <ContactAnalytics />
            </TabPanel>
          </TabPanels>
        </Tabs>

        {/* New Contact Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Contact</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <EnhancedContactForm
                propertyId=""
                onSuccess={handleContactSuccess}
                onClose={onClose}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Box>
  );
}
