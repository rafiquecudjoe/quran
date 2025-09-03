import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { Country } from '../../utils/countryUtils';

interface CountrySelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange: (country: Country | null) => void;
  error?: string;
  countries: Country[];
  disabled?: boolean;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  label,
  placeholder = "Select country",
  value,
  onChange,
  error,
  countries,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCountry = countries.find(country => country.name === value);

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (country: Country) => {
    onChange(country);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border rounded-lg text-left flex items-center justify-between
          transition-all duration-200 bg-white
          ${error 
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
            : 'border-slate-300 focus:border-blue-500 focus:ring-blue-500'
          }
          ${disabled 
            ? 'bg-slate-100 text-slate-500 cursor-not-allowed' 
            : 'hover:border-slate-400 focus:ring-2 focus:ring-opacity-20'
          }
        `}
      >
        <div className="flex items-center flex-1">
          {selectedCountry ? (
            <>
              <span className="text-lg mr-3">{selectedCountry.flag}</span>
              <span className="text-slate-900">{selectedCountry.name}</span>
              <span className="text-slate-500 ml-2">({selectedCountry.phoneCode})</span>
            </>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
        </div>
        
        <ChevronDown 
          className={`w-5 h-5 text-slate-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
          <div className="p-3 border-b border-slate-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search countries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="max-h-40 overflow-y-auto">
            {selectedCountry && (
              <button
                type="button"
                onClick={handleClear}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 text-slate-500 border-b border-slate-100"
              >
                Clear selection
              </button>
            )}
            
            {filteredCountries.length === 0 ? (
              <div className="px-4 py-3 text-slate-500 text-center">
                No countries found
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`
                    w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors
                    flex items-center
                    ${selectedCountry?.code === country.code 
                      ? 'bg-blue-50 text-blue-900' 
                      : 'text-slate-900'
                    }
                  `}
                >
                  <span className="text-lg mr-3">{country.flag}</span>
                  <span className="flex-1">{country.name}</span>
                  <span className="text-slate-500 text-sm">{country.phoneCode}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
