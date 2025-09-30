import React from 'react';
import {
  SimpleGrid,
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaBed, FaBath, FaRuler } from 'react-icons/fa';

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

interface SearchResultsProps {
  results: Property[];
  isLoading?: boolean;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
  if (isLoading) {
    return (
      <SimpleGrid columns={[1, 2, 3]} spacing={6}>
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <Box
            key={index}
            height="400px"
            borderRadius="lg"
            overflow="hidden"
            bg="gray.100"
            animation="pulse 2s infinite"
          />
        ))}
      </SimpleGrid>
    );
  }

  if (results.length === 0) {
    return (
      <Box textAlign="center" py={10}>
        <Text fontSize="lg" color="gray.600">
          No properties found matching your criteria
        </Text>
      </Box>
    );
  }

  return (
    <SimpleGrid columns={[1, 2, 3]} spacing={6}>
      {results.map((property) => (
        <Box
          key={property.id}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bg="white"
          transition="transform 0.2s"
          _hover={{ transform: 'scale(1.02)' }}
          cursor="pointer"
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
          </VStack>
        </Box>
      ))}
    </SimpleGrid>
  );
};
