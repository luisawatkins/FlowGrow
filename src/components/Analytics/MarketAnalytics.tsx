import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Select,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MarketAnalyticsProps {
  location?: string;
  propertyType?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const formatPercentage = (value: number) =>
  `${value.toFixed(1)}%`;

export const MarketAnalytics: React.FC<MarketAnalyticsProps> = ({
  location,
  propertyType,
}) => {
  const toast = useToast();
  const [marketData, setMarketData] = useState<any>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('12m');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const params = new URLSearchParams();
        if (location) params.append('location', location);
        if (propertyType) params.append('propertyType', propertyType);

        const response = await fetch(
          `/api/analytics/market?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch market data');
        }

        const data = await response.json();
        setMarketData(data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load market analytics',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
  }, [location, propertyType, toast]);

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        Loading market analytics...
      </Box>
    );
  }

  if (!marketData) {
    return (
      <Box textAlign="center" py={10}>
        No market data available
      </Box>
    );
  }

  const filteredTrends = marketData.trends.slice(
    selectedTimeRange === '6m' ? -6 : -12
  );

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        {/* Summary Statistics */}
        <Grid
          templateColumns={{
            base: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)',
          }}
          gap={4}
        >
          <GridItem>
            <Stat>
              <StatLabel>Average Price</StatLabel>
              <StatNumber>
                {formatCurrency(marketData.summary.averagePrice)}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    marketData.summary.monthOverMonthChange >= 0
                      ? 'increase'
                      : 'decrease'
                  }
                />
                {formatPercentage(marketData.summary.monthOverMonthChange)} (MoM)
              </StatHelpText>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Median Price</StatLabel>
              <StatNumber>
                {formatCurrency(marketData.summary.medianPrice)}
              </StatNumber>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Total Listings</StatLabel>
              <StatNumber>{marketData.summary.totalListings}</StatNumber>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Days on Market</StatLabel>
              <StatNumber>
                {Math.round(marketData.summary.averageDaysOnMarket)}
              </StatNumber>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Year over Year</StatLabel>
              <StatNumber>
                {formatPercentage(marketData.summary.yearOverYearChange)}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    marketData.summary.yearOverYearChange >= 0
                      ? 'increase'
                      : 'decrease'
                  }
                />
                Price Change
              </StatHelpText>
            </Stat>
          </GridItem>

          <GridItem>
            <Stat>
              <StatLabel>Month over Month</StatLabel>
              <StatNumber>
                {formatPercentage(marketData.summary.monthOverMonthChange)}
              </StatNumber>
              <StatHelpText>
                <StatArrow
                  type={
                    marketData.summary.monthOverMonthChange >= 0
                      ? 'increase'
                      : 'decrease'
                  }
                />
                Price Change
              </StatHelpText>
            </Stat>
          </GridItem>
        </Grid>

        {/* Price Trends Chart */}
        <Box>
          <HStack justify="space-between" mb={4}>
            <Heading size="md">Price Trends</Heading>
            <Select
              width="150px"
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
            >
              <option value="6m">Last 6 Months</option>
              <option value="12m">Last 12 Months</option>
            </Select>
          </HStack>

          <Box height="400px">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) =>
                    new Date(date).toLocaleDateString(undefined, {
                      month: 'short',
                    })
                  }
                />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      notation: 'compact',
                      maximumFractionDigits: 1,
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(date) =>
                    new Date(date).toLocaleDateString()
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="averagePrice"
                  name="Average Price"
                  stroke="#0088FE"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="medianPrice"
                  name="Median Price"
                  stroke="#00C49F"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Property Types and Price Ranges */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={8}>
          <GridItem>
            <Box>
              <Heading size="md" mb={4}>
                Property Types
              </Heading>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketData.propertyTypes}
                      dataKey="percentage"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) =>
                        `${entry.type} (${formatPercentage(entry.percentage)})`
                      }
                    >
                      {marketData.propertyTypes.map((entry: any, index: number) => (
                        <Cell
                          key={entry.type}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatPercentage(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </GridItem>

          <GridItem>
            <Box>
              <Heading size="md" mb={4}>
                Price Distribution
              </Heading>
              <Box height="300px">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={marketData.priceRanges}
                      dataKey="percentage"
                      nameKey="range"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) =>
                        `${entry.range} (${formatPercentage(entry.percentage)})`
                      }
                    >
                      {marketData.priceRanges.map((entry: any, index: number) => (
                        <Cell
                          key={entry.range}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatPercentage(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </GridItem>
        </Grid>

        {/* Detailed Statistics Table */}
        <Box>
          <Heading size="md" mb={4}>
            Property Type Analysis
          </Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Property Type</Th>
                <Th isNumeric>Count</Th>
                <Th isNumeric>Market Share</Th>
                <Th isNumeric>Average Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {marketData.propertyTypes.map((type: any) => (
                <Tr key={type.type}>
                  <Td>{type.type}</Td>
                  <Td isNumeric>{type.count}</Td>
                  <Td isNumeric>{formatPercentage(type.percentage)}</Td>
                  <Td isNumeric>{formatCurrency(type.averagePrice)}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Box>
  );
};
