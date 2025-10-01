import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  RadioGroup,
  Radio,
  Stack,
  Alert,
  AlertIcon,
  AlertDescription,
  Divider,
  Icon,
  useToast,
  Progress,
  Badge,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
} from '@chakra-ui/react';
import {
  DownloadIcon,
  UploadIcon,
  FileIcon,
  CheckIcon,
  WarningIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import { FavoritesExportProps } from '@/types/favorites';

export const FavoritesExport: React.FC<FavoritesExportProps & {
  isOpen: boolean;
  onClose: () => void;
}> = ({
  isOpen,
  onClose,
  onExport,
  onImport,
  className = '',
  supportedFormats = ['json', 'csv', 'pdf'],
}) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const toast = useToast();

  // Handle export
  const handleExport = async () => {
    try {
      setIsExporting(true);
      await onExport(exportFormat);
      
      toast({
        title: 'Export Successful',
        description: `Your favorites have been exported as ${exportFormat.toUpperCase()}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export favorites. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle file selection for import
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportFile(file);
    }
  };

  // Handle import
  const handleImport = async () => {
    if (!importFile) return;

    try {
      setIsImporting(true);
      setImportProgress(0);

      // Simulate import progress
      const progressInterval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      await onImport(importFile);
      
      setImportProgress(100);
      
      toast({
        title: 'Import Successful',
        description: 'Your favorites have been imported successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Import Failed',
        description: 'Failed to import favorites. Please check the file format.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsImporting(false);
      setImportProgress(0);
    }
  };

  // Get format description
  const getFormatDescription = (format: string) => {
    switch (format) {
      case 'json':
        return 'Structured data format, best for backup and sharing';
      case 'csv':
        return 'Spreadsheet format, compatible with Excel and Google Sheets';
      case 'pdf':
        return 'Document format, best for printing and sharing';
      default:
        return '';
    }
  };

  // Get format icon
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'json':
        return '📄';
      case 'csv':
        return '📊';
      case 'pdf':
        return '📋';
      default:
        return '📄';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <DownloadIcon color="blue.500" />
            <Text>Export & Import Favorites</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Export Section */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Export Favorites
              </Text>
              
              <Alert status="info" mb={4}>
                <AlertIcon />
                <AlertDescription>
                  Export your favorites to backup or share them with others.
                </AlertDescription>
              </Alert>

              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" fontWeight="medium" color="gray.700">
                  Choose Export Format:
                </Text>
                
                <RadioGroup value={exportFormat} onChange={(value) => setExportFormat(value as any)}>
                  <Stack spacing={3}>
                    {supportedFormats.map((format) => (
                      <Card key={format} variant="outline" cursor="pointer" _hover={{ bg: 'gray.50' }}>
                        <CardBody>
                          <HStack>
                            <Radio value={format} />
                            <VStack align="start" spacing={1} flex={1}>
                              <HStack>
                                <Text fontSize="lg">{getFormatIcon(format)}</Text>
                                <Text fontSize="md" fontWeight="medium" textTransform="uppercase">
                                  {format}
                                </Text>
                                <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                                  Recommended
                                </Badge>
                              </HStack>
                              <Text fontSize="sm" color="gray.600">
                                {getFormatDescription(format)}
                              </Text>
                            </VStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                  </Stack>
                </RadioGroup>
              </VStack>
            </Box>

            <Divider />

            {/* Import Section */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                Import Favorites
              </Text>
              
              <Alert status="warning" mb={4}>
                <WarningIcon />
                <AlertDescription>
                  Importing will add new favorites to your existing collection. Duplicates will be skipped.
                </AlertDescription>
              </Alert>

              <VStack spacing={4} align="stretch">
                <Box>
                  <input
                    type="file"
                    accept=".json,.csv"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="import-file-input"
                  />
                  <Button
                    leftIcon={<UploadIcon />}
                    onClick={() => document.getElementById('import-file-input')?.click()}
                    variant="outline"
                    width="100%"
                    isDisabled={isImporting}
                  >
                    {importFile ? `Selected: ${importFile.name}` : 'Select File to Import'}
                  </Button>
                </Box>

                {importFile && (
                  <Card variant="outline">
                    <CardBody>
                      <HStack>
                        <FileIcon color="green.500" />
                        <VStack align="start" spacing={1} flex={1}>
                          <Text fontSize="sm" fontWeight="medium">
                            {importFile.name}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            {(importFile.size / 1024).toFixed(1)} KB
                          </Text>
                        </VStack>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={handleImport}
                          isLoading={isImporting}
                          loadingText="Importing..."
                        >
                          Import
                        </Button>
                      </HStack>
                      
                      {isImporting && (
                        <Box mt={3}>
                          <Progress value={importProgress} colorScheme="green" size="sm" />
                          <Text fontSize="xs" color="gray.600" mt={1}>
                            Importing... {importProgress}%
                          </Text>
                        </Box>
                      )}
                    </CardBody>
                  </Card>
                )}

                <SimpleGrid columns={2} spacing={4}>
                  <Card variant="outline">
                    <CardHeader pb={2}>
                      <HStack>
                        <Text fontSize="sm">📄</Text>
                        <Text fontSize="sm" fontWeight="medium">JSON Format</Text>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Text fontSize="xs" color="gray.600">
                        Structured data with all property details, notes, and tags
                      </Text>
                    </CardBody>
                  </Card>

                  <Card variant="outline">
                    <CardHeader pb={2}>
                      <HStack>
                        <Text fontSize="sm">📊</Text>
                        <Text fontSize="sm" fontWeight="medium">CSV Format</Text>
                      </HStack>
                    </CardHeader>
                    <CardBody pt={0}>
                      <Text fontSize="xs" color="gray.600">
                        Spreadsheet format with basic property information
                      </Text>
                    </CardBody>
                  </Card>
                </SimpleGrid>
              </VStack>
            </Box>

            {/* Supported Formats Info */}
            <Box bg="gray.50" p={4} borderRadius="md">
              <HStack mb={2}>
                <InfoIcon color="blue.500" />
                <Text fontSize="sm" fontWeight="medium">
                  Supported Formats
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.600">
                We support JSON and CSV formats for import. PDF export is available for printing and sharing.
                Make sure your import file contains valid property data.
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleExport}
              isLoading={isExporting}
              loadingText="Exporting..."
              leftIcon={<DownloadIcon />}
            >
              Export Favorites
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
