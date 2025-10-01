import React, { useState } from 'react';
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
  IconButton,
  Badge,
  Alert,
  AlertIcon,
  AlertDescription,
  Divider,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  MenuGroupTitle,
} from '@chakra-ui/react';
import {
  StarIcon,
  SettingsIcon,
  DownloadIcon,
  UploadIcon,
  AddIcon,
  DeleteIcon,
  EditIcon,
  ViewIcon,
  ShareIcon,
  FilterIcon,
  SearchIcon,
  ChevronDownIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import { useEnhancedFavorites } from '@/hooks/useEnhancedFavorites';
import { FavoritesList } from './FavoritesList';
import { FavoritesFilters } from './FavoritesFilters';
import { FavoritesAnalytics } from './FavoritesAnalytics';
import { FavoritesExport } from './FavoritesExport';
import { CreateFavoriteModal } from './CreateFavoriteModal';
import { EditFavoriteModal } from './EditFavoriteModal';
import { FavoritesListManager } from './FavoritesListManager';

interface EnhancedFavoritesManagerProps {
  userId?: string;
  onViewProperty?: (propertyId: string) => void;
  onEditFavorite?: (favorite: any) => void;
  onDeleteFavorite?: (favoriteId: string) => void;
  onShareList?: (listId: string) => void;
  className?: string;
  showAnalytics?: boolean;
  showFilters?: boolean;
  showLists?: boolean;
  showExport?: boolean;
  maxItems?: number;
}

export const EnhancedFavoritesManager: React.FC<EnhancedFavoritesManagerProps> = ({
  userId = 'user_1', // Default for demo
  onViewProperty,
  onEditFavorite,
  onDeleteFavorite,
  onShareList,
  className = '',
  showAnalytics = true,
  showFilters = true,
  showLists = true,
  showExport = true,
  maxItems = 50,
}) => {
  const {
    favorites,
    isLoading,
    error,
    totalCount,
    analytics,
    addFavorite,
    removeFavorite,
    updateFavorite,
    toggleFavorite,
    isFavorited,
    getFavorite,
    setFilters,
    clearFilters,
    searchFavorites,
    sortFavorites,
    createList,
    addToList,
    removeFromList,
    deleteList,
    exportFavorites,
    importFavorites,
    bulkAdd,
    bulkRemove,
    bulkUpdate,
    refresh,
  } = useEnhancedFavorites(userId);

  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  // Modal states
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isListsOpen, onOpen: onListsOpen, onClose: onListsClose } = useDisclosure();

  const [editingFavorite, setEditingFavorite] = useState<any>(null);

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    searchFavorites(term);
  };

  // Handle favorite selection
  const handleFavoriteSelect = (favoriteId: string, selected: boolean) => {
    if (selected) {
      setSelectedFavorites(prev => [...prev, favoriteId]);
    } else {
      setSelectedFavorites(prev => prev.filter(id => id !== favoriteId));
    }
  };

  // Handle bulk selection
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedFavorites(favorites.map(fav => fav.id));
    } else {
      setSelectedFavorites([]);
    }
  };

  // Handle bulk operations
  const handleBulkRemove = async () => {
    try {
      await bulkRemove(selectedFavorites);
      setSelectedFavorites([]);
    } catch (error) {
      console.error('Failed to remove favorites:', error);
    }
  };

  const handleBulkUpdate = async (updates: any) => {
    try {
      await bulkUpdate(selectedFavorites, updates);
      setSelectedFavorites([]);
    } catch (error) {
      console.error('Failed to update favorites:', error);
    }
  };

  // Handle edit favorite
  const handleEditFavorite = (favorite: any) => {
    setEditingFavorite(favorite);
    onEditOpen();
  };

  // Handle delete favorite
  const handleDeleteFavorite = async (favoriteId: string) => {
    try {
      await removeFavorite(favoriteId);
      onDeleteFavorite?.(favoriteId);
    } catch (error) {
      console.error('Failed to delete favorite:', error);
    }
  };

  // Handle export
  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const exportData = await exportFavorites(format);
      // In a real app, this would trigger a download
      console.log('Export data:', exportData);
    } catch (error) {
      console.error('Failed to export favorites:', error);
    }
  };

  // Handle import
  const handleImport = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const result = await importFavorites(data);
      
      if (result.validation.isValid) {
        console.log('Import successful:', result);
      } else {
        console.error('Import failed:', result.validation.errors);
      }
    } catch (error) {
      console.error('Failed to import favorites:', error);
    }
  };

  return (
    <Box className={className}>
      {/* Header */}
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <HStack>
              <StarIcon color="blue.500" />
              <Text fontSize="2xl" fontWeight="bold">
                My Favorites
              </Text>
              <Badge colorScheme="blue" variant="subtle">
                {totalCount}
              </Badge>
            </HStack>
            <Text color="gray.600" fontSize="sm">
              Manage your saved properties and create custom lists
            </Text>
          </VStack>

          <HStack>
            <Button
              leftIcon={<AddIcon />}
              onClick={onCreateOpen}
              colorScheme="blue"
              size="sm"
            >
              Add Property
            </Button>
            
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm" variant="outline">
                Actions
              </MenuButton>
              <MenuList>
                <MenuGroup title="Bulk Actions">
                  <MenuItem
                    icon={<DeleteIcon />}
                    onClick={handleBulkRemove}
                    isDisabled={selectedFavorites.length === 0}
                  >
                    Remove Selected ({selectedFavorites.length})
                  </MenuItem>
                  <MenuItem
                    icon={<EditIcon />}
                    onClick={() => handleBulkUpdate({ priority: 'high' })}
                    isDisabled={selectedFavorites.length === 0}
                  >
                    Mark as High Priority
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="Data">
                  <MenuItem icon={<DownloadIcon />} onClick={onExportOpen}>
                    Export Favorites
                  </MenuItem>
                  <MenuItem icon={<UploadIcon />} onClick={() => document.getElementById('import-file')?.click()}>
                    Import Favorites
                  </MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuGroup title="Lists">
                  <MenuItem icon={<SettingsIcon />} onClick={onListsOpen}>
                    Manage Lists
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>

            <IconButton
              aria-label="Refresh favorites"
              icon={<ViewIcon />}
              onClick={refresh}
              isLoading={isLoading}
              size="sm"
              variant="ghost"
            />
          </HStack>
        </HStack>

        {/* Error Alert */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Quick Stats */}
        {analytics && (
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                Total Favorites
              </StatLabel>
              <StatNumber fontSize="lg" color="blue.600">
                {analytics.totalFavorites}
              </StatNumber>
              <StatHelpText fontSize="xs">
                Properties saved
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                Average Price
              </StatLabel>
              <StatNumber fontSize="lg" color="green.600">
                ${Math.round(analytics.averagePrice).toLocaleString()}
              </StatNumber>
              <StatHelpText fontSize="xs">
                Price range: ${analytics.priceRange.min.toLocaleString()} - ${analytics.priceRange.max.toLocaleString()}
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                Property Types
              </StatLabel>
              <StatNumber fontSize="lg" color="purple.600">
                {Object.keys(analytics.propertyTypes).length}
              </StatNumber>
              <StatHelpText fontSize="xs">
                Different types
              </StatHelpText>
            </Stat>

            <Stat>
              <StatLabel fontSize="sm" color="gray.600">
                Days in Favorites
              </StatLabel>
              <StatNumber fontSize="lg" color="orange.600">
                {Math.round(analytics.averageDaysInFavorites)}
              </StatNumber>
              <StatHelpText fontSize="xs">
                Average time saved
              </StatHelpText>
            </Stat>
          </SimpleGrid>
        )}

        {/* Main Content */}
        <Tabs index={activeTab} onChange={setActiveTab}>
          <TabList>
            <Tab>
              <HStack>
                <Text>All Favorites</Text>
                <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                  {favorites.length}
                </Badge>
              </HStack>
            </Tab>
            {showFilters && (
              <Tab>
                <HStack>
                  <FilterIcon />
                  <Text>Filters</Text>
                </HStack>
              </Tab>
            )}
            {showAnalytics && (
              <Tab>
                <HStack>
                  <InfoIcon />
                  <Text>Analytics</Text>
                </HStack>
              </Tab>
            )}
            {showLists && (
              <Tab>
                <HStack>
                  <SettingsIcon />
                  <Text>Lists</Text>
                </HStack>
              </Tab>
            )}
          </TabList>

          <TabPanels>
            {/* All Favorites Tab */}
            <TabPanel px={0}>
              <FavoritesList
                favorites={favorites}
                isLoading={isLoading}
                onViewProperty={onViewProperty}
                onEditFavorite={handleEditFavorite}
                onDeleteFavorite={handleDeleteFavorite}
                onToggleFavorite={toggleFavorite}
                selectedFavorites={selectedFavorites}
                onFavoriteSelect={handleFavoriteSelect}
                onSelectAll={handleSelectAll}
                searchTerm={searchTerm}
                onSearch={handleSearch}
                showNotes={true}
                showTags={true}
                showPriority={true}
                showPriceAlerts={true}
                layout="grid"
                maxItems={maxItems}
              />
            </TabPanel>

            {/* Filters Tab */}
            {showFilters && (
              <TabPanel px={0}>
                <FavoritesFilters
                  filters={{}}
                  onFiltersChange={setFilters}
                  onClearFilters={clearFilters}
                  showAdvanced={true}
                />
              </TabPanel>
            )}

            {/* Analytics Tab */}
            {showAnalytics && analytics && (
              <TabPanel px={0}>
                <FavoritesAnalytics
                  analytics={analytics}
                  onFilterClick={(filter, value) => {
                    console.log('Filter clicked:', filter, value);
                  }}
                  showCharts={true}
                  showTrends={true}
                />
              </TabPanel>
            )}

            {/* Lists Tab */}
            {showLists && (
              <TabPanel px={0}>
                <FavoritesListManager
                  userId={userId}
                  onShareList={onShareList}
                />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
      </VStack>

      {/* Modals */}
      <CreateFavoriteModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onAddFavorite={addFavorite}
      />

      <EditFavoriteModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        favorite={editingFavorite}
        onUpdateFavorite={updateFavorite}
      />

      <FavoritesExport
        isOpen={isExportOpen}
        onClose={onExportClose}
        onExport={handleExport}
        onImport={handleImport}
      />

      <FavoritesListManager
        isOpen={isListsOpen}
        onClose={onListsClose}
        userId={userId}
        onShareList={onShareList}
      />

      {/* Hidden file input for import */}
      <input
        id="import-file"
        type="file"
        accept=".json,.csv"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImport(file);
        }}
      />
    </Box>
  );
};
