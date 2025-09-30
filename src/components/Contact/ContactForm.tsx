import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  VStack,
  Checkbox,
  useToast,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import type { PropertyInquiry } from '@/app/api/inquiries/route';

interface ContactFormProps {
  propertyId: string;
  onSuccess?: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({
  propertyId,
  onSuccess,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<Partial<PropertyInquiry>>({
    propertyId,
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    message: '',
    preferredContactMethod: 'email',
    preferredViewingTime: '',
    isPreApproved: false,
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone format';
    }

    if (!formData.message?.trim()) {
      newErrors.message = 'Message is required';
    }

    if (formData.preferredContactMethod === 'phone' && !formData.phone) {
      newErrors.phone = 'Phone number is required for phone contact method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: 'Error',
        description: 'Please fix the errors in the form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      toast({
        title: 'Success',
        description: 'Your inquiry has been submitted successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        propertyId,
        name: session?.user?.name || '',
        email: session?.user?.email || '',
        phone: '',
        message: '',
        preferredContactMethod: 'email',
        preferredViewingTime: '',
        isPreApproved: false,
      });

      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit inquiry. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={4} align="stretch">
        <FormControl isRequired isInvalid={!!errors.name}>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your name"
          />
          <FormErrorMessage>{errors.name}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.email}>
          <FormLabel>Email</FormLabel>
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
          />
          <FormErrorMessage>{errors.email}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.phone}>
          <FormLabel>Phone</FormLabel>
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
          />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Preferred Contact Method</FormLabel>
          <RadioGroup
            value={formData.preferredContactMethod}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                preferredContactMethod: value as 'email' | 'phone',
              }))
            }
          >
            <Stack direction="row">
              <Radio value="email">Email</Radio>
              <Radio value="phone">Phone</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Preferred Viewing Time</FormLabel>
          <Input
            name="preferredViewingTime"
            type="datetime-local"
            value={formData.preferredViewingTime}
            onChange={handleInputChange}
          />
        </FormControl>

        <FormControl isRequired isInvalid={!!errors.message}>
          <FormLabel>Message</FormLabel>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Enter your message"
            rows={4}
          />
          <FormErrorMessage>{errors.message}</FormErrorMessage>
        </FormControl>

        <FormControl>
          <Checkbox
            isChecked={formData.isPreApproved}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isPreApproved: e.target.checked,
              }))
            }
          >
            I have mortgage pre-approval
          </Checkbox>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="full"
          isLoading={isSubmitting}
        >
          Submit Inquiry
        </Button>
      </VStack>
    </Box>
  );
};