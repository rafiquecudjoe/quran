import React from 'react';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  countryCode: string;
  disabled?: boolean;
  helperText?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  label,
  placeholder = "Enter phone number",
  value,
  onChange,
  error,
  countryCode,
  disabled = false,
  helperText
}) => {
  // Extract just the number part (without country code)
  const getNumberPart = (phoneValue: string): string => {
    if (!phoneValue) return '';
    
    // Remove country code if it exists at the start
    const codeWithoutPlus = countryCode.replace('+', '');
    if (phoneValue.startsWith(countryCode)) {
      return phoneValue.substring(countryCode.length).trim();
    } else if (phoneValue.startsWith(codeWithoutPlus)) {
      return phoneValue.substring(codeWithoutPlus.length).trim();
    }
    
    return phoneValue;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Only allow digits, spaces, dashes, and parentheses
    const cleanValue = inputValue.replace(/[^\d\s\-\(\)]/g, '');
    
    // Combine with country code
    const fullNumber = countryCode && cleanValue ? `${countryCode} ${cleanValue}` : cleanValue;
    onChange(fullNumber);
  };

  const numberPart = getNumberPart(value);

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
          <Phone className="w-5 h-5 text-slate-400 mr-2" />
          {countryCode && (
            <span className="text-slate-600 font-medium mr-2 border-r border-slate-300 pr-2">
              {countryCode}
            </span>
          )}
        </div>
        
        <input
          type="tel"
          placeholder={placeholder}
          value={numberPart}
          onChange={handleInputChange}
          disabled={disabled}
          className={`
            w-full py-3 pr-4 border rounded-lg transition-all duration-200
            ${countryCode ? 'pl-24' : 'pl-12'}
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
            }
            ${disabled 
              ? 'bg-slate-100 text-slate-500 cursor-not-allowed' 
              : 'bg-white focus:ring-2 focus:ring-opacity-20'
            }
          `}
        />
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-slate-500">{helperText}</p>
      )}
    </div>
  );
};
