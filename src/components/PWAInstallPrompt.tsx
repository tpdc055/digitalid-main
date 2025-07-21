"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Shield,
  Download,
  X,
  Smartphone,
  Wifi,
  Bell,
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { usePWA, getPWAInstructions } from '@/hooks/usePWA';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const {
    isInstallable,
    isInstalled,
    isOnline,
    isUpdateAvailable,
    installApp,
    updateApp,
    dismissInstall
  } = usePWA();

  const { t } = useLanguage();

  // Don't show if already installed or not installable
  if (isInstalled || (!isInstallable && !isUpdateAvailable) || !showPrompt) {
    return null;
  }

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await installApp();

    if (success) {
      setShowPrompt(false);
    } else {
      setShowInstructions(true);
    }
    setIsInstalling(false);
  };

  const handleUpdate = async () => {
    setIsInstalling(true);
    await updateApp();
    setIsInstalling(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    dismissInstall();
  };

  // Update available prompt
  if (isUpdateAvailable) {
    return (
      <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-lg">
              <RefreshCw className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                Update Available
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                A new version of PNG Government Portal is ready to install.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleUpdate}
                  disabled={isInstalling}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isInstalling ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-2" />
                      Update Now
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDismiss}
                  className="border-blue-200"
                >
                  Later
                </Button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-blue-400 hover:text-blue-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Install prompt
  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-l-4 border-l-green-500 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-800 rounded-lg">
            <Shield className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-green-900 dark:text-green-100">
                Install PNG Gov Portal
              </h3>
              <Badge variant="outline" className="text-xs bg-green-100 text-green-700">
                PWA
              </Badge>
            </div>
            <p className="text-sm text-green-700 dark:text-green-200 mb-3">
              Get the full app experience with offline access and notifications.
            </p>

            {/* Features list */}
            <div className="space-y-1 mb-3">
              {[
                { icon: Smartphone, text: 'Works like a native app' },
                { icon: Wifi, text: 'Offline functionality' },
                { icon: Bell, text: 'Push notifications' },
                { icon: CheckCircle, text: 'Secure & encrypted' }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-green-600 dark:text-green-300">
                  <feature.icon className="h-3 w-3" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Connection status */}
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                disabled={isInstalling}
                className="bg-green-600 hover:bg-green-700"
              >
                {isInstalling ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                    Installing...
                  </>
                ) : (
                  <>
                    <Download className="h-3 w-3 mr-2" />
                    Install
                  </>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowInstructions(!showInstructions)}
                className="border-green-200"
              >
                Help
              </Button>
            </div>

            {/* Manual installation instructions */}
            {showInstructions && (
              <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-lg border">
                <p className="text-xs font-medium mb-2">Manual Installation:</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {getPWAInstructions()}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={handleDismiss}
            className="text-green-400 hover:text-green-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
