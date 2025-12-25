import React, { useState, useEffect, useRef } from 'react';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Globe, 
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
  ChevronDown,
  UserPlus,
  Baby,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { DateOfBirthPicker } from '../ui/DateOfBirthPicker';
import { SignupFormData, RegistrationType, FamilySignupFormData, ChildInfo } from '../../types';
import { countries, type Country } from '../../utils/countryUtils';

interface EnhancedSignupFormProps {
  onSignup: (userData: SignupFormData) => Promise<void>;
  onFamilySignup?: (familyData: FamilySignupFormData) => Promise<void>;
  onLoginClick: () => void;
}

export const EnhancedSignupForm: React.FC<EnhancedSignupFormProps> = ({
  onSignup,
  onFamilySignup,
  onLoginClick
}) => {
  // Registration type selection
  const [registrationType, setRegistrationType] = useState<RegistrationType | null>(null);
  
  // Adult self-registration state
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Family registration state
  const [familyStep, setFamilyStep] = useState(1);
  const [familyCountrySearch, setFamilyCountrySearch] = useState('');
  const [showFamilyCountryDropdown, setShowFamilyCountryDropdown] = useState(false);
  const familyCountryDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedFamilyCountry, setSelectedFamilyCountry] = useState<Country | null>(null);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);
  const [familyFormData, setFamilyFormData] = useState<FamilySignupFormData>({
    parentFirstName: '',
    parentLastName: '',
    parentEmail: '',
    parentTelephone: '',
    relationship: 'father',
    country: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    numberOfChildren: 1,
    children: [{ firstName: '', lastName: '', dateOfBirth: '', quranLevel: '' }]
  });
  const [familyErrors, setFamilyErrors] = useState<{[key: string]: string}>({});

  // Filter countries based on search
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredFamilyCountries = countries.filter(country =>
    country.name.toLowerCase().includes(familyCountrySearch.toLowerCase())
  );

  // Handle clicking outside the country dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
        setCountrySearch('');
      }
      if (familyCountryDropdownRef.current && !familyCountryDropdownRef.current.contains(event.target as Node)) {
        setShowFamilyCountryDropdown(false);
        setFamilyCountrySearch('');
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
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
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
        if (formData.dateOfBirth && formData.age < 18) {
          newErrors.dateOfBirth = 'You must be 18 or older. Please use the parent registration option.';
        }
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

  const nextStep = async () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        await handleSubmit();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep) && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onSignup(formData);
        // Don't reset isSubmitting here - component will unmount on successful navigation
      } catch (error) {
        // Only reset isSubmitting on error so user can retry
        setIsSubmitting(false);
      }
    }
  };

  const totalSteps = formData.userType === 'child' ? 3 : 2;

  // Family registration functions
  const updateFamilyFormData = (field: string, value: string) => {
    setFamilyFormData({ ...familyFormData, [field]: value });
    if (familyErrors[field]) {
      setFamilyErrors({ ...familyErrors, [field]: '' });
    }
  };

  const updateChildInfo = (index: number, field: keyof ChildInfo, value: string) => {
    const updatedChildren = [...familyFormData.children];
    updatedChildren[index] = { ...updatedChildren[index], [field]: value };
    
    // Calculate age for child
    if (field === 'dateOfBirth' && value) {
      updatedChildren[index].age = calculateAge(value);
    }
    
    setFamilyFormData({ ...familyFormData, children: updatedChildren });
    
    // Clear error
    const errorKey = `child_${index}_${field}`;
    if (familyErrors[errorKey]) {
      setFamilyErrors({ ...familyErrors, [errorKey]: '' });
    }
  };

  const setNumberOfChildren = (count: number) => {
    const currentChildren = familyFormData.children;
    let newChildren: ChildInfo[];
    
    if (count > currentChildren.length) {
      // Add more children
      newChildren = [
        ...currentChildren,
        ...Array(count - currentChildren.length).fill(null).map(() => ({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          quranLevel: ''
        }))
      ];
    } else {
      // Remove children
      newChildren = currentChildren.slice(0, count);
    }
    
    setFamilyFormData({ ...familyFormData, numberOfChildren: count, children: newChildren });
  };

  const addChild = () => {
    if (familyFormData.numberOfChildren < 10) {
      setNumberOfChildren(familyFormData.numberOfChildren + 1);
    }
  };

  const removeChild = (index: number) => {
    if (familyFormData.numberOfChildren > 1) {
      const newChildren = familyFormData.children.filter((_, i) => i !== index);
      setFamilyFormData({
        ...familyFormData,
        numberOfChildren: familyFormData.numberOfChildren - 1,
        children: newChildren
      });
    }
  };

  const validateFamilyStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {};

    switch (step) {
      case 1:
        if (!familyFormData.parentFirstName.trim()) newErrors.parentFirstName = 'Your first name is required';
        if (!familyFormData.parentLastName.trim()) newErrors.parentLastName = 'Your last name is required';
        if (!familyFormData.parentEmail.trim()) newErrors.parentEmail = 'Email is required';
        if (!/\S+@\S+\.\S+/.test(familyFormData.parentEmail)) newErrors.parentEmail = 'Invalid email format';
        if (!familyFormData.parentTelephone.trim()) newErrors.parentTelephone = 'Phone number is required';
        if (!familyFormData.country) newErrors.country = 'Country is required';
        if (!familyFormData.relationship) newErrors.relationship = 'Relationship is required';
        break;
        
      case 2:
        // Just validate number selection (always valid if we get here)
        break;
        
      case 3:
        // Validate each child
        familyFormData.children.forEach((child, index) => {
          if (!child.firstName.trim()) newErrors[`child_${index}_firstName`] = 'First name is required';
          if (!child.lastName.trim()) newErrors[`child_${index}_lastName`] = 'Last name is required';
          if (!child.dateOfBirth) newErrors[`child_${index}_dateOfBirth`] = 'Date of birth is required';
          if (!child.quranLevel) newErrors[`child_${index}_quranLevel`] = 'Quran level is required';
          
          // Validate child is under 18
          if (child.dateOfBirth) {
            const age = calculateAge(child.dateOfBirth);
            if (age >= 18) {
              newErrors[`child_${index}_dateOfBirth`] = 'Child must be under 18 years old';
            }
            if (age < 4) {
              newErrors[`child_${index}_dateOfBirth`] = 'Child must be at least 4 years old';
            }
          }
        });
        break;
        
      case 4:
        if (!confirmEmailSent) newErrors.confirmEmailSent = 'Please confirm you understand';
        break;
    }

    setFamilyErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextFamilyStep = async () => {
    if (validateFamilyStep(familyStep)) {
      if (familyStep < 4) {
        setFamilyStep(familyStep + 1);
      } else {
        await handleFamilySubmit();
      }
    }
  };

  const prevFamilyStep = () => {
    if (familyStep > 1) {
      setFamilyStep(familyStep - 1);
    }
  };

  const handleFamilySubmit = async () => {
    if (validateFamilyStep(4) && onFamilySignup && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onFamilySignup(familyFormData);
        // Don't reset isSubmitting here - component will unmount on successful navigation
      } catch (error) {
        // Only reset isSubmitting on error so user can retry
        setIsSubmitting(false);
      }
    }
  };

  const goBack = () => {
    setRegistrationType(null);
    setCurrentStep(1);
    setFamilyStep(1);
  };

  // Render registration type selection
  const renderTypeSelection = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-blue-800 p-8 text-center">
          <div className="mx-auto w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mb-4">
            <Book className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome to Ismail Academy</h1>
          <p className="text-blue-100">Begin your Quran learning journey today</p>
        </div>
        
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold text-slate-800 text-center mb-8">
            How would you like to register?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Adult Self-Registration */}
            <button
              onClick={() => setRegistrationType('adult')}
              className="group p-6 border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-left"
            >
              <div className="w-16 h-16 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center mb-4 transition-colors">
                <User className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">I'm an Adult</h3>
              <p className="text-slate-600 text-sm">
                Register myself for Quran learning. I'm 18 years or older.
              </p>
            </button>

            {/* Parent Registering Children */}
            <button
              onClick={() => setRegistrationType('parent')}
              className="group p-6 border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 text-left"
            >
              <div className="w-16 h-16 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center mb-4 transition-colors">
                <Users className="w-8 h-8 text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">I'm a Parent</h3>
              <p className="text-slate-600 text-sm">
                Register my child(ren) for Quran learning. Credentials will be emailed to me.
              </p>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <button
                onClick={onLoginClick}
                className="text-blue-700 hover:text-blue-800 font-semibold hover:underline"
              >
                Log in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

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

  const renderFamilyProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-700">Step {familyStep} of 4</span>
        <span className="text-sm text-slate-500">{Math.round((familyStep / 4) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-blue-700 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(familyStep / 4) * 100}%` }}
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
            First Name *
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={(e) => updateFormData('firstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.firstName ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={(e) => updateFormData('lastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.lastName ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter your last name"
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
                          const newFormData = { ...formData, country: country.name };
                          setFormData(newFormData);
                          setSelectedCountry(country);
                          setCountrySearch('');
                          setShowCountryDropdown(false);
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
        <DateOfBirthPicker
          value={formData.dateOfBirth}
          onChange={(value) => updateFormData('dateOfBirth', value)}
          error={errors.dateOfBirth || (formData.dateOfBirth && formData.age < 18 ? 'You must be 18 or older' : undefined)}
          minAge={0}
          maxAge={120}
        />
        
        {formData.dateOfBirth && formData.age > 0 && formData.age >= 18 && (
          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              ✓ Age: <span className="font-medium">{formData.age} years old</span>
            </p>
          </div>
        )}

        {formData.dateOfBirth && formData.age > 0 && formData.age < 18 && (
          <div className="mt-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700 font-medium mb-2">
              ⚠️ You must be 18 or older to register as an adult.
            </p>
            <p className="text-sm text-red-600 mb-3">
              Since you're {formData.age} years old, please ask your parent or guardian to register you using the parent registration option.
            </p>
            <button
              type="button"
              onClick={goBack}
              className="text-sm bg-red-100 hover:bg-red-200 text-red-700 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              ← Go to Parent Registration
            </button>
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

  // Family registration steps
  const renderFamilyStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-blue-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Contact Information</h2>
        <p className="text-slate-600">We'll send your children's login credentials to your email</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your First Name *
          </label>
          <input
            type="text"
            value={familyFormData.parentFirstName}
            onChange={(e) => updateFamilyFormData('parentFirstName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              familyErrors.parentFirstName ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter your first name"
          />
          {familyErrors.parentFirstName && <p className="text-red-500 text-sm mt-1">{familyErrors.parentFirstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Your Last Name *
          </label>
          <input
            type="text"
            value={familyFormData.parentLastName}
            onChange={(e) => updateFamilyFormData('parentLastName', e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              familyErrors.parentLastName ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Enter your last name"
          />
          {familyErrors.parentLastName && <p className="text-red-500 text-sm mt-1">{familyErrors.parentLastName}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="email"
            value={familyFormData.parentEmail}
            onChange={(e) => updateFamilyFormData('parentEmail', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              familyErrors.parentEmail ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="your.email@example.com"
          />
        </div>
        <p className="text-xs text-slate-500 mt-1">Login credentials for all children will be sent to this email</p>
        {familyErrors.parentEmail && <p className="text-red-500 text-sm mt-1">{familyErrors.parentEmail}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Country *
        </label>
        <div className="relative" ref={familyCountryDropdownRef}>
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
          <input
            type="text"
            value={familyFormData.country}
            onChange={(e) => {
              updateFamilyFormData('country', e.target.value);
              setFamilyCountrySearch(e.target.value);
              setShowFamilyCountryDropdown(true);
            }}
            onFocus={() => {
              setFamilyCountrySearch(familyFormData.country);
              setShowFamilyCountryDropdown(true);
            }}
            className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              familyErrors.country ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="Search and select your country"
          />
          <button
            type="button"
            onClick={() => setShowFamilyCountryDropdown(!showFamilyCountryDropdown)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
          
          {showFamilyCountryDropdown && (
            <div className="absolute z-50 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="max-h-48 overflow-y-auto">
                {filteredFamilyCountries.length > 0 ? (
                  filteredFamilyCountries.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => {
                        setFamilyFormData({ ...familyFormData, country: country.name });
                        setSelectedFamilyCountry(country);
                        setFamilyCountrySearch('');
                        setShowFamilyCountryDropdown(false);
                        if (!familyFormData.parentTelephone || familyFormData.parentTelephone.startsWith('+')) {
                          setFamilyFormData(prev => ({ ...prev, country: country.name, parentTelephone: country.phoneCode + ' ' }));
                        }
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
                        familyFormData.country === country.name ? 'bg-blue-100 text-blue-800' : 'text-slate-700'
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
                  <div className="px-4 py-3 text-slate-500 text-center">No countries found</div>
                )}
              </div>
            </div>
          )}
        </div>
        {familyErrors.country && <p className="text-red-500 text-sm mt-1">{familyErrors.country}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Phone Number *
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="tel"
            value={familyFormData.parentTelephone}
            onChange={(e) => updateFamilyFormData('parentTelephone', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              familyErrors.parentTelephone ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder={selectedFamilyCountry ? `${selectedFamilyCountry.phoneCode} 123456789` : "+1 (555) 123-4567"}
          />
        </div>
        {familyErrors.parentTelephone && <p className="text-red-500 text-sm mt-1">{familyErrors.parentTelephone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Your Relationship to Children *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(['mother', 'father', 'guardian'] as const).map((rel) => (
            <button
              key={rel}
              type="button"
              onClick={() => updateFamilyFormData('relationship', rel)}
              className={`py-3 px-4 rounded-lg border-2 font-medium transition-all ${
                familyFormData.relationship === rel
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              {rel.charAt(0).toUpperCase() + rel.slice(1)}
            </button>
          ))}
        </div>
        {familyErrors.relationship && <p className="text-red-500 text-sm mt-1">{familyErrors.relationship}</p>}
      </div>
    </div>
  );

  const renderFamilyStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-blue-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">How Many Children?</h2>
        <p className="text-slate-600">Select the number of children you'd like to register</p>
      </div>

      <div className="flex justify-center gap-3 flex-wrap">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => setNumberOfChildren(num)}
            className={`w-16 h-16 rounded-xl border-2 font-bold text-xl transition-all ${
              familyFormData.numberOfChildren === num
                ? 'border-blue-500 bg-blue-500 text-white shadow-lg scale-110'
                : 'border-slate-200 hover:border-blue-300 text-slate-600 hover:bg-blue-50'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {familyFormData.numberOfChildren >= 5 && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={addChild}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-700 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add more children
          </button>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <Mail className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <p className="font-medium text-blue-800">
              Registering {familyFormData.numberOfChildren} {familyFormData.numberOfChildren === 1 ? 'child' : 'children'}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              Each child will receive a unique username and password sent to your email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFamilyStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Baby className="w-8 h-8 text-blue-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Children's Information</h2>
        <p className="text-slate-600">Enter details for each child</p>
      </div>

      <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2">
        {familyFormData.children.map((child, index) => (
          <div key={index} className="p-5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="font-bold text-blue-700">{index + 1}</span>
                </div>
                <h3 className="font-semibold text-slate-800">
                  Child {index + 1}
                  {child.firstName && ` - ${child.firstName}`}
                </h3>
              </div>
              {familyFormData.numberOfChildren > 1 && (
                <button
                  type="button"
                  onClick={() => removeChild(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                <input
                  type="text"
                  value={child.firstName}
                  onChange={(e) => updateChildInfo(index, 'firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    familyErrors[`child_${index}_firstName`] ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Child's first name"
                />
                {familyErrors[`child_${index}_firstName`] && (
                  <p className="text-red-500 text-xs mt-1">{familyErrors[`child_${index}_firstName`]}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  value={child.lastName}
                  onChange={(e) => updateChildInfo(index, 'lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    familyErrors[`child_${index}_lastName`] ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Child's last name"
                />
                {familyErrors[`child_${index}_lastName`] && (
                  <p className="text-red-500 text-xs mt-1">{familyErrors[`child_${index}_lastName`]}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <DateOfBirthPicker
                  value={child.dateOfBirth}
                  onChange={(value) => updateChildInfo(index, 'dateOfBirth', value)}
                  error={familyErrors[`child_${index}_dateOfBirth`]}
                  minAge={4}
                  maxAge={17}
                />
                {child.dateOfBirth && child.age !== undefined && !familyErrors[`child_${index}_dateOfBirth`] && (
                  <p className="text-xs text-green-600 mt-1">✓ Age: {child.age} years old</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quran Level *</label>
                <select
                  value={child.quranLevel}
                  onChange={(e) => updateChildInfo(index, 'quranLevel', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    familyErrors[`child_${index}_quranLevel`] ? 'border-red-500' : 'border-slate-300'
                  }`}
                >
                  <option value="">Select level</option>
                  <option value="beginners">Beginners</option>
                  <option value="advanced">Advanced</option>
                  <option value="hifz">Hifz</option>
                </select>
                {familyErrors[`child_${index}_quranLevel`] && (
                  <p className="text-red-500 text-xs mt-1">{familyErrors[`child_${index}_quranLevel`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {familyFormData.numberOfChildren < 10 && (
        <button
          type="button"
          onClick={addChild}
          className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-blue-400 hover:text-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Another Child
        </button>
      )}
    </div>
  );

  const renderFamilyStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-blue-700" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Review & Confirm</h2>
        <p className="text-slate-600">Please review the information before submitting</p>
      </div>

      {/* Parent Info Summary */}
      <div className="p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Mail className="w-5 h-5 text-blue-700" />
          Parent Contact
        </h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p><span className="text-slate-500">Name:</span> <span className="font-medium">{familyFormData.parentFirstName} {familyFormData.parentLastName}</span></p>
          <p><span className="text-slate-500">Email:</span> <span className="font-medium">{familyFormData.parentEmail}</span></p>
          <p><span className="text-slate-500">Phone:</span> <span className="font-medium">{familyFormData.parentTelephone}</span></p>
          <p><span className="text-slate-500">Relationship:</span> <span className="font-medium capitalize">{familyFormData.relationship}</span></p>
        </div>
      </div>

      {/* Children Summary */}
      <div className="p-4 bg-slate-50 rounded-xl">
        <h3 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-700" />
          Children to be Registered ({familyFormData.children.length})
        </h3>
        <div className="space-y-3">
          {familyFormData.children.map((child, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-700">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-slate-800">{child.firstName} {child.lastName}</p>
                  <p className="text-xs text-slate-500">Age: {child.age} • {child.quranLevel}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What Happens Next */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
          ⚡ What happens next
        </h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>A unique username & password will be generated for each child</span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>All login credentials will be sent to: <strong>{familyFormData.parentEmail}</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>Your children can use these credentials to log in and start learning</span>
          </li>
        </ul>
      </div>

      {/* Confirmation Checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="confirmEmail"
          checked={confirmEmailSent}
          onChange={(e) => setConfirmEmailSent(e.target.checked)}
          className="mt-1 w-5 h-5 text-blue-700 border-slate-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="confirmEmail" className="text-sm text-slate-600">
          I understand that login credentials for all my children will be sent to my email address ({familyFormData.parentEmail})
        </label>
      </div>
      {familyErrors.confirmEmailSent && <p className="text-red-500 text-sm">{familyErrors.confirmEmailSent}</p>}
    </div>
  );

  // Adult self-registration form
  const renderAdultForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex items-center justify-center p-4">
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
                onClick={goBack}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change registration type
              </Button>
            )}

            <Button
              onClick={nextStep}
              disabled={isSubmitting || (currentStep === 2 && formData.dateOfBirth && formData.age < 18)}
              className={`flex items-center gap-2 ${
                isSubmitting || (currentStep === 2 && formData.dateOfBirth && formData.age < 18)
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-blue-700 hover:bg-blue-800'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : currentStep === totalSteps ? (
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

  // Family registration form
  const renderFamilyForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="pb-2">
          {renderFamilyProgressBar()}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {familyStep === 1 && renderFamilyStep1()}
          {familyStep === 2 && renderFamilyStep2()}
          {familyStep === 3 && renderFamilyStep3()}
          {familyStep === 4 && renderFamilyStep4()}

          <div className="flex justify-between pt-6">
            {familyStep > 1 ? (
              <Button
                variant="outline"
                onClick={prevFamilyStep}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={goBack}
                className="text-slate-600 hover:text-slate-900"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change registration type
              </Button>
            )}

            <Button
              onClick={nextFamilyStep}
              disabled={isSubmitting}
              className={`flex items-center gap-2 ${isSubmitting ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'}`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : familyStep === 4 ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  Register All Children
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>

          {familyStep === 1 && (
            <div className="text-center pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                By registering, you agree to our{' '}
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

  // Main render
  if (!registrationType) {
    return renderTypeSelection();
  }

  if (registrationType === 'adult') {
    return renderAdultForm();
  }

  return renderFamilyForm();
};
