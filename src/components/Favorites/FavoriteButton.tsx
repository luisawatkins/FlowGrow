import React from 'react';
import {
  IconButton,
  Icon,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useFavorites } from '@/hooks/useFavorites';

interface FavoriteButtonProps {
  propertyId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'ghost' | 'outline';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  size = 'md',
  variant = 'ghost',
}) => {
  const { favorites, toggleFavorite, isLoading } = useFavorites();
  const toast = useToast();

  const isFavorite = favorites.includes(propertyId);

  const handleToggle = async () => {
    try {
      await toggleFavorite(propertyId);
      toast({
        title: isFavorite ? 'Removed from favorites' : 'Added to favorites',
        status: 'success',
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: 'Failed to update favorites',
        status: 'error',
        duration: 3000,
      });
    }
  };

  return (
    <Tooltip
      label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      placement="top"
    >
      <IconButton
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        icon={
          <Icon
            as={isFavorite ? FaHeart : FaRegHeart}
            color={isFavorite ? 'red.500' : 'gray.500'}
          />
        }
        onClick={handleToggle}
        isLoading={isLoading}
        size={size}
        variant={variant}
      />
    </Tooltip>
  );
};
