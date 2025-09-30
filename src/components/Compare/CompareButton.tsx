import React from 'react';
import {
  IconButton,
  Icon,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { FaBalanceScale } from 'react-icons/fa';
import { useComparison } from '@/hooks/useComparison';

interface CompareButtonProps {
  propertyId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'ghost' | 'outline';
}

export const CompareButton: React.FC<CompareButtonProps> = ({
  propertyId,
  size = 'md',
  variant = 'ghost',
}) => {
  const { addToComparison, removeFromComparison, isInComparison, isLoading } = useComparison();
  const toast = useToast();

  const handleToggle = async () => {
    try {
      if (isInComparison(propertyId)) {
        await removeFromComparison(propertyId);
        toast({
          title: 'Removed from comparison',
          status: 'success',
          duration: 2000,
        });
      } else {
        await addToComparison(propertyId);
        toast({
          title: 'Added to comparison',
          status: 'success',
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to update comparison',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Tooltip
      label={isInComparison(propertyId) ? 'Remove from comparison' : 'Add to comparison'}
      placement="top"
    >
      <IconButton
        aria-label={isInComparison(propertyId) ? 'Remove from comparison' : 'Add to comparison'}
        icon={<Icon as={FaBalanceScale} />}
        onClick={handleToggle}
        isLoading={isLoading}
        size={size}
        variant={variant}
        colorScheme={isInComparison(propertyId) ? 'blue' : 'gray'}
      />
    </Tooltip>
  );
};
