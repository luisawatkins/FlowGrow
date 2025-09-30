import React, { useRef, useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Button,
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
  Progress,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import {
  FaFileUpload,
  FaDownload,
  FaTrash,
  FaEllipsisV,
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaShare,
  FaEdit,
} from 'react-icons/fa';
import { useDocuments } from '@/hooks/useDocuments';

interface DocumentManagerProps {
  propertyId: string;
}

export const DocumentManager: React.FC<DocumentManagerProps> = ({
  propertyId,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [newFileName, setNewFileName] = useState('');

  const {
    documents,
    isLoading,
    uploadProgress,
    uploadDocument,
    downloadDocument,
    deleteDocument,
    renameDocument,
    shareDocument,
  } = useDocuments(propertyId);

  const toast = useToast();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      await uploadDocument(files[0]);
      toast({
        title: 'Document uploaded successfully',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to upload document',
        status: 'error',
        duration: 3000,
      });
    }

    // Clear the input
    e.target.value = '';
  };

  const handleDownload = async (document: any) => {
    try {
      await downloadDocument(document.id);
      toast({
        title: 'Document downloaded successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to download document',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleDelete = async (document: any) => {
    try {
      await deleteDocument(document.id);
      toast({
        title: 'Document deleted successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete document',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleShare = async (document: any) => {
    try {
      const shareUrl = await shareDocument(document.id);
      // Copy to clipboard
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: 'Share link copied to clipboard',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to share document',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const handleRename = async () => {
    if (!selectedDocument || !newFileName.trim()) return;

    try {
      await renameDocument(selectedDocument.id, newFileName);
      setIsRenameModalOpen(false);
      setSelectedDocument(null);
      setNewFileName('');
      toast({
        title: 'Document renamed successfully',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to rename document',
        status: 'error',
        duration: 3000,
      });
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return FaFilePdf;
      case 'doc':
      case 'docx':
        return FaFileWord;
      case 'xls':
      case 'xlsx':
        return FaFileExcel;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return FaFileImage;
      default:
        return FaFile;
    }
  };

  if (isLoading) {
    return (
      <Box p={6}>
        <Text>Loading documents...</Text>
      </Box>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Upload Section */}
        <Box
          borderWidth="2px"
          borderStyle="dashed"
          borderRadius="lg"
          p={6}
          textAlign="center"
        >
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
          <VStack spacing={4}>
            <Icon as={FaFileUpload} boxSize={8} color="blue.500" />
            <Text fontSize="lg">
              Drag and drop files here or{' '}
              <Button
                variant="link"
                colorScheme="blue"
                onClick={() => fileInputRef.current?.click()}
              >
                browse
              </Button>
            </Text>
            <Text color="gray.500" fontSize="sm">
              Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
            </Text>
          </VStack>
        </Box>

        {/* Upload Progress */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <Box>
            <Text mb={2}>Uploading...</Text>
            <Progress value={uploadProgress} size="sm" colorScheme="blue" />
          </Box>
        )}

        {/* Documents List */}
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Size</Th>
              <Th>Uploaded</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {documents.map((doc) => (
              <Tr key={doc.id}>
                <Td>
                  <HStack>
                    <Icon
                      as={getFileIcon(doc.type)}
                      color="blue.500"
                    />
                    <Text>{doc.name}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Badge>{doc.type.toUpperCase()}</Badge>
                </Td>
                <Td>{(doc.size / 1024).toFixed(2)} KB</Td>
                <Td>{new Date(doc.uploadedAt).toLocaleDateString()}</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FaEllipsisV />}
                      variant="ghost"
                      size="sm"
                    />
                    <MenuList>
                      <MenuItem
                        icon={<FaDownload />}
                        onClick={() => handleDownload(doc)}
                      >
                        Download
                      </MenuItem>
                      <MenuItem
                        icon={<FaShare />}
                        onClick={() => handleShare(doc)}
                      >
                        Share
                      </MenuItem>
                      <MenuItem
                        icon={<FaEdit />}
                        onClick={() => {
                          setSelectedDocument(doc);
                          setNewFileName(doc.name);
                          setIsRenameModalOpen(true);
                        }}
                      >
                        Rename
                      </MenuItem>
                      <MenuItem
                        icon={<FaTrash />}
                        color="red.500"
                        onClick={() => handleDelete(doc)}
                      >
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {documents.length === 0 && (
          <Box textAlign="center" py={8}>
            <Text color="gray.600">No documents uploaded yet</Text>
          </Box>
        )}
      </VStack>

      {/* Rename Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => {
          setIsRenameModalOpen(false);
          setSelectedDocument(null);
          setNewFileName('');
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Rename Document</ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <FormControl>
              <FormLabel>New Name</FormLabel>
              <Input
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Enter new file name"
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={() => {
                setIsRenameModalOpen(false);
                setSelectedDocument(null);
                setNewFileName('');
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleRename}
              isDisabled={!newFileName.trim()}
            >
              Rename
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
