import { User } from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const API_CLIENT_KEY = import.meta.env.VITE_API_CLIENT_KEY || 'your-client-key';
const API_CLIENT_SECRET = import.meta.env.VITE_API_CLIENT_SECRET || 'your-client-secret';

// Request/Response Types
export interface LoginRequest {
    email: string;
    password: string;
    userType?: 'child' | 'adult';
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userType: 'child' | 'adult';
    telephone?: string;
    country?: string;
    dateOfBirth?: string;
    age?: number;
    timezone?: string;
    parentInfo?: {
        firstName: string;
        lastName: string;
        email: string;
        telephone: string;
        relationship: 'mother' | 'father' | 'guardian';
    };
}

export interface AuthResponse {
    success: boolean;
    message: string;
    data?: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
    error?: string;
}

// Utility function to make API requests
const makeAPIRequest = async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
    data?: any,
    includeAuth: boolean = false
): Promise<any> => {
    const url = `${API_BASE_URL}/api/v1/${endpoint}`;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'client-key': API_CLIENT_KEY,
        'client-secret': API_CLIENT_SECRET,
    };

    // Add authorization header if needed
    if (includeAuth) {
        const token = localStorage.getItem('quran-academy-token');
        if (token) {
            headers['authorization'] = `Bearer ${token}`;
        }
    }

    const config: RequestInit = {
        method,
        headers,
        ...(data && { body: JSON.stringify(data) }),
    };

    try {
        const response = await fetch(url, config);
        const result = await response.json();

        // For auth endpoints, return the result even if not ok
        // This allows us to handle validation errors properly
        if (!response.ok) {
            // For 400 (validation errors), return the result with error details
            if (response.status === 400) {
                return {
                    success: false,
                    message: result.message || 'Validation error',
                    error: result.message || `HTTP error! status: ${response.status}`,
                    status: response.status
                };
            }
            // For other errors, throw as before
            throw new Error(result.message || `HTTP error! status: ${response.status}`);
        }

        return result;
    } catch (error) {
        console.error(`API request failed for ${endpoint}:`, error);
        // If it's a network error or parsing error, wrap it
        if (error instanceof TypeError || (error as Error).name === 'SyntaxError') {
            return {
                success: false,
                message: 'Network error. Please check your connection and try again.',
                error: error instanceof Error ? error.message : 'Unknown network error'
            };
        }
        throw error;
    }
};

class AuthService {
    // Login user
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        try {
            const response = await makeAPIRequest('customers/login', 'POST', credentials);

            // Check if there was a network error or API error
            if (response.success === false) {
                return {
                    success: false,
                    message: response.message || 'Login failed',
                    error: response.error || response.message,
                };
            }

            // Check for successful login response (backend returns { message, data } without status field)
            if (response.data && response.message) {
                // Store tokens and user data
                localStorage.setItem('quran-academy-token', response.data.accessToken);
                localStorage.setItem('quran-academy-refresh-token', response.data.refreshToken);

                // Add default progress data if missing
                const userData = {
                    ...response.data.userData,
                    progress: response.data.userData.progress || {
                        totalHours: 0,
                        completedLessons: 0,
                        currentSurah: 'Al-Fatiha',
                        memorizedVerses: 0,
                        achievements: [],
                        weeklyGoal: 5,
                        weeklyProgress: 0
                    },
                    selectedSessions: response.data.userData.selectedSessions || [],
                    subscription: response.data.userData.subscription || {
                        plan: 'free',
                        status: 'active',
                        startDate: new Date().toISOString(),
                        endDate: null
                    },
                    dateJoined: response.data.userData.dateJoined || new Date().toISOString()
                };

                localStorage.setItem('quran-academy-user', JSON.stringify(userData));

                const successResponse = {
                    success: true,
                    message: response.message || 'Login successful',
                    data: {
                        user: userData,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                    },
                };
                return successResponse;
            } else {
                return {
                    success: false,
                    message: response.message || 'Login failed',
                    error: response.error || response.message,
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Login failed. Please check your credentials and try again.',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // Register user
    async register(userData: RegisterRequest): Promise<AuthResponse> {
        try {
            const response = await makeAPIRequest('customers/register', 'POST', userData);

            // Check if registration was successful
            // The makeAPIRequest returns the JSON response body when the HTTP status is successful (200-299)
            // If we get here, it means the HTTP request was successful
            if (response.data) {
                // Store tokens and user data
                localStorage.setItem('quran-academy-token', response.data.accessToken);
                localStorage.setItem('quran-academy-refresh-token', response.data.refreshToken);
                localStorage.setItem('quran-academy-user', JSON.stringify(response.data.userData));

                return {
                    success: true,
                    message: response.message || 'Registration successful',
                    data: {
                        user: response.data.userData,
                        accessToken: response.data.accessToken,
                        refreshToken: response.data.refreshToken,
                    },
                };
            } else {
                return {
                    success: false,
                    message: response.message || 'Registration failed',
                    error: response.error || response.message,
                };
            }
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Registration failed. Please check your information and try again.',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // Logout user
    logout(): void {
        localStorage.removeItem('quran-academy-token');
        localStorage.removeItem('quran-academy-refresh-token');
        localStorage.removeItem('quran-academy-user');
    }

    // Refresh access token
    async refreshToken(): Promise<AuthResponse> {
        try {
            const refreshToken = localStorage.getItem('quran-academy-refresh-token');

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await makeAPIRequest('auth/refresh-token', 'POST', { refreshToken });

            if (response.success) {
                localStorage.setItem('quran-academy-token', response.data.accessToken);
                localStorage.setItem('quran-academy-refresh-token', response.data.refreshToken);

                return {
                    success: true,
                    message: 'Token refreshed successfully',
                    data: response.data,
                };
            } else {
                // If refresh fails, logout user
                this.logout();
                return {
                    success: false,
                    message: 'Session expired. Please login again.',
                    error: response.error,
                };
            }
        } catch (error) {
            console.error('Token refresh error:', error);
            this.logout();
            return {
                success: false,
                message: 'Session expired. Please login again.',
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    // Get current user from localStorage
    getCurrentUser(): User | null {
        try {
            const userData = localStorage.getItem('quran-academy-user');
            if (!userData) return null;

            const user = JSON.parse(userData);

            // Add default progress data if missing (for backward compatibility)
            if (!user.progress) {
                user.progress = {
                    totalHours: 0,
                    completedLessons: 0,
                    currentSurah: 'Al-Fatiha',
                    memorizedVerses: 0,
                    achievements: [],
                    weeklyGoal: 5,
                    weeklyProgress: 0
                };
            }

            // Add other missing fields
            if (!user.selectedSessions) user.selectedSessions = [];
            if (!user.subscription) {
                user.subscription = {
                    plan: 'free',
                    status: 'active',
                    startDate: new Date().toISOString(),
                    endDate: null
                };
            }
            if (!user.dateJoined) user.dateJoined = new Date().toISOString();

            return user;
        } catch (error) {
            console.error('Error parsing user data:', error);
            return null;
        }
    }

    // Check if user is authenticated
    isAuthenticated(): boolean {
        const token = localStorage.getItem('quran-academy-token');
        const user = this.getCurrentUser();
        return !!(token && user);
    }

    // Get access token
    getAccessToken(): string | null {
        return localStorage.getItem('quran-academy-token');
    }

    // Validate email format
    validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    validatePassword(password: string): { isValid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.push('Password must contain at least one special character');
        }

        return {
            isValid: errors.length === 0,
            errors,
        };
    }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
