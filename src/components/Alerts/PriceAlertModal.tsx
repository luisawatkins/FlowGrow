import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Text,
  Select,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { usePriceAlerts } from '@/hooks/usePriceAlerts';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  currentPrice: number;
}

type AlertType = 'price_drop' | 'price_increase' | 'specific_price';

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  propertyId,
  currentPrice,
}) => {
  const [alertType, setAlertType] = useState<AlertType>('price_drop');
  const [percentage, setPercentage] = useState(5);
  const [specificPrice, setSpecificPrice] = useState(currentPrice);
  const { createAlert, isLoading } = usePriceAlerts();
  const toast = useToast();

  const handleCreateAlert = async () => {
    try {
      const alertData = {
        propertyId,
        type: alertType,
        currentPrice,
        ...(alertType === 'specific_price'
          ? { targetPrice: specificPrice }
          : { percentage }),
      };

      await createAlert(alertData);

      toast({
        title: 'Price alert created',
        description: 'You will be notified when the price changes.',
        status: 'success',
        duration: 3000,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Failed to create alert',
        description: 'Please try again later.',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const calculateTargetPrice = () => {
    if (alertType === 'specific_price') {
      return specificPrice;
    }

    const multiplier = alertType === 'price_drop' ? (100 - percentage) / 100 : (100 + percentage) / 100;
    return currentPrice * multiplier;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Price Alert</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Current Price</FormLabel>
              <Text fontSize="xl" fontWeight="bold" color="blue.600">
                ${currentPrice.toLocaleString()}
              </Text>
            </FormControl>

            <FormControl>
              <FormLabel>Alert Type</FormLabel>
              <Select
                value={alertType}
                onChange={(e) => setAlertType(e.target.value as AlertType)}
              >
                <option value="price_drop">Price Drop</option>
                <option value="price_increase">Price Increase</option>
                <option value="specific_price">Specific Price</option>
              </Select>
            </FormControl>

            {alertType !== 'specific_price' ? (
              <FormControl>
                <FormLabel>Percentage {alertType === 'price_drop' ? 'Drop' : 'Increase'}</FormLabel>
                <NumberInput
                  value={percentage}
                  onChange={(_, value) => setPercentage(value)}
                  min={1}
                  max={50}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            ) : (
              <FormControl>
                <FormLabel>Target Price</FormLabel>
                <NumberInput
                  value={specificPrice}
                  onChange={(_, value) => setSpecificPrice(value)}
                  min={0}
                  max={currentPrice * 2}
                  step={1000}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            )}

            <VStack align="start" w="100%" spacing={1}>
              <Text fontSize="sm" color="gray.600">
                You will be notified when the price reaches:
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="green.600">
                ${calculateTargetPrice().toLocaleString()}
              </Text>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleCreateAlert}
            isLoading={isLoading}
          >
            Create Alert
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
