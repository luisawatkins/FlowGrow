import { Container } from '@chakra-ui/react';
import { RecentlyViewedProperties } from '@/components/RecentViews/RecentlyViewedProperties';

export default function RecentViewsPage() {
  return (
    <Container maxW="container.xl" py={8}>
      <RecentlyViewedProperties />
    </Container>
  );
}
