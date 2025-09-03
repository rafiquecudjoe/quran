import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { LoginRequest } from '../../services/authService';
import { parseValidationErrors, clearFieldError, FormErrors } from '../../utils/validationUtils';

interface LoginFormProps {
  onBack: () => void;
  onSignupClick: () => void;
  onLoginSuccess?: () => void;
  onToastSuccess?: (title: string, message?: string) => void;
  onToastError?: (title: string, message?: string) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onBack,
  onSignupClick,
  onLoginSuccess,
  onToastSuccess,
  onToastError
}) => {
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    userType: 'adult'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await login(formData);
      
      if (response.success) {
        // Show success toast with exact backend message
        const successMessage = response.message || 'Login successful';
        onToastSuccess?.(successMessage);
        
        // Login successful, call success callback
        onLoginSuccess?.();
      } else {
        // Show error toast with exact backend response
        const errorMessage = response.message || response.error || 'Login Failed';
        onToastError?.(errorMessage);
        
        // Parse validation errors from backend response
        const validationErrors = parseValidationErrors(response.message || response.error || '');
        setErrors(validationErrors);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Show error toast with connection error message
      let errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
      
      // Try to extract meaningful error message from the error object
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      onToastError?.(errorMessage);
      
      // Handle unexpected errors
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    }
  };

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific error when user starts typing
    clearFieldError(errors, field, setErrors);
  };

  // Use rememberMe for future implementation
  React.useEffect(() => {
    if (rememberMe) {
      // Future: implement remember me functionality
      console.log('Remember me is enabled');
    }
  }, [rememberMe]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={onBack}
          className="flex items-center text-slate-600 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to home
        </button>
        
        <Card variant="elevated">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-600">Sign in to continue your Quran learning journey</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{errors.general}</p>
                </div>
              )}
              
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                leftIcon={<Mail className="w-5 h-5 text-slate-400" />}
              />
              
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                error={errors.password}
                leftIcon={<Lock className="w-5 h-5 text-slate-400" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-700 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-slate-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-700 hover:text-blue-800">
                  Forgot password?
                </a>
              </div>
              
              <Button
                type="submit"
                className="w-full"
                loading={isLoading}
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-slate-600">
                Don't have an account?{' '}
                <button
                  onClick={onSignupClick}
                  className="text-blue-700 hover:text-blue-800 font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
