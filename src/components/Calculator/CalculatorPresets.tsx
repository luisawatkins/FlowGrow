import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Badge,
  IconButton,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon, StarIcon, StarOutlineIcon } from '@chakra-ui/icons';
import { CalculatorPreset } from '@/types/calculator';
import { useEnhancedCalculator } from '@/hooks/useEnhancedCalculator';

interface CalculatorPresetsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (preset: CalculatorPreset) => void;
  presets: CalculatorPreset[];
}

export const CalculatorPresets: React.FC<CalculatorPresetsProps> = ({
  isOpen,
  onClose,
  onSelect,
  presets,
}) => {
  const { createPreset, updatePreset, deletePreset, isLoading } = useEnhancedCalculator();
  const toast = useToast();
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  
  const [selectedPreset, setSelectedPreset] = useState<CalculatorPreset | null>(null);
  const [presetForm, setPresetForm] = useState({
    name: '',
    description: '',
    isDefault: false,
  });

  const handleCreatePreset = async () => {
    if (!presetForm.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a preset name.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await createPreset({
        name: presetForm.name,
        description: presetForm.description,
        inputs: {}, // Empty inputs for now
        isDefault: presetForm.isDefault,
      });

      toast({
        title: 'Preset created',
        description: 'Calculator preset has been created successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setPresetForm({ name: '', description: '', isDefault: false });
      onCreateClose();
    } catch (error) {
      toast({
        title: 'Error creating preset',
        description: 'Failed to create calculator preset.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditPreset = async () => {
    if (!selectedPreset || !presetForm.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a preset name.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await updatePreset(selectedPreset.id, {
        name: presetForm.name,
        description: presetForm.description,
        isDefault: presetForm.isDefault,
      });

      toast({
        title: 'Preset updated',
        description: 'Calculator preset has been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setPresetForm({ name: '', description: '', isDefault: false });
      setSelectedPreset(null);
      onEditClose();
    } catch (error) {
      toast({
        title: 'Error updating preset',
        description: 'Failed to update calculator preset.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeletePreset = async (preset: CalculatorPreset) => {
    try {
      await deletePreset(preset.id);
      toast({
        title: 'Preset deleted',
        description: 'Calculator preset has been deleted successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting preset',
        description: 'Failed to delete calculator preset.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = (preset: CalculatorPreset) => {
    setSelectedPreset(preset);
    setPresetForm({
      name: preset.name,
      description: preset.description || '',
      isDefault: preset.isDefault,
    });
    onEditOpen();
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Calculator Presets</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="semibold">
                  Saved Presets
                </Text>
                <Button
                  leftIcon={<AddIcon />}
                  colorScheme="blue"
                  size="sm"
                  onClick={onCreateOpen}
                >
                  Create Preset
                </Button>
              </HStack>

              {presets.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  <AlertDescription>
                    No presets available. Create your first preset to get started.
                  </AlertDescription>
                </Alert>
              ) : (
                <VStack spacing={3} align="stretch">
                  {presets.map((preset) => (
                    <Card key={preset.id}>
                      <CardBody>
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={2} flex={1}>
                            <HStack>
                              <Text fontWeight="medium">{preset.name}</Text>
                              {preset.isDefault && (
                                <Badge colorScheme="yellow" size="sm">
                                  <StarIcon boxSize={2} mr={1} />
                                  Default
                                </Badge>
                              )}
                            </HStack>
                            {preset.description && (
                              <Text fontSize="sm" color="gray.600">
                                {preset.description}
                              </Text>
                            )}
                            <Text fontSize="xs" color="gray.500">
                              Created: {preset.createdAt.toLocaleDateString()}
                            </Text>
                          </VStack>
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              onClick={() => onSelect(preset)}
                            >
                              Use
                            </Button>
                            <IconButton
                              aria-label="Edit preset"
                              icon={<EditIcon />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditClick(preset)}
                            />
                            <IconButton
                              aria-label="Delete preset"
                              icon={<DeleteIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeletePreset(preset)}
                            />
                          </HStack>
                        </HStack>
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Create Preset Modal */}
      <Modal isOpen={isCreateOpen} onClose={onCreateClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Calculator Preset</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Preset Name</FormLabel>
                <Input
                  value={presetForm.name}
                  onChange={(e) => setPresetForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter preset name..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description (Optional)</FormLabel>
                <Textarea
                  value={presetForm.description}
                  onChange={(e) => setPresetForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter preset description..."
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <HStack>
                  <input
                    type="checkbox"
                    checked={presetForm.isDefault}
                    onChange={(e) => setPresetForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  />
                  <Text>Set as default preset</Text>
                </HStack>
              </FormControl>

              <HStack spacing={4} justify="flex-end">
                <Button variant="outline" onClick={onCreateClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleCreatePreset}
                  isLoading={isLoading}
                  loadingText="Creating..."
                >
                  Create Preset
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Edit Preset Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Calculator Preset</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl>
                <FormLabel>Preset Name</FormLabel>
                <Input
                  value={presetForm.name}
                  onChange={(e) => setPresetForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter preset name..."
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description (Optional)</FormLabel>
                <Textarea
                  value={presetForm.description}
                  onChange={(e) => setPresetForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter preset description..."
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <HStack>
                  <input
                    type="checkbox"
                    checked={presetForm.isDefault}
                    onChange={(e) => setPresetForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                  />
                  <Text>Set as default preset</Text>
                </HStack>
              </FormControl>

              <HStack spacing={4} justify="flex-end">
                <Button variant="outline" onClick={onEditClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleEditPreset}
                  isLoading={isLoading}
                  loadingText="Updating..."
                >
                  Update Preset
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
