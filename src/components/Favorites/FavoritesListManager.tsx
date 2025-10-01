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
  Checkbox,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  Alert,
  AlertIcon,
  AlertDescription,
  Wrap,
  WrapItem,
  Divider,
} from '@chakra-ui/react';
import {
  SettingsIcon,
  AddIcon,
  EditIcon,
  DeleteIcon,
  ShareIcon,
  MoreIcon,
  StarIcon,
  TagIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import { FavoritesList } from '@/types/favorites';
import { favoritesService } from '@/lib/favoritesService';

interface FavoritesListManagerProps {
  isOpen?: boolean;
  onClose?: () => void;
  userId: string;
  onShareList?: (listId: string) => void;
}

export const FavoritesListManager: React.FC<FavoritesListManagerProps> = ({
  isOpen,
  onClose,
  userId,
  onShareList,
}) => {
  const [lists, setLists] = useState<FavoritesList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingList, setEditingList] = useState<FavoritesList | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [newListIsPublic, setNewListIsPublic] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const toast = useToast();

  // Load lists
  const loadLists = async () => {
    try {
      setIsLoading(true);
      const userLists = await favoritesService.getLists(userId);
      setLists(userLists);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load lists',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create new list
  const handleCreateList = async () => {
    if (!newListName.trim()) {
      setErrors({ name: 'List name is required' });
      return;
    }

    try {
      setIsCreating(true);
      setErrors({});
      
      const listId = await favoritesService.createList(
        userId,
        newListName.trim(),
        newListDescription.trim() || undefined,
        newListIsPublic
      );
      
      toast({
        title: 'List Created',
        description: 'Your new list has been created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setNewListName('');
      setNewListDescription('');
      setNewListIsPublic(false);
      
      // Reload lists
      await loadLists();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create list',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Edit list
  const handleEditList = (list: FavoritesList) => {
    setEditingList(list);
    setNewListName(list.name);
    setNewListDescription(list.description || '');
    setNewListIsPublic(list.isPublic);
    setIsEditing(true);
  };

  // Update list
  const handleUpdateList = async () => {
    if (!editingList || !newListName.trim()) {
      setErrors({ name: 'List name is required' });
      return;
    }

    try {
      setIsCreating(true);
      setErrors({});
      
      // In a real app, this would call an update API
      // For now, we'll just update the local state
      setLists(prev => prev.map(list => 
        list.id === editingList.id 
          ? { ...list, name: newListName.trim(), description: newListDescription.trim(), isPublic: newListIsPublic }
          : list
      ));
      
      toast({
        title: 'List Updated',
        description: 'Your list has been updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reset form
      setEditingList(null);
      setNewListName('');
      setNewListDescription('');
      setNewListIsPublic(false);
      setIsEditing(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update list',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsCreating(false);
    }
  };

  // Delete list
  const handleDeleteList = async (listId: string) => {
    try {
      await favoritesService.deleteList(listId);
      
      toast({
        title: 'List Deleted',
        description: 'Your list has been deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Reload lists
      await loadLists();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete list',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Share list
  const handleShareList = (listId: string) => {
    onShareList?.(listId);
    toast({
      title: 'List Shared',
      description: 'List sharing link has been copied to clipboard',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  // Load lists on mount
  useEffect(() => {
    if (isOpen) {
      loadLists();
    }
  }, [isOpen]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setNewListName('');
      setNewListDescription('');
      setNewListIsPublic(false);
      setEditingList(null);
      setIsEditing(false);
      setErrors({});
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen || false} onClose={onClose || (() => {})} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <SettingsIcon color="blue.500" />
            <Text>Manage Lists</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Create/Edit Form */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                {isEditing ? 'Edit List' : 'Create New List'}
              </Text>
              
              <VStack spacing={4} align="stretch">
                <FormControl isRequired isInvalid={!!errors.name}>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    List Name
                  </FormLabel>
                  <Input
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    placeholder="Enter list name..."
                    isDisabled={isCreating}
                  />
                  {errors.name && (
                    <FormErrorMessage fontSize="xs">
                      {errors.name}
                    </FormErrorMessage>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="sm" fontWeight="medium">
                    Description
                  </FormLabel>
                  <Textarea
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                    placeholder="Enter list description..."
                    rows={3}
                    isDisabled={isCreating}
                  />
                  <FormHelperText fontSize="xs">
                    Optional description for your list
                  </FormHelperText>
                </FormControl>

                <FormControl>
                  <Checkbox
                    isChecked={newListIsPublic}
                    onChange={(e) => setNewListIsPublic(e.target.checked)}
                    isDisabled={isCreating}
                  >
                    Make this list public
                  </Checkbox>
                  <FormHelperText fontSize="xs">
                    Public lists can be shared with others
                  </FormHelperText>
                </FormControl>

                <HStack>
                  <Button
                    colorScheme="blue"
                    onClick={isEditing ? handleUpdateList : handleCreateList}
                    isLoading={isCreating}
                    loadingText={isEditing ? 'Updating...' : 'Creating...'}
                    leftIcon={<AddIcon />}
                  >
                    {isEditing ? 'Update List' : 'Create List'}
                  </Button>
                  
                  {isEditing && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsEditing(false);
                        setEditingList(null);
                        setNewListName('');
                        setNewListDescription('');
                        setNewListIsPublic(false);
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </HStack>
              </VStack>
            </Box>

            <Divider />

            {/* Existing Lists */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Your Lists
              </Text>
              
              {isLoading ? (
                <Text fontSize="sm" color="gray.600">Loading lists...</Text>
              ) : lists.length === 0 ? (
                <Alert status="info">
                  <InfoIcon />
                  <AlertDescription>
                    You don't have any custom lists yet. Create your first list above.
                  </AlertDescription>
                </Alert>
              ) : (
                <SimpleGrid columns={1} spacing={3}>
                  {lists.map((list) => (
                    <Card key={list.id} variant="outline">
                      <CardBody>
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex={1}>
                            <HStack>
                              <Text fontSize="md" fontWeight="semibold">
                                {list.name}
                              </Text>
                              {list.isDefault && (
                                <Badge colorScheme="blue" variant="subtle" size="sm">
                                  Default
                                </Badge>
                              )}
                              {list.isPublic && (
                                <Badge colorScheme="green" variant="subtle" size="sm">
                                  Public
                                </Badge>
                              )}
                            </HStack>
                            
                            {list.description && (
                              <Text fontSize="sm" color="gray.600">
                                {list.description}
                              </Text>
                            )}
                            
                            <HStack spacing={4} fontSize="xs" color="gray.500">
                              <Text>{list.propertyIds.length} properties</Text>
                              <Text>Created {new Date(list.createdAt).toLocaleDateString()}</Text>
                              {list.tags && list.tags.length > 0 && (
                                <Wrap spacing={1}>
                                  {list.tags.map((tag, index) => (
                                    <WrapItem key={index}>
                                      <Badge colorScheme="gray" variant="outline" size="xs">
                                        {tag}
                                      </Badge>
                                    </WrapItem>
                                  ))}
                                </Wrap>
                              )}
                            </HStack>
                          </VStack>
                          
                          <Menu>
                            <MenuButton as={IconButton} icon={<MoreIcon />} size="sm" variant="ghost" />
                            <MenuList>
                              <MenuItem icon={<EditIcon />} onClick={() => handleEditList(list)}>
                                Edit
                              </MenuItem>
                              <MenuItem icon={<ShareIcon />} onClick={() => handleShareList(list.id)}>
                                Share
                              </MenuItem>
                              <MenuDivider />
                              <MenuItem 
                                icon={<DeleteIcon />} 
                                onClick={() => handleDeleteList(list.id)}
                                color="red.500"
                                isDisabled={list.isDefault}
                              >
                                Delete
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
