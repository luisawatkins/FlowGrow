import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  useToast,
} from '@chakra-ui/react';
import {
  FaEllipsisV,
  FaBell,
  FaBellSlash,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';
import { useSavedSearches } from '@/hooks/useSavedSearches';

interface SavedSearchesListProps {
  onEdit: (searchId: string) => void;
}

export const SavedSearchesList: React.FC<SavedSearchesListProps> = ({
  onEdit,
}) => {
  const {
    savedSearches,
    isLoading,
    deleteSearch,
    toggleNotifications,
  } = useSavedSearches();
  const toast = useToast();

  const handleDelete = async (searchId: string) => {
    try {
      await deleteSearch(searchId);
      toast({
        title: 'Search deleted',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete search',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleToggleNotifications = async (searchId: string) => {
    try {
      await toggleNotifications(searchId);
      toast({
        title: 'Notifications updated',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to update notifications',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg">
        <Text>Loading saved searches...</Text>
      </Box>
    );
  }

  if (savedSearches.length === 0) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" textAlign="center">
        <Text color="gray.600">No saved searches yet</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {savedSearches.map((search) => (
        <Box
          key={search.id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          <HStack justify="space-between" mb={2}>
            <HStack>
              <Text fontWeight="bold">{search.name}</Text>
              {search.notifications && (
                <Badge colorScheme="blue">Notifications On</Badge>
              )}
            </HStack>

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaEllipsisV />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem
                  icon={<FaEdit />}
                  onClick={() => onEdit(search.id)}
                >
                  Edit Search
                </MenuItem>
                <MenuItem
                  icon={search.notifications ? <FaBellSlash /> : <FaBell />}
                  onClick={() => handleToggleNotifications(search.id)}
                >
                  {search.notifications
                    ? 'Disable Notifications'
                    : 'Enable Notifications'}
                </MenuItem>
                <Divider />
                <MenuItem
                  icon={<FaTrash />}
                  color="red.500"
                  onClick={() => handleDelete(search.id)}
                >
                  Delete Search
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          <VStack align="start" spacing={1}>
            {Object.entries(search.criteria).map(([key, value]) => (
              <Text key={key} fontSize="sm" color="gray.600">
                {key}: {JSON.stringify(value)}
              </Text>
            ))}
          </VStack>

          <Button
            mt={4}
            size="sm"
            colorScheme="blue"
            variant="outline"
            as="a"
            href={`/search?${new URLSearchParams(search.criteria).toString()}`}
          >
            Run Search
          </Button>
        </Box>
      ))}
    </VStack>
  );
};
