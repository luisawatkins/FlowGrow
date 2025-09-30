import React, { useEffect, useRef } from 'react';
import { useColorMode } from '@chakra-ui/react';

interface AccessibilityOptions {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
  focusable?: boolean;
  keyboardNavigation?: boolean;
  announceChanges?: boolean;
}

export const withAccessibility = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: AccessibilityOptions = {}
) => {
  return function AccessibleComponent(props: P) {
    const componentRef = useRef<HTMLElement>(null);
    const { colorMode } = useColorMode();

    useEffect(() => {
      if (!componentRef.current) return;

      // Add ARIA attributes
      if (options.ariaLabel) {
        componentRef.current.setAttribute('aria-label', options.ariaLabel);
      }
      if (options.ariaDescribedBy) {
        componentRef.current.setAttribute(
          'aria-describedby',
          options.ariaDescribedBy
        );
      }
      if (options.role) {
        componentRef.current.setAttribute('role', options.role);
      }
      if (typeof options.tabIndex === 'number') {
        componentRef.current.setAttribute('tabindex', options.tabIndex.toString());
      }

      // Add keyboard navigation
      if (options.keyboardNavigation) {
        const handleKeyDown = (e: KeyboardEvent) => {
          switch (e.key) {
            case 'Enter':
            case ' ':
              e.preventDefault();
              (e.target as HTMLElement).click();
              break;
            case 'Escape':
              e.preventDefault();
              (e.target as HTMLElement).blur();
              break;
          }
        };

        componentRef.current.addEventListener('keydown', handleKeyDown);
        return () => {
          componentRef.current?.removeEventListener('keydown', handleKeyDown);
        };
      }
    }, []);

    // Add high contrast styles for better visibility
    const highContrastStyles = {
      ...(colorMode === 'dark' && {
        backgroundColor: '#000',
        color: '#fff',
        border: '2px solid #fff',
      }),
      ...(colorMode === 'light' && {
        backgroundColor: '#fff',
        color: '#000',
        border: '2px solid #000',
      }),
    };

    return (
      <WrappedComponent
        {...props}
        ref={componentRef}
        style={{
          ...props.style,
          ...(options.focusable && {
            outline: 'none',
            ':focus': {
              boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
            },
            ':focus-visible': {
              boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.6)',
            },
          }),
        }}
      />
    );
  };
};
