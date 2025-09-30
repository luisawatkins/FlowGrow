import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Grid,
  Button,
  Text,
  Select,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  Badge,
  Icon,
} from '@chakra-ui/react';
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
} from 'react-icons/fa';
import { useScheduling } from '@/hooks/useScheduling';

interface ViewingSchedulerProps {
  propertyId: string;
  agentId: string;
}

export const ViewingScheduler: React.FC<ViewingSchedulerProps> = ({
  propertyId,
  agentId,
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const {
    availableSlots,
    isLoading,
    scheduleViewing,
  } = useScheduling(propertyId, agentId);

  const toast = useToast();

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    try {
      await scheduleViewing({
        date: selectedDate,
        time: selectedTime,
        ...contactInfo,
      });

      toast({
        title: 'Viewing scheduled successfully',
        description: 'You will receive a confirmation email shortly.',
        status: 'success',
        duration: 5000,
      });

      setIsConfirmModalOpen(false);
      setSelectedDate('');
      setSelectedTime('');
      setContactInfo({
        name: '',
        email: '',
        phone: '',
        notes: '',
      });
    } catch (error) {
      toast({
        title: 'Failed to schedule viewing',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
      });
    }
  };

  const getAvailableTimesForDate = (date: string) => {
    return availableSlots.filter(slot => slot.date === date);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box p={6} textAlign="center">
        <Text>Loading available viewing slots...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Date Selection */}
        <Box>
          <Text fontWeight="bold" mb={4}>
            Select a Date
          </Text>
          <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
            {[...new Set(availableSlots.map(slot => slot.date))].map(date => (
              <Button
                key={date}
                onClick={() => handleDateSelect(date)}
                variant={selectedDate === date ? 'solid' : 'outline'}
                colorScheme="blue"
                size="lg"
                height="auto"
                p={4}
              >
                <VStack spacing={1}>
                  <Icon as={FaCalendarAlt} />
                  <Text fontSize="sm">{formatDate(date)}</Text>
                </VStack>
              </Button>
            ))}
          </Grid>
        </Box>

        {/* Time Selection */}
        {selectedDate && (
          <Box>
            <Text fontWeight="bold" mb={4}>
              Select a Time
            </Text>
            <Grid templateColumns="repeat(auto-fill, minmax(120px, 1fr))" gap={4}>
              {getAvailableTimesForDate(selectedDate).map(slot => (
                <Button
                  key={slot.time}
                  onClick={() => handleTimeSelect(slot.time)}
                  variant={selectedTime === slot.time ? 'solid' : 'outline'}
                  colorScheme="blue"
                  isDisabled={!slot.available}
                >
                  <HStack>
                    <Icon as={FaClock} />
                    <Text>{slot.time}</Text>
                  </HStack>
                </Button>
              ))}
            </Grid>
          </Box>
        )}

        {/* Schedule Button */}
        {selectedDate && selectedTime && (
          <Button
            colorScheme="blue"
            size="lg"
            onClick={() => setIsConfirmModalOpen(true)}
          >
            Schedule Viewing
          </Button>
        )}
      </VStack>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Viewing</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <Box>
                <Badge colorScheme="blue" mb={2}>Selected Time</Badge>
                <HStack>
                  <Icon as={FaCalendarAlt} />
                  <Text>{formatDate(selectedDate)}</Text>
                  <Icon as={FaClock} />
                  <Text>{selectedTime}</Text>
                </HStack>
              </Box>

              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                  placeholder="Enter your name"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo(prev => ({
                    ...prev,
                    name: e.target.value,
                  }))}
                  leftIcon={<Icon as={FaUser} />}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo(prev => ({
                    ...prev,
                    email: e.target.value,
                  }))}
                  leftIcon={<Icon as={FaEnvelope} />}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Phone</FormLabel>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo(prev => ({
                    ...prev,
                    phone: e.target.value,
                  }))}
                  leftIcon={<Icon as={FaPhone} />}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Additional Notes</FormLabel>
                <Textarea
                  placeholder="Any special requests or questions?"
                  value={contactInfo.notes}
                  onChange={(e) => setContactInfo(prev => ({
                    ...prev,
                    notes: e.target.value,
                  }))}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isDisabled={!contactInfo.name || !contactInfo.email || !contactInfo.phone}
            >
              Confirm Viewing
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
