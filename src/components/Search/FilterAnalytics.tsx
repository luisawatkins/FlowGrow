import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Badge,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
  Tooltip,
  Icon,
} from '@chakra-ui/react';
import {
  InfoIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  StarIcon,
} from '@chakra-ui/icons';
import { SearchFilterAnalytics } from '@/types/search';

interface FilterAnalyticsProps {
  analytics: SearchFilterAnalytics;
  onFilterClick?: (filter: string) => void;
  className?: string;
}

export const FilterAnalytics: React.FC<FilterAnalyticsProps> = ({
  analytics,
  onFilterClick,
  className = '',
}) => {
  const filterReductionPercentage = analytics.totalResults > 0 
    ? ((analytics.totalResults - analytics.filteredResults) / analytics.totalResults) * 100 
    : 0;

  const isFilteringEffective = filterReductionPercentage > 0 && filterReductionPercentage < 90;

  return (
    <Box className={className} bg="white" borderRadius="md" border="1px" borderColor="gray.200" p={4}>
      <VStack spacing={4} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <HStack>
            <Icon as={TrendingUpIcon} color="blue.500" />
            <Text fontSize="md" fontWeight="semibold">
              Search Analytics
            </Text>
          </HStack>
          <Tooltip label="Filter effectiveness and search insights" placement="top" hasArrow>
            <Icon as={InfoIcon} color="gray.400" boxSize={4} />
          </Tooltip>
        </HStack>

        {/* Results Summary */}
        <SimpleGrid columns={2} spacing={4}>
          <Stat>
            <StatLabel fontSize="sm" color="gray.600">
              Total Results
            </StatLabel>
            <StatNumber fontSize="lg" color="blue.600">
              {analytics.totalResults.toLocaleString()}
            </StatNumber>
            <StatHelpText fontSize="xs">
              Available properties
            </StatHelpText>
          </Stat>

          <Stat>
            <StatLabel fontSize="sm" color="gray.600">
              Filtered Results
            </StatLabel>
            <StatNumber fontSize="lg" color="green.600">
              {analytics.filteredResults.toLocaleString()}
            </StatNumber>
            <StatHelpText fontSize="xs">
              Matching your criteria
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        {/* Filter Effectiveness */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.700">
              Filter Effectiveness
            </Text>
            <Text fontSize="sm" color="gray.600">
              {filterReductionPercentage.toFixed(1)}% reduction
            </Text>
          </HStack>
          
          <Progress
            value={filterReductionPercentage}
            colorScheme={isFilteringEffective ? 'green' : filterReductionPercentage > 90 ? 'red' : 'blue'}
            size="sm"
            borderRadius="md"
          />
          
          <Text fontSize="xs" color="gray.500" mt={1}>
            {isFilteringEffective 
              ? 'Good filtering - results are focused but not too restrictive'
              : filterReductionPercentage > 90 
                ? 'Very restrictive - consider relaxing some filters'
                : 'No filtering applied - try adding some filters'
            }
          </Text>
        </Box>

        {/* Popular Filters */}
        {analytics.popularFilters.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
              Popular Filters
            </Text>
            <HStack wrap="wrap" spacing={2}>
              {analytics.popularFilters.map((filter, index) => (
                <Badge
                  key={filter}
                  colorScheme="blue"
                  variant="subtle"
                  cursor="pointer"
                  _hover={{ bg: 'blue.100' }}
                  onClick={() => onFilterClick?.(filter)}
                >
                  {filter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Badge>
              ))}
            </HStack>
          </Box>
        )}

        {/* Filter Counts */}
        {Object.keys(analytics.filterCounts).length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
              Active Filters
            </Text>
            <SimpleGrid columns={2} spacing={2}>
              {Object.entries(analytics.filterCounts).map(([filter, count]) => (
                <HStack key={filter} justify="space-between">
                  <Text fontSize="xs" color="gray.600" textTransform="capitalize">
                    {filter.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                  <Badge colorScheme="gray" variant="outline" fontSize="xs">
                    {count}
                  </Badge>
                </HStack>
              ))}
            </SimpleGrid>
          </Box>
        )}

        {/* Suggested Filters */}
        {analytics.suggestedFilters.length > 0 && (
          <Box>
            <Divider />
            <Text fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
              Suggested Filters
            </Text>
            <HStack wrap="wrap" spacing={2}>
              {analytics.suggestedFilters.map((filter) => (
                <Badge
                  key={filter}
                  colorScheme="green"
                  variant="outline"
                  cursor="pointer"
                  _hover={{ bg: 'green.100' }}
                  onClick={() => onFilterClick?.(filter)}
                >
                  + {filter.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Badge>
              ))}
            </HStack>
          </Box>
        )}

        {/* Performance Indicator */}
        <Box>
          <HStack justify="space-between" align="center">
            <Text fontSize="xs" color="gray.500">
              Search Performance
            </Text>
            <HStack>
              <Icon 
                as={analytics.filteredResults > 0 ? TrendingUpIcon : TrendingDownIcon} 
                color={analytics.filteredResults > 0 ? 'green.500' : 'red.500'}
                boxSize={3}
              />
              <Text fontSize="xs" color={analytics.filteredResults > 0 ? 'green.600' : 'red.600'}>
                {analytics.filteredResults > 0 ? 'Good' : 'No Results'}
              </Text>
            </HStack>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};
