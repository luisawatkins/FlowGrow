import React, { useState } from 'react';
import {
  VStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Text,
  Box,
  Heading,
  Divider,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaHome, FaDollarSign, FaMapMarkerAlt } from 'react-icons/fa';
import { useContact } from '@/hooks/useContact';

interface ContactFormProps {
  propertyId: string;
  propertyDetails: {
    title: string;
    price: number;
    location: string;
  };
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  propertyId,
  propertyDetails,
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    message: 'I am interested in this property and would like to schedule a viewing.',
  });

  const { submitInquiry, isLoading } = useContact();
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitInquiry(propertyId, formData);
      toast({
        title: 'Inquiry sent successfully',
        description: 'We will get back to you soon.',
        status: 'success',
        duration: 5000,
      });
      setFormData(prev => ({
        ...prev,
        message: 'I am interested in this property and would like to schedule a viewing.',
      }));
    } catch (error) {
      toast({
        title: 'Failed to send inquiry',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
      });
    }
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      bg="white"
      shadow="sm"
    >
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={4}>Property Details</Heading>
          <VStack spacing={2} align="stretch">
            <HStack>
              <Icon as={FaHome} />
              <Text>{propertyDetails.title}</Text>
            </HStack>
            <HStack>
              <Icon as={FaDollarSign} />
              <Text>${propertyDetails.price.toLocaleString()}</Text>
            </HStack>
            <HStack>
              <Icon as={FaMapMarkerAlt} />
              <Text>{propertyDetails.location}</Text>
            </HStack>
          </VStack>
        </Box>

        <Divider />

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Enter your message"
                rows={4}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              width="100%"
              isLoading={isLoading}
            >
              Send Inquiry
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};
