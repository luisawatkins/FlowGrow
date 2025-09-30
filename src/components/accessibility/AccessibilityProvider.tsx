import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  useColorMode,
  useToast,
} from '@chakra-ui/react';

interface AccessibilitySettings {
  fontSize: number;
  lineHeight: number;
  contrast: 'normal' | 'high';
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  textSpacing: number;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (settings: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 16,
  lineHeight: 1.5,
  contrast: 'normal',
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
  textSpacing: 0,
};

const AccessibilityContext = createContext<AccessibilityContextType>({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
});

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      'useAccessibility must be used within an AccessibilityProvider'
    );
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load settings from localStorage if available
    const savedSettings = localStorage.getItem('accessibility-settings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const { setColorMode } = useColorMode();
  const toast = useToast();

  useEffect(() => {
    // Save settings to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));

    // Apply settings to document
    document.documentElement.style.setProperty(
      '--base-font-size',
      `${settings.fontSize}px`
    );
    document.documentElement.style.setProperty(
      '--base-line-height',
      settings.lineHeight.toString()
    );
    document.documentElement.style.setProperty(
      '--text-spacing',
      `${settings.textSpacing}px`
    );

    // Apply reduced motion
    if (settings.reducedMotion) {
      document.documentElement.style.setProperty(
        '--transition-duration',
        '0s'
      );
    } else {
      document.documentElement.style.removeProperty('--transition-duration');
    }

    // Apply high contrast
    if (settings.contrast === 'high') {
      setColorMode('dark');
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply keyboard navigation
    if (settings.keyboardNavigation) {
      document.documentElement.classList.add('keyboard-navigation');
    } else {
      document.documentElement.classList.remove('keyboard-navigation');
    }

    // Announce changes to screen readers
    if (settings.screenReader) {
      const announcement = document.createElement('div');
      announcement.setAttribute('role', 'status');
      announcement.setAttribute('aria-live', 'polite');
      announcement.textContent = 'Accessibility settings updated';
      document.body.appendChild(announcement);
      setTimeout(() => document.body.removeChild(announcement), 1000);
    }
  }, [settings, setColorMode]);

  const updateSettings = (newSettings: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    toast({
      title: 'Settings Updated',
      description: 'Your accessibility preferences have been saved.',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    toast({
      title: 'Settings Reset',
      description: 'Accessibility settings have been reset to defaults.',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <AccessibilityContext.Provider
      value={{ settings, updateSettings, resetSettings }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const AccessibilityPanel: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useAccessibility();

  return (
    <Box p={6} bg="white" borderRadius="lg" shadow="md">
      <VStack spacing={6} align="stretch">
        <Text fontSize="2xl" fontWeight="bold">
          Accessibility Settings
        </Text>

        <VStack spacing={4} align="stretch">
          <Box>
            <Text mb={2}>Font Size</Text>
            <Slider
              value={settings.fontSize}
              min={12}
              max={24}
              step={1}
              onChange={(value) => updateSettings({ fontSize: value })}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <Box>
            <Text mb={2}>Line Height</Text>
            <Slider
              value={settings.lineHeight}
              min={1}
              max={2}
              step={0.1}
              onChange={(value) => updateSettings({ lineHeight: value })}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <Box>
            <Text mb={2}>Text Spacing</Text>
            <Slider
              value={settings.textSpacing}
              min={0}
              max={10}
              step={1}
              onChange={(value) => updateSettings({ textSpacing: value })}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
          </Box>

          <HStack justify="space-between">
            <Text>High Contrast</Text>
            <Switch
              isChecked={settings.contrast === 'high'}
              onChange={(e) =>
                updateSettings({
                  contrast: e.target.checked ? 'high' : 'normal',
                })
              }
            />
          </HStack>

          <HStack justify="space-between">
            <Text>Reduced Motion</Text>
            <Switch
              isChecked={settings.reducedMotion}
              onChange={(e) =>
                updateSettings({ reducedMotion: e.target.checked })
              }
            />
          </HStack>

          <HStack justify="space-between">
            <Text>Screen Reader Announcements</Text>
            <Switch
              isChecked={settings.screenReader}
              onChange={(e) =>
                updateSettings({ screenReader: e.target.checked })
              }
            />
          </HStack>

          <HStack justify="space-between">
            <Text>Keyboard Navigation</Text>
            <Switch
              isChecked={settings.keyboardNavigation}
              onChange={(e) =>
                updateSettings({ keyboardNavigation: e.target.checked })
              }
            />
          </HStack>
        </VStack>

        <Button onClick={resetSettings} variant="outline">
          Reset to Defaults
        </Button>
      </VStack>
    </Box>
  );
};
