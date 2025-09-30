import React, { useState, useEffect } from 'react';
import { IconButton, useToast } from '@chakra-ui/react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

interface FavoriteButtonProps {
  propertyId: string;
  initialIsFavorite?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  propertyId,
  initialIsFavorite = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const toast = useToast();

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!session?.user) return;

      try {
        const response = await fetch(`/api/favorites/${propertyId}`);
        if (response.ok) {
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [propertyId, session]);

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to save favorites',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const method = isFavorite ? 'DELETE' : 'POST';
      const response = await fetch(`/api/favorites/${propertyId}`, {
        method,
      });

      if (!response.ok) {
        throw new Error('Failed to update favorite status');
      }

      setIsFavorite(!isFavorite);
      toast({
        title: isFavorite ? 'Removed from Favorites' : 'Added to Favorites',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorite status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <IconButton
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      icon={isFavorite ? <FaHeart /> : <FaRegHeart />}
      colorScheme={isFavorite ? 'red' : 'gray'}
      variant="ghost"
      isLoading={isLoading}
      onClick={handleToggleFavorite}
      _hover={{
        transform: 'scale(1.1)',
      }}
      transition="all 0.2s"
    />
  );
};