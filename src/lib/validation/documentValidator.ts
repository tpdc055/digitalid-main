export interface DocumentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DocumentRequirement {
  serviceType: string;
  requiredDocuments: string[];
  maxFileSize: number; // in MB
  allowedTypes: string[];
  maxFiles: number;
}

// PNG Government document requirements by service type
export const DOCUMENT_REQUIREMENTS: Record<string, DocumentRequirement> = {
  'Birth Certificate': {
    serviceType: 'Birth Certificate',
    requiredDocuments: ['Hospital Birth Record', 'Parents\' ID', 'Marriage Certificate (if applicable)'],
    maxFileSize: 10,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    maxFiles: 5
  },
  'Passport Application': {
    serviceType: 'Passport Application',
    requiredDocuments: ['Birth Certificate', 'Citizenship Certificate', 'Recent Photo', 'ID Card'],
    maxFileSize: 10,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    maxFiles: 6
  },
  'Business License': {
    serviceType: 'Business License',
    requiredDocuments: ['Business Plan', 'Tax Registration', 'Owner ID', 'Location Certificate'],
    maxFileSize: 15,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    maxFiles: 8
  },
  'Vehicle Registration': {
    serviceType: 'Vehicle Registration',
    requiredDocuments: ['Purchase Receipt', 'Import Documents', 'Owner ID', 'Insurance Certificate'],
    maxFileSize: 10,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    maxFiles: 6
  },
  'Education Verification': {
    serviceType: 'Education Verification',
    requiredDocuments: ['Academic Transcripts', 'Certificates', 'Institution Letter'],
    maxFileSize: 10,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    maxFiles: 5
  },
  'Health Insurance': {
    serviceType: 'Health Insurance',
    requiredDocuments: ['Birth Certificate', 'Employment Letter', 'Recent Photo', 'Medical History'],
    maxFileSize: 10,
    allowedTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    maxFiles: 6
  }
};

export class DocumentValidator {
  static validateFile(file: File, serviceType: string, language: string = 'en'): DocumentValidationResult {
    const result: DocumentValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const requirements = DOCUMENT_REQUIREMENTS[serviceType];
    if (!requirements) {
      result.isValid = false;
      result.errors.push(this.getTranslatedMessage('validation.unsupported_service', language));
      return result;
    }

    // File size validation
    const maxSizeBytes = requirements.maxFileSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      result.isValid = false;
      result.errors.push(this.getTranslatedMessage('validation.file_too_large', language, requirements.maxFileSize));
    }

    // File type validation
    if (!requirements.allowedTypes.includes(file.type)) {
      result.isValid = false;
      result.errors.push(this.getTranslatedMessage('validation.invalid_file_type', language));
    }

    // File name validation (no special characters, reasonable length)
    const validNamePattern = /^[a-zA-Z0-9._\s-]+$/;
    if (!validNamePattern.test(file.name)) {
      result.isValid = false;
      result.errors.push(this.getTranslatedMessage('validation.invalid_filename', language));
    }

    if (file.name.length > 100) {
      result.isValid = false;
      result.errors.push(this.getTranslatedMessage('validation.filename_too_long', language));
    }

    // Add warnings for optimization
    if (file.size > 5 * 1024 * 1024) { // Warn if over 5MB
      result.warnings.push(this.getTranslatedMessage('validation.large_file_warning', language));
    }

    if (file.type.includes('image') && file.size > 2 * 1024 * 1024) {
      result.warnings.push(this.getTranslatedMessage('validation.image_size_warning', language));
    }

    return result;
  }

  static validateFileList(files: File[], serviceType: string, language: string = 'en'): DocumentValidationResult {
    const result: DocumentValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const requirements = DOCUMENT_REQUIREMENTS[serviceType];
    if (!requirements) {
      result.isValid = false;
      result.errors.push(this.getTranslatedMessage('validation.unsupported_service', language));
      return result;
    }

    // Check file count
    if (files.length > requirements.maxFiles) {
      result.isValid = false;
      result.errors.push(this.getTranslatedMessage('validation.too_many_files', language, requirements.maxFiles));
    }

    if (files.length === 0) {
      result.errors.push(this.getTranslatedMessage('validation.no_files', language));
    }

    // Validate each file
    files.forEach((file, index) => {
      const fileResult = this.validateFile(file, serviceType, language);
      if (!fileResult.isValid) {
        result.isValid = false;
        fileResult.errors.forEach(error => {
          result.errors.push(`File ${index + 1}: ${error}`);
        });
      }
      result.warnings.push(...fileResult.warnings);
    });

    // Check for duplicate files
    const fileNames = files.map(f => f.name.toLowerCase());
    const duplicates = fileNames.filter((name, index) => fileNames.indexOf(name) !== index);
    if (duplicates.length > 0) {
      result.warnings.push(this.getTranslatedMessage('validation.duplicate_files', language));
    }

    return result;
  }

  static getRequirements(serviceType: string): DocumentRequirement | null {
    return DOCUMENT_REQUIREMENTS[serviceType] || null;
  }

  static getAllowedTypesString(serviceType: string): string {
    const requirements = DOCUMENT_REQUIREMENTS[serviceType];
    if (!requirements) return '';

    const typeMap: Record<string, string> = {
      'application/pdf': 'PDF',
      'image/jpeg': 'JPG',
      'image/jpg': 'JPG',
      'image/png': 'PNG',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX'
    };

    const types = requirements.allowedTypes.map(type => typeMap[type] || type).filter((v, i, a) => a.indexOf(v) === i);
    return types.join(', ');
  }

  private static getTranslatedMessage(key: string, language: string, ...args: any[]): string {
    const messages: Record<string, Record<string, string>> = {
      en: {
        'validation.unsupported_service': 'Unsupported service type',
        'validation.file_too_large': `File size must be less than ${args[0]}MB`,
        'validation.invalid_file_type': 'Invalid file type. Please upload PDF, JPG, or PNG files',
        'validation.invalid_filename': 'File name contains invalid characters',
        'validation.filename_too_long': 'File name is too long (max 100 characters)',
        'validation.large_file_warning': 'Large file detected. Consider compressing for faster upload',
        'validation.image_size_warning': 'Image file is large. Consider reducing resolution',
        'validation.too_many_files': `Too many files. Maximum ${args[0]} files allowed`,
        'validation.no_files': 'Please select at least one file',
        'validation.duplicate_files': 'Duplicate file names detected'
      },
      tpi: {
        'validation.unsupported_service': 'Dispela senis i no gut',
        'validation.file_too_large': `Fail i bikpela tumas. ${args[0]}MB nating`,
        'validation.invalid_file_type': 'Nogut kain fail. PDF, JPG, o PNG tasol',
        'validation.invalid_filename': 'Nem bilong fail i gat nogut mak',
        'validation.filename_too_long': 'Nem bilong fail i longpela tumas',
        'validation.large_file_warning': 'Bikpela fail. Mekim smol long kwik salim',
        'validation.image_size_warning': 'Piksa i bikpela. Mekim smol',
        'validation.too_many_files': `Planti fail tumas. ${args[0]} fail tasol`,
        'validation.no_files': 'Yu mas makim wanpela fail',
        'validation.duplicate_files': 'Sem nem fail'
      },
      ho: {
        'validation.unsupported_service': 'Ia hanua oa kado',
        'validation.file_too_large': `Beha i bada tumas. ${args[0]}MB mada`,
        'validation.invalid_file_type': 'Abe beha kado. PDF, JPG, ma PNG mada',
        'validation.invalid_filename': 'Beha laha i godo abe maka',
        'validation.filename_too_long': 'Beha laha i raba tumas',
        'validation.large_file_warning': 'Bada beha. Mekim ikina daba hau',
        'validation.image_size_warning': 'Taburea i bada. Mekim ikina',
        'validation.too_many_files': `Gahea beha tumas. ${args[0]} beha mada`,
        'validation.no_files': 'Idua goava ta beha',
        'validation.duplicate_files': 'Noho beha laha'
      }
    };

    return messages[language]?.[key] || messages['en'][key] || key;
  }
}

// Utility function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility function to generate secure file names
export function generateSecureFileName(originalName: string, citizenId: string): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  const safeName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  return `${citizenId}_${timestamp}_${safeName}`;
}
