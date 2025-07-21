"use client";
import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'tpi' | 'ho';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    'nav.citizen_portal': 'Access Portal',
    'nav.admin_portal': 'Admin Portal',
    'nav.service_provider_portal': 'Service Provider Portal',
    'nav.security_dashboard': 'Security Dashboard',
    'nav.notifications': 'Notifications',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.sign_out': 'Sign Out',
    // Portal
    'portal.title': 'PNG Digital Government Portal',
    'portal.subtitle': 'Secure Digital Identity & Government Services Platform',

    // Common Actions
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.close': 'Close',
    'common.next': 'Next',
    'common.back': 'Back',
    'common.continue': 'Continue',
    'common.finish': 'Finish',
    'common.retry': 'Retry',
    'common.skip': 'Skip',

    // Application Modal
    'app.modal.title': 'New Application',
    'app.service_type': 'Service Type',
    'app.service_type.placeholder': 'Select a service',
    'app.urgency': 'Processing Urgency',
    'app.urgency.standard': 'Standard (Regular Processing)',
    'app.urgency.express': 'Express (+50% fee)',
    'app.urgency.urgent': 'Urgent (+100% fee)',
    'app.documents': 'Supporting Documents',
    'app.documents.upload': 'Click to upload or drag and drop',
    'app.documents.types': 'PDF, JPG, PNG (max 10MB each)',
    'app.notes': 'Additional Notes',
    'app.notes.placeholder': 'Any additional information or special requests...',
    'app.submit': 'Submit Application',

    // Payment Modal
    'payment.modal.title': 'Make Payment',
    'payment.summary': 'Payment Summary',
    'payment.service_fee': 'Service Fee',
    'payment.processing_fee': 'Processing Fee',
    'payment.total': 'Total',
    'payment.method': 'Payment Method',
    'payment.credit_card': 'Credit Card',
    'payment.mobile_money': 'Mobile Money',
    'payment.bank_transfer': 'Bank Transfer',
    'payment.proceed': 'Proceed to Payment',

    // Document Modal
    'docs.modal.title': 'Download Documents',
    'docs.ready': 'Ready',
    'docs.processing': 'Processing',

    // Profile Modal
    'profile.modal.title': 'Edit Profile Information',
    'profile.full_name': 'Full Name',
    'profile.email': 'Email Address',
    'profile.phone': 'Phone Number',
    'profile.save': 'Save Changes',

    // Contact Modal
    'contact.modal.title': 'Update Contact Information',
    'contact.address': 'Address',
    'contact.emergency': 'Emergency Contact',
    'contact.update': 'Update Information',

    // Biometric Modal
    'biometric.modal.title': 'Biometric Authentication Setup',
    'biometric.onboard.title': 'Secure Your Account',
    'biometric.onboard.subtitle': 'Set up biometric authentication for enhanced security',
    'biometric.step1.title': 'Choose Authentication Method',
    'biometric.step2.title': 'Capture Biometric Data',
    'biometric.step3.title': 'Verify Setup',
    'biometric.fingerprint': 'Fingerprint',
    'biometric.face': 'Face Recognition',
    'biometric.voice': 'Voice Recognition',
    'biometric.capture': 'Capture',
    'biometric.verify': 'Verify',
    'biometric.success': 'Setup Complete!',

    // Video Call Modal
    'video.modal.title': 'Video Consultation',

    // Notifications
    'notification.app_submitted': 'Application submitted successfully',
    'notification.payment_completed': 'Payment completed',
    'notification.doc_ready': 'Document ready for download',
    'notification.status_updated': 'Application status updated',

    // Validation Messages
    'validation.file_too_large': 'File size must be less than 10MB',
    'validation.invalid_file_type': 'Invalid file type. Please upload PDF, JPG, or PNG files',
    'validation.required_field': 'This field is required',
    'validation.invalid_email': 'Please enter a valid email address',
    'validation.invalid_phone': 'Please enter a valid phone number',
  },
  tpi: {
    // Navigation
    'nav.citizen_portal': 'Access Portal',
    'nav.admin_portal': 'Admin Portal',
    'nav.service_provider_portal': 'Service Provider Portal',
    'nav.security_dashboard': 'Security Dashboard',
    'nav.notifications': 'Ol Massage',
    'nav.profile': 'Profil',
    'nav.settings': 'Ol Setting',
    'nav.sign_out': 'Kamaut',
    // Portal
    'portal.title': 'PNG Gavman Digital Portal',
    'portal.subtitle': 'Strongpela Digital ID na Gavman Sevenis Platform',

    // Common Actions
    'common.save': 'Seiv',
    'common.cancel': 'Pinis',
    'common.submit': 'Salim',
    'common.close': 'Pasim',
    'common.next': 'Bihain',
    'common.back': 'Go Bek',
    'common.continue': 'Kontiniu',
    'common.finish': 'Pinis',
    'common.retry': 'Traim Gen',
    'common.skip': 'Jump',

    // Application Modal
    'app.modal.title': 'Nupela Aplikesen',
    'app.service_type': 'Kain Senis',
    'app.service_type.placeholder': 'Makim wanpela senis',
    'app.urgency': 'Hevi bilong Aplikesen',
    'app.urgency.standard': 'Nomas (Nomas taim)',
    'app.urgency.express': 'Kwik (+50% mani)',
    'app.urgency.urgent': 'Tru Kwik (+100% mani)',
    'app.documents': 'Ol Pepa',
    'app.documents.upload': 'Klik long putim pepa o pulim',
    'app.documents.types': 'PDF, JPG, PNG (10MB nating)',
    'app.notes': 'Narapela Toktok',
    'app.notes.placeholder': 'Narapela samting yu laik tokim...',
    'app.submit': 'Salim Aplikesen',

    // Payment Modal
    'payment.modal.title': 'Peim Mani',
    'payment.summary': 'Ol Mani',
    'payment.service_fee': 'Mani bilong Senis',
    'payment.processing_fee': 'Mani bilong Wok',
    'payment.total': 'Olgeta Mani',
    'payment.method': 'We bilong Peim',
    'payment.credit_card': 'Kredit Kad',
    'payment.mobile_money': 'Mobail Mani',
    'payment.bank_transfer': 'Bank Salim',
    'payment.proceed': 'Go long Peim',

    // Validation Messages
    'validation.file_too_large': 'Fail i bikpela tumas. 10MB nating',
    'validation.invalid_file_type': 'Nogut kain fail. PDF, JPG, o PNG tasol',
    'validation.required_field': 'Yu mas putim dispela',
    'validation.invalid_email': 'Nogut email. Putim gut wan',
    'validation.invalid_phone': 'Nogut namba fon. Putim gut wan',
  },
  ho: {
    // Navigation
    'nav.citizen_portal': 'Access Portal',
    'nav.admin_portal': 'Admin Portal',
    'nav.service_provider_portal': 'Service Provider Portal',
    'nav.security_dashboard': 'Security Dashboard',
    'nav.notifications': 'Oi Hau',
    'nav.profile': 'Profil',
    'nav.settings': 'Oi Setting',
    'nav.sign_out': 'Hau Mai',
    // Portal
    'portal.title': 'PNG Gavman Digital Portal',
    'portal.subtitle': 'Dodoru Digital ID ma Gavman Seveni Platform',

    // Common Actions
    'common.save': 'Henia',
    'common.cancel': 'Raku',
    'common.submit': 'Hau',
    'common.close': 'Hido',
    'common.next': 'Vada',
    'common.back': 'Gevaora',
    'common.continue': 'Rau',
    'common.finish': 'Henia',
    'common.retry': 'Rau Kohi',
    'common.skip': 'Vaira',

    // Application Modal
    'app.modal.title': 'Koitaia Application',
    'app.service_type': 'Hanua Muduka',
    'app.service_type.placeholder': 'Goava ta hanua',
    'app.urgency': 'Application Daba',
    'app.urgency.standard': 'Namona (Namona taim)',
    'app.urgency.express': 'Daba (+50% banee)',
    'app.urgency.urgent': 'Daba Tru (+100% banee)',
    'app.documents': 'Oi Beha',
    'app.documents.upload': 'Klik muduka beha ma pulim',
    'app.documents.types': 'PDF, JPG, PNG (10MB mada)',
    'app.notes': 'Kohi Hau',
    'app.notes.placeholder': 'Kohi hau oiabu laik...',
    'app.submit': 'Hau Application',

    // Validation Messages
    'validation.file_too_large': 'Beha i bada tumas. 10MB mada',
    'validation.invalid_file_type': 'Abe beha kado. PDF, JPG, ma PNG mada',
    'validation.required_field': 'Idua muduka ia',
    'validation.invalid_email': 'Abe email. Muduka dabu ta',
    'validation.invalid_phone': 'Abe phone namba. Muduka dabu ta',
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
