import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaFolder } from 'react-icons/fa';
import { DocumentManager } from '@/components/Documents/DocumentManager';

interface DocumentsPageProps {
  params: {
    propertyId: string;
  };
}

export default function DocumentsPage({
  params,
}: DocumentsPageProps) {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={6} align="stretch">
        <HStack spacing={2}>
          <Icon as={FaFolder} color="blue.500" boxSize={6} />
          <Heading size="lg">Property Documents</Heading>
        </HStack>
        
        <Text color="gray.600">
          Manage and organize all documents related to this property.
          Upload, download, and share files securely.
        </Text>

        <DocumentManager propertyId={params.propertyId} />
      </VStack>
    </Container>
  );
}
