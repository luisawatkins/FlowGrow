import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast,
} from '@chakra-ui/react';
import {
  FaEllipsisV,
  FaTrash,
  FaEdit,
} from 'react-icons/fa';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';

interface PriceAlertsListProps {
  onEdit: (alertId: string) => void;
}

export const PriceAlertsList: React.FC<PriceAlertsListProps> = ({
  onEdit,
}) => {
  const { alerts, isLoading, deleteAlert } = usePriceAlerts();
  const toast = useToast();

  const handleDelete = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
      toast({
        title: 'Alert deleted',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete alert',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const formatAlertCondition = (alert: any) => {
    switch (alert.type) {
      case 'price_drop':
        return `Price drops by ${alert.percentage}%`;
      case 'price_increase':
        return `Price increases by ${alert.percentage}%`;
      case 'specific_price':
        return `Price reaches $${alert.targetPrice.toLocaleString()}`;
      default:
        return 'Unknown condition';
    }
  };

  if (isLoading) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg">
        <Text>Loading price alerts...</Text>
      </Box>
    );
  }

  if (alerts.length === 0) {
    return (
      <Box p={4} borderWidth="1px" borderRadius="lg" textAlign="center">
        <Text color="gray.600">No price alerts set</Text>
      </Box>
    );
  }

  return (
    <VStack spacing={4} align="stretch">
      {alerts.map((alert) => (
        <Box
          key={alert.id}
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          bg="white"
        >
          <HStack justify="space-between" mb={2}>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">{alert.property.title}</Text>
              <Badge colorScheme="blue">
                {formatAlertCondition(alert)}
              </Badge>
            </VStack>

            <Menu>
              <MenuButton
                as={IconButton}
                icon={<FaEllipsisV />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem
                  icon={<FaEdit />}
                  onClick={() => onEdit(alert.id)}
                >
                  Edit Alert
                </MenuItem>
                <MenuItem
                  icon={<FaTrash />}
                  color="red.500"
                  onClick={() => handleDelete(alert.id)}
                >
                  Delete Alert
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="gray.600">
              Current Price: ${alert.currentPrice.toLocaleString()}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Target Price: ${alert.targetPrice.toLocaleString()}
            </Text>
            <Text fontSize="xs" color="gray.500">
              Created on {new Date(alert.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </Box>
      ))}
    </VStack>
  );
};
