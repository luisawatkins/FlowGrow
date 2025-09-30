import React from 'react';
import {
  Box,
  VStack,
  Heading,
  Text,
  SimpleGrid,
  Button,
  Image,
  Badge,
  HStack,
  Icon,
  Skeleton,
} from '@chakra-ui/react';
import { FaBed, FaBath, FaRuler } from 'react-icons/fa';
import { useFavorites } from '@/hooks/useFavorites';
import { FavoriteButton } from './FavoriteButton';

interface Property {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  location: string;
}

export const FavoritesList: React.FC = () => {
  const { favoriteProperties, isLoading } = useFavorites();

  if (isLoading) {
    return (
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {[1, 2, 3].map((_, index) => (
          <Skeleton key={index} height="400px" borderRadius="lg" />
        ))}
      </SimpleGrid>
    );
  }

  if (favoriteProperties.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.600">
          You haven't added any properties to your favorites yet.
        </Text>
        <Button
          colorScheme="blue"
          mt={4}
          as="a"
          href="/search"
        >
          Browse Properties
        </Button>
      </Box>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Heading size="lg">Your Favorite Properties</Heading>
      
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {favoriteProperties.map((property: Property) => (
          <Box
            key={property.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            position="relative"
          >
            <Box position="absolute" top={2} right={2} zIndex={1}>
              <FavoriteButton propertyId={property.id} />
            </Box>

            <Image
              src={property.imageUrl}
              alt={property.title}
              height="200px"
              width="100%"
              objectFit="cover"
            />

            <VStack p={4} spacing={3} align="stretch">
              <Badge colorScheme="blue" alignSelf="flex-start">
                {property.propertyType}
              </Badge>

              <Text fontSize="xl" fontWeight="semibold" noOfLines={1}>
                {property.title}
              </Text>

              <Text color="gray.600" fontSize="sm">
                {property.location}
              </Text>

              <Text color="blue.600" fontSize="2xl" fontWeight="bold">
                ${property.price.toLocaleString()}
              </Text>

              <HStack spacing={4} color="gray.600">
                <HStack>
                  <Icon as={FaBed} />
                  <Text>{property.bedrooms} beds</Text>
                </HStack>
                <HStack>
                  <Icon as={FaBath} />
                  <Text>{property.bathrooms} baths</Text>
                </HStack>
                <HStack>
                  <Icon as={FaRuler} />
                  <Text>{property.squareFeet.toLocaleString()} sq ft</Text>
                </HStack>
              </HStack>

              <Button
                as="a"
                href={`/properties/${property.id}`}
                colorScheme="blue"
                variant="outline"
                size="sm"
                mt={2}
              >
                View Details
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  );
};
