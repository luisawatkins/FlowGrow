import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Textarea,
  VStack,
  useToast,
  Grid,
  GridItem,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { CreatePropertyRequest } from '@/app/api/properties/create/route';

const PROPERTY_TYPES = ['House', 'Apartment', 'Studio', 'Villa'];
const AMENITY_OPTIONS = [
  'Parking',
  'Pool',
  'Garden',
  'Gym',
  'Security System',
  'Air Conditioning',
  'Furnished',
  'Beach Access',
  'Mountain View',
  'Garage',
  'Fireplace',
];

export const CreatePropertyForm: React.FC = () => {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<CreatePropertyRequest>>({
    title: '',
    description: '',
    price: 0,
    propertyType: '',
    bedrooms: 1,
    bathrooms: 1,
    squareFeet: 0,
    location: '',
    amenities: [],
    images: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInputChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities((prev) => {
      if (prev.includes(amenity)) {
        return prev.filter((a) => a !== amenity);
      }
      return [...prev, amenity];
    });
    setFormData((prev) => ({
      ...prev,
      amenities: selectedAmenities.includes(amenity)
        ? prev.amenities?.filter((a) => a !== amenity)
        : [...(prev.amenities || []), amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/properties/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create property listing');
      }

      const data = await response.json();
      toast({
        title: 'Success',
        description: 'Property listing created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        price: 0,
        propertyType: '',
        bedrooms: 1,
        bathrooms: 1,
        squareFeet: 0,
        location: '',
        amenities: [],
        images: [],
      });
      setSelectedAmenities([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create property listing',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} p={6} bg="white" borderRadius="lg" shadow="md">
      <VStack spacing={6} align="stretch">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem colSpan={2}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter property title"
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter property description"
                rows={4}
              />
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Price</FormLabel>
              <NumberInput
                min={0}
                value={formData.price}
                onChange={(value) => handleNumberInputChange('price', value)}
              >
                <NumberInputField placeholder="Enter price" />
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Property Type</FormLabel>
              <Select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                placeholder="Select property type"
              >
                {PROPERTY_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Bedrooms</FormLabel>
              <NumberInput
                min={0}
                value={formData.bedrooms}
                onChange={(value) => handleNumberInputChange('bedrooms', value)}
              >
                <NumberInputField placeholder="Number of bedrooms" />
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Bathrooms</FormLabel>
              <NumberInput
                min={0}
                value={formData.bathrooms}
                onChange={(value) => handleNumberInputChange('bathrooms', value)}
              >
                <NumberInputField placeholder="Number of bathrooms" />
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Square Feet</FormLabel>
              <NumberInput
                min={0}
                value={formData.squareFeet}
                onChange={(value) => handleNumberInputChange('squareFeet', value)}
              >
                <NumberInputField placeholder="Enter square footage" />
              </NumberInput>
            </FormControl>
          </GridItem>

          <GridItem>
            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Enter location"
              />
            </FormControl>
          </GridItem>

          <GridItem colSpan={2}>
            <FormControl>
              <FormLabel>Amenities</FormLabel>
              <Wrap spacing={2}>
                {AMENITY_OPTIONS.map((amenity) => (
                  <WrapItem key={amenity}>
                    <Tag
                      size="lg"
                      variant={selectedAmenities.includes(amenity) ? 'solid' : 'outline'}
                      colorScheme="blue"
                      cursor="pointer"
                      onClick={() => handleAmenityToggle(amenity)}
                    >
                      <TagLabel>{amenity}</TagLabel>
                      {selectedAmenities.includes(amenity) && (
                        <TagCloseButton onClick={(e) => {
                          e.stopPropagation();
                          handleAmenityToggle(amenity);
                        }} />
                      )}
                    </Tag>
                  </WrapItem>
                ))}
              </Wrap>
            </FormControl>
          </GridItem>
        </Grid>

        <Button
          type="submit"
          colorScheme="blue"
          size="lg"
          width="full"
          isLoading={isSubmitting}
        >
          Create Property Listing
        </Button>
      </VStack>
    </Box>
  );
};
