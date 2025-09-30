import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Progress,
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FaWalking,
  FaBus,
  FaBicycle,
  FaCar,
  FaGraduationCap,
  FaUtensils,
  FaShoppingBag,
  FaTree,
  FaUsers,
  FaHome,
  FaBook,
  FaExclamationTriangle,
  FaCheckCircle,
  FaInfoCircle,
} from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface NeighborhoodInfoProps {
  propertyId: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const formatDistance = (distance: number) =>
  `${distance.toFixed(1)} mi`;

const formatTime = (minutes: number) =>
  minutes >= 60
    ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
    : `${minutes}m`;

const SchoolRating: React.FC<{ rating: number }> = ({ rating }) => (
  <HStack spacing={1}>
    <Text fontWeight="bold" color={rating >= 7 ? 'green.500' : 'orange.500'}>
      {rating.toFixed(1)}
    </Text>
    <Progress
      value={(rating / 10) * 100}
      colorScheme={rating >= 7 ? 'green' : 'orange'}
      size="sm"
      width="50px"
    />
  </HStack>
);

export const NeighborhoodInfo: React.FC<NeighborhoodInfoProps> = ({
  propertyId,
}) => {
  const toast = useToast();
  const [neighborhoodData, setNeighborhoodData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNeighborhoodData = async () => {
      try {
        const response = await fetch(
          `/api/neighborhoods/${propertyId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch neighborhood data');
        }

        const data = await response.json();
        setNeighborhoodData(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load neighborhood data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchNeighborhoodData();
  }, [propertyId, toast]);

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        Loading neighborhood information...
      </Box>
    );
  }

  if (!neighborhoodData) {
    return (
      <Box textAlign="center" py={10}>
        No neighborhood data available
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        {/* Overview Section */}
        <Box>
          <Heading size="lg" mb={4}>
            {neighborhoodData.overview.name}
          </Heading>
          <Text color="gray.600" mb={6}>
            {neighborhoodData.overview.description}
          </Text>

          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <Stat>
              <StatLabel>Population</StatLabel>
              <StatNumber>
                {neighborhoodData.overview.population.toLocaleString()}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Median Income</StatLabel>
              <StatNumber>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(neighborhoodData.overview.medianIncome)}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Median Age</StatLabel>
              <StatNumber>{neighborhoodData.overview.medianAge}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Crime Rate</StatLabel>
              <StatNumber>
                <Badge
                  colorScheme={
                    neighborhoodData.overview.crimeRate === 'low'
                      ? 'green'
                      : neighborhoodData.overview.crimeRate === 'moderate'
                      ? 'yellow'
                      : 'red'
                  }
                >
                  {neighborhoodData.overview.crimeRate.toUpperCase()}
                </Badge>
              </StatNumber>
            </Stat>
          </SimpleGrid>

          <Grid
            templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
            gap={6}
            mt={6}
          >
            <GridItem>
              <VStack
                p={4}
                bg="blue.50"
                borderRadius="lg"
                align="start"
                spacing={2}
              >
                <HStack>
                  <Icon as={FaWalking} color="blue.500" />
                  <Text fontWeight="bold">Walk Score</Text>
                </HStack>
                <Progress
                  value={neighborhoodData.overview.walkScore}
                  colorScheme="blue"
                  size="lg"
                  width="full"
                />
                <Text fontSize="sm" color="gray.600">
                  {neighborhoodData.overview.walkScore}/100 - Very Walkable
                </Text>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack
                p={4}
                bg="green.50"
                borderRadius="lg"
                align="start"
                spacing={2}
              >
                <HStack>
                  <Icon as={FaBus} color="green.500" />
                  <Text fontWeight="bold">Transit Score</Text>
                </HStack>
                <Progress
                  value={neighborhoodData.overview.transitScore}
                  colorScheme="green"
                  size="lg"
                  width="full"
                />
                <Text fontSize="sm" color="gray.600">
                  {neighborhoodData.overview.transitScore}/100 - Excellent Transit
                </Text>
              </VStack>
            </GridItem>

            <GridItem>
              <VStack
                p={4}
                bg="purple.50"
                borderRadius="lg"
                align="start"
                spacing={2}
              >
                <HStack>
                  <Icon as={FaBicycle} color="purple.500" />
                  <Text fontWeight="bold">Bike Score</Text>
                </HStack>
                <Progress
                  value={neighborhoodData.overview.bikeScore}
                  colorScheme="purple"
                  size="lg"
                  width="full"
                />
                <Text fontSize="sm" color="gray.600">
                  {neighborhoodData.overview.bikeScore}/100 - Very Bikeable
                </Text>
              </VStack>
            </GridItem>
          </Grid>
        </Box>

        {/* Detailed Information Tabs */}
        <Tabs>
          <TabList>
            <Tab>Schools</Tab>
            <Tab>Amenities</Tab>
            <Tab>Transit</Tab>
            <Tab>Demographics</Tab>
          </TabList>

          <TabPanels>
            {/* Schools Panel */}
            <TabPanel>
              <VStack spacing={6} align="stretch">
                <HStack>
                  <Icon as={FaGraduationCap} color="blue.500" boxSize={6} />
                  <Heading size="md">
                    Schools ({neighborhoodData.schools.schools.length})
                  </Heading>
                </HStack>

                <Table>
                  <Thead>
                    <Tr>
                      <Th>School</Th>
                      <Th>Type</Th>
                      <Th>Grades</Th>
                      <Th isNumeric>Rating</Th>
                      <Th isNumeric>Distance</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {neighborhoodData.schools.schools.map((school: any) => (
                      <Tr key={school.id}>
                        <Td>
                          <Text fontWeight="medium">{school.name}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {school.students} students
                          </Text>
                        </Td>
                        <Td>
                          <Badge>
                            {school.type.charAt(0).toUpperCase() +
                              school.type.slice(1)}
                          </Badge>
                        </Td>
                        <Td>{school.grades}</Td>
                        <Td isNumeric>
                          <SchoolRating rating={school.rating} />
                        </Td>
                        <Td isNumeric>{formatDistance(school.distance)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </VStack>
            </TabPanel>

            {/* Amenities Panel */}
            <TabPanel>
              <VStack spacing={8} align="stretch">
                {neighborhoodData.amenities.categories.map((category: any) => (
                  <Box key={category.name}>
                    <HStack mb={4}>
                      <Icon
                        as={
                          category.name === 'Restaurants'
                            ? FaUtensils
                            : category.name === 'Shopping'
                            ? FaShoppingBag
                            : FaTree
                        }
                        color="blue.500"
                        boxSize={6}
                      />
                      <Heading size="md">
                        {category.name} ({category.count})
                      </Heading>
                    </HStack>

                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                      {category.items.map((item: any) => (
                        <Box
                          key={item.id}
                          p={4}
                          borderWidth={1}
                          borderRadius="lg"
                        >
                          <VStack align="start" spacing={2}>
                            <Heading size="sm">{item.name}</Heading>
                            <HStack>
                              <Badge colorScheme="blue">
                                {item.rating.toFixed(1)} ★
                              </Badge>
                              <Text fontSize="sm" color="gray.600">
                                {formatDistance(item.distance)} away
                              </Text>
                            </HStack>
                          </VStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                ))}
              </VStack>
            </TabPanel>

            {/* Transit Panel */}
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
                <GridItem>
                  <VStack align="stretch" spacing={6}>
                    <Heading size="md">Transit Stops</Heading>
                    {neighborhoodData.transit.stops.map((stop: any) => (
                      <Box
                        key={stop.id}
                        p={4}
                        borderWidth={1}
                        borderRadius="lg"
                      >
                        <HStack justify="space-between">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="bold">{stop.name}</Text>
                            <HStack>
                              <Badge
                                colorScheme={
                                  stop.type === 'subway'
                                    ? 'purple'
                                    : stop.type === 'train'
                                    ? 'blue'
                                    : 'green'
                                }
                              >
                                {stop.type.toUpperCase()}
                              </Badge>
                              <Text fontSize="sm" color="gray.600">
                                {formatDistance(stop.distance)} away
                              </Text>
                            </HStack>
                          </VStack>
                          <HStack>
                            {stop.lines.map((line: string) => (
                              <Badge
                                key={line}
                                colorScheme="gray"
                                variant="solid"
                              >
                                {line}
                              </Badge>
                            ))}
                          </HStack>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </GridItem>

                <GridItem>
                  <VStack align="stretch" spacing={6}>
                    <Heading size="md">Commute Times</Heading>
                    <SimpleGrid columns={2} spacing={4}>
                      <Box p={4} bg="gray.50" borderRadius="lg">
                        <VStack>
                          <Icon as={FaCar} boxSize={6} color="blue.500" />
                          <Text fontWeight="bold">Driving</Text>
                          <Text>
                            {formatTime(neighborhoodData.transit.commuteTime.driving)}
                          </Text>
                        </VStack>
                      </Box>
                      <Box p={4} bg="gray.50" borderRadius="lg">
                        <VStack>
                          <Icon as={FaBus} boxSize={6} color="green.500" />
                          <Text fontWeight="bold">Transit</Text>
                          <Text>
                            {formatTime(neighborhoodData.transit.commuteTime.transit)}
                          </Text>
                        </VStack>
                      </Box>
                      <Box p={4} bg="gray.50" borderRadius="lg">
                        <VStack>
                          <Icon as={FaBicycle} boxSize={6} color="purple.500" />
                          <Text fontWeight="bold">Cycling</Text>
                          <Text>
                            {formatTime(neighborhoodData.transit.commuteTime.cycling)}
                          </Text>
                        </VStack>
                      </Box>
                      <Box p={4} bg="gray.50" borderRadius="lg">
                        <VStack>
                          <Icon as={FaWalking} boxSize={6} color="orange.500" />
                          <Text fontWeight="bold">Walking</Text>
                          <Text>
                            {formatTime(neighborhoodData.transit.commuteTime.walking)}
                          </Text>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </VStack>
                </GridItem>
              </Grid>
            </TabPanel>

            {/* Demographics Panel */}
            <TabPanel>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
                <GridItem>
                  <VStack align="stretch" spacing={6}>
                    <Heading size="md">Age Distribution</Heading>
                    <Box height="300px">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={neighborhoodData.demographics.ageDistribution}
                            dataKey="percentage"
                            nameKey="range"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={(entry) =>
                              `${entry.range} (${entry.percentage}%)`
                            }
                          >
                            {neighborhoodData.demographics.ageDistribution.map(
                              (_: any, index: number) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              )
                            )}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </VStack>
                </GridItem>

                <GridItem>
                  <VStack align="stretch" spacing={6}>
                    <Heading size="md">Education Level</Heading>
                    <Box height="300px">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={neighborhoodData.demographics.education}>
                          <XAxis dataKey="level" />
                          <YAxis />
                          <Tooltip />
                          <Bar
                            dataKey="percentage"
                            fill="#8884d8"
                            label={{ position: 'top' }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </VStack>
                </GridItem>

                <GridItem colSpan={{ base: 1, md: 2 }}>
                  <VStack align="stretch" spacing={6}>
                    <Heading size="md">Household Types</Heading>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>Type</Th>
                          <Th isNumeric>Percentage</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {neighborhoodData.demographics.householdTypes.map(
                          (type: any) => (
                            <Tr key={type.type}>
                              <Td>{type.type}</Td>
                              <Td isNumeric>{type.percentage}%</Td>
                            </Tr>
                          )
                        )}
                      </Tbody>
                    </Table>
                  </VStack>
                </GridItem>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};