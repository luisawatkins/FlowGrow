import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  SimpleGrid,
  Badge,
  Icon,
  Tooltip,
  useDisclosure,
  Collapse,
  Divider,
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  StarIcon,
  InfoIcon,
} from '@chakra-ui/icons';
import { SearchFilterPreset } from '@/types/search';

interface FilterPresetsProps {
  presets: SearchFilterPreset[];
  onApplyPreset: (preset: SearchFilterPreset) => void;
  currentPreset?: string;
  className?: string;
}

export const FilterPresets: React.FC<FilterPresetsProps> = ({
  presets,
  onApplyPreset,
  currentPreset,
  className = '',
}) => {
  const { isOpen, onToggle } = useDisclosure();

  if (presets.length === 0) {
    return null;
  }

  return (
    <Box className={className} bg="white" borderRadius="md" border="1px" borderColor="gray.200">
      <HStack justify="space-between" align="center" p={4}>
        <HStack>
          <StarIcon color="blue.500" />
          <Text fontSize="md" fontWeight="semibold">
            Quick Filters
          </Text>
          <Badge colorScheme="blue" variant="subtle" fontSize="xs">
            {presets.length}
          </Badge>
        </HStack>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggle}
          rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        >
          {isOpen ? 'Hide' : 'Show'} Presets
        </Button>
      </HStack>

      <Collapse in={isOpen}>
        <Box px={4} pb={4}>
          <VStack spacing={3} align="stretch">
            <Text fontSize="sm" color="gray.600">
              Apply pre-configured filter combinations for common searches
            </Text>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3}>
              {presets.map((preset) => (
                <Tooltip
                  key={preset.id}
                  label={preset.description}
                  placement="top"
                  hasArrow
                >
                  <Button
                    size="sm"
                    variant={currentPreset === preset.id ? 'solid' : 'outline'}
                    colorScheme={currentPreset === preset.id ? 'blue' : 'gray'}
                    justifyContent="flex-start"
                    onClick={() => onApplyPreset(preset)}
                    _hover={{
                      transform: 'translateY(-1px)',
                      shadow: 'md',
                    }}
                    transition="all 0.2s"
                  >
                    <HStack spacing={3} align="center">
                      <Text fontSize="lg">{preset.icon}</Text>
                      <VStack align="start" spacing={0} flex={1}>
                        <Text fontSize="sm" fontWeight="medium" textAlign="left">
                          {preset.name}
                        </Text>
                        <Text fontSize="xs" color="gray.600" textAlign="left" noOfLines={1}>
                          {preset.description}
                        </Text>
                      </VStack>
                      {currentPreset === preset.id && (
                        <Icon as={StarIcon} color="blue.500" boxSize={3} />
                      )}
                    </HStack>
                  </Button>
                </Tooltip>
              ))}
            </SimpleGrid>

            <Divider />

            <HStack justify="space-between" align="center">
              <HStack>
                <InfoIcon color="gray.400" boxSize={3} />
                <Text fontSize="xs" color="gray.500">
                  Presets help you quickly find properties matching common criteria
                </Text>
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};
