import React from 'react';
import { Box, Container, Heading } from '@chakra-ui/react';
import { CreatePropertyForm } from '@/components/PropertyListing/CreatePropertyForm';

export default function CreatePropertyPage() {
  return (
    <Container maxW="container.lg" py={8}>
      <Box mb={8}>
        <Heading as="h1" size="xl">Create New Property Listing</Heading>
      </Box>
      <CreatePropertyForm />
    </Container>
  );
}
