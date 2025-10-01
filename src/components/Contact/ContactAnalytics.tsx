import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  SimpleGrid,
  Progress,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Button,
  Select,
  useToast,
} from '@chakra-ui/react';
import { ContactAnalytics } from '@/types/contact';
import { useEnhancedContact } from '@/hooks/useEnhancedContact';

export const ContactAnalytics: React.FC = () => {
  const { analytics, getAnalytics, isLoading, error } = useEnhancedContact();
  const toast = useToast();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      await getAnalytics();
    } catch (error) {
      toast({
        title: 'Error loading analytics',
        description: 'Failed to load contact analytics.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error loading analytics!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!analytics) {
    return (
      <Box textAlign="center" py={8}>
        <Text>Loading analytics...</Text>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'blue';
      case 'contacted':
        return 'green';
      case 'scheduled':
        return 'purple';
      case 'viewing_scheduled':
        return 'orange';
      case 'follow_up':
        return 'yellow';
      case 'closed':
        return 'gray';
      case 'spam':
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Contact Analytics
        </Text>
        <HStack spacing={4}>
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            maxW="150px"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </Select>
          <Button onClick={loadAnalytics} isLoading={isLoading}>
            Refresh
          </Button>
        </HStack>
      </HStack>

      {/* Key Metrics */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Stat>
          <StatLabel>Total Inquiries</StatLabel>
          <StatNumber>{analytics.totalInquiries}</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            All time
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Response Rate</StatLabel>
          <StatNumber>{analytics.responseRate.toFixed(1)}%</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            Average response rate
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Avg Response Time</StatLabel>
          <StatNumber>
            {analytics.averageResponseTime > 0 
              ? `${Math.round(analytics.averageResponseTime / (1000 * 60 * 60))}h`
              : 'N/A'
            }
          </StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            Faster is better
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>Active Inquiries</StatLabel>
          <StatNumber>
            {analytics.inquiriesByStatus.new + analytics.inquiriesByStatus.contacted}
          </StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            New + Contacted
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Status Distribution */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Inquiries by Status
        </Text>
        <VStack spacing={3} align="stretch">
          {Object.entries(analytics.inquiriesByStatus).map(([status, count]) => (
            <Box key={status}>
              <HStack justify="space-between" mb={1}>
                <HStack spacing={2}>
                  <Badge colorScheme={getStatusColor(status)}>
                    {status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <Text fontSize="sm" color="gray.600">
                    {count} inquiries
                  </Text>
                </HStack>
                <Text fontSize="sm" fontWeight="medium">
                  {analytics.totalInquiries > 0 
                    ? `${((count / analytics.totalInquiries) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </Text>
              </HStack>
              <Progress
                value={analytics.totalInquiries > 0 ? (count / analytics.totalInquiries) * 100 : 0}
                colorScheme={getStatusColor(status)}
                size="sm"
                borderRadius="md"
              />
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Monthly Trends */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Monthly Trends
        </Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Month</Th>
              <Th isNumeric>Inquiries</Th>
              <Th>Trend</Th>
            </Tr>
          </Thead>
          <Tbody>
            {analytics.inquiriesByMonth.slice(-6).map((month) => (
              <Tr key={month.month}>
                <Td>{month.month}</Td>
                <Td isNumeric>{month.count}</Td>
                <Td>
                  <Badge colorScheme="blue" variant="subtle">
                    {month.count > 0 ? 'Active' : 'No activity'}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Top Properties */}
      <Box>
        <Text fontSize="lg" fontWeight="semibold" mb={4}>
          Top Properties by Inquiries
        </Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Property</Th>
              <Th isNumeric>Inquiries</Th>
              <Th>Percentage</Th>
            </Tr>
          </Thead>
          <Tbody>
            {analytics.topProperties.slice(0, 5).map((property) => (
              <Tr key={property.propertyId}>
                <Td>{property.propertyTitle}</Td>
                <Td isNumeric>{property.inquiryCount}</Td>
                <Td>
                  {analytics.totalInquiries > 0 
                    ? `${((property.inquiryCount / analytics.totalInquiries) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};
