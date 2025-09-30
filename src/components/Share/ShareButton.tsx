import React from 'react';
import {
  IconButton,
  Icon,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react';
import { FaShare } from 'react-icons/fa';
import { ShareModal } from './ShareModal';

interface ShareButtonProps {
  propertyId: string;
  propertyTitle: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'ghost' | 'outline';
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  propertyId,
  propertyTitle,
  size = 'md',
  variant = 'ghost',
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Tooltip label="Share property" placement="top">
        <IconButton
          aria-label="Share property"
          icon={<Icon as={FaShare} />}
          onClick={onOpen}
          size={size}
          variant={variant}
        />
      </Tooltip>

      <ShareModal
        isOpen={isOpen}
        onClose={onClose}
        propertyId={propertyId}
        propertyTitle={propertyTitle}
      />
    </>
  );
};
