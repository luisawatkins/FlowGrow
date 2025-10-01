import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tooltip,
  Icon,
  Button,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  StarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  InfoIcon,
  CalendarIcon,
  LocationIcon,
  TagIcon,
  BellIcon,
  EyeIcon,
  DollarIcon,
} from '@chakra-ui/icons';
import { FavoritesAnalytics, FavoritesAnalyticsProps } from '@/types/favorites';

export const FavoritesAnalytics: React.FC<FavoritesAnalyticsProps> = ({
  analytics,
  onFilterClick,
  className = '',
  showCharts = true,
  showTrends = true,
}) => {
  // Calculate percentage changes
  const priceChangePercentage = analytics.priceChanges.increased > 0 || analytics.priceChanges.decreased > 0
    ? ((analytics.priceChanges.increased - analytics.priceChanges.decreased) / analytics.totalFavorites) * 100
    : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  return (
    <Box className={className}>
      <VStack spacing={6} align="stretch">
        {/* Overview Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <Stat>
            <StatLabel fontSize="sm" color="gray.600">
              Total Favorites
            </StatLabel>
            <StatNumber fontSize="2xl" color="blue.600">
              {analytics.totalFavorites}
            </StatNumber>
            <StatHelpText fontSize="xs">
              Properties saved
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel fontSize="sm" color="gray.600">
              Average Price
            </StatLabel>
            <StatNumber fontSize="2xl" color="green.600">
              ${Math.round(analytics.averagePrice).toLocaleString()}
            </StatNumber>
            <StatHelpText fontSize="xs">
              Price range: ${analytics.priceRange.min.toLocaleString()} - ${analytics.priceRange.max.toLocaleString()}
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel fontSize="sm" color="gray.600">
              Days in Favorites
            </StatLabel>
            <StatNumber fontSize="2xl" color="orange.600">
              {Math.round(analytics.averageDaysInFavorites)}
            </StatNumber>
            <StatHelpText fontSize="xs">
              Average time saved
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel fontSize="sm" color="gray.600">
              Property Types
            </StatLabel>
            <StatNumber fontSize="2xl" color="purple.600">
              {Object.keys(analytics.propertyTypes).length}
            </StatNumber>
            <StatHelpText fontSize="xs">
              Different types
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Price Changes */}
        <Card>
          <CardHeader>
            <HStack>
              <DollarIcon color="green.500" />
              <Text fontSize="lg" fontWeight="semibold">
                Price Changes
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={3} spacing={4}>
              <Stat textAlign="center">
                <StatLabel fontSize="sm" color="green.600">
                  Increased
                </StatLabel>
                <StatNumber fontSize="xl" color="green.600">
                  {analytics.priceChanges.increased}
                </StatNumber>
                <StatArrow type="increase" />
              </Stat>

              <Stat textAlign="center">
                <StatLabel fontSize="sm" color="red.600">
                  Decreased
                </StatLabel>
                <StatNumber fontSize="xl" color="red.600">
                  {analytics.priceChanges.decreased}
                </StatNumber>
                <StatArrow type="decrease" />
              </Stat>

              <Stat textAlign="center">
                <StatLabel fontSize="sm" color="gray.600">
                  Unchanged
                </StatLabel>
                <StatNumber fontSize="xl" color="gray.600">
                  {analytics.priceChanges.unchanged}
                </StatNumber>
              </Stat>
            </SimpleGrid>
          </CardBody>
        </Card>

        {/* Property Types Distribution */}
        <Card>
          <CardHeader>
            <HStack>
              <TagIcon color="blue.500" />
              <Text fontSize="lg" fontWeight="semibold">
                Property Types
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              {Object.entries(analytics.propertyTypes).map(([type, count]) => {
                const percentage = (count / analytics.totalFavorites) * 100;
                return (
                  <Box key={type}>
                    <HStack justify="space-between" mb={1}>
                      <Text fontSize="sm" fontWeight="medium" textTransform="capitalize">
                        {type}
                      </Text>
                      <HStack>
                        <Text fontSize="sm" color="gray.600">
                          {count}
                        </Text>
                        <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                          {percentage.toFixed(1)}%
                        </Badge>
                      </HStack>
                    </HStack>
                    <Progress
                      value={percentage}
                      colorScheme="blue"
                      size="sm"
                      borderRadius="md"
                    />
                  </Box>
                );
              })}
            </VStack>
          </CardBody>
        </Card>

        {/* Locations Distribution */}
        <Card>
          <CardHeader>
            <HStack>
              <LocationIcon color="green.500" />
              <Text fontSize="lg" fontWeight="semibold">
                Locations
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <Wrap spacing={2}>
              {Object.entries(analytics.locations).map(([location, count]) => (
                <WrapItem key={location}>
                  <Badge
                    colorScheme="green"
                    variant="subtle"
                    px={3}
                    py={1}
                    borderRadius="full"
                    cursor="pointer"
                    _hover={{ bg: 'green.100' }}
                    onClick={() => onFilterClick?.('location', location)}
                  >
                    <HStack spacing={2}>
                      <Text fontSize="sm">{location}</Text>
                      <Text fontSize="xs" color="green.600">
                        {count}
                      </Text>
                    </HStack>
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
          </CardBody>
        </Card>

        {/* Tags Distribution */}
        {Object.keys(analytics.tags).length > 0 && (
          <Card>
            <CardHeader>
              <HStack>
                <TagIcon color="purple.500" />
                <Text fontSize="lg" fontWeight="semibold">
                  Popular Tags
              </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <Wrap spacing={2}>
                {Object.entries(analytics.tags)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 10)
                  .map(([tag, count]) => (
                    <WrapItem key={tag}>
                      <Badge
                        colorScheme="purple"
                        variant="subtle"
                        px={3}
                        py={1}
                        borderRadius="full"
                        cursor="pointer"
                        _hover={{ bg: 'purple.100' }}
                        onClick={() => onFilterClick?.('tags', tag)}
                      >
                        <HStack spacing={2}>
                          <Text fontSize="sm">{tag}</Text>
                          <Text fontSize="xs" color="purple.600">
                            {count}
                          </Text>
                        </HStack>
                      </Badge>
                    </WrapItem>
                  ))}
              </Wrap>
            </CardBody>
          </Card>
        )}

        {/* Recently Added */}
        {analytics.recentlyAdded.length > 0 && (
          <Card>
            <CardHeader>
              <HStack>
                <CalendarIcon color="orange.500" />
                <Text fontSize="lg" fontWeight="semibold">
                  Recently Added
                </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {analytics.recentlyAdded.slice(0, 5).map((favorite) => (
                  <HStack key={favorite.id} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                    <VStack align="start" spacing={1}>
                      <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                        {favorite.property.title}
                      </Text>
                      <Text fontSize="xs" color="gray.600">
                        Added {new Date(favorite.addedAt).toLocaleDateString()}
                      </Text>
                    </VStack>
                    <HStack>
                      <Text fontSize="sm" color="blue.600" fontWeight="medium">
                        ${favorite.property.price.toLocaleString()}
                      </Text>
                      {favorite.priority && (
                        <Badge colorScheme={getPriorityColor(favorite.priority)} size="sm">
                          {favorite.priority}
                        </Badge>
                      )}
                    </HStack>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Monthly Trends */}
        {showTrends && analytics.monthlyTrends.length > 0 && (
          <Card>
            <CardHeader>
              <HStack>
                <TrendingUpIcon color="teal.500" />
                <Text fontSize="lg" fontWeight="semibold">
                  Monthly Trends
                </Text>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {analytics.monthlyTrends.slice(0, 6).map((trend, index) => (
                  <Box key={index}>
                    <HStack justify="space-between" mb={2}>
                      <Text fontSize="sm" fontWeight="medium">
                        {trend.month}
                      </Text>
                      <HStack>
                        <Text fontSize="sm" color="green.600">
                          +{trend.added}
                        </Text>
                        <Text fontSize="sm" color="red.600">
                          -{trend.removed}
                        </Text>
                      </HStack>
                    </HStack>
                    <HStack spacing={2}>
                      <Progress
                        value={(trend.added / (trend.added + trend.removed)) * 100}
                        colorScheme="green"
                        size="sm"
                        flex={1}
                      />
                      <Progress
                        value={(trend.removed / (trend.added + trend.removed)) * 100}
                        colorScheme="red"
                        size="sm"
                        flex={1}
                      />
                    </HStack>
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Insights */}
        <Card>
          <CardHeader>
            <HStack>
              <InfoIcon color="blue.500" />
              <Text fontSize="lg" fontWeight="semibold">
                Insights
              </Text>
            </HStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={3} align="stretch">
              <HStack>
                <Icon as={EyeIcon} color="blue.500" />
                <Text fontSize="sm">
                  Most viewed property: <strong>{analytics.mostViewedProperty}</strong>
                </Text>
              </HStack>
              
              <HStack>
                <Icon as={DollarIcon} color="green.500" />
                <Text fontSize="sm">
                  Average price: <strong>${Math.round(analytics.averagePrice).toLocaleString()}</strong>
                </Text>
              </HStack>
              
              <HStack>
                <Icon as={CalendarIcon} color="orange.500" />
                <Text fontSize="sm">
                  Average time in favorites: <strong>{Math.round(analytics.averageDaysInFavorites)} days</strong>
                </Text>
              </HStack>
              
              <HStack>
                <Icon as={TagIcon} color="purple.500" />
                <Text fontSize="sm">
                  Most popular tag: <strong>{Object.entries(analytics.tags).sort(([, a], [, b]) => b - a)[0]?.[0] || 'None'}</strong>
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};
