import React, { useState, useMemo } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Image,
  Badge,
  Checkbox,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
  Alert,
  AlertIcon,
  AlertDescription,
  Skeleton,
  SkeletonText,
  Divider,
  Flex,
  Spacer,
  Select,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  SearchIcon,
  StarIcon,
  EditIcon,
  DeleteIcon,
  ViewIcon,
  MoreIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
  SortIcon,
  BellIcon,
  CalendarIcon,
  LocationIcon,
  PriceIcon,
  BedIcon,
  BathIcon,
  SquareIcon,
} from '@chakra-ui/icons';
import { FavoriteProperty, FavoritesListProps } from '@/types/favorites';

export const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  isLoading = false,
  onViewProperty,
  onEditFavorite,
  onDeleteFavorite,
  onToggleFavorite,
  selectedFavorites = [],
  onFavoriteSelect,
  onSelectAll,
  searchTerm = '',
  onSearch,
  className = '',
  showNotes = true,
  showTags = true,
  showPriority = true,
  showPriceAlerts = true,
  layout = 'grid',
  maxItems = 50,
}) => {
  const [sortBy, setSortBy] = useState<string>('added_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<Record<string, string[]>>({});

  const { isOpen: isNotesOpen, onOpen: onNotesOpen, onClose: onNotesClose } = useDisclosure();
  const { isOpen: isTagsOpen, onOpen: onTagsOpen, onClose: onTagsClose } = useDisclosure();
  const [editingFavorite, setEditingFavorite] = useState<FavoriteProperty | null>(null);

  // Filter and sort favorites
  const filteredFavorites = useMemo(() => {
    let filtered = favorites;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(fav =>
        fav.property.title.toLowerCase().includes(searchLower) ||
        fav.property.location.toLowerCase().includes(searchLower) ||
        fav.notes?.toLowerCase().includes(searchLower) ||
        fav.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'added_date':
          aValue = new Date(a.addedAt).getTime();
          bValue = new Date(b.addedAt).getTime();
          break;
        case 'price':
          aValue = a.property.price;
          bValue = b.property.price;
          break;
        case 'property_type':
          aValue = a.property.propertyType;
          bValue = b.property.propertyType;
          break;
        case 'location':
          aValue = a.property.location;
          bValue = b.property.location;
          break;
        case 'last_viewed':
          aValue = new Date(a.lastViewedAt || a.addedAt).getTime();
          bValue = new Date(b.lastViewedAt || b.addedAt).getTime();
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority || 'medium'];
          bValue = priorityOrder[b.priority || 'medium'];
          break;
        default:
          aValue = a.property.title;
          bValue = b.property.title;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered.slice(0, maxItems);
  }, [favorites, searchTerm, sortBy, sortOrder, maxItems]);

  // Handle favorite selection
  const handleFavoriteSelect = (favoriteId: string, selected: boolean) => {
    onFavoriteSelect?.(favoriteId, selected);
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    onSelectAll?.(selected);
  };

  // Handle edit notes
  const handleEditNotes = (favorite: FavoriteProperty) => {
    setEditingFavorite(favorite);
    setNotes({ ...notes, [favorite.id]: favorite.notes || '' });
    onNotesOpen();
  };

  // Handle save notes
  const handleSaveNotes = () => {
    if (editingFavorite) {
      onEditFavorite?.({
        ...editingFavorite,
        notes: notes[editingFavorite.id],
      });
    }
    onNotesClose();
  };

  // Handle edit tags
  const handleEditTags = (favorite: FavoriteProperty) => {
    setEditingFavorite(favorite);
    setTags({ ...tags, [favorite.id]: favorite.tags || [] });
    onTagsOpen();
  };

  // Handle save tags
  const handleSaveTags = () => {
    if (editingFavorite) {
      onEditFavorite?.({
        ...editingFavorite,
        tags: tags[editingFavorite.id],
      });
    }
    onTagsClose();
  };

  // Handle add tag
  const handleAddTag = (favoriteId: string, tag: string) => {
    if (tag.trim()) {
      setTags(prev => ({
        ...prev,
        [favoriteId]: [...(prev[favoriteId] || []), tag.trim()],
      }));
    }
  };

  // Handle remove tag
  const handleRemoveTag = (favoriteId: string, tagToRemove: string) => {
    setTags(prev => ({
      ...prev,
      [favoriteId]: (prev[favoriteId] || []).filter(tag => tag !== tagToRemove),
    }));
  };

  // Loading skeleton
  const LoadingSkeleton = () => (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <Skeleton height="200px" />
          <CardBody>
            <SkeletonText mt="4" noOfLines={2} spacing="4" />
            <Skeleton height="20px" mt="4" />
          </CardBody>
        </Card>
      ))}
    </SimpleGrid>
  );

  // Empty state
  const EmptyState = () => (
    <VStack spacing={4} py={12}>
      <StarIcon boxSize={12} color="gray.300" />
      <Text fontSize="lg" color="gray.600" textAlign="center">
        No favorites found
      </Text>
      <Text fontSize="sm" color="gray.500" textAlign="center">
        {searchTerm ? 'Try adjusting your search terms' : 'Start adding properties to your favorites'}
      </Text>
    </VStack>
  );

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (filteredFavorites.length === 0) {
    return <EmptyState />;
  }

  return (
    <Box className={className}>
      {/* Header Controls */}
      <VStack spacing={4} align="stretch" mb={6}>
        {/* Search and Sort */}
        <HStack spacing={4}>
          <InputGroup flex={1}>
            <InputLeftElement>
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => onSearch?.(e.target.value)}
            />
          </InputGroup>

          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            width="200px"
          >
            <option value="added_date">Date Added</option>
            <option value="price">Price</option>
            <option value="property_type">Property Type</option>
            <option value="location">Location</option>
            <option value="last_viewed">Last Viewed</option>
            <option value="priority">Priority</option>
          </Select>

          <IconButton
            aria-label="Toggle sort order"
            icon={sortOrder === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />}
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            size="sm"
            variant="outline"
          />

          <IconButton
            aria-label="Toggle filters"
            icon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            size="sm"
            variant={showFilters ? 'solid' : 'outline'}
            colorScheme="blue"
          />
        </HStack>

        {/* Selection Controls */}
        {selectedFavorites.length > 0 && (
          <Alert status="info">
            <AlertIcon />
            <AlertDescription>
              {selectedFavorites.length} favorites selected
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        {showFilters && (
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontSize="sm" fontWeight="medium" mb={3}>
              Quick Filters
            </Text>
            <HStack wrap="wrap" spacing={2}>
              <Badge colorScheme="blue" variant="subtle">
                All ({favorites.length})
              </Badge>
              <Badge colorScheme="green" variant="subtle">
                High Priority ({favorites.filter(f => f.priority === 'high').length})
              </Badge>
              <Badge colorScheme="orange" variant="subtle">
                With Notes ({favorites.filter(f => f.notes).length})
              </Badge>
              <Badge colorScheme="purple" variant="subtle">
                With Alerts ({favorites.filter(f => f.priceAlerts?.length).length})
              </Badge>
            </HStack>
          </Box>
        )}
      </VStack>

      {/* Favorites Grid/List */}
      {layout === 'grid' ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {filteredFavorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              onViewProperty={onViewProperty}
              onEditFavorite={onEditFavorite}
              onDeleteFavorite={onDeleteFavorite}
              onToggleFavorite={onToggleFavorite}
              onEditNotes={handleEditNotes}
              onEditTags={handleEditTags}
              selected={selectedFavorites.includes(favorite.id)}
              onSelect={handleFavoriteSelect}
              showNotes={showNotes}
              showTags={showTags}
              showPriority={showPriority}
              showPriceAlerts={showPriceAlerts}
              compact={false}
            />
          ))}
        </SimpleGrid>
      ) : (
        <VStack spacing={4} align="stretch">
          {filteredFavorites.map((favorite) => (
            <FavoriteCard
              key={favorite.id}
              favorite={favorite}
              onViewProperty={onViewProperty}
              onEditFavorite={onEditFavorite}
              onDeleteFavorite={onDeleteFavorite}
              onToggleFavorite={onToggleFavorite}
              onEditNotes={handleEditNotes}
              onEditTags={handleEditTags}
              selected={selectedFavorites.includes(favorite.id)}
              onSelect={handleFavoriteSelect}
              showNotes={showNotes}
              showTags={showTags}
              showPriority={showPriority}
              showPriceAlerts={showPriceAlerts}
              compact={true}
            />
          ))}
        </VStack>
      )}

      {/* Notes Modal */}
      <Modal isOpen={isNotesOpen} onClose={onNotesClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Notes</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Textarea
                value={editingFavorite ? notes[editingFavorite.id] || '' : ''}
                onChange={(e) => setNotes(prev => ({
                  ...prev,
                  [editingFavorite?.id || '']: e.target.value,
                }))}
                placeholder="Add notes about this property..."
                rows={4}
              />
              <HStack justify="flex-end">
                <Button variant="ghost" onClick={onNotesClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleSaveNotes}>
                  Save
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Tags Modal */}
      <Modal isOpen={isTagsOpen} onClose={onTagsClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Tags</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Wrap>
                {(editingFavorite ? tags[editingFavorite.id] || [] : []).map((tag, index) => (
                  <WrapItem key={index}>
                    <Tag colorScheme="blue">
                      <TagLabel>{tag}</TagLabel>
                      <TagCloseButton onClick={() => handleRemoveTag(editingFavorite?.id || '', tag)} />
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
              <HStack>
                <Input
                  placeholder="Add a tag..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag(editingFavorite?.id || '', e.currentTarget.value);
                      e.currentTarget.value = '';
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector('input[placeholder="Add a tag..."]') as HTMLInputElement;
                    if (input?.value) {
                      handleAddTag(editingFavorite?.id || '', input.value);
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </HStack>
              <HStack justify="flex-end">
                <Button variant="ghost" onClick={onTagsClose}>
                  Cancel
                </Button>
                <Button colorScheme="blue" onClick={handleSaveTags}>
                  Save
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

// Individual Favorite Card Component
interface FavoriteCardProps {
  favorite: FavoriteProperty;
  onViewProperty?: (propertyId: string) => void;
  onEditFavorite?: (favorite: FavoriteProperty) => void;
  onDeleteFavorite?: (favoriteId: string) => void;
  onToggleFavorite?: (propertyId: string) => void;
  onEditNotes?: (favorite: FavoriteProperty) => void;
  onEditTags?: (favorite: FavoriteProperty) => void;
  selected?: boolean;
  onSelect?: (favoriteId: string, selected: boolean) => void;
  showNotes?: boolean;
  showTags?: boolean;
  showPriority?: boolean;
  showPriceAlerts?: boolean;
  compact?: boolean;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  favorite,
  onViewProperty,
  onEditFavorite,
  onDeleteFavorite,
  onToggleFavorite,
  onEditNotes,
  onEditTags,
  selected = false,
  onSelect,
  showNotes = true,
  showTags = true,
  showPriority = true,
  showPriceAlerts = true,
  compact = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  if (compact) {
    return (
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        cursor="pointer"
        _hover={{ shadow: 'md' }}
      >
        <CardBody>
          <HStack spacing={4} align="start">
            {/* Selection Checkbox */}
            {onSelect && (
              <Checkbox
                isChecked={selected}
                onChange={(e) => onSelect(favorite.id, e.target.checked)}
                onClick={(e) => e.stopPropagation()}
              />
            )}

            {/* Property Image */}
            <Image
              src={favorite.property.imageUrl}
              alt={favorite.property.title}
              boxSize="80px"
              objectFit="cover"
              borderRadius="md"
              onClick={() => onViewProperty?.(favorite.propertyId)}
            />

            {/* Property Details */}
            <VStack align="start" spacing={2} flex={1}>
              <HStack justify="space-between" width="100%">
                <Text fontSize="lg" fontWeight="semibold" noOfLines={1}>
                  {favorite.property.title}
                </Text>
                <HStack>
                  {showPriority && favorite.priority && (
                    <Badge colorScheme={getPriorityColor(favorite.priority)} size="sm">
                      {favorite.priority}
                    </Badge>
                  )}
                  {showPriceAlerts && favorite.priceAlerts && favorite.priceAlerts.length > 0 && (
                    <Tooltip label={`${favorite.priceAlerts.length} price alerts`}>
                      <BellIcon color="blue.500" />
                    </Tooltip>
                  )}
                </HStack>
              </HStack>

              <HStack spacing={4} color="gray.600" fontSize="sm">
                <HStack>
                  <LocationIcon />
                  <Text>{favorite.property.location}</Text>
                </HStack>
                <HStack>
                  <PriceIcon />
                  <Text>${favorite.property.price.toLocaleString()}</Text>
                </HStack>
                <HStack>
                  <BedIcon />
                  <Text>{favorite.property.bedrooms}</Text>
                </HStack>
                <HStack>
                  <BathIcon />
                  <Text>{favorite.property.bathrooms}</Text>
                </HStack>
                <HStack>
                  <SquareIcon />
                  <Text>{favorite.property.squareFeet.toLocaleString()} sq ft</Text>
                </HStack>
              </HStack>

              {showNotes && favorite.notes && (
                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                  {favorite.notes}
                </Text>
              )}

              {showTags && favorite.tags && favorite.tags.length > 0 && (
                <Wrap>
                  {favorite.tags.map((tag, index) => (
                    <WrapItem key={index}>
                      <Badge colorScheme="blue" variant="subtle" size="sm">
                        {tag}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              )}
            </VStack>

            {/* Actions */}
            <HStack>
              <IconButton
                aria-label="View property"
                icon={<ViewIcon />}
                size="sm"
                variant="ghost"
                onClick={() => onViewProperty?.(favorite.propertyId)}
              />
              <Menu>
                <MenuButton as={IconButton} icon={<MoreIcon />} size="sm" variant="ghost" />
                <MenuList>
                  <MenuItem icon={<EditIcon />} onClick={() => onEditFavorite?.(favorite)}>
                    Edit
                  </MenuItem>
                  <MenuItem icon={<EditIcon />} onClick={() => onEditNotes?.(favorite)}>
                    Edit Notes
                  </MenuItem>
                  <MenuItem icon={<EditIcon />} onClick={() => onEditTags?.(favorite)}>
                    Edit Tags
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<DeleteIcon />} onClick={() => onDeleteFavorite?.(favorite.id)} color="red.500">
                    Remove
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      cursor="pointer"
      _hover={{ shadow: 'lg', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <Box position="absolute" top={2} left={2} zIndex={1}>
          <Checkbox
            isChecked={selected}
            onChange={(e) => onSelect(favorite.id, e.target.checked)}
            onClick={(e) => e.stopPropagation()}
            bg="white"
            borderRadius="md"
            p={1}
          />
        </Box>
      )}

      {/* Property Image */}
      <Box position="relative">
        <Image
          src={favorite.property.imageUrl}
          alt={favorite.property.title}
          height="200px"
          width="100%"
          objectFit="cover"
          onClick={() => onViewProperty?.(favorite.propertyId)}
        />
        
        {/* Priority Badge */}
        {showPriority && favorite.priority && (
          <Badge
            colorScheme={getPriorityColor(favorite.priority)}
            position="absolute"
            top={2}
            right={2}
            size="sm"
          >
            {favorite.priority}
          </Badge>
        )}

        {/* Price Alerts Badge */}
        {showPriceAlerts && favorite.priceAlerts && favorite.priceAlerts.length > 0 && (
          <Tooltip label={`${favorite.priceAlerts.length} price alerts`}>
            <Badge
              colorScheme="blue"
              position="absolute"
              bottom={2}
              right={2}
              size="sm"
            >
              <BellIcon mr={1} />
              {favorite.priceAlerts.length}
            </Badge>
          </Tooltip>
        )}
      </Box>

      <CardBody>
        <VStack align="stretch" spacing={3}>
          {/* Property Title and Price */}
          <VStack align="start" spacing={1}>
            <Text fontSize="lg" fontWeight="semibold" noOfLines={1}>
              {favorite.property.title}
            </Text>
            <Text color="blue.600" fontSize="xl" fontWeight="bold">
              ${favorite.property.price.toLocaleString()}
            </Text>
            <Text color="gray.600" fontSize="sm">
              {favorite.property.location}
            </Text>
          </VStack>

          {/* Property Details */}
          <HStack spacing={4} color="gray.600" fontSize="sm">
            <HStack>
              <BedIcon />
              <Text>{favorite.property.bedrooms} beds</Text>
            </HStack>
            <HStack>
              <BathIcon />
              <Text>{favorite.property.bathrooms} baths</Text>
            </HStack>
            <HStack>
              <SquareIcon />
              <Text>{favorite.property.squareFeet.toLocaleString()} sq ft</Text>
            </HStack>
          </HStack>

          {/* Notes */}
          {showNotes && favorite.notes && (
            <Text fontSize="sm" color="gray.600" noOfLines={2}>
              {favorite.notes}
            </Text>
          )}

          {/* Tags */}
          {showTags && favorite.tags && favorite.tags.length > 0 && (
            <Wrap>
              {favorite.tags.map((tag, index) => (
                <WrapItem key={index}>
                  <Badge colorScheme="blue" variant="subtle" size="sm">
                    {tag}
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
          )}

          {/* Actions */}
          <HStack justify="space-between" pt={2}>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={() => onViewProperty?.(favorite.propertyId)}
            >
              View Details
            </Button>
            
            <HStack>
              <IconButton
                aria-label="Edit notes"
                icon={<EditIcon />}
                size="sm"
                variant="ghost"
                onClick={() => onEditNotes?.(favorite)}
              />
              <Menu>
                <MenuButton as={IconButton} icon={<MoreIcon />} size="sm" variant="ghost" />
                <MenuList>
                  <MenuItem icon={<EditIcon />} onClick={() => onEditFavorite?.(favorite)}>
                    Edit
                  </MenuItem>
                  <MenuItem icon={<EditIcon />} onClick={() => onEditTags?.(favorite)}>
                    Edit Tags
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<DeleteIcon />} onClick={() => onDeleteFavorite?.(favorite.id)} color="red.500">
                    Remove
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};