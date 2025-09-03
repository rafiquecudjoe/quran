import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Globe, 
  Calendar, 
  Users, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Eye, 
  EyeOff,
  Camera,
  Upload,
  Book,
  Search,
  ChevronDown
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { SignupFormData } from '../../types';
import { countries, type Country } from '../../utils/countryUtils';

interface EnhancedSignupFormProps {
  onSignup: (userData: SignupFormData) => void;
  onLoginClick: () => void;
}

export const EnhancedSignupForm: React.FC<EnhancedSignupFormProps> = ({
  onSignup,
  onLoginClick
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    country: '',
    dateOfBirth: '',
    quranLevel: '',
    userType: 'adult',
    age: 0,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Handle clicking outside the country dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
        // Reset search to show selected country when dropdown closes
        setCountrySearch('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const updateFormData = (field: string, value: string | File) => {
    const newFormData = { ...formData, [field]: value };
    
    // Auto-calculate age and user type when date of birth changes
    if (field === 'dateOfBirth' && typeof value === 'string' && value) {
      const age = calculateAge(value);
      newFormData.age = age;
      newFormData.userType = age < 18 ? 'child' : 'adult';
    }
    
    setFormData(newFormData);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const updateParentInfo = (field: string, value: string) => {
    setFormData({
      ...formData,
      parentInfo: {
        firstName: '',
        lastName: '',
        email: '',
        telephone: '',
        relationship: 'mother' as const,
        ...formData.parentInfo,
        [field]: value
      }
    });
  };

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = 'Student first name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Student last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        break;
        
      case 2:
        if (!formData.telephone.trim()) newErrors.telephone = 'Phone number is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        if (!formData.quranLevel) newErrors.quranLevel = 'Quran level is required';
        break;
        
      case 3:
        if (formData.userType === 'child') {
          if (!formData.parentInfo?.firstName.trim()) newErrors.parentFirstName = 'Parent first name is required';
          if (!formData.parentInfo?.lastName.trim()) newErrors.parentLastName = 'Parent last name is required';
          if (!formData.parentInfo?.email.trim()) newErrors.parentEmail = 'Parent email is required';
          if (!/\S+@\S+\.\S+/.test(formData.parentInfo?.email || '')) newErrors.parentEmail = 'Invalid parent email format';
          if (!formData.parentInfo?.telephone.trim()) newErrors.parentTelephone = 'Parent phone number is required';
          if (!formData.parentInfo?.relationship) newErrors.parentRelationship = 'Relationship is required';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      onSignup(formData);
    }
  };

  const totalSteps = formData.userType === 'child' ? 3 : 2;

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-700">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm text-slate-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-blue-700 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-blue-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Create Your Account</h2>
        <p className="text-slate-600">Let's start with your basic information</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Student First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.firstName ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter student first name"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Student Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.lastName ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter student last name"
          />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.email ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter your email"
          />
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => updateFormData('password', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.password ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Create a password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={formData.confirmPassword}
            onChange={(e) => updateFormData('confirmPassword', e.target.value)}
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.confirmPassword ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Globe className="w-8 h-8 text-blue-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Details</h2>
        <p className="text-slate-600">Help us personalize your learning experience</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Country *
        </label>
        <div className="relative" ref={countryDropdownRef}>
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
          <div className="relative">
            <input
              type="text"
              value={formData.country}
              onChange={(e) => {
                const value = e.target.value;
                updateFormData('country', value);
                setCountrySearch(value);
                setShowCountryDropdown(true);
                // Clear selected country when typing
                if (selectedCountry && value !== selectedCountry.name) {
                  setSelectedCountry(null);
                }
              }}
              onFocus={() => {
                setCountrySearch(formData.country);
                setShowCountryDropdown(true);
              }}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.country ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Search and select your country"
            />
            <button
              type="button"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <ChevronDown className="w-5 h-5" />
            </button>
            
            {showCountryDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div className="p-2 border-b border-slate-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search countries..."
                    />
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          // Update form data directly
                          const newFormData = { ...formData, country: country.name };
                          setFormData(newFormData);
                          
                          setSelectedCountry(country);
                          setCountrySearch('');
                          setShowCountryDropdown(false);
                          
                          // Auto-populate phone number with country code
                          if (!newFormData.telephone || newFormData.telephone.startsWith('+')) {
                            const updatedFormData = { ...newFormData, telephone: country.phoneCode + ' ' };
                            setFormData(updatedFormData);
                          }
                        }}
                        className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                          formData.country === country.name ? 'bg-blue-100 text-blue-800' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{country.flag}</span>
                          <span className="flex-1">{country.name}</span>
                          <span className="text-sm text-slate-500">{country.phoneCode}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-slate-500 text-center">
                      No countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Phone Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="tel"
            value={formData.telephone}
            onChange={(e) => updateFormData('telephone', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.telephone ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder={selectedCountry ? `${selectedCountry.phoneCode} 123456789` : "+1 (555) 123-4567"}
          />
        </div>
        {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Profile Picture
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center border-2 border-dashed border-slate-300">
            {formData.profilePicture ? (
              <img 
                src={formData.profilePicture instanceof File ? URL.createObjectURL(formData.profilePicture) : formData.profilePicture} 
                alt="Profile preview" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-slate-400" />
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              id="profilePicture"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  updateFormData('profilePicture', file);
                }
              }}
              className="hidden"
            />
            <label
              htmlFor="profilePicture"
              className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose Photo
            </label>
            <p className="text-xs text-slate-500 mt-1">JPG, PNG or GIF (max 5MB)</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Date of Birth *
        </label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.dateOfBirth ? 'border-red-500' : 'border-slate-300'
            }`}
          />
        </div>
        {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
        
        {formData.dateOfBirth && (
          <div className="mt-3 p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600">
              Age: <span className="font-medium">{formData.age} years old</span>
              {formData.userType === 'child' && (
                <span className="ml-2 text-amber-600">(Parent/Guardian information will be required)</span>
              )}
            </p>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Holy Quran Level *
        </label>
        <div className="relative">
          <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={formData.quranLevel}
            onChange={(e) => updateFormData('quranLevel', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none ${
              errors.quranLevel ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select your Quran level</option>
            <option value="beginners">Beginners - Currently started learning Yarsanal Quran</option>
            <option value="advanced">Advanced - Want to polish Quran</option>
            <option value="hifz">Hifz - Want to memorize Quran</option>
          </select>
        </div>
        {errors.quranLevel && <p className="text-red-500 text-sm mt-1">{errors.quranLevel}</p>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-blue-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Parent/Guardian Information</h2>
        <p className="text-slate-600">Since you're under 18, we need a parent or guardian's details</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Parent/Guardian First Name *
          </label>
          <input
            type="text"
            value={formData.parentInfo?.firstName || ''}
            onChange={(e) => updateParentInfo('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.parentFirstName ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter first name"
          />
          {errors.parentFirstName && <p className="text-red-500 text-sm mt-1">{errors.parentFirstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Parent/Guardian Last Name *
          </label>
          <input
            type="text"
            value={formData.parentInfo?.lastName || ''}
            onChange={(e) => updateParentInfo('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.parentLastName ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter last name"
          />
          {errors.parentLastName && <p className="text-red-500 text-sm mt-1">{errors.parentLastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Parent/Guardian Email *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="email"
            value={formData.parentInfo?.email || ''}
            onChange={(e) => updateParentInfo('email', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.parentEmail ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="parent@example.com"
          />
        </div>
        {errors.parentEmail && <p className="text-red-500 text-sm mt-1">{errors.parentEmail}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Parent/Guardian Phone Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="tel"
            value={formData.parentInfo?.telephone || ''}
            onChange={(e) => updateParentInfo('telephone', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.parentTelephone ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        {errors.parentTelephone && <p className="text-red-500 text-sm mt-1">{errors.parentTelephone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Relationship *
        </label>
        <select
          value={formData.parentInfo?.relationship || ''}
          onChange={(e) => updateParentInfo('relationship', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none ${
            errors.parentRelationship ? 'border-red-500' : 'border-slate-300'
          }`}
        >
          <option value="">Select relationship</option>
          <option value="mother">Mother</option>
          <option value="father">Father</option>
          <option value="guardian">Guardian</option>
        </select>
        {errors.parentRelationship && <p className="text-red-500 text-sm mt-1">{errors.parentRelationship}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="pb-2">
          {renderProgressBar()}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && formData.userType === 'child' && renderStep3()}

          <div className="flex justify-between pt-6">
            {currentStep > 1 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={onLoginClick}
                className="text-slate-600 hover:text-slate-900"
              >
                Already have an account?
              </Button>
            )}

            <Button
              onClick={nextStep}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800"
            >
              {currentStep === totalSteps ? (
                <>
                  <Check className="w-4 h-4" />
                  Create Account
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {currentStep === 1 && (
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-700 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-700 hover:underline">Privacy Policy</a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
