import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Badge,
} from '@chakra-ui/react';
import {
  FaHome,
  FaSearch,
  FaHeart,
  FaUser,
  FaBell,
} from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number;
}

export const MobileBottomNavigation: React.FC = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const navItems: NavItem[] = [
    { label: 'Home', icon: FaHome, href: '/' },
    { label: 'Search', icon: FaSearch, href: '/search' },
    { label: 'Favorites', icon: FaHeart, href: '/favorites', badge: 3 },
    { label: 'Notifications', icon: FaBell, href: '/notifications', badge: 5 },
    { label: 'Profile', icon: FaUser, href: '/profile' },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      display={{ base: 'block', md: 'none' }}
      zIndex={1000}
      bg={bgColor}
      borderTop="1px"
      borderColor={borderColor}
      px={4}
      py={2}
      boxShadow="0 -2px 10px rgba(0, 0, 0, 0.05)"
    >
      <HStack justify="space-between" spacing={0}>
        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          const IconComponent = item.icon;

          return (
            <VStack
              key={item.label}
              spacing={1}
              flex={1}
              py={2}
              cursor="pointer"
              onClick={() => handleNavigation(item.href)}
              color={isActive ? 'blue.500' : 'gray.500'}
              position="relative"
              transition="all 0.2s"
              _hover={{ color: 'blue.500' }}
            >
              <Box position="relative">
                <IconComponent size={20} />
                {item.badge && (
                  <Badge
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    colorScheme="red"
                    borderRadius="full"
                    minW="18px"
                    h="18px"
                    textAlign="center"
                    fontSize="xs"
                    p={0}
                  >
                    {item.badge}
                  </Badge>
                )}
              </Box>
              <Text
                fontSize="xs"
                fontWeight={isActive ? 'bold' : 'normal'}
                display={{ base: 'none', sm: 'block' }}
              >
                {item.label}
              </Text>
            </VStack>
          );
        })}
      </HStack>
    </Box>
  );
};