import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  IconButton,
  Text,
  Avatar,
  Badge,
  Divider,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import {
  FaPaperPlane,
  FaPaperclip,
  FaImage,
  FaSmile,
} from 'react-icons/fa';
import { useChat } from '@/hooks/useChat';

interface ChatWindowProps {
  agentId: string;
  propertyId?: string;
}

interface Message {
  id: string;
  senderId: string;
  senderType: 'user' | 'agent';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachments?: Array<{
    id: string;
    type: 'image' | 'document';
    url: string;
    name: string;
  }>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  agentId,
  propertyId,
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const {
    messages,
    agent,
    isLoading,
    isTyping,
    sendMessage,
    uploadAttachment,
  } = useChat(agentId);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage({
        content: message,
        propertyId,
      });
      setMessage('');
    } catch (error) {
      toast({
        title: 'Failed to send message',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const file = files[0];
      await uploadAttachment(file);
      
      toast({
        title: 'File uploaded successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to upload file',
        status: 'error',
        duration: 3000,
      });
    }

    // Clear the input
    e.target.value = '';
  };

  if (isLoading) {
    return (
      <Box
        height="600px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      height="600px"
      display="flex"
      flexDirection="column"
    >
      {/* Header */}
      <HStack
        p={4}
        borderBottomWidth="1px"
        bg="gray.50"
        spacing={4}
      >
        <Avatar
          size="sm"
          name={agent?.name}
          src={agent?.avatarUrl}
        />
        <VStack align="start" spacing={0} flex={1}>
          <Text fontWeight="bold">{agent?.name}</Text>
          <HStack>
            <Badge
              colorScheme={agent?.isOnline ? 'green' : 'gray'}
              variant="subtle"
            >
              {agent?.isOnline ? 'Online' : 'Offline'}
            </Badge>
            {agent?.role && (
              <Badge colorScheme="blue" variant="subtle">
                {agent.role}
              </Badge>
            )}
          </HStack>
        </VStack>
      </HStack>

      {/* Messages */}
      <VStack
        flex={1}
        overflowY="auto"
        spacing={4}
        p={4}
        align="stretch"
      >
        {messages.map((msg: Message) => (
          <Box
            key={msg.id}
            alignSelf={msg.senderType === 'user' ? 'flex-end' : 'flex-start'}
            maxW="70%"
          >
            <Box
              bg={msg.senderType === 'user' ? 'blue.500' : 'gray.100'}
              color={msg.senderType === 'user' ? 'white' : 'black'}
              p={3}
              borderRadius="lg"
              position="relative"
            >
              <Text>{msg.content}</Text>
              
              {msg.attachments && msg.attachments.length > 0 && (
                <VStack mt={2} align="stretch">
                  {msg.attachments.map(attachment => (
                    <Box
                      key={attachment.id}
                      borderWidth="1px"
                      borderRadius="md"
                      p={2}
                      bg={msg.senderType === 'user' ? 'blue.600' : 'white'}
                    >
                      <HStack>
                        <Icon
                          as={attachment.type === 'image' ? FaImage : FaPaperclip}
                        />
                        <Text fontSize="sm">{attachment.name}</Text>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
            
            <Text
              fontSize="xs"
              color="gray.500"
              mt={1}
              textAlign={msg.senderType === 'user' ? 'right' : 'left'}
            >
              {new Date(msg.timestamp).toLocaleTimeString()}
              {msg.senderType === 'user' && (
                <Text as="span" ml={2}>
                  {msg.status === 'read' ? '✓✓' : '✓'}
                </Text>
              )}
            </Text>
          </Box>
        ))}

        {isTyping && (
          <HStack spacing={2} alignSelf="flex-start">
            <Avatar size="xs" name={agent?.name} src={agent?.avatarUrl} />
            <Text fontSize="sm" color="gray.500">
              {agent?.name} is typing...
            </Text>
          </HStack>
        )}

        <div ref={messagesEndRef} />
      </VStack>

      <Divider />

      {/* Input */}
      <HStack p={4} spacing={2}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        
        <IconButton
          aria-label="Attach file"
          icon={<FaPaperclip />}
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
        />
        
        <IconButton
          aria-label="Add emoji"
          icon={<FaSmile />}
          variant="ghost"
        />
        
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <IconButton
          aria-label="Send message"
          icon={<FaPaperPlane />}
          colorScheme="blue"
          onClick={handleSend}
          isDisabled={!message.trim()}
        />
      </HStack>
    </Box>
  );
};
