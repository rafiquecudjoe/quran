import { Recommendation } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface CreateRecommendationRequest {
    title: string;
    description: string;
    category: 'feature' | 'content' | 'instructor' | 'technical' | 'general';
    priority: 'low' | 'medium' | 'high';
}

export class RecommendationService {
    static async createRecommendation(recommendation: CreateRecommendationRequest): Promise<Recommendation> {
        try {
            const response = await fetch(`${API_BASE_URL}/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(recommendation)
            });

            if (!response.ok) {
                throw new Error('Failed to submit recommendation');
            }

            const data = await response.json();
            return data.data || data;
        } catch (error) {
            console.error('Error creating recommendation:', error);
            throw error;
        }
    }

    static async getUserRecommendations(): Promise<Recommendation[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/recommendations/my`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }

            const data = await response.json();
            return data.data || data;
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            throw error;
        }
    }
}
