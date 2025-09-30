import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Image,
  Stack,
  Text,
  VStack,
  HStack,
  Divider,
  Badge,
  Icon,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import {
  FaBed,
  FaBath,
  FaRuler,
  FaCalendar,
  FaWalking,
  FaBus,
  FaGraduationCap,
  FaParking,
  FaDollarSign,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';

interface PropertyComparisonProps {
  propertyIds: string[];
}

interface ComparisonProperty {
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
  amenities: string[];
  walkScore: number;
  transitScore: number;
  schoolRating: number;
  pricePerSqFt: number;
  hoaFees: number;
  propertyTax: number;
  utilities: {
    electric: string;
    water: string;
    gas: string;
    internet: string;
  };
  parking: {
    type: string;
    spaces: number;
  };
  metrics: {
    pricePerBedroom: number;
    pricePerBathroom: number;
    totalMonthlyExpenses: number;
  };
}

interface ComparisonData {
  properties: ComparisonProperty[];
  summary: {
    priceDifference: number;
    sizeDifference: number;
    pricePerSqFtDifference: number;
    monthlyExpensesDifference: number;
  };
}

export const PropertyComparison: React.FC<PropertyComparisonProps> = ({
  propertyIds,
}) => {
  const toast = useToast();
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        const response = await fetch('/api/comparison', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ propertyIds }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch comparison data');
        }

        const data = await response.json();
        setComparisonData(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load comparison data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparisonData();
  }, [propertyIds, toast]);

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        Loading comparison...
      </Box>
    );
  }

  if (!comparisonData) {
    return (
      <Box textAlign="center" py={10}>
        No comparison data available
      </Box>
    );
  }

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const formatNumber = (num: number) =>
    new Intl.NumberFormat('en-US').format(num);

  return (
    <Box>
      <Grid templateColumns={`repeat(${comparisonData.properties.length}, 1fr)`} gap={6}>
        {comparisonData.properties.map((property) => (
          <GridItem key={property.id}>
            <VStack spacing={4} align="stretch">
              <Image
                src={property.imageUrl}
                alt={property.title}
                borderRadius="lg"
                objectFit="cover"
                height="250px"
              />

              <Box>
                <Heading size="md" mb={2}>
                  {property.title}
                </Heading>
                <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                  {formatCurrency(property.price)}
                </Text>
              </Box>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
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
                  <Text>{formatNumber(property.squareFeet)} sqft</Text>
                </HStack>
                <HStack>
                  <Icon as={FaCalendar} />
                  <Text>Built {property.yearBuilt}</Text>
                </HStack>
              </Grid>
            </VStack>
          </GridItem>
        ))}
      </Grid>

      <Divider my={8} />

      <Box mb={8}>
        <Heading size="md" mb={4}>
          Key Differences
        </Heading>
        <Grid templateColumns={`repeat(${comparisonData.properties.length}, 1fr)`} gap={6}>
          <GridItem>
            <VStack align="stretch" spacing={3}>
              <Text>Price Difference: {formatCurrency(comparisonData.summary.priceDifference)}</Text>
              <Text>Size Difference: {formatNumber(comparisonData.summary.sizeDifference)} sqft</Text>
              <Text>Price/sqft Difference: {formatCurrency(comparisonData.summary.pricePerSqFtDifference)}</Text>
              <Text>Monthly Expenses Difference: {formatCurrency(comparisonData.summary.monthlyExpensesDifference)}</Text>
            </VStack>
          </GridItem>
        </Grid>
      </Box>

      <Box mb={8}>
        <Heading size="md" mb={4}>
          Location & Accessibility
        </Heading>
        <Table>
          <Thead>
            <Tr>
              <Th>Metric</Th>
              {comparisonData.properties.map((property) => (
                <Th key={property.id}>{property.title}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                <HStack>
                  <Icon as={FaWalking} />
                  <Text>Walk Score</Text>
                </HStack>
              </Td>
              {comparisonData.properties.map((property) => (
                <Td key={property.id}>
                  <Badge colorScheme={property.walkScore >= 70 ? 'green' : 'yellow'}>
                    {property.walkScore}
                  </Badge>
                </Td>
              ))}
            </Tr>
            <Tr>
              <Td>
                <HStack>
                  <Icon as={FaBus} />
                  <Text>Transit Score</Text>
                </HStack>
              </Td>
              {comparisonData.properties.map((property) => (
                <Td key={property.id}>
                  <Badge colorScheme={property.transitScore >= 70 ? 'green' : 'yellow'}>
                    {property.transitScore}
                  </Badge>
                </Td>
              ))}
            </Tr>
            <Tr>
              <Td>
                <HStack>
                  <Icon as={FaGraduationCap} />
                  <Text>School Rating</Text>
                </HStack>
              </Td>
              {comparisonData.properties.map((property) => (
                <Td key={property.id}>
                  <Badge colorScheme={property.schoolRating >= 7 ? 'green' : 'yellow'}>
                    {property.schoolRating}/10
                  </Badge>
                </Td>
              ))}
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Box mb={8}>
        <Heading size="md" mb={4}>
          Costs & Expenses
        </Heading>
        <Table>
          <Thead>
            <Tr>
              <Th>Expense</Th>
              {comparisonData.properties.map((property) => (
                <Th key={property.id}>{property.title}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Price per sqft</Td>
              {comparisonData.properties.map((property) => (
                <Td key={property.id}>{formatCurrency(property.pricePerSqFt)}</Td>
              ))}
            </Tr>
            <Tr>
              <Td>HOA Fees (monthly)</Td>
              {comparisonData.properties.map((property) => (
                <Td key={property.id}>{formatCurrency(property.hoaFees)}</Td>
              ))}
            </Tr>
            <Tr>
              <Td>Property Tax (yearly)</Td>
              {comparisonData.properties.map((property) => (
                <Td key={property.id}>{formatCurrency(property.propertyTax)}</Td>
              ))}
            </Tr>
            <Tr>
              <Td>Total Monthly Expenses</Td>
              {comparisonData.properties.map((property) => (
                <Td key={property.id}>
                  {formatCurrency(property.metrics.totalMonthlyExpenses)}
                </Td>
              ))}
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Box>
        <Heading size="md" mb={4}>
          Amenities
        </Heading>
        <Table>
          <Thead>
            <Tr>
              <Th>Feature</Th>
              {comparisonData.properties.map((property) => (
                <Th key={property.id}>{property.title}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {['Parking', 'Gym', 'Pool', 'Garden', 'Fireplace'].map((amenity) => (
              <Tr key={amenity}>
                <Td>{amenity}</Td>
                {comparisonData.properties.map((property) => (
                  <Td key={property.id}>
                    {property.amenities.includes(amenity) ? (
                      <Icon as={FaCheck} color="green.500" />
                    ) : (
                      <Icon as={FaTimes} color="red.500" />
                    )}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};
