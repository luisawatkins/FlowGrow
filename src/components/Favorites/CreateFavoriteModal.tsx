import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import {
  AddIcon,
  StarIcon,
  TagIcon,
  InfoIcon,
  WarningIcon,
} from '@chakra-ui/icons';

interface CreateFavoriteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFavorite: (propertyId: string, notes?: string, tags?: string[], priority?: string) => Promise<void>;
}

export const CreateFavoriteModal: React.FC<CreateFavoriteModalProps> = ({
  isOpen,
  onClose,
  onAddFavorite,
}) => {
  const [propertyId, setPropertyId] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!propertyId.trim()) {
      newErrors.propertyId = 'Property ID is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      setErrors({});
      
      await onAddFavorite(propertyId.trim(), notes.trim() || undefined, tags.length > 0 ? tags : undefined, priority);
      
      toast({
        title: 'Favorite Added',
        description: 'Property has been added to your favorites',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setPropertyId('');
      setNotes('');
      setTags([]);
      setPriority('medium');
      setNewTag('');
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add property to favorites',
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <AddIcon color="blue.500" />
            <Text>Add Property to Favorites</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Property ID */}
            <FormControl isRequired isInvalid={!!errors.propertyId}>
              <FormLabel fontSize="sm" fontWeight="medium">
                Property ID
              </FormLabel>
              <Input
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                placeholder="Enter property ID or URL..."
                isDisabled={isLoading}
              />
              <FormHelperText fontSize="xs">
                Enter the property ID or paste a property URL
              </FormHelperText>
              {errors.propertyId && (
                <FormErrorMessage fontSize="xs">
                  {errors.propertyId}
                </FormErrorMessage>
              )}
            </FormControl>

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

            {/* Info Alert */}
            <Alert status="info">
              <InfoIcon />
              <AlertDescription fontSize="sm">
                You can edit these details later from your favorites list
              </AlertDescription>
            </Alert>
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
              loadingText="Adding..."
              leftIcon={<StarIcon />}
            >
              Add to Favorites
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
