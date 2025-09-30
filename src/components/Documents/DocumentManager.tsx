import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Badge,
  Select,
  useToast,
  useDisclosure,
  Tooltip,
} from '@chakra-ui/react';
import {
  FaFile,
  FaFileContract,
  FaFileAlt,
  FaFileInvoiceDollar,
  FaFileSignature,
  FaShare,
  FaDownload,
  FaTrash,
  FaEllipsisV,
  FaCheck,
  FaClock,
  FaExclamationTriangle,
} from 'react-icons/fa';
import { useSession } from 'next-auth/react';
import type { Document } from '@/app/api/documents/route';

interface DocumentManagerProps {
  propertyId?: string;
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (users: { email: string; role: 'viewer' | 'signer' }[]) => void;
}

const DOCUMENT_ICONS = {
  contract: FaFileContract,
  inspection: FaFileAlt,
  appraisal: FaFileAlt,
  mortgage: FaFileInvoiceDollar,
  other: FaFile,
};

const STATUS_COLORS = {
  draft: 'gray',
  pending: 'yellow',
  signed: 'green',
  expired: 'red',
};

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onShare,
}) => {
  const [users, setUsers] = useState([{ email: '', role: 'viewer' as const }]);

  const handleAddUser = () => {
    setUsers([...users, { email: '', role: 'viewer' as const }]);
  };

  const handleRemoveUser = (index: number) => {
    setUsers(users.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const validUsers = users.filter((user) => user.email.trim());
    onShare(validUsers);
    setUsers([{ email: '', role: 'viewer' }]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Share Document</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4}>
            {users.map((user, index) => (
              <HStack key={index} width="full">
                <FormControl>
                  <Input
                    placeholder="Email address"
                    value={user.email}
                    onChange={(e) => {
                      const newUsers = [...users];
                      newUsers[index].email = e.target.value;
                      setUsers(newUsers);
                    }}
                  />
                </FormControl>
                <Select
                  width="120px"
                  value={user.role}
                  onChange={(e) => {
                    const newUsers = [...users];
                    newUsers[index].role = e.target.value as 'viewer' | 'signer';
                    setUsers(newUsers);
                  }}
                >
                  <option value="viewer">Viewer</option>
                  <option value="signer">Signer</option>
                </Select>
                {index > 0 && (
                  <IconButton
                    aria-label="Remove user"
                    icon={<FaTrash />}
                    onClick={() => handleRemoveUser(index)}
                  />
                )}
              </HStack>
            ))}
            <Button onClick={handleAddUser}>Add Another User</Button>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!users.some((user) => user.email.trim())}
          >
            Share
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  propertyId,
}) => {
  const { data: session } = useSession();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState({
    type: '',
    status: '',
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const params = new URLSearchParams();
        if (propertyId) params.append('propertyId', propertyId);
        if (filter.type) params.append('type', filter.type);
        if (filter.status) params.append('status', filter.status);

        const response = await fetch(`/api/documents?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }

        const data = await response.json();
        setDocuments(data.documents);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load documents',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [propertyId, filter, toast]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const formData = new FormData();
    formData.append('file', files[0]);
    if (propertyId) formData.append('propertyId', propertyId);

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const document = await response.json();
      setDocuments((prev) => [...prev, document]);

      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleShare = async (users: { email: string; role: 'viewer' | 'signer' }[]) => {
    if (!selectedDocument) return;

    try {
      const response = await fetch('/api/documents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: selectedDocument.id,
          action: 'share',
          data: {
            sharedWith: users.map((user) => ({
              ...user,
              status: 'pending',
            })),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to share document');
      }

      const updatedDocument = await response.json();
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === updatedDocument.id ? updatedDocument : doc
        )
      );

      toast({
        title: 'Success',
        description: 'Document shared successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to share document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSign = async (documentId: string) => {
    try {
      const response = await fetch('/api/documents', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId,
          action: 'sign',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign document');
      }

      const updatedDocument = await response.json();
      setDocuments((prev) =>
        prev.map((doc) =>
          doc.id === updatedDocument.id ? updatedDocument : doc
        )
      );

      toast({
        title: 'Success',
        description: 'Document signed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  if (isLoading) {
    return (
      <Box textAlign="center" py={10}>
        Loading documents...
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Actions Bar */}
        <HStack justify="space-between">
          <HStack>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <Button
              colorScheme="blue"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Document
            </Button>
          </HStack>

          <HStack>
            <Select
              placeholder="All Types"
              value={filter.type}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, type: e.target.value }))
              }
            >
              <option value="contract">Contracts</option>
              <option value="inspection">Inspections</option>
              <option value="appraisal">Appraisals</option>
              <option value="mortgage">Mortgage</option>
              <option value="other">Other</option>
            </Select>

            <Select
              placeholder="All Statuses"
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({ ...prev, status: e.target.value }))
              }
            >
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="signed">Signed</option>
              <option value="expired">Expired</option>
            </Select>
          </HStack>
        </HStack>

        {/* Documents Table */}
        {documents.length === 0 ? (
          <Box textAlign="center" py={10} color="gray.500">
            No documents found
          </Box>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Document</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Size</Th>
                <Th>Last Updated</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {documents.map((document) => (
                <Tr key={document.id}>
                  <Td>
                    <HStack>
                      <Icon
                        as={DOCUMENT_ICONS[document.type]}
                        boxSize={5}
                        color="blue.500"
                      />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{document.name}</Text>
                        {document.sharedWith.length > 0 && (
                          <Text fontSize="sm" color="gray.500">
                            Shared with {document.sharedWith.length} users
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </Td>
                  <Td>
                    <Text textTransform="capitalize">{document.type}</Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={STATUS_COLORS[document.status]}>
                      {document.status}
                    </Badge>
                  </Td>
                  <Td>{formatFileSize(document.size)}</Td>
                  <Td>
                    <Text>
                      {new Date(document.updatedAt).toLocaleDateString()}
                    </Text>
                  </Td>
                  <Td>
                    <HStack>
                      <Tooltip label="Download">
                        <IconButton
                          aria-label="Download"
                          icon={<FaDownload />}
                          size="sm"
                          onClick={() => window.open(document.url)}
                        />
                      </Tooltip>

                      <Tooltip label="Share">
                        <IconButton
                          aria-label="Share"
                          icon={<FaShare />}
                          size="sm"
                          onClick={() => {
                            setSelectedDocument(document);
                            onOpen();
                          }}
                        />
                      </Tooltip>

                      {document.status === 'pending' && (
                        <Tooltip label="Sign">
                          <IconButton
                            aria-label="Sign"
                            icon={<FaFileSignature />}
                            size="sm"
                            colorScheme="green"
                            onClick={() => handleSign(document.id)}
                          />
                        </Tooltip>
                      )}

                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FaEllipsisV />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem icon={<FaCheck />}>Mark as Complete</MenuItem>
                          <MenuItem icon={<FaClock />}>Set Reminder</MenuItem>
                          <MenuItem
                            icon={<FaTrash />}
                            color="red.500"
                          >
                            Delete
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>

      <ShareModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setSelectedDocument(null);
        }}
        onShare={handleShare}
      />
    </Box>
  );
};