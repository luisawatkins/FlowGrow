import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Image,
  Text,
  IconButton,
  Box,
  Badge,
  VStack,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { useComparison } from '@/hooks/useComparison';

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
  yearBuilt: number;
  parking: string;
  features: string[];
  amenities: string[];
}

interface ComparisonTableProps {
  properties: Property[];
  onRemove: (propertyId: string) => void;
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  properties,
  onRemove,
}) => {
  const renderValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Icon as={FaCheck} color="green.500" />
      ) : (
        <Icon as={FaTimes} color="red.500" />
      );
    }
    if (typeof value === 'number') {
      if (value > 1000) {
        return value.toLocaleString();
      }
      return value;
    }
    return value;
  };

  const renderFeaturesList = (features: string[]) => (
    <VStack align="start" spacing={1}>
      {features.map((feature, index) => (
        <Text key={index} fontSize="sm">
          • {feature}
        </Text>
      ))}
    </VStack>
  );

  return (
    <Box overflowX="auto">
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Features</Th>
            {properties.map((property) => (
              <Th key={property.id}>
                <VStack align="stretch" spacing={4}>
                  <HStack justify="space-between">
                    <Text>{property.title}</Text>
                    <IconButton
                      aria-label="Remove from comparison"
                      icon={<FaTrash />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => onRemove(property.id)}
                    />
                  </HStack>
                  <Image
                    src={property.imageUrl}
                    alt={property.title}
                    height="150px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                </VStack>
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td fontWeight="bold">Price</Td>
            {properties.map((property) => (
              <Td key={property.id}>
                <Text color="blue.600" fontWeight="bold">
                  ${property.price.toLocaleString()}
                </Text>
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Property Type</Td>
            {properties.map((property) => (
              <Td key={property.id}>
                <Badge colorScheme="blue">{property.propertyType}</Badge>
              </Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Location</Td>
            {properties.map((property) => (
              <Td key={property.id}>{property.location}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Bedrooms</Td>
            {properties.map((property) => (
              <Td key={property.id}>{property.bedrooms}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Bathrooms</Td>
            {properties.map((property) => (
              <Td key={property.id}>{property.bathrooms}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Square Feet</Td>
            {properties.map((property) => (
              <Td key={property.id}>{property.squareFeet.toLocaleString()}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Year Built</Td>
            {properties.map((property) => (
              <Td key={property.id}>{property.yearBuilt}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Parking</Td>
            {properties.map((property) => (
              <Td key={property.id}>{property.parking}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Features</Td>
            {properties.map((property) => (
              <Td key={property.id}>{renderFeaturesList(property.features)}</Td>
            ))}
          </Tr>
          <Tr>
            <Td fontWeight="bold">Amenities</Td>
            {properties.map((property) => (
              <Td key={property.id}>{renderFeaturesList(property.amenities)}</Td>
            ))}
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};
