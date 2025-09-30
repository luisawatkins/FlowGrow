import React from 'react';
import {
  Box,
  Image,
  Text,
  HStack,
  VStack,
  Icon,
  Badge,
  IconButton,
  useColorModeValue,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import {
  FaBed,
  FaBath,
  FaRuler,
  FaHeart,
  FaRegHeart,
  FaCamera,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { useRouter } from 'next/router';

interface MobilePropertyCardProps {
  property: {
    id: string;
    title: string;
    price: number;
    imageUrl: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    location: string;
    propertyType: string;
    isFavorite?: boolean;
    imageCount?: number;
    isNew?: boolean;
    isPriceReduced?: boolean;
  };
  onFavoriteToggle?: (id: string) => void;
}

export const MobilePropertyCard: React.FC<MobilePropertyCardProps> = ({
  property,
  onFavoriteToggle,
}) => {
  const router = useRouter();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleClick = () => {
    router.push(`/properties/${property.id}`);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);

  return (
    <Box
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      onClick={handleClick}
      cursor="pointer"
      position="relative"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)' }}
      _active={{ transform: 'translateY(0)' }}
    >
      {/* Image Section */}
      <Box position="relative">
        <Image
          src={property.imageUrl}
          alt={property.title}
          height="200px"
          width="100%"
          objectFit="cover"
        />

        {/* Image Count Badge */}
        {property.imageCount && (
          <HStack
            position="absolute"
            bottom={2}
            right={2}
            bg="blackAlpha.700"
            color="white"
            px={2}
            py={1}
            borderRadius="md"
            spacing={1}
          >
            <Icon as={FaCamera} boxSize={3} />
            <Text fontSize="sm">{property.imageCount}</Text>
          </HStack>
        )}

        {/* Status Badges */}
        <HStack position="absolute" top={2} left={2} spacing={2}>
          {property.isNew && (
            <Badge colorScheme="green" variant="solid">
              New
            </Badge>
          )}
          {property.isPriceReduced && (
            <Badge colorScheme="red" variant="solid">
              Price Reduced
            </Badge>
          )}
        </HStack>

        {/* Favorite Button */}
        <IconButton
          aria-label={property.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          icon={property.isFavorite ? <FaHeart /> : <FaRegHeart />}
          position="absolute"
          top={2}
          right={2}
          colorScheme={property.isFavorite ? 'red' : 'gray'}
          variant="solid"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.(property.id);
          }}
        />
      </Box>

      {/* Content Section */}
      <Box p={4}>
        <VStack align="stretch" spacing={2}>
          {/* Price and Type */}
          <Flex align="center">
            <Text fontSize="xl" fontWeight="bold">
              {formatPrice(property.price)}
            </Text>
            <Spacer />
            <Badge variant="subtle" colorScheme="blue">
              {property.propertyType}
            </Badge>
          </Flex>

          {/* Location */}
          <HStack color="gray.600" spacing={1}>
            <Icon as={FaMapMarkerAlt} boxSize={3} />
            <Text fontSize="sm" noOfLines={1}>
              {property.location}
            </Text>
          </HStack>

          {/* Property Details */}
          <HStack spacing={4} mt={2}>
            <HStack spacing={1}>
              <Icon as={FaBed} color="gray.500" />
              <Text fontSize="sm">{property.bedrooms}</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FaBath} color="gray.500" />
              <Text fontSize="sm">{property.bathrooms}</Text>
            </HStack>
            <HStack spacing={1}>
              <Icon as={FaRuler} color="gray.500" />
              <Text fontSize="sm">
                {property.squareFeet.toLocaleString()} sqft
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};