import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Switch,
  Select,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  useToast,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaBell, FaSearch } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import type { SavedSearch } from '@/app/api/saved-searches/route';

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<SavedSearch>) => void;
  initialData?: Partial<SavedSearch>;
}

const SaveSearchModal: React.FC<SaveSearchModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<Partial<SavedSearch>>(
    initialData || {
      name: '',
      filters: {},
      emailAlerts: false,
      alertFrequency: 'weekly',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>
            {initialData ? 'Edit Saved Search' : 'Save Search'}
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Search Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter a name for this search"
                />
              </FormControl>

              <FormControl>
                <HStack justify="space-between">
                  <FormLabel mb={0}>Email Alerts</FormLabel>
                  <Switch
                    isChecked={formData.emailAlerts}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        emailAlerts: e.target.checked,
                      }))
                    }
                  />
                </HStack>
              </FormControl>

              {formData.emailAlerts && (
                <FormControl>
                  <FormLabel>Alert Frequency</FormLabel>
                  <Select
                    value={formData.alertFrequency}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        alertFrequency: e.target.value as SavedSearch['alertFrequency'],
                      }))
                    }
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </FormControl>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" colorScheme="blue">
              Save
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export const SavedSearches: React.FC = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [selectedSearch, setSelectedSearch] = useState<SavedSearch | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSavedSearches = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch('/api/saved-searches');
        if (!response.ok) {
          throw new Error('Failed to fetch saved searches');
        }

        const data = await response.json();
        setSavedSearches(data.savedSearches);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load saved searches',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedSearches();
  }, [session, toast]);

  const handleSaveSearch = async (data: Partial<SavedSearch>) => {
    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to save search');
      }

      const newSearch = await response.json();
      setSavedSearches((prev) => [...prev, newSearch]);

      toast({
        title: 'Success',
        description: 'Search saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save search',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditSearch = async (search: SavedSearch) => {
    setSelectedSearch(search);
    onOpen();
  };

  const handleDeleteSearch = async (searchId: string) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete search');
      }

      setSavedSearches((prev) =>
        prev.filter((search) => search.id !== searchId)
      );

      toast({
        title: 'Success',
        description: 'Search deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete search',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRunSearch = (search: SavedSearch) => {
    // Apply the saved search filters and redirect to search results
    const queryParams = new URLSearchParams();
    const filters = search.filters;

    if (filters.priceRange) {
      queryParams.set('minPrice', filters.priceRange.min.toString());
      queryParams.set('maxPrice', filters.priceRange.max.toString());
    }
    if (filters.propertyType) {
      queryParams.set('propertyType', filters.propertyType);
    }
    if (filters.bedrooms) {
      queryParams.set('bedrooms', filters.bedrooms.toString());
    }
    if (filters.bathrooms) {
      queryParams.set('bathrooms', filters.bathrooms.toString());
    }
    if (filters.location) {
      queryParams.set('location', filters.location);
    }
    if (filters.squareFeet) {
      queryParams.set('minSqft', filters.squareFeet.min.toString());
      queryParams.set('maxSqft', filters.squareFeet.max.toString());
    }

    window.location.href = `/search?${queryParams.toString()}`;
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        Loading saved searches...
      </Box>
    );
  }

  return (
    <Box>
      <SaveSearchModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedSearch(null);
        }}
        onSave={handleSaveSearch}
        initialData={selectedSearch || undefined}
      />

      {savedSearches.length === 0 ? (
        <Box textAlign="center" py={10}>
          <Text color="gray.600">No saved searches yet</Text>
        </Box>
      ) : (
        <Table>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Alerts</Th>
              <Th>Last Run</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {savedSearches.map((search) => (
              <Tr key={search.id}>
                <Td>
                  <Text fontWeight="medium">{search.name}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {Object.entries(search.filters)
                      .filter(([_, value]) => value !== undefined)
                      .map(([key, value]) => {
                        if (key === 'priceRange') {
                          return `$${value.min}-${value.max}`;
                        }
                        if (key === 'squareFeet') {
                          return `${value.min}-${value.max} sqft`;
                        }
                        return `${key}: ${value}`;
                      })
                      .join(' • ')}
                  </Text>
                </Td>
                <Td>
                  {search.emailAlerts ? (
                    <Badge colorScheme="green">
                      {search.alertFrequency}
                    </Badge>
                  ) : (
                    <Badge>Off</Badge>
                  )}
                </Td>
                <Td>
                  <Text fontSize="sm" color="gray.600">
                    {new Date(search.lastRunAt).toLocaleDateString()}
                  </Text>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Run search"
                      icon={<FaSearch />}
                      size="sm"
                      onClick={() => handleRunSearch(search)}
                    />
                    <IconButton
                      aria-label="Edit search"
                      icon={<FaEdit />}
                      size="sm"
                      onClick={() => handleEditSearch(search)}
                    />
                    <IconButton
                      aria-label="Delete search"
                      icon={<FaTrash />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteSearch(search.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};
