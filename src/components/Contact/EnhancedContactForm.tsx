import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Checkbox,
  useToast,
  FormErrorMessage,
  Text,
  Divider,
  Badge,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useEnhancedContact } from '@/hooks/useEnhancedContact';
import { ContactForm, ContactStatus } from '@/types/contact';
import { AddIcon, AttachmentIcon, CalendarIcon } from '@chakra-ui/icons';

interface EnhancedContactFormProps {
  propertyId: string;
  propertyTitle?: string;
  onSuccess?: (contact: ContactForm) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export const EnhancedContactForm: React.FC<EnhancedContactFormProps> = ({
  propertyId,
  propertyTitle,
  onSuccess,
  onClose,
  isOpen = false,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const { createContact, isLoading } = useEnhancedContact();
  const { isOpen: isTemplateOpen, onOpen: onTemplateOpen, onClose: onTemplateClose } = useDisclosure();
  
  const [formData, setFormData] = useState<Partial<ContactForm>>({
    propertyId,
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    message: '',
    preferredContactMethod: 'email',
    preferredViewingTime: '',
    isPreApproved: false,
    budget: undefined,
    timeline: '',
    additionalInfo: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<File[]>([]);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

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

    if (formData.budget && formData.budget < 0) {
      newErrors.budget = 'Budget must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const contactData = {
        ...formData,
        status: ContactStatus.NEW,
        attachments: attachments.map((file, index) => ({
          id: `att-${index}`,
          filename: file.name,
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' as const : 'document' as const,
          size: file.size,
        })),
      } as Omit<ContactForm, 'id' | 'createdAt' | 'updatedAt'>;

      const contact = await createContact(contactData);
      
      toast({
        title: 'Inquiry submitted successfully',
        description: 'We will get back to you within 24 hours.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onSuccess?.(contact);
      onClose?.();
    } catch (error) {
      toast({
        title: 'Error submitting inquiry',
        description: 'Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const formContent = (
    <Box as="form" onSubmit={handleSubmit} maxW="600px" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Property Info */}
        {propertyTitle && (
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
              Inquiring about: {propertyTitle}
            </Text>
            <Divider mt={2} />
          </Box>
        )}

        {/* Basic Information */}
        <HStack spacing={4}>
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Full Name</FormLabel>
            <Input
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              placeholder="Enter your email"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
        </HStack>

        <FormControl isInvalid={!!errors.phone}>
          <FormLabel>Phone Number (Optional)</FormLabel>
          <Input
            name="phone"
            value={formData.phone || ''}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
          />
          <FormErrorMessage>{errors.phone}</FormErrorMessage>
        </FormControl>

        {/* Contact Preferences */}
        <HStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>Preferred Contact Method</FormLabel>
            <Select
              name="preferredContactMethod"
              value={formData.preferredContactMethod || 'email'}
              onChange={handleInputChange}
            >
              <option value="email">Email</option>
              <option value="phone">Phone</option>
              <option value="text">Text Message</option>
              <option value="any">Any Method</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Preferred Viewing Time</FormLabel>
            <Input
              name="preferredViewingTime"
              value={formData.preferredViewingTime || ''}
              onChange={handleInputChange}
              placeholder="e.g., Weekend mornings"
            />
          </FormControl>
        </HStack>

        {/* Budget and Timeline */}
        <HStack spacing={4}>
          <FormControl isInvalid={!!errors.budget}>
            <FormLabel>Budget (Optional)</FormLabel>
            <Input
              name="budget"
              type="number"
              value={formData.budget || ''}
              onChange={handleInputChange}
              placeholder="Enter your budget"
            />
            <FormErrorMessage>{errors.budget}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Timeline (Optional)</FormLabel>
            <Select
              name="timeline"
              value={formData.timeline || ''}
              onChange={handleInputChange}
              placeholder="Select timeline"
            >
              <option value="immediately">Immediately</option>
              <option value="1-3 months">1-3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6+ months">6+ months</option>
            </Select>
          </FormControl>
        </HStack>

        {/* Message */}
        <FormControl isRequired isInvalid={!!errors.message}>
          <FormLabel>Message</FormLabel>
          <Textarea
            name="message"
            value={formData.message || ''}
            onChange={handleInputChange}
            placeholder="Tell us about your requirements and any questions you have..."
            rows={4}
          />
          <FormErrorMessage>{errors.message}</FormErrorMessage>
        </FormControl>

        {/* Additional Information */}
        <FormControl>
          <FormLabel>Additional Information (Optional)</FormLabel>
          <Textarea
            name="additionalInfo"
            value={formData.additionalInfo || ''}
            onChange={handleInputChange}
            placeholder="Any additional information that might be helpful..."
            rows={3}
          />
        </FormControl>

        {/* Attachments */}
        <FormControl>
          <FormLabel>Attachments (Optional)</FormLabel>
          <Input
            type="file"
            multiple
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx"
            display="none"
            id="file-upload"
          />
          <Button
            as="label"
            htmlFor="file-upload"
            leftIcon={<AttachmentIcon />}
            variant="outline"
            cursor="pointer"
          >
            Add Files
          </Button>
          
          {attachments.length > 0 && (
            <VStack align="stretch" mt={2}>
              {attachments.map((file, index) => (
                <HStack key={index} justify="space-between" p={2} bg="gray.50" borderRadius="md">
                  <Text fontSize="sm">{file.name}</Text>
                  <IconButton
                    aria-label="Remove file"
                    icon={<AddIcon transform="rotate(45deg)" />}
                    size="sm"
                    variant="ghost"
                    onClick={() => removeAttachment(index)}
                  />
                </HStack>
              ))}
            </VStack>
          )}
        </FormControl>

        {/* Pre-approval */}
        <FormControl>
          <Checkbox
            name="isPreApproved"
            isChecked={formData.isPreApproved || false}
            onChange={handleInputChange}
          >
            I am pre-approved for financing
          </Checkbox>
        </FormControl>

        {/* Submit Button */}
        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          isLoading={isLoading}
          loadingText="Submitting..."
        >
          Submit Inquiry
        </Button>
      </VStack>
    </Box>
  );

  if (isOpen) {
    return (
      <Modal isOpen={isOpen} onClose={onClose || (() => {})} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Contact Property Owner</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {formContent}
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return formContent;
};
