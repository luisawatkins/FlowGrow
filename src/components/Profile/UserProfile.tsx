import React from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  HStack,
  useToast,
  Divider,
  Switch,
} from '@chakra-ui/react';
import { useProfile } from '@/hooks/useProfile';

export const UserProfile: React.FC = () => {
  const {
    profile,
    isLoading,
    updateProfile,
    updateNotificationSettings,
  } = useProfile();

  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profile);
      toast({
        title: 'Profile updated',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: 'Failed to update profile',
        status: 'error',
        duration: 3000,
      });
    }
  };

  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box maxW="container.md" mx="auto" py={8}>
      <VStack spacing={8} align="stretch">
        <HStack spacing={4}>
          <Avatar
            size="2xl"
            name={profile?.name}
            src={profile?.avatarUrl}
          />
          <VStack align="start" flex={1}>
            <Heading size="lg">{profile?.name}</Heading>
            <Button size="sm" colorScheme="blue">
              Change Photo
            </Button>
          </VStack>
        </HStack>

        <form onSubmit={handleSubmit}>
          <VStack spacing={6} align="stretch">
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                value={profile?.name || ''}
                onChange={(e) => updateProfile({ ...profile, name: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={profile?.email || ''}
                onChange={(e) => updateProfile({ ...profile, email: e.target.value })}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone</FormLabel>
              <Input
                type="tel"
                value={profile?.phone || ''}
                onChange={(e) => updateProfile({ ...profile, phone: e.target.value })}
              />
            </FormControl>

            <Divider />

            <Heading size="md">Notification Settings</Heading>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Email Notifications
              </FormLabel>
              <Switch
                isChecked={profile?.notifications?.email}
                onChange={(e) => updateNotificationSettings({ email: e.target.checked })}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Push Notifications
              </FormLabel>
              <Switch
                isChecked={profile?.notifications?.push}
                onChange={(e) => updateNotificationSettings({ push: e.target.checked })}
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                SMS Notifications
              </FormLabel>
              <Switch
                isChecked={profile?.notifications?.sms}
                onChange={(e) => updateNotificationSettings({ sms: e.target.checked })}
              />
            </FormControl>

            <Button type="submit" colorScheme="blue" size="lg">
              Save Changes
            </Button>
          </VStack>
        </form>
      </VStack>
    </Box>
  );
};
