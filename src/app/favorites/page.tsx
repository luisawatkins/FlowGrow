import React from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { PropertyCard } from '@/components/PropertyCard';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

async function getFavorites() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/signin');
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/favorites`, {
      headers: {
        Cookie: `next-auth.session-token=${session.user.id}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch favorites');
    }

    const data = await response.json();
    return data.favorites;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
}

export default async function FavoritesPage() {
  const favorites = await getFavorites();

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="xl" mb={2}>My Favorites</Heading>
          <Text color="gray.600">
            Properties you've saved for later
          </Text>
        </Box>

        {favorites.length === 0 ? (
          <Box
            p={8}
            bg="white"
            borderRadius="lg"
            textAlign="center"
            boxShadow="sm"
          >
            <Text fontSize="lg" color="gray.600">
              You haven't saved any properties to your favorites yet.
            </Text>
          </Box>
        ) : (
          <Grid
            templateColumns={{
              base: '1fr',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap={6}
          >
            {favorites.map((property: any) => (
              <PropertyCard
                key={property.id}
                property={property}
                showFavoriteButton
              />
            ))}
          </Grid>
        )}
      </VStack>
    </Container>
  );
}