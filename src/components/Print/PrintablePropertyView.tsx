import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Image,
  Grid,
  GridItem,
  Divider,
  Icon,
  List,
  ListItem,
} from '@chakra-ui/react';
import {
  FaBed,
  FaBath,
  FaRuler,
  FaParking,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';

interface PropertyDetails {
  id: string;
  title: string;
  price: number;
  description: string;
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

interface PrintablePropertyViewProps {
  property: PropertyDetails;
}

export const PrintablePropertyView: React.FC<PrintablePropertyViewProps> = ({
  property,
}) => {
  return (
    <Box
      p={8}
      bg="white"
      className="printable-view"
      sx={{
        '@media print': {
          p: 0,
          color: 'black',
        },
      }}
    >
      {/* Header */}
      <VStack spacing={4} align="stretch" mb={8}>
        <Text fontSize="2xl" fontWeight="bold">
          {property.title}
        </Text>
        <HStack>
          <Icon as={FaMapMarkerAlt} />
          <Text>{property.location}</Text>
        </HStack>
        <Text fontSize="xl" fontWeight="bold" color="blue.600">
          ${property.price.toLocaleString()}
        </Text>
      </VStack>

      {/* Main Image */}
      <Box mb={8}>
        <Image
          src={property.imageUrl}
          alt={property.title}
          width="100%"
          height="400px"
          objectFit="cover"
          borderRadius="lg"
        />
      </Box>

      {/* Property Details */}
      <Grid templateColumns="repeat(2, 1fr)" gap={6} mb={8}>
        <GridItem>
          <VStack align="start" spacing={4}>
            <HStack>
              <Icon as={FaBed} />
              <Text>{property.bedrooms} Bedrooms</Text>
            </HStack>
            <HStack>
              <Icon as={FaBath} />
              <Text>{property.bathrooms} Bathrooms</Text>
            </HStack>
            <HStack>
              <Icon as={FaRuler} />
              <Text>{property.squareFeet.toLocaleString()} sq ft</Text>
            </HStack>
          </VStack>
        </GridItem>
        <GridItem>
          <VStack align="start" spacing={4}>
            <HStack>
              <Icon as={FaCalendarAlt} />
              <Text>Built in {property.yearBuilt}</Text>
            </HStack>
            <HStack>
              <Icon as={FaParking} />
              <Text>{property.parking}</Text>
            </HStack>
            <Text>{property.propertyType}</Text>
          </VStack>
        </GridItem>
      </Grid>

      <Divider my={8} />

      {/* Description */}
      <VStack align="stretch" spacing={4} mb={8}>
        <Text fontSize="xl" fontWeight="bold">
          Description
        </Text>
        <Text whiteSpace="pre-wrap">{property.description}</Text>
      </VStack>

      {/* Features and Amenities */}
      <Grid templateColumns="repeat(2, 1fr)" gap={8}>
        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              Features
            </Text>
            <List spacing={2}>
              {property.features.map((feature, index) => (
                <ListItem key={index}>{feature}</ListItem>
              ))}
            </List>
          </VStack>
        </GridItem>
        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="xl" fontWeight="bold">
              Amenities
            </Text>
            <List spacing={2}>
              {property.amenities.map((amenity, index) => (
                <ListItem key={index}>{amenity}</ListItem>
              ))}
            </List>
          </VStack>
        </GridItem>
      </Grid>

      {/* Footer */}
      <Box mt={12} pt={8} borderTop="1px" borderColor="gray.200">
        <VStack spacing={2} align="center" fontSize="sm" color="gray.600">
          <Text>Property ID: {property.id}</Text>
          <Text>Generated on {new Date().toLocaleDateString()}</Text>
          <Text>FlowGrow Real Estate</Text>
        </VStack>
      </Box>
    </Box>
  );
};
