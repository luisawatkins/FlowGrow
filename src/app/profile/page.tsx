import { UserProfile } from '@/components/Profile/UserProfile';
import { Container } from '@chakra-ui/react';

export default function ProfilePage() {
  return (
    <Container maxW="container.lg" py={8}>
      <UserProfile />
    </Container>
  );
}
