'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { pushNotificationService } from '@/lib/pushNotificationService';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAInstallPromptProps {
  className?: string;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ className = '' }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      const standalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInStandaloneMode = ('standalone' in window.navigator) && (window.navigator as any).standalone;
      
      setIsStandalone(standalone || isInStandaloneMode);
      setIsInstalled(standalone || isInStandaloneMode);
    };

    // Check if device is iOS
    const checkIOS = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isIOSDevice);
    };

    checkInstallation();
    checkIOS();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not dismissed before
      const dismissed = localStorage.getItem('pwa-install-dismissed');
      if (!dismissed) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('pwa-install-dismissed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  const handleIOSInstall = () => {
    // For iOS, we show instructions
    setShowPrompt(false);
    // Could open a modal with iOS-specific instructions
  };

  // Don't show if already installed or not supported
  if (isInstalled || (!deferredPrompt && !isIOS)) {
    return null;
  }

  return (
    <>
      {showPrompt && (
        <div className={`fixed bottom-20 left-4 right-4 z-50 ${className}`}>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  {isIOS ? (
                    <Smartphone size={20} className="text-blue-600" />
                  ) : (
                    <Download size={20} className="text-blue-600" />
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {isIOS ? 'Install FlowGrow' : 'Install App'}
                </h3>
                <p className="text-xs text-gray-600 mb-3">
                  {isIOS 
                    ? 'Add FlowGrow to your home screen for quick access'
                    : 'Install FlowGrow for a better experience with offline access'
                  }
                </p>
                
                <div className="flex gap-2">
                  <button
                    onClick={isIOS ? handleIOSInstall : handleInstall}
                    className="flex-1 bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {isIOS ? 'Show Instructions' : 'Install'}
                  </button>
                  <button
                    onClick={handleDismiss}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* iOS Installation Instructions Modal */}
      {isIOS && showPrompt && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Install FlowGrow
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  1
                </div>
                <p className="text-sm text-gray-700">
                  Tap the <strong>Share</strong> button in Safari
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  2
                </div>
                <p className="text-sm text-gray-700">
                  Scroll down and tap <strong>"Add to Home Screen"</strong>
                </p>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  3
                </div>
                <p className="text-sm text-gray-700">
                  Tap <strong>"Add"</strong> to confirm
                </p>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleDismiss}
                className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PWAInstallPrompt;
