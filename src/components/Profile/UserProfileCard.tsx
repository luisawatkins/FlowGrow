import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  HStack,
  Avatar,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { signOut, useSession } from 'next-auth/react';

export const UserProfileCard: React.FC = () => {
  const { data: session } = useSession();
  const toast = useToast();

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: true, callbackUrl: '/' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (!session?.user) {
    return null;
  }

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="md">
      <VStack spacing={6} align="stretch">
        <HStack spacing={4}>
          <Avatar
            size="xl"
            name={session.user.name || undefined}
            src={session.user.image || undefined}
          />
          <VStack align="start" spacing={1}>
            <Heading size="md">{session.user.name}</Heading>
            <Text color="gray.600">{session.user.email}</Text>
          </VStack>
        </HStack>

        <Divider />

        <VStack align="stretch" spacing={4}>
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={() => window.location.href = '/properties/create'}
          >
            Create New Listing
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={() => window.location.href = '/favorites'}
          >
            My Favorites
          </Button>
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={() => window.location.href = '/saved-searches'}
          >
            Saved Searches
          </Button>
        </VStack>

        <Divider />

        <Button colorScheme="red" variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </VStack>
    </Box>
  );
};
