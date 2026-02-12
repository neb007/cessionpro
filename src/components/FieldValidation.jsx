import React from 'react';
import { Check, AlertCircle, Info } from 'lucide-react';

export default function FieldValidation({
  fieldName,
  value,
  isRequired = false,
  minLength = 0,
  pattern = null,
  customValidator = null,
  language = 'fr'
}) {
  const getValidationStatus = () => {
    // Empty field
    if (!value || (typeof value === 'string' && !value.trim())) {
      return isRequired ? 'error' : 'empty';
    }

    // Min length
    if (typeof value === 'string' && value.length < minLength) {
      return 'error';
    }

    // Pattern validation
    if (pattern && typeof value === 'string' && !pattern.test(value)) {
      return 'error';
    }

    // Custom validator
    if (customValidator && !customValidator(value)) {
      return 'error';
    }

    return 'valid';
  };

  const status = getValidationStatus();

  const getIcon = () => {
    switch (status) {
      case 'valid':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'empty':
        return <Info className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getMessage = () => {
    if (status === 'valid') {
      return language === 'fr' ? '✓ Valide' : '✓ Valid';
    }
    if (status === 'error') {
      if (typeof value === 'string' && value.length < minLength) {
        return language === 'fr'
          ? `✗ Minimum ${minLength} caractères`
          : `✗ Minimum ${minLength} characters`;
      }
      return language === 'fr' ? '✗ Format invalide' : '✗ Invalid format';
    }
    return '';
  };

  return (
    <div className="flex items-center gap-2">
      {getIcon()}
      {getMessage() && (
        <span className={`text-xs font-medium ${
          status === 'valid'
            ? 'text-green-600'
            : status === 'error'
              ? 'text-red-600'
              : 'text-gray-500'
        }`}>
          {getMessage()}
        </span>
      )}
    </div>
  );
}
