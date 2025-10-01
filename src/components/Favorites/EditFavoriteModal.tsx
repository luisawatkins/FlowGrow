import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Input,
  Textarea,
  Select,
  Checkbox,
  CheckboxGroup,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertDescription,
  useToast,
  Badge,
  Wrap,
  WrapItem,
  Icon,
  Divider,
} from '@chakra-ui/react';
import {
  EditIcon,
  StarIcon,
  TagIcon,
  InfoIcon,
  WarningIcon,
  DeleteIcon,
} from '@chakra-ui/icons';
import { FavoriteProperty } from '@/types/favorites';

interface EditFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorite: FavoriteProperty | null;
  onUpdateFavorite: (favoriteId: string, updates: Partial<FavoriteProperty>) => Promise<void>;
}

export const EditFavoriteModal: React.FC<EditFavoriteModalProps> = ({
  isOpen,
  onClose,
  favorite,
  onUpdateFavorite,
}) => {
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [status, setStatus] = useState<'active' | 'archived' | 'removed'>('active');
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  // Initialize form when favorite changes
  useEffect(() => {
    if (favorite) {
      setNotes(favorite.notes || '');
      setTags(favorite.tags || []);
      setPriority(favorite.priority || 'medium');
      setStatus(favorite.status || 'active');
    }
  }, [favorite]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!favorite) return;

    try {
      setIsLoading(true);
      setErrors({});
      
      await onUpdateFavorite(favorite.id, {
        notes: notes.trim() || undefined,
        tags: tags.length > 0 ? tags : undefined,
        priority,
        status,
      });
      
      toast({
        title: 'Favorite Updated',
        description: 'Your favorite has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorite',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle add tag
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  // Handle remove tag
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  // Handle key press for tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Predefined tags
  const predefinedTags = [
    'downtown', 'modern', 'family', 'luxury', 'investment', 'work', 'schools', 'beachfront',
    'suburbs', 'apartment', 'house', 'condo', 'studio', 'villa', 'furnished', 'pet-friendly'
  ];

  if (!favorite) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <EditIcon color="blue.500" />
            <Text>Edit Favorite</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Property Info */}
            <Box bg="gray.50" p={3} borderRadius="md">
              <Text fontSize="sm" fontWeight="medium" color="gray.700">
                {favorite.property.title}
              </Text>
              <Text fontSize="xs" color="gray.600">
                {favorite.property.location} • ${favorite.property.price.toLocaleString()}
              </Text>
            </Box>

            {/* Priority */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Priority
              </FormLabel>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                isDisabled={isLoading}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </Select>
              <FormHelperText fontSize="xs">
                Set the priority level for this property
              </FormHelperText>
            </FormControl>

            {/* Status */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Status
              </FormLabel>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                isDisabled={isLoading}
              >
                <option value="active">Active</option>
                <option value="archived">Archived</option>
                <option value="removed">Removed</option>
              </Select>
              <FormHelperText fontSize="xs">
                Set the status of this favorite
              </FormHelperText>
            </FormControl>

            {/* Notes */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Notes
              </FormLabel>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add personal notes about this property..."
                rows={3}
                isDisabled={isLoading}
              />
              <FormHelperText fontSize="xs">
                Add any personal notes or observations about this property
              </FormHelperText>
            </FormControl>

            {/* Tags */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="medium">
                Tags
              </FormLabel>
              
              {/* Current Tags */}
              {tags.length > 0 && (
                <Wrap spacing={2} mb={3}>
                  {tags.map((tag, index) => (
                    <WrapItem key={index}>
                      <Badge colorScheme="blue" variant="subtle" px={2} py={1} borderRadius="full">
                        <HStack spacing={1}>
                          <Text fontSize="xs">{tag}</Text>
                          <Icon
                            as={TagIcon}
                            boxSize={2}
                            cursor="pointer"
                            onClick={() => handleRemoveTag(tag)}
                          />
                        </HStack>
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              )}

              {/* Add New Tag */}
              <HStack>
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  onKeyPress={handleTagKeyPress}
                  isDisabled={isLoading}
                />
                <Button
                  size="sm"
                  onClick={handleAddTag}
                  isDisabled={!newTag.trim() || tags.includes(newTag.trim())}
                >
                  Add
                </Button>
              </HStack>

              {/* Predefined Tags */}
              <Box mt={3}>
                <Text fontSize="xs" color="gray.600" mb={2}>
                  Quick Tags:
                </Text>
                <Wrap spacing={1}>
                  {predefinedTags.map((tag) => (
                    <WrapItem key={tag}>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => {
                          if (!tags.includes(tag)) {
                            setTags(prev => [...prev, tag]);
                          }
                        }}
                        isDisabled={tags.includes(tag) || isLoading}
                        fontSize="xs"
                      >
                        {tag}
                      </Button>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>

              <FormHelperText fontSize="xs">
                Add tags to help organize and find your favorites
              </FormHelperText>
            </FormControl>

            {/* Property Details */}
            <Divider />
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Property Details
              </Text>
              <SimpleGrid columns={2} spacing={3}>
                <Box>
                  <Text fontSize="xs" color="gray.600">Property Type</Text>
                  <Text fontSize="sm" fontWeight="medium">{favorite.property.propertyType}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.600">Bedrooms</Text>
                  <Text fontSize="sm" fontWeight="medium">{favorite.property.bedrooms}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.600">Bathrooms</Text>
                  <Text fontSize="sm" fontWeight="medium">{favorite.property.bathrooms}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.600">Square Feet</Text>
                  <Text fontSize="sm" fontWeight="medium">{favorite.property.squareFeet.toLocaleString()}</Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Favorite Info */}
            <Divider />
            <Box>
              <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                Favorite Information
              </Text>
              <SimpleGrid columns={2} spacing={3}>
                <Box>
                  <Text fontSize="xs" color="gray.600">Added Date</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {new Date(favorite.addedAt).toLocaleDateString()}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.600">Last Viewed</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {favorite.lastViewedAt ? new Date(favorite.lastViewedAt).toLocaleDateString() : 'Never'}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.600">View Count</Text>
                  <Text fontSize="sm" fontWeight="medium">{favorite.viewCount || 0}</Text>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.600">Price Alerts</Text>
                  <Text fontSize="sm" fontWeight="medium">{favorite.priceAlerts?.length || 0}</Text>
                </Box>
              </SimpleGrid>
            </Box>

            {/* Warning for status changes */}
            {status === 'removed' && (
              <Alert status="warning">
                <WarningIcon />
                <AlertDescription fontSize="sm">
                  Setting status to "Removed" will hide this favorite from your main list
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={onClose} isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Updating..."
              leftIcon={<EditIcon />}
            >
              Update Favorite
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
