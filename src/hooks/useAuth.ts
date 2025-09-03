import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { authService, LoginRequest, RegisterRequest, AuthResponse } from '../services/authService';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue] as const;
};

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(authService.getCurrentUser());
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check authentication status on mount
        const currentUser = authService.getCurrentUser();
        const authenticated = authService.isAuthenticated();

        setUser(currentUser);
        setIsAuthenticated(authenticated);
    }, []);

    // Login function
    const login = useCallback(async (credentials: LoginRequest): Promise<AuthResponse> => {
        setIsLoading(true);

        try {
            const response = await authService.login(credentials);

            if (response.success && response.data) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            return {
                success: false,
                message: errorMessage,
                error: errorMessage,
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Register function
    const register = useCallback(async (userData: RegisterRequest): Promise<AuthResponse> => {
        setIsLoading(true);

        try {
            const response = await authService.register(userData);

            if (response.success && response.data) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            }

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Registration failed';
            return {
                success: false,
                message: errorMessage,
                error: errorMessage,
            };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Logout function
    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    // Refresh token function
    const refreshToken = useCallback(async (): Promise<boolean> => {
        try {
            const response = await authService.refreshToken();

            if (response.success) {
                return true;
            } else {
                // Token refresh failed, logout user
                logout();
                return false;
            }
        } catch (error) {
            logout();
            return false;
        }
    }, [logout]);

    // Update user data
    const updateUser = useCallback((updatedUser: User) => {
        setUser(updatedUser);
        localStorage.setItem('quran-academy-user', JSON.stringify(updatedUser));
    }, []);

    return {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshToken,
        updateUser
    };
};
