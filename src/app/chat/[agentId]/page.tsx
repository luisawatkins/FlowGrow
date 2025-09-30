import React from 'react';
import {
  Container,
  VStack,
  Heading,
  Text,
} from '@chakra-ui/react';
import { ChatWindow } from '@/components/Chat/ChatWindow';

interface ChatPageProps {
  params: {
    agentId: string;
  };
  searchParams?: {
    propertyId?: string;
  };
}

export default function ChatPage({
  params,
  searchParams,
}: ChatPageProps) {
  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={6} align="stretch">
        <VStack align="start" spacing={1}>
          <Heading size="lg">Chat with Agent</Heading>
          <Text color="gray.600">
            Get instant answers to your property questions
          </Text>
        </VStack>

        <ChatWindow
          agentId={params.agentId}
          propertyId={searchParams?.propertyId}
        />
      </VStack>
    </Container>
  );
}
