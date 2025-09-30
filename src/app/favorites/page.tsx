import { Container } from '@chakra-ui/react';
import { FavoritesList } from '@/components/Favorites/FavoritesList';

export default function FavoritesPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <FavoritesList />
    </Container>
  );
}
