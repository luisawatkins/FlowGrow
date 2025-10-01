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
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';
import { ImageAnalytics } from '@/types/gallery';
import { useEnhancedGallery } from '@/hooks/useEnhancedGallery';

export const GalleryAnalytics: React.FC = () => {
  const { analytics, getAnalytics, isLoading, error } = useEnhancedGallery();
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
        description: 'Failed to load gallery analytics.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <HStack justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold">
          Gallery Analytics
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
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Images</StatLabel>
              <StatNumber>{analytics.totalImages}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                All time
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Size</StatLabel>
              <StatNumber>{formatFileSize(analytics.totalSize)}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                Storage used
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Average Size</StatLabel>
              <StatNumber>{formatFileSize(analytics.uploadStats.averageSize)}</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                Per image
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Uploads</StatLabel>
              <StatNumber>{analytics.uploadStats.totalUploads}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                All time
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Monthly Trends */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">
            Upload Trends
          </Text>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Month</Th>
                <Th isNumeric>Images</Th>
                <Th isNumeric>Size</Th>
                <Th>Trend</Th>
              </Tr>
            </Thead>
            <Tbody>
              {analytics.imagesByMonth.slice(-6).map((month) => (
                <Tr key={month.month}>
                  <Td>{month.month}</Td>
                  <Td isNumeric>{month.count}</Td>
                  <Td isNumeric>{formatFileSize(month.size)}</Td>
                  <Td>
                    <Badge colorScheme="blue" variant="subtle">
                      {month.count > 0 ? 'Active' : 'No activity'}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Top Tags */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">
            Most Used Tags
          </Text>
        </CardHeader>
        <CardBody>
          <VStack spacing={3} align="stretch">
            {analytics.topTags.slice(0, 10).map((tag) => (
              <Box key={tag.tag}>
                <HStack justify="space-between" mb={1}>
                  <HStack spacing={2}>
                    <Badge colorScheme="blue" variant="subtle">
                      {tag.tag}
                    </Badge>
                    <Text fontSize="sm" color="gray.600">
                      {tag.count} images
                    </Text>
                  </HStack>
                  <Text fontSize="sm" fontWeight="medium">
                    {analytics.totalImages > 0 
                      ? `${((tag.count / analytics.totalImages) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </Text>
                </HStack>
                <Progress
                  value={analytics.totalImages > 0 ? (tag.count / analytics.totalImages) * 100 : 0}
                  colorScheme="blue"
                  size="sm"
                  borderRadius="md"
                />
              </Box>
            ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Upload Stats */}
      <Card>
        <CardHeader>
          <Text fontSize="lg" fontWeight="semibold">
            Upload Statistics
          </Text>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Most Active User
              </Text>
              <Text fontSize="lg" fontWeight="semibold">
                {analytics.uploadStats.mostActiveUser || 'N/A'}
              </Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.600" mb={2}>
                Average File Size
              </Text>
              <Text fontSize="lg" fontWeight="semibold">
                {formatFileSize(analytics.uploadStats.averageSize)}
              </Text>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );
};
