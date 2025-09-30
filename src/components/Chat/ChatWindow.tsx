import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Avatar,
  IconButton,
  useToast,
  Spinner,
  Divider,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Image,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaPaperPlane,
  FaPaperclip,
  FaImage,
  FaFile,
  FaEllipsisV,
  FaDownload,
  FaCheck,
  FaCheckDouble,
} from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import type {
  ChatMessage,
  ChatConversation,
} from '@/app/api/chat/messages/route';

interface ChatWindowProps {
  conversationId: string;
  onClose?: () => void;
}

const MessageBubble: React.FC<{
  message: ChatMessage;
  isOwnMessage: boolean;
}> = ({ message, isOwnMessage }) => {
  const toast = useToast();

  const handleDownload = async (url: string, name: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download file',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      alignSelf={isOwnMessage ? 'flex-end' : 'flex-start'}
      maxW="70%"
      mb={4}
    >
      {!isOwnMessage && (
        <HStack mb={1}>
          <Avatar
            size="xs"
            name={message.senderName}
            src={message.senderImage}
          />
          <Text fontSize="sm" color="gray.600">
            {message.senderName}
          </Text>
        </HStack>
      )}

      <Box
        bg={isOwnMessage ? 'blue.500' : 'gray.100'}
        color={isOwnMessage ? 'white' : 'black'}
        p={3}
        borderRadius="lg"
        position="relative"
      >
        <Text>{message.content}</Text>

        {message.attachments && message.attachments.length > 0 && (
          <VStack mt={2} align="stretch" spacing={2}>
            {message.attachments.map((attachment, index) => (
              <Box
                key={index}
                borderRadius="md"
                overflow="hidden"
                bg={isOwnMessage ? 'blue.600' : 'gray.200'}
                p={2}
              >
                {attachment.type === 'image' ? (
                  <Image
                    src={attachment.url}
                    alt={attachment.name}
                    maxH="200px"
                    objectFit="cover"
                    cursor="pointer"
                    onClick={() => window.open(attachment.url)}
                  />
                ) : (
                  <HStack justify="space-between">
                    <HStack>
                      <FaFile />
                      <Text>{attachment.name}</Text>
                    </HStack>
                    <IconButton
                      aria-label="Download file"
                      icon={<FaDownload />}
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleDownload(attachment.url, attachment.name)
                      }
                    />
                  </HStack>
                )}
              </Box>
            ))}
          </VStack>
        )}

        <HStack
          position="absolute"
          bottom="-20px"
          right={isOwnMessage ? 0 : 'auto'}
          left={isOwnMessage ? 'auto' : 0}
          spacing={1}
        >
          <Text fontSize="xs" color="gray.500">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {isOwnMessage && (
            <Icon
              as={message.isRead ? FaCheckDouble : FaCheck}
              color={message.isRead ? 'blue.500' : 'gray.500'}
              boxSize={3}
            />
          )}
        </HStack>
      </Box>
    </Box>
  );
};

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  onClose,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<
    { type: 'image' | 'document'; url: string; name: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/chat/messages?conversationId=${conversationId}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data.messages);
        setConversation(data.conversation);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load messages',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // In a real application, set up WebSocket connection here
    // const ws = new WebSocket('ws://your-websocket-url');
    // ws.onmessage = (event) => {
    //   const message = JSON.parse(event.data);
    //   setMessages((prev) => [...prev, message]);
    // };
    // return () => ws.close();
  }, [conversationId, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && attachments.length === 0) return;

    setIsSending(true);
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId,
          content: newMessage.trim(),
          attachments: attachments.length > 0 ? attachments : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const message = await response.json();
      setMessages((prev) => [...prev, message]);
      setNewMessage('');
      setAttachments([]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'image' | 'document'
  ) => {
    const files = Array.from(e.target.files || []);
    // In a real app, upload to cloud storage and get URLs
    const newAttachments = files.map((file) => ({
      type,
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
    e.target.value = ''; // Reset input
  };

  if (isLoading) {
    return (
      <Box
        height="600px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!conversation) {
    return (
      <Box
        height="600px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Text>Conversation not found</Text>
      </Box>
    );
  }

  const otherParticipant = conversation.participants.find(
    (p) => p.id !== (session?.user as any)?.id
  );

  return (
    <Box height="600px" display="flex" flexDirection="column">
      {/* Header */}
      <HStack
        p={4}
        bg="white"
        borderBottom="1px"
        borderColor="gray.200"
        justify="space-between"
      >
        <HStack>
          <Avatar
            size="sm"
            name={otherParticipant?.name}
            src={otherParticipant?.image}
          />
          <Box>
            <Text fontWeight="bold">{otherParticipant?.name}</Text>
            <Text fontSize="sm" color="gray.600">
              {otherParticipant?.role === 'agent' ? 'Real Estate Agent' : 'User'}
            </Text>
          </Box>
        </HStack>

        <HStack>
          {conversation.propertyId && (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                window.location.href = `/properties/${conversation.propertyId}`
              }
            >
              View Property
            </Button>
          )}
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<FaEllipsisV />}
              variant="ghost"
              aria-label="More options"
            />
            <MenuList>
              <MenuItem onClick={() => window.print()}>Print Chat</MenuItem>
              <MenuItem onClick={onClose}>Close Chat</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </HStack>

      {/* Messages */}
      <VStack
        flex={1}
        overflowY="auto"
        p={4}
        spacing={0}
        align="stretch"
        bg="gray.50"
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.senderId === (session?.user as any)?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </VStack>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <HStack p={2} bg="gray.100" overflowX="auto">
          {attachments.map((attachment, index) => (
            <Box
              key={index}
              position="relative"
              borderRadius="md"
              overflow="hidden"
            >
              {attachment.type === 'image' ? (
                <Image
                  src={attachment.url}
                  alt={attachment.name}
                  height="60px"
                  width="60px"
                  objectFit="cover"
                />
              ) : (
                <Box
                  height="60px"
                  width="60px"
                  bg="gray.200"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <FaFile size={24} />
                </Box>
              )}
              <IconButton
                aria-label="Remove attachment"
                icon={<FaCheck />}
                size="xs"
                position="absolute"
                top={1}
                right={1}
                colorScheme="red"
                onClick={() =>
                  setAttachments((prev) =>
                    prev.filter((_, i) => i !== index)
                  )
                }
              />
            </Box>
          ))}
        </HStack>
      )}

      {/* Input */}
      <HStack p={4} bg="white" borderTop="1px" borderColor="gray.200">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={(e) => handleFileSelect(e, 'document')}
          multiple
        />
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaPaperclip />}
            variant="ghost"
            aria-label="Attach file"
          />
          <MenuList>
            <MenuItem
              icon={<FaImage />}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Images
            </MenuItem>
            <MenuItem
              icon={<FaFile />}
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Documents
            </MenuItem>
          </MenuList>
        </Menu>
        <Input
          flex={1}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <IconButton
          aria-label="Send message"
          icon={<FaPaperPlane />}
          colorScheme="blue"
          isLoading={isSending}
          onClick={handleSendMessage}
        />
      </HStack>
    </Box>
  );
};