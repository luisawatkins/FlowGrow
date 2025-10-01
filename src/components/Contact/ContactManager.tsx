import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Select,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { SearchIcon, EditIcon, DeleteIcon, ViewIcon, EmailIcon, PhoneIcon } from '@chakra-ui/icons';
import { useEnhancedContact } from '@/hooks/useEnhancedContact';
import { ContactForm, ContactStatus, ContactFilters } from '@/types/contact';
import { ContactDetailsModal } from './ContactDetailsModal';
import { ContactResponseModal } from './ContactResponseModal';

interface ContactManagerProps {
  propertyId?: string;
  showPropertyColumn?: boolean;
}

export const ContactManager: React.FC<ContactManagerProps> = ({
  propertyId,
  showPropertyColumn = false,
}) => {
  const {
    contacts,
    isLoading,
    error,
    getContacts,
    getContactsByProperty,
    updateContact,
    deleteContact,
  } = useEnhancedContact();

  const [filters, setFilters] = useState<ContactFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactForm | null>(null);
  const [selectedContactForResponse, setSelectedContactForResponse] = useState<ContactForm | null>(null);
  
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const { isOpen: isResponseOpen, onOpen: onResponseOpen, onClose: onResponseClose } = useDisclosure();

  useEffect(() => {
    loadContacts();
  }, [propertyId, filters]);

  const loadContacts = async () => {
    try {
      if (propertyId) {
        await getContactsByProperty(propertyId);
      } else {
        await getContacts(filters);
      }
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const handleStatusChange = async (contactId: string, newStatus: ContactStatus) => {
    try {
      await updateContact(contactId, { status: newStatus });
      await loadContacts();
    } catch (error) {
      console.error('Failed to update contact status:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      await deleteContact(contactId);
      await loadContacts();
    } catch (error) {
      console.error('Failed to delete contact:', error);
    }
  };

  const handleViewDetails = (contact: ContactForm) => {
    setSelectedContact(contact);
    onDetailsOpen();
  };

  const handleRespond = (contact: ContactForm) => {
    setSelectedContactForResponse(contact);
    onResponseOpen();
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

  const filteredContacts = contacts.filter(contact => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.message.toLowerCase().includes(searchLower)
    );
  });

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error loading contacts!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filters and Search */}
      <VStack spacing={4} align="stretch" mb={6}>
        <HStack spacing={4} wrap="wrap">
          <InputGroup maxW="300px">
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>

          <Select
            placeholder="Filter by status"
            value={filters.status || ''}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as ContactStatus || undefined }))}
            maxW="200px"
          >
            <option value="">All Statuses</option>
            {Object.values(ContactStatus).map(status => (
              <option key={status} value={status}>
                {status.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </Select>

          <Button onClick={loadContacts} isLoading={isLoading}>
            Refresh
          </Button>
        </HStack>
      </VStack>

      {/* Contacts Table */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              {showPropertyColumn && <Th>Property</Th>}
              <Th>Status</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredContacts.map((contact) => (
              <Tr key={contact.id}>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{contact.name}</Text>
                    {contact.isPreApproved && (
                      <Badge colorScheme="green" size="sm">Pre-approved</Badge>
                    )}
                  </VStack>
                </Td>
                <Td>{contact.email}</Td>
                <Td>{contact.phone || '-'}</Td>
                {showPropertyColumn && (
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      Property {contact.propertyId}
                    </Text>
                  </Td>
                )}
                <Td>
                  <Badge colorScheme={getStatusColor(contact.status)}>
                    {contact.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </Td>
                <Td>
                  <Text fontSize="sm" color="gray.600">
                    {contact.createdAt.toLocaleDateString()}
                  </Text>
                </Td>
                <Td>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="View details"
                      icon={<ViewIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleViewDetails(contact)}
                    />
                    <IconButton
                      aria-label="Respond"
                      icon={<EmailIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRespond(contact)}
                    />
                    <Menu>
                      <MenuButton
                        as={IconButton}
                        aria-label="More actions"
                        icon={<EditIcon />}
                        size="sm"
                        variant="ghost"
                      />
                      <MenuList>
                        <MenuItem onClick={() => handleStatusChange(contact.id, ContactStatus.CONTACTED)}>
                          Mark as Contacted
                        </MenuItem>
                        <MenuItem onClick={() => handleStatusChange(contact.id, ContactStatus.SCHEDULED)}>
                          Mark as Scheduled
                        </MenuItem>
                        <MenuItem onClick={() => handleStatusChange(contact.id, ContactStatus.CLOSED)}>
                          Mark as Closed
                        </MenuItem>
                        <Divider />
                        <MenuItem
                          onClick={() => handleDeleteContact(contact.id)}
                          color="red.500"
                        >
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {filteredContacts.length === 0 && !isLoading && (
        <Box textAlign="center" py={8}>
          <Text color="gray.500">No contacts found</Text>
        </Box>
      )}

      {/* Modals */}
      {selectedContact && (
        <ContactDetailsModal
          contact={selectedContact}
          isOpen={isDetailsOpen}
          onClose={onDetailsClose}
          onUpdate={loadContacts}
        />
      )}

      {selectedContactForResponse && (
        <ContactResponseModal
          contact={selectedContactForResponse}
          isOpen={isResponseOpen}
          onClose={onResponseClose}
          onSuccess={loadContacts}
        />
      )}
    </Box>
  );
};
