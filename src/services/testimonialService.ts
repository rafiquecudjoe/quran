import { Testimonial } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export class TestimonialService {
    /**
     * Submit a new testimonial
     */
    static async submitTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt' | 'approved' | 'featured'>): Promise<Testimonial> {
        try {
            const response = await fetch(`${API_BASE_URL}/testimonials`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(testimonial),
            });

            if (!response.ok) {
                throw new Error('Failed to submit testimonial');
            }

            return await response.json();
        } catch (error) {
            console.error('Error submitting testimonial:', error);
            throw error;
        }
    }

    /**
     * Get testimonials for a user
     */
    static async getUserTestimonials(userId: string): Promise<Testimonial[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/testimonials/user/${userId}`);

            if (!response.ok) {
                throw new Error('Failed to fetch testimonials');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user testimonials:', error);
            throw error;
        }
    }

    /**
     * Get approved testimonials for public display
     */
    static async getApprovedTestimonials(): Promise<Testimonial[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/testimonials/approved`);

            if (!response.ok) {
                throw new Error('Failed to fetch approved testimonials');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching approved testimonials:', error);
            throw error;
        }
    }

    /**
     * Get featured testimonials for homepage
     */
    static async getFeaturedTestimonials(): Promise<Testimonial[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/testimonials/featured`);

            if (!response.ok) {
                throw new Error('Failed to fetch featured testimonials');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching featured testimonials:', error);
            throw error;
        }
    }
}
