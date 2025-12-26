import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Send,
  MessageCircle,
  Clock,
  CheckCircle,
  Play,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface ContactPageProps {
  onBack: () => void;
  onGetStarted: () => void;
  onLogin: () => void;
  onWatchSalatVideos: () => void;
  onViewCourses: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onBack, onGetStarted, onLogin, onWatchSalatVideos, onViewCourses }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
        }, 5000);
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Contact form error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      title: "Email Us",
      detail: "info@ismailacademy.com",
      subDetail: "We reply within 24 hours"
    },
    {
      icon: <Phone className="w-6 h-6 text-blue-600" />,
      title: "Call Us",
      detail: "+233537955256",
      subDetail: "Mon-Fri, 9am-6pm GMT"
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-blue-600" />,
      title: "WhatsApp",
      detail: "+233537955256",
      subDetail: "Quick responses"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-600" />,
      title: "Office Hours",
      detail: "Monday - Friday",
      subDetail: "9:00 AM - 6:00 PM EST"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0 cursor-pointer" onClick={onBack}>
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center shadow-lg bg-white border border-slate-100 flex-shrink-0">
                <img
                  src="/logos/ismail-academy-logo.jpeg"
                  alt="Ismail Academy"
                  className="w-12 h-12 sm:w-18 sm:h-18 object-contain rounded-xl"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
                  Ismail Academy
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Learn Quran Online</p>
              </div>
              <div className="block sm:hidden">
                <h1 className="text-sm font-bold bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
                  Ismail Academy
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <Button
                variant="ghost"
                onClick={onViewCourses}
                className="hidden md:inline-flex text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm"
              >
                Courses
              </Button>
              <Button
                variant="ghost"
                className="hidden md:inline-flex text-blue-700 bg-blue-50 text-sm font-semibold border-b-2 border-blue-700"
              >
                Contact
              </Button>
              <Button
                variant="ghost"
                onClick={onWatchSalatVideos}
                className="hidden lg:inline-flex text-blue-700 hover:text-blue-800 hover:bg-blue-50 text-sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Salat Videos
              </Button>
              <Button
                variant="ghost"
                onClick={onLogin}
                className="hidden sm:inline-flex text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm px-2 sm:px-4"
              >
                Sign In
              </Button>
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-md text-xs sm:text-sm px-3 sm:px-6 py-2 sm:py-3"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-10 sm:py-16 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Get in Touch
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            Have questions about our courses? Want to enroll your family?
            We're here to help you start your Quran learning journey.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card variant="elevated" className="overflow-hidden">
                <CardContent className="p-6 sm:p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Send Us a Message
                  </h2>
                  
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-slate-600">
                        We'll get back to you within 24 hours. Jazakallahu Khair!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                          <AlertCircle className="w-5 h-5 flex-shrink-0" />
                          <p className="text-sm">{error}</p>
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="Your full name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div>
                          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                            Subject *
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="">Select a subject</option>
                            <option value="enrollment">Course Enrollment</option>
                            <option value="pricing">Pricing & Payment</option>
                            <option value="schedule">Class Schedule</option>
                            <option value="technical">Technical Support</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={5}
                          className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                          placeholder="Tell us how we can help you..."
                        />
                      </div>

                      <Button
                        type="submit"
                        size="lg"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index} variant="elevated" className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{info.title}</h3>
                        <p className="text-blue-600 font-medium">{info.detail}</p>
                        <p className="text-sm text-slate-500">{info.subDetail}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                q: "How do I enroll in a course?",
                a: "Click the 'Get Started' button on our homepage, create an account, and select your preferred course. You'll receive login credentials and class schedule via email."
              },
              {
                q: "What equipment do I need?",
                a: "You'll need a computer, tablet, or smartphone with a stable internet connection, a webcam, and a microphone. We use Zoom for our live classes."
              },
              {
                q: "Can I reschedule my classes?",
                a: "Yes! You can reschedule classes up to 24 hours before the scheduled time. Simply contact your instructor or use our student portal."
              },
              {
                q: "Do you offer family discounts?",
                a: "Yes, we offer special rates for families enrolling multiple children. Contact us for more details about our family packages."
              }
            ].map((faq, index) => (
              <Card key={index} variant="default" className="border border-slate-200">
                <CardContent className="p-5">
                  <h3 className="font-semibold text-slate-900 mb-2">{faq.q}</h3>
                  <p className="text-slate-600 text-sm">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <p className="text-slate-400 text-sm">
            © 2024 Ismail Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
