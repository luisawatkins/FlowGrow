import React from 'react';
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Badge,
  IconButton,
  Tooltip,
  Wrap,
  WrapItem,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react';
import {
  CloseIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FilterIcon,
} from '@chakra-ui/icons';
import { SearchFilterChip } from '@/types/search';

interface FilterChipsProps {
  chips: SearchFilterChip[];
  onRemoveChip: (chipId: string) => void;
  onClearAll: () => void;
  maxVisible?: number;
  showClearAll?: boolean;
  className?: string;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  chips,
  onRemoveChip,
  onClearAll,
  maxVisible = 5,
  showClearAll = true,
  className = '',
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const visibleChips = isOpen ? chips : chips.slice(0, maxVisible);
  const hiddenCount = chips.length - maxVisible;

  if (chips.length === 0) {
    return null;
  }

  return (
    <Box className={className}>
      <HStack justify="space-between" align="center" mb={3}>
        <HStack>
          <FilterIcon color="gray.500" />
          <Text fontSize="sm" fontWeight="medium" color="gray.700">
            Active Filters
          </Text>
          <Badge colorScheme="blue" variant="subtle" fontSize="xs">
            {chips.length}
          </Badge>
        </HStack>
        
        {showClearAll && (
          <Button
            size="xs"
            variant="ghost"
            colorScheme="red"
            onClick={onClearAll}
          >
            Clear All
          </Button>
        )}
      </HStack>

      <Wrap spacing={2}>
        {visibleChips.map((chip) => (
          <WrapItem key={chip.id}>
            <Tooltip
              label={`${chip.category}: ${chip.label}`}
              placement="top"
              hasArrow
            >
              <Badge
                colorScheme="blue"
                variant="subtle"
                px={3}
                py={1}
                borderRadius="full"
                cursor="pointer"
                _hover={{ bg: 'blue.100' }}
                transition="all 0.2s"
              >
                <HStack spacing={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    {chip.label}
                  </Text>
                  <IconButton
                    aria-label={`Remove ${chip.label} filter`}
                    icon={<CloseIcon />}
                    size="xs"
                    variant="ghost"
                    colorScheme="blue"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveChip(chip.id);
                    }}
                    _hover={{ bg: 'blue.200' }}
                  />
                </HStack>
              </Badge>
            </Tooltip>
          </WrapItem>
        ))}
        
        {hiddenCount > 0 && (
          <WrapItem>
            <Button
              size="sm"
              variant="ghost"
              colorScheme="blue"
              onClick={onToggle}
              rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              {isOpen ? 'Show Less' : `+${hiddenCount} More`}
            </Button>
          </WrapItem>
        )}
      </Wrap>

      {/* Grouped chips by category */}
      {isOpen && chips.length > 0 && (
        <Collapse in={isOpen}>
          <Box mt={4}>
            <VStack align="stretch" spacing={3}>
              {Object.entries(
                chips.reduce((groups, chip) => {
                  const category = chip.category;
                  if (!groups[category]) {
                    groups[category] = [];
                  }
                  groups[category].push(chip);
                  return groups;
                }, {} as Record<string, SearchFilterChip[]>)
              ).map(([category, categoryChips]) => (
                <Box key={category}>
                  <Text fontSize="xs" fontWeight="semibold" color="gray.500" mb={2}>
                    {category}
                  </Text>
                  <Wrap spacing={1}>
                    {categoryChips.map((chip) => (
                      <WrapItem key={chip.id}>
                        <Badge
                          colorScheme="gray"
                          variant="outline"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontSize="xs"
                          cursor="pointer"
                          _hover={{ bg: 'gray.100' }}
                          onClick={() => onRemoveChip(chip.id)}
                        >
                          <HStack spacing={1}>
                            <Text>{chip.label}</Text>
                            <CloseIcon boxSize={2} />
                          </HStack>
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              ))}
            </VStack>
          </Box>
        </Collapse>
      )}
    </Box>
  );
};
