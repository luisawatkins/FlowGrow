import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  IconButton,
  Badge,
  Alert,
  AlertIcon,
  AlertDescription,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from '@chakra-ui/react';
import {
  StarIcon,
  FilterIcon,
  SettingsIcon,
  DownloadIcon,
  UploadIcon,
  AddIcon,
  ViewIcon,
  ShareIcon,
} from '@chakra-ui/icons';
import { EnhancedFavoritesManager } from '@/components/Favorites/EnhancedFavoritesManager';
import { FavoritesList } from '@/components/Favorites/FavoritesList';
import { FavoritesFilters } from '@/components/Favorites/FavoritesFilters';
import { FavoritesAnalytics } from '@/components/Favorites/FavoritesAnalytics';
import { FavoritesExport } from '@/components/Favorites/FavoritesExport';
import { CreateFavoriteModal } from '@/components/Favorites/CreateFavoriteModal';
import { EditFavoriteModal } from '@/components/Favorites/EditFavoriteModal';
import { FavoritesListManager } from '@/components/Favorites/FavoritesListManager';
import { useEnhancedFavorites } from '@/hooks/useEnhancedFavorites';

export default function EnhancedFavoritesPage() {
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
  } = useEnhancedFavorites('user_1'); // Default user for demo

  const [selectedFavorites, setSelectedFavorites] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [editingFavorite, setEditingFavorite] = useState<any>(null);

  // Modal states
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isExportOpen, onOpen: onExportOpen, onClose: onExportClose } = useDisclosure();
  const { isOpen: isListsOpen, onOpen: onListsOpen, onClose: onListsClose } = useDisclosure();
  const { isOpen: isFiltersOpen, onOpen: onFiltersOpen, onClose: onFiltersClose } = useDisclosure();
  const { isOpen: isAnalyticsOpen, onOpen: onAnalyticsOpen, onClose: onAnalyticsClose } = useDisclosure();

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
    } catch (error) {
      console.error('Failed to delete favorite:', error);
    }
  };

  // Handle view property
  const handleViewProperty = (propertyId: string) => {
    // In a real app, this would navigate to the property page
    console.log('View property:', propertyId);
  };

  // Handle share list
  const handleShareList = (listId: string) => {
    // In a real app, this would generate a shareable link
    console.log('Share list:', listId);
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
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box>
          <HStack justify="space-between" align="center" mb={4}>
            <VStack align="start" spacing={1}>
              <HStack>
                <StarIcon color="blue.500" />
                <Text fontSize="3xl" fontWeight="bold">
                  My Favorites
                </Text>
                <Badge colorScheme="blue" variant="subtle" fontSize="lg">
                  {totalCount}
                </Badge>
              </HStack>
              <Text color="gray.600" fontSize="lg">
                Manage your saved properties and create custom lists
              </Text>
            </VStack>

            <HStack>
              <Button
                leftIcon={<AddIcon />}
                onClick={onCreateOpen}
                colorScheme="blue"
                size="lg"
              >
                Add Property
              </Button>
            </HStack>
          </HStack>

          {/* Quick Stats */}
          {analytics && (
            <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} mb={6}>
              <Stat>
                <StatLabel fontSize="sm" color="gray.600">
                  Total Favorites
                </StatLabel>
                <StatNumber fontSize="xl" color="blue.600">
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
                <StatNumber fontSize="xl" color="green.600">
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
                <StatNumber fontSize="xl" color="purple.600">
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
                <StatNumber fontSize="xl" color="orange.600">
                  {Math.round(analytics.averageDaysInFavorites)}
                </StatNumber>
                <StatHelpText fontSize="xs">
                  Average time saved
                </StatHelpText>
              </Stat>
            </SimpleGrid>
          )}
        </Box>

        {/* Action Bar */}
        <HStack justify="space-between" align="center" wrap="wrap" spacing={4}>
          <HStack spacing={4}>
            <Button
              leftIcon={<FilterIcon />}
              onClick={onFiltersOpen}
              variant="outline"
              size="sm"
            >
              Filters
            </Button>
            
            <Button
              leftIcon={<SettingsIcon />}
              onClick={onAnalyticsOpen}
              variant="outline"
              size="sm"
            >
              Analytics
            </Button>
            
            <Button
              leftIcon={<SettingsIcon />}
              onClick={onListsOpen}
              variant="outline"
              size="sm"
            >
              Lists
            </Button>
          </HStack>

          <HStack>
            <Button
              leftIcon={<DownloadIcon />}
              onClick={onExportOpen}
              variant="ghost"
              size="sm"
            >
              Export
            </Button>
            
            <Button
              leftIcon={<UploadIcon />}
              onClick={() => document.getElementById('import-file')?.click()}
              variant="ghost"
              size="sm"
            >
              Import
            </Button>
            
            {selectedFavorites.length > 0 && (
              <Button
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={handleBulkRemove}
              >
                Remove Selected ({selectedFavorites.length})
              </Button>
            )}
          </HStack>
        </HStack>

        {/* Error Alert */}
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Box>
          <FavoritesList
            favorites={favorites}
            isLoading={isLoading}
            onViewProperty={handleViewProperty}
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
            maxItems={50}
          />
        </Box>

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
          userId="user_1"
          onShareList={handleShareList}
        />

        {/* Drawers */}
        <Drawer isOpen={isFiltersOpen} onClose={onFiltersClose} size="md">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              <HStack>
                <FilterIcon />
                <Text>Filter Favorites</Text>
              </HStack>
            </DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              <FavoritesFilters
                filters={{}}
                onFiltersChange={setFilters}
                onClearFilters={clearFilters}
                showAdvanced={true}
              />
            </DrawerBody>
          </DrawerContent>
        </Drawer>

        <Drawer isOpen={isAnalyticsOpen} onClose={onAnalyticsClose} size="lg">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader>
              <HStack>
                <SettingsIcon />
                <Text>Favorites Analytics</Text>
              </HStack>
            </DrawerHeader>
            <DrawerCloseButton />
            <DrawerBody>
              {analytics && (
                <FavoritesAnalytics
                  analytics={analytics}
                  onFilterClick={(filter, value) => {
                    console.log('Filter clicked:', filter, value);
                  }}
                  showCharts={true}
                  showTrends={true}
                />
              )}
            </DrawerBody>
          </DrawerContent>
        </Drawer>

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
      </VStack>
    </Container>
  );
}
