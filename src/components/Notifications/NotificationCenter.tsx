import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  Stack,
  Text,
  Badge,
  useToast,
  VStack,
  HStack,
  Icon,
  Divider,
} from '@chakra-ui/react';
import { FaBell, FaEnvelope, FaHome, FaTag, FaInfoCircle } from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import type { Notification } from '@/app/api/notifications/route';

const NOTIFICATION_ICONS = {
  property_update: FaHome,
  price_change: FaTag,
  new_message: FaEnvelope,
  inquiry: FaEnvelope,
  system: FaInfoCircle,
};

const NOTIFICATION_COLORS = {
  property_update: 'blue',
  price_change: 'green',
  new_message: 'purple',
  inquiry: 'orange',
  system: 'gray',
};

export const NotificationCenter: React.FC = () => {
  const { data: session } = useSession();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const fetchNotifications = async () => {
    if (!session?.user) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/notifications');
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch notifications',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Set up polling for new notifications
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, [session]);

  const handleMarkAllAsRead = async () => {
    if (!session?.user) return;

    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to mark notifications as read');
      }

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );

      toast({
        title: 'Success',
        description: 'All notifications marked as read',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      try {
        const response = await fetch(`/api/notifications/${notification.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isRead: true }),
        });

        if (!response.ok) {
          throw new Error('Failed to mark notification as read');
        }

        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notification.id ? { ...n, isRead: true } : n
          )
        );
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }

    // Handle navigation based on notification type
    if (notification.propertyId) {
      window.location.href = `/properties/${notification.propertyId}`;
    }
    setIsOpen(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 7) {
      return `${days}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Popover
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      placement="bottom-end"
    >
      <PopoverTrigger>
        <Box position="relative" display="inline-block">
          <IconButton
            aria-label="Notifications"
            icon={<FaBell />}
            variant="ghost"
            onClick={() => setIsOpen(!isOpen)}
          />
          {unreadCount > 0 && (
            <Badge
              colorScheme="red"
              position="absolute"
              top="-1"
              right="-1"
              borderRadius="full"
              minW="1.5em"
            >
              {unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>

      <PopoverContent width="400px">
        <PopoverHeader fontWeight="bold">
          <HStack justify="space-between">
            <Text>Notifications</Text>
            {unreadCount > 0 && (
              <Button size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </HStack>
        </PopoverHeader>

        <PopoverBody maxH="400px" overflowY="auto">
          {isLoading ? (
            <Text textAlign="center" py={4}>
              Loading notifications...
            </Text>
          ) : notifications.length === 0 ? (
            <Text textAlign="center" py={4} color="gray.500">
              No notifications
            </Text>
          ) : (
            <VStack spacing={0} align="stretch">
              {notifications.map((notification) => (
                <Box
                  key={notification.id}
                  p={3}
                  cursor="pointer"
                  onClick={() => handleNotificationClick(notification)}
                  bg={notification.isRead ? 'transparent' : 'gray.50'}
                  _hover={{ bg: 'gray.100' }}
                  transition="background-color 0.2s"
                >
                  <HStack spacing={3} align="start">
                    <Icon
                      as={NOTIFICATION_ICONS[notification.type]}
                      color={`${NOTIFICATION_COLORS[notification.type]}.500`}
                      boxSize={5}
                      mt={1}
                    />
                    <VStack spacing={1} align="start" flex={1}>
                      <Text fontWeight={notification.isRead ? 'normal' : 'bold'}>
                        {notification.title}
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        {notification.message}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {formatDate(notification.createdAt)}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
            </VStack>
          )}
        </PopoverBody>

        <PopoverFooter>
          <Button
            size="sm"
            variant="ghost"
            width="full"
            onClick={() => {
              setIsOpen(false);
              window.location.href = '/notifications';
            }}
          >
            View All Notifications
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};