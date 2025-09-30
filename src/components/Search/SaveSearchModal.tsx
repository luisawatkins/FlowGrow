import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Checkbox,
  useToast,
  Text,
} from '@chakra-ui/react';
import { useSavedSearches } from '@/hooks/useSavedSearches';

interface SaveSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchCriteria: any;
}

export const SaveSearchModal: React.FC<SaveSearchModalProps> = ({
  isOpen,
  onClose,
  searchCriteria,
}) => {
  const [name, setName] = useState('');
  const [enableNotifications, setEnableNotifications] = useState(true);
  const { saveSearch, isLoading } = useSavedSearches();
  const toast = useToast();

  const handleSave = async () => {
    try {
      await saveSearch({
        name,
        criteria: searchCriteria,
        notifications: enableNotifications,
      });

      toast({
        title: 'Search saved successfully',
        status: 'success',
        duration: 3000,
      });

      onClose();
    } catch (error) {
      toast({
        title: 'Failed to save search',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Save Search</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Search Name</FormLabel>
              <Input
                placeholder="e.g., Downtown 2BR Apartments"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <Checkbox
                isChecked={enableNotifications}
                onChange={(e) => setEnableNotifications(e.target.checked)}
              >
                Notify me when new properties match this search
              </Checkbox>
            </FormControl>

            <Text fontSize="sm" color="gray.600">
              Current Search Criteria:
            </Text>
            <VStack align="start" spacing={1} fontSize="sm" color="gray.600">
              {Object.entries(searchCriteria).map(([key, value]) => (
                <Text key={key}>
                  {key}: {JSON.stringify(value)}
                </Text>
              ))}
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={isLoading}
            isDisabled={!name.trim()}
          >
            Save Search
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
