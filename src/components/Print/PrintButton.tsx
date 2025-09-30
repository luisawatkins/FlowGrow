import React from 'react';
import {
  IconButton,
  Icon,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Button,
  VStack,
  Text,
} from '@chakra-ui/react';
import { FaPrint } from 'react-icons/fa';
import { PrintablePropertyView } from './PrintablePropertyView';

interface PrintButtonProps {
  property: any;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'ghost' | 'outline';
}

export const PrintButton: React.FC<PrintButtonProps> = ({
  property,
  size = 'md',
  variant = 'ghost',
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Tooltip label="Print property details" placement="top">
        <IconButton
          aria-label="Print property details"
          icon={<Icon as={FaPrint} />}
          onClick={onOpen}
          size={size}
          variant={variant}
        />
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="6xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          
          <VStack
            position="sticky"
            top={0}
            p={4}
            bg="white"
            borderBottom="1px"
            borderColor="gray.200"
            zIndex="sticky"
            className="no-print"
          >
            <Button
              leftIcon={<FaPrint />}
              colorScheme="blue"
              onClick={handlePrint}
            >
              Print
            </Button>
            <Text fontSize="sm" color="gray.600">
              Tip: Set margins to "None" in your browser's print settings for best results
            </Text>
          </VStack>

          <PrintablePropertyView property={property} />
        </ModalContent>
      </Modal>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          .printable-view {
            width: 100%;
            max-width: none !important;
            margin: 0 !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </>
  );
};
