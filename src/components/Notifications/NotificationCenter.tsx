import React from 'react';
import {
  Box,
  VStack,
  Text,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Button,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import { useNotifications } from '@/hooks/useNotifications';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    isLoading,
  } = useNotifications();

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label="Notifications"
        icon={
          <Box position="relative">
            <Icon as={FaBell} />
            {unreadCount > 0 && (
              <Badge
                position="absolute"
                top="-2px"
                right="-2px"
                colorScheme="red"
                borderRadius="full"
                minW="18px"
                h="18px"
                fontSize="xs"
              >
                {unreadCount}
              </Badge>
            )}
          </Box>
        }
        variant="ghost"
      />

      <MenuList maxH="400px" overflowY="auto" minW="320px">
        <HStack justify="space-between" px={4} py={2}>
          <Text fontWeight="bold">Notifications</Text>
          {notifications.length > 0 && (
            <Button
              size="sm"
              variant="ghost"
              onClick={markAllAsRead}
              isLoading={isLoading}
            >
              Mark all as read
            </Button>
          )}
        </HStack>

        <MenuDivider />

        {notifications.length === 0 ? (
          <Box p={4} textAlign="center" color="gray.500">
            <Text>No notifications</Text>
          </Box>
        ) : (
          <VStack align="stretch" spacing={0}>
            {notifications.map((notification) => (
              <MenuItem
                key={notification.id}
                py={3}
                px={4}
                bg={notification.isRead ? 'transparent' : 'blue.50'}
              >
                <HStack justify="space-between" width="100%">
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontWeight={notification.isRead ? 'normal' : 'bold'}>
                      {notification.title}
                    </Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {notification.message}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </Text>
                  </VStack>

                  <HStack>
                    {!notification.isRead && (
                      <IconButton
                        aria-label="Mark as read"
                        icon={<FaCheck />}
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                      />
                    )}
                    <IconButton
                      aria-label="Delete notification"
                      icon={<FaTrash />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                    />
                  </HStack>
                </HStack>
              </MenuItem>
            ))}
          </VStack>
        )}
      </MenuList>
    </Menu>
  );
};
