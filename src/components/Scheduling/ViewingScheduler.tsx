import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Grid,
  Text,
  VStack,
  HStack,
  useToast,
  Textarea,
  SimpleGrid,
  Badge,
  Divider,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import type { ViewingSlot, ViewingBooking } from '@/app/api/scheduling/route';

interface ViewingSchedulerProps {
  propertyId: string;
  propertyTitle: string;
}

interface TimeSlotProps {
  slot: ViewingSlot;
  onSelect: (slot: ViewingSlot) => void;
  isSelected: boolean;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ slot, onSelect, isSelected }) => {
  const startTime = new Date(slot.startTime);
  const formattedTime = startTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Button
      width="full"
      variant={isSelected ? 'solid' : 'outline'}
      colorScheme={isSelected ? 'blue' : slot.isBooked ? 'gray' : 'blue'}
      isDisabled={slot.isBooked}
      onClick={() => onSelect(slot)}
      py={6}
    >
      <VStack spacing={1}>
        <Text>{formattedTime}</Text>
        {slot.isBooked ? (
          <Badge colorScheme="red">Booked</Badge>
        ) : (
          <Badge colorScheme="green">Available</Badge>
        )}
      </VStack>
    </Button>
  );
};

export const ViewingScheduler: React.FC<ViewingSchedulerProps> = ({
  propertyId,
  propertyTitle,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [availableSlots, setAvailableSlots] = useState<ViewingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<ViewingSlot | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    notes: '',
  });

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch(
          `/api/scheduling?propertyId=${propertyId}&date=${selectedDate}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch available slots');
        }

        const data = await response.json();
        setAvailableSlots(data.slots);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load available slots',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchAvailableSlots();
  }, [propertyId, selectedDate, toast]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: ViewingSlot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/scheduling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slotId: selectedSlot.id,
          propertyId,
          ...formData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to book viewing');
      }

      const booking: ViewingBooking = await response.json();

      toast({
        title: 'Success',
        description: 'Property viewing scheduled successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Update available slots
      setAvailableSlots((prev) =>
        prev.map((slot) =>
          slot.id === selectedSlot.id ? { ...slot, isBooked: true } : slot
        )
      );

      setIsModalOpen(false);
      setSelectedSlot(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule viewing',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Group slots by hour
  const groupedSlots = availableSlots.reduce<Record<string, ViewingSlot[]>>(
    (acc, slot) => {
      const hour = new Date(slot.startTime).getHours();
      if (!acc[hour]) {
        acc[hour] = [];
      }
      acc[hour].push(slot);
      return acc;
    },
    {}
  );

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <FormControl>
          <FormLabel>Select Date</FormLabel>
          <Input
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]}
            max={
              new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split('T')[0]
            }
          />
        </FormControl>

        <Box>
          <Text fontWeight="bold" mb={4}>
            Available Time Slots
          </Text>
          {Object.entries(groupedSlots).length === 0 ? (
            <Text textAlign="center" color="gray.500" py={4}>
              No available slots for this date
            </Text>
          ) : (
            <VStack spacing={4}>
              {Object.entries(groupedSlots).map(([hour, slots]) => (
                <Box key={hour} width="full">
                  <Text mb={2} color="gray.600">
                    {new Date(slots[0].startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      hour12: true,
                    })}
                  </Text>
                  <SimpleGrid columns={[2, 3, 4]} spacing={4}>
                    {slots.map((slot) => (
                      <TimeSlot
                        key={slot.id}
                        slot={slot}
                        onSelect={handleSlotSelect}
                        isSelected={selectedSlot?.id === slot.id}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule Property Viewing</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <VStack spacing={4}>
              <Box width="full">
                <Text fontWeight="bold">{propertyTitle}</Text>
                <Text color="gray.600">
                  {selectedSlot &&
                    new Date(selectedSlot.startTime).toLocaleString([], {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                </Text>
              </Box>

              <Divider />

              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Enter your name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter your email"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Phone (optional)</FormLabel>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Enter your phone number"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes (optional)</FormLabel>
                <Textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Any special requests or questions?"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleBooking}
              isLoading={isLoading}
            >
              Schedule Viewing
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};