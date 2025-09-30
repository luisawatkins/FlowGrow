import React from 'react';
import {
  Box,
  Button,
  Input,
  Select,
  Checkbox,
  Radio,
  Switch,
  Tooltip,
  useColorMode,
} from '@chakra-ui/react';
import { withAccessibility } from './withAccessibility';
import { useAccessibility } from './AccessibilityProvider';

// Accessible Button with enhanced keyboard navigation and ARIA support
export const AccessibleButton = withAccessibility(
  React.forwardRef<HTMLButtonElement, any>((props, ref) => {
    const { settings } = useAccessibility();
    const { colorMode } = useColorMode();

    return (
      <Button
        ref={ref}
        {...props}
        fontSize={`${settings.fontSize}px`}
        transition={settings.reducedMotion ? 'none' : undefined}
        _focus={{
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
          outline: 'none',
        }}
        _hover={
          settings.reducedMotion
            ? {}
            : {
                transform: 'translateY(-1px)',
              }
        }
        aria-label={props['aria-label'] || props.children}
      />
    );
  }),
  {
    keyboardNavigation: true,
    focusable: true,
    role: 'button',
  }
);

// Accessible Input with enhanced labeling and error handling
export const AccessibleInput = withAccessibility(
  React.forwardRef<HTMLInputElement, any>((props, ref) => {
    const { settings } = useAccessibility();

    return (
      <Input
        ref={ref}
        {...props}
        fontSize={`${settings.fontSize}px`}
        aria-invalid={props.isInvalid}
        aria-required={props.isRequired}
        aria-describedby={props.errorMessage ? `${props.id}-error` : undefined}
      />
    );
  }),
  {
    focusable: true,
  }
);

// Accessible Select with enhanced keyboard navigation
export const AccessibleSelect = withAccessibility(
  React.forwardRef<HTMLSelectElement, any>((props, ref) => {
    const { settings } = useAccessibility();

    return (
      <Select
        ref={ref}
        {...props}
        fontSize={`${settings.fontSize}px`}
        aria-label={props.placeholder}
      />
    );
  }),
  {
    keyboardNavigation: true,
    focusable: true,
  }
);

// Accessible Checkbox with enhanced keyboard interaction
export const AccessibleCheckbox = withAccessibility(
  React.forwardRef<HTMLInputElement, any>((props, ref) => {
    const { settings } = useAccessibility();

    return (
      <Checkbox
        ref={ref}
        {...props}
        fontSize={`${settings.fontSize}px`}
        spacing={settings.textSpacing + 2}
      />
    );
  }),
  {
    keyboardNavigation: true,
    focusable: true,
    role: 'checkbox',
  }
);

// Accessible Radio with enhanced keyboard interaction
export const AccessibleRadio = withAccessibility(
  React.forwardRef<HTMLInputElement, any>((props, ref) => {
    const { settings } = useAccessibility();

    return (
      <Radio
        ref={ref}
        {...props}
        fontSize={`${settings.fontSize}px`}
        spacing={settings.textSpacing + 2}
      />
    );
  }),
  {
    keyboardNavigation: true,
    focusable: true,
    role: 'radio',
  }
);

// Accessible Switch with enhanced keyboard interaction
export const AccessibleSwitch = withAccessibility(
  React.forwardRef<HTMLInputElement, any>((props, ref) => {
    const { settings } = useAccessibility();

    return (
      <Switch
        ref={ref}
        {...props}
        aria-checked={props.isChecked}
        role="switch"
      />
    );
  }),
  {
    keyboardNavigation: true,
    focusable: true,
  }
);

// Accessible Card with proper semantic structure
export const AccessibleCard = withAccessibility(
  React.forwardRef<HTMLDivElement, any>((props, ref) => {
    const { settings } = useAccessibility();
    const { colorMode } = useColorMode();

    return (
      <Box
        ref={ref}
        {...props}
        role="article"
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        bg={colorMode === 'light' ? 'white' : 'gray.800'}
        fontSize={`${settings.fontSize}px`}
        lineHeight={settings.lineHeight}
        transition={settings.reducedMotion ? 'none' : 'all 0.2s'}
        _hover={
          settings.reducedMotion
            ? {}
            : {
                transform: 'translateY(-2px)',
                boxShadow: 'lg',
              }
        }
      />
    );
  }),
  {
    focusable: true,
    role: 'article',
  }
);

// Accessible Tooltip with proper timing and positioning
export const AccessibleTooltip = withAccessibility(
  React.forwardRef<HTMLDivElement, any>((props, ref) => {
    const { settings } = useAccessibility();

    return (
      <Tooltip
        ref={ref}
        {...props}
        openDelay={settings.reducedMotion ? 0 : 200}
        closeDelay={settings.reducedMotion ? 0 : 100}
        hasArrow
        placement="top"
        aria-hidden="true" // Tooltip content should be available in the main content
      />
    );
  }),
  {
    announceChanges: true,
  }
);

// Accessible Link with proper navigation handling
export const AccessibleLink = withAccessibility(
  React.forwardRef<HTMLAnchorElement, any>((props, ref) => {
    const { settings } = useAccessibility();

    return (
      <Box
        ref={ref}
        {...props}
        as="a"
        fontSize={`${settings.fontSize}px`}
        textDecoration="underline"
        _hover={{
          textDecoration: 'none',
        }}
        _focus={{
          boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
          outline: 'none',
        }}
      />
    );
  }),
  {
    keyboardNavigation: true,
    focusable: true,
    role: 'link',
  }
);

// Accessible Image with proper alt text and loading states
export const AccessibleImage = withAccessibility(
  React.forwardRef<HTMLImageElement, any>((props, ref) => {
    return (
      <Box
        ref={ref}
        {...props}
        as="img"
        loading="lazy"
        onError={(e) => {
          e.currentTarget.alt = 'Image failed to load';
          e.currentTarget.style.display = 'none';
        }}
      />
    );
  }),
  {
    role: 'img',
  }
);
