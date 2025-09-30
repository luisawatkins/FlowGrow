import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Grid,
  GridItem,
  Text,
  Heading,
  Progress,
  Icon,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FaGraduationCap,
  FaBus,
  FaShoppingCart,
  FaHospital,
  FaUtensils,
  FaTree,
  FaWalking,
  FaShieldAlt,
} from 'react-icons/fa';
import { useNeighborhood } from '@/hooks/useNeighborhood';

interface NeighborhoodInfoProps {
  propertyId: string;
}

export const NeighborhoodInfo: React.FC<NeighborhoodInfoProps> = ({
  propertyId,
}) => {
  const {
    neighborhood,
    isLoading,
    error,
  } = useNeighborhood(propertyId);

  const statBgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  if (isLoading) {
    return (
      <Box p={6} borderWidth="1px" borderRadius="lg">
        <Text>Loading neighborhood information...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={6} borderWidth="1px" borderRadius="lg" bg="red.50">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  if (!neighborhood) {
    return (
      <Box p={6} borderWidth="1px" borderRadius="lg">
        <Text>No neighborhood information available</Text>
      </Box>
    );
  }

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Tabs>
        <TabList px={6} pt={4}>
          <Tab>Overview</Tab>
          <Tab>Demographics</Tab>
          <Tab>Schools</Tab>
          <Tab>Transportation</Tab>
          <Tab>Amenities</Tab>
        </TabList>

        <TabPanels>
          {/* Overview Panel */}
          <TabPanel p={6}>
            <VStack spacing={6} align="stretch">
              <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                <GridItem>
                  <Stat bg={statBgColor} p={4} borderRadius="lg" borderWidth="1px">
                    <StatLabel>Walk Score</StatLabel>
                    <StatNumber>{neighborhood.walkScore}</StatNumber>
                    <StatHelpText>Very Walkable</StatHelpText>
                  </Stat>
                </GridItem>
                <GridItem>
                  <Stat bg={statBgColor} p={4} borderRadius="lg" borderWidth="1px">
                    <StatLabel>Transit Score</StatLabel>
                    <StatNumber>{neighborhood.transitScore}</StatNumber>
                    <StatHelpText>Good Transit</StatHelpText>
                  </Stat>
                </GridItem>
                <GridItem>
                  <Stat bg={statBgColor} p={4} borderRadius="lg" borderWidth="1px">
                    <StatLabel>Crime Rate</StatLabel>
                    <StatNumber>{neighborhood.crimeRate}%</StatNumber>
                    <StatHelpText>Below Average</StatHelpText>
                  </Stat>
                </GridItem>
              </Grid>

              <Box>
                <Heading size="md" mb={4}>Quality of Life</Heading>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  {[
                    { label: 'Safety', value: 85 },
                    { label: 'Noise Level', value: 70 },
                    { label: 'Cleanliness', value: 80 },
                    { label: 'Green Space', value: 75 },
                  ].map((item) => (
                    <GridItem key={item.label}>
                      <Text mb={2}>{item.label}</Text>
                      <Progress
                        value={item.value}
                        colorScheme={item.value > 75 ? 'green' : 'blue'}
                        borderRadius="full"
                      />
                    </GridItem>
                  ))}
                </Grid>
              </Box>
            </VStack>
          </TabPanel>

          {/* Demographics Panel */}
          <TabPanel p={6}>
            <VStack spacing={6} align="stretch">
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                  <Box p={4} borderWidth="1px" borderRadius="lg">
                    <Heading size="sm" mb={4}>Age Distribution</Heading>
                    <VStack spacing={3} align="stretch">
                      {neighborhood.demographics.ageDistribution.map((age) => (
                        <Box key={age.range}>
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="sm">{age.range}</Text>
                            <Text fontSize="sm">{age.percentage}%</Text>
                          </HStack>
                          <Progress value={age.percentage} size="sm" />
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box p={4} borderWidth="1px" borderRadius="lg">
                    <Heading size="sm" mb={4}>Household Types</Heading>
                    <VStack spacing={3} align="stretch">
                      {neighborhood.demographics.householdTypes.map((type) => (
                        <Box key={type.name}>
                          <HStack justify="space-between" mb={1}>
                            <Text fontSize="sm">{type.name}</Text>
                            <Text fontSize="sm">{type.percentage}%</Text>
                          </HStack>
                          <Progress value={type.percentage} size="sm" />
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </GridItem>
              </Grid>
            </VStack>
          </TabPanel>

          {/* Schools Panel */}
          <TabPanel p={6}>
            <VStack spacing={4} align="stretch">
              {neighborhood.schools.map((school) => (
                <Box
                  key={school.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  _hover={{ bg: 'gray.50' }}
                >
                  <HStack justify="space-between">
                    <VStack align="start" spacing={1}>
                      <HStack>
                        <Icon as={FaGraduationCap} />
                        <Text fontWeight="bold">{school.name}</Text>
                        <Badge colorScheme="blue">{school.type}</Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.600">
                        Grades {school.grades} • {school.distance} miles
                      </Text>
                    </VStack>
                    <Box
                      bg={school.rating >= 8 ? 'green.500' : 'blue.500'}
                      color="white"
                      borderRadius="full"
                      w="40px"
                      h="40px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      fontWeight="bold"
                    >
                      {school.rating}
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </TabPanel>

          {/* Transportation Panel */}
          <TabPanel p={6}>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Heading size="sm" mb={4}>Public Transit</Heading>
                  <VStack spacing={4} align="stretch">
                    {neighborhood.transportation.publicTransit.map((transit) => (
                      <HStack key={transit.type} justify="space-between">
                        <HStack>
                          <Icon as={FaBus} />
                          <Text>{transit.type}</Text>
                        </HStack>
                        <Text>{transit.distance} min walk</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>
              </GridItem>
              <GridItem>
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Heading size="sm" mb={4}>Average Commute Times</Heading>
                  <VStack spacing={4} align="stretch">
                    {neighborhood.transportation.commuteTimes.map((commute) => (
                      <Box key={commute.destination}>
                        <Text fontSize="sm" mb={1}>{commute.destination}</Text>
                        <Progress
                          value={(commute.time / 60) * 100}
                          size="sm"
                        />
                        <Text fontSize="sm" color="gray.600" mt={1}>
                          {commute.time} minutes
                        </Text>
                      </Box>
                    ))}
                  </VStack>
                </Box>
              </GridItem>
            </Grid>
          </TabPanel>

          {/* Amenities Panel */}
          <TabPanel p={6}>
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              {[
                {
                  category: 'Shopping',
                  icon: FaShoppingCart,
                  items: neighborhood.amenities.shopping,
                },
                {
                  category: 'Healthcare',
                  icon: FaHospital,
                  items: neighborhood.amenities.healthcare,
                },
                {
                  category: 'Dining',
                  icon: FaUtensils,
                  items: neighborhood.amenities.dining,
                },
                {
                  category: 'Parks & Recreation',
                  icon: FaTree,
                  items: neighborhood.amenities.recreation,
                },
              ].map((category) => (
                <GridItem key={category.category}>
                  <Box p={4} borderWidth="1px" borderRadius="lg">
                    <HStack mb={4}>
                      <Icon as={category.icon} />
                      <Heading size="sm">{category.category}</Heading>
                    </HStack>
                    <VStack spacing={3} align="stretch">
                      {category.items.map((item) => (
                        <HStack
                          key={item.name}
                          justify="space-between"
                          p={2}
                          _hover={{ bg: 'gray.50' }}
                          borderRadius="md"
                        >
                          <Text>{item.name}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {item.distance} miles
                          </Text>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                </GridItem>
              ))}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
