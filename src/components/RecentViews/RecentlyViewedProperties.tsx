import React from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  VStack,
  HStack,
  Icon,
  Badge,
  Button,
  Skeleton,
} from '@chakra-ui/react';
import { FaBed, FaBath, FaRuler, FaClock } from 'react-icons/fa';
import { useRecentViews } from '@/hooks/useRecentViews';

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
  viewedAt: string;
}

export const RecentlyViewedProperties: React.FC = () => {
  const { recentProperties, isLoading, clearHistory } = useRecentViews();

  if (isLoading) {
    return (
      <Box>
        <HStack justify="space-between" mb={6}>
          <Heading size="lg">Recently Viewed</Heading>
          <Skeleton height="40px" width="120px" />
        </HStack>
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton key={index} height="400px" borderRadius="lg" />
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  if (recentProperties.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.600">
          No recently viewed properties
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
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Recently Viewed</Heading>
        <Button
          variant="ghost"
          colorScheme="blue"
          onClick={clearHistory}
        >
          Clear History
        </Button>
      </HStack>

      <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
        {recentProperties.map((property: Property) => (
          <Box
            key={property.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bg="white"
            transition="transform 0.2s"
            _hover={{ transform: 'scale(1.02)' }}
            cursor="pointer"
            as="a"
            href={`/properties/${property.id}`}
          >
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

              <HStack color="gray.500" fontSize="sm">
                <Icon as={FaClock} />
                <Text>
                  Viewed {new Date(property.viewedAt).toLocaleDateString()}
                </Text>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
