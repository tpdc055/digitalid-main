"use client";

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isUpdateAvailable: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

interface PWAActions {
  installApp: () => Promise<boolean>;
  updateApp: () => Promise<void>;
  dismissInstall: () => void;
}

export function usePWA(): PWAState & PWAActions {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isIOSStandalone = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isIOSStandalone);
    };

    // Register service worker
    const registerServiceWorker = async () => {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('[PWA] Service Worker registered successfully:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setIsUpdateAvailable(true);
                  console.log('[PWA] New version available');
                }
              });
            }
          });

          // Handle messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
              setIsUpdateAvailable(true);
            }
          });

        } catch (error) {
          console.error('[PWA] Service Worker registration failed:', error);
        }
      }
    };

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setInstallPrompt(promptEvent);
      setIsInstallable(true);
      console.log('[PWA] Install prompt available');
    };

    // Handle app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
      console.log('[PWA] App installed successfully');

      // Track installation
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'pwa_install', {
          event_category: 'PWA',
          event_label: 'PNG Government Portal'
        });
      }
    };

    // Handle online/offline status
    const handleOnlineStatus = () => setIsOnline(navigator.onLine);

    // Initialize
    checkInstallation();
    registerServiceWorker();
    handleOnlineStatus();

    // Event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  const installApp = async (): Promise<boolean> => {
    if (!installPrompt) {
      console.log('[PWA] No install prompt available');
      return false;
    }

    try {
      await installPrompt.prompt();
      const choiceResult = await installPrompt.userChoice;

      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] User accepted the install prompt');
        setInstallPrompt(null);
        setIsInstallable(false);
        return true;
      } else {
        console.log('[PWA] User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Error during installation:', error);
      return false;
    }
  };

  const updateApp = async (): Promise<void> => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration && registration.waiting) {
          // Tell waiting service worker to skip waiting and become active
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });

          // Refresh page after new service worker takes control
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.error('[PWA] Error updating app:', error);
      }
    }
  };

  const dismissInstall = (): void => {
    setInstallPrompt(null);
    setIsInstallable(false);
    console.log('[PWA] Install prompt dismissed');
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    installPrompt,
    installApp,
    updateApp,
    dismissInstall
  };
}

// Utility function to check PWA installation status
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;

  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;

  return isStandalone || isIOSStandalone;
}

// Utility function to get PWA installation instructions based on browser
export function getPWAInstructions(): string {
  if (typeof window === 'undefined') return '';

  const userAgent = window.navigator.userAgent.toLowerCase();

  if (userAgent.includes('chrome') && !userAgent.includes('edg')) {
    return 'Tap the menu (⋮) and select "Add to Home screen" or "Install app"';
  } else if (userAgent.includes('firefox')) {
    return 'Tap the menu (⋮) and select "Add to Home screen"';
  } else if (userAgent.includes('safari') && userAgent.includes('iphone')) {
    return 'Tap the Share button (□↗) and select "Add to Home Screen"';
  } else if (userAgent.includes('safari') && userAgent.includes('ipad')) {
    return 'Tap the Share button (□↗) and select "Add to Home Screen"';
  } else if (userAgent.includes('edg')) {
    return 'Tap the menu (⋯) and select "Add to phone" or "Install app"';
  } else if (userAgent.includes('samsung')) {
    return 'Tap the menu (⋮) and select "Add page to" > "Home screen"';
  }

  return 'Look for "Add to Home Screen" or "Install" option in your browser menu';
}
