import React, { useState } from 'react';
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
  UserPlus
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { SignupFormData } from '../../types';

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
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    telephone: '',
    country: '',
    dateOfBirth: '',
    userType: 'adult',
    age: 0
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
    'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Saudi Arabia', 'UAE', 'Qatar',
    'Kuwait', 'Bahrain', 'Oman', 'Turkey', 'Morocco', 'Egypt', 'Jordan', 'Lebanon',
    'Pakistan', 'India', 'Bangladesh', 'Malaysia', 'Indonesia', 'Singapore', 'Other'
  ];

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

  const updateFormData = (field: string, value: string) => {
    const newFormData = { ...formData, [field]: value };
    
    // Auto-calculate age and user type when date of birth changes
    if (field === 'dateOfBirth' && value) {
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
        break;
        
      case 3:
        if (formData.userType === 'child') {
          if (!formData.parentInfo?.firstName.trim()) newErrors.parentFirstName = 'Parent first name is required';
          if (!formData.parentInfo?.lastName.trim()) newErrors.parentLastName = 'Parent last name is required';
          if (!formData.parentInfo?.email.trim()) newErrors.parentEmail = 'Parent email is required';
          if (!/\S+@\S+\.\S+/.test(formData.parentInfo?.email || '')) newErrors.parentEmail = 'Invalid parent email format';
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
        <span className="text-sm font-medium text-emerald-600">Step {currentStep} of {totalSteps}</span>
        <span className="text-sm text-slate-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className="bg-emerald-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-emerald-600" />
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
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
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
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
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
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
            className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
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
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Globe className="w-8 h-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Details</h2>
        <p className="text-slate-600">Help us personalize your learning experience</p>
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
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              errors.telephone ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="+1 (555) 123-4567"
          />
        </div>
        {errors.telephone && <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Country *
        </label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={formData.country}
            onChange={(e) => updateFormData('country', e.target.value)}
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none ${
              errors.country ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select your country</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
        {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
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
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
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
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-emerald-600" />
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
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
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
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
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
              errors.parentEmail ? 'border-red-500' : 'border-slate-300'
            }`}
            placeholder="parent@example.com"
          />
        </div>
        {errors.parentEmail && <p className="text-red-500 text-sm mt-1">{errors.parentEmail}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Relationship *
        </label>
        <select
          value={formData.parentInfo?.relationship || ''}
          onChange={(e) => updateParentInfo('relationship', e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors appearance-none ${
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-4 h-4 text-blue-600" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Parent/Guardian Account</h3>
            <p className="text-sm text-blue-700 mt-1">
              Your parent/guardian will receive an email to set up their account and can monitor your progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
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
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
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
                <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
