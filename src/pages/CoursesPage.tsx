import React from 'react';
import {
  BookOpen,
  Clock,
  Users,
  Award,
  Star,
  ArrowRight,
  CheckCircle,
  User,
  Calendar,
  Globe,
  Mic,
  BookMarked,
  GraduationCap,
  Play
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface CoursesPageProps {
  onBack: () => void;
  onGetStarted: () => void;
  onLogin: () => void;
  onWatchSalatVideos: () => void;
  onContactUs: () => void;
}

const courses = [
  {
    id: 'beginners',
    title: "Beginner's Lesson",
    subtitle: "Foundation Course for All Ages",
    icon: <BookOpen className="w-8 h-8 text-blue-600" />,
    description: "The Ismail Academy Beginner's Lesson is the foundational course designed for kids and adults (male and females). This course starts from learning basic Arabic alphabets, joining of letters, introduction of Arabic vowels etc. It is recommended for those who do not know anything at all in Arabic and would like to read the Arabic language and the Holy Quran.",
    featured: true,
    color: "blue",
    structure: {
      classType: "One-on-One",
      duration: "15 to 20 minutes a day (Monday to Thursday)",
      ageLevel: "At least 5 Years",
      requirements: "None",
      courseLevel: "Beginner",
      period: "4 to 5 months",
      tutor: "Online Private Tutor",
      language: "English"
    }
  },
  {
    id: 'tajweed',
    title: "Tajweed Mastery",
    subtitle: "Perfect Your Quran Pronunciation",
    icon: <Mic className="w-8 h-8 text-emerald-600" />,
    description: "Master the art of Tajweed - the science of Quran recitation. Learn proper pronunciation rules, articulation points (Makharij), and characteristics of letters (Sifaat). This course ensures you recite the Quran exactly as it was revealed to Prophet Muhammad ﷺ.",
    featured: false,
    color: "emerald",
    structure: {
      classType: "One-on-One",
      duration: "30 minutes a day (Monday to Thursday)",
      ageLevel: "10 Years and above",
      requirements: "Ability to read Arabic",
      courseLevel: "Intermediate",
      period: "6 to 8 months",
      tutor: "Online Private Tutor",
      language: "English"
    }
  },
  {
    id: 'hifz',
    title: "Quran Memorization (Hifz)",
    subtitle: "Memorize the Holy Quran",
    icon: <BookMarked className="w-8 h-8 text-purple-600" />,
    description: "Embark on the blessed journey of becoming a Hafiz/Hafiza. Our structured Hifz program includes daily memorization, revision techniques, and regular assessments. Students receive personalized attention to ensure accurate memorization with proper Tajweed.",
    featured: false,
    color: "purple",
    structure: {
      classType: "One-on-One",
      duration: "45 to 60 minutes a day (Monday to Thursday)",
      ageLevel: "7 Years and above",
      requirements: "Basic Quran reading ability",
      courseLevel: "All Levels",
      period: "2 to 4 years (depending on pace)",
      tutor: "Online Private Tutor",
      language: "English/Arabic"
    }
  },
  {
    id: 'recitation',
    title: "Beautiful Recitation",
    subtitle: "Qira'at & Melodious Recitation",
    icon: <GraduationCap className="w-8 h-8 text-amber-600" />,
    description: "Learn the art of beautiful Quran recitation. This course covers various recitation styles, proper breathing techniques, and melodious tones while maintaining correct Tajweed. Perfect for those who want to lead prayers or recite in gatherings.",
    featured: false,
    color: "amber",
    structure: {
      classType: "One-on-One",
      duration: "30 minutes a day (Monday to Thursday)",
      ageLevel: "12 Years and above",
      requirements: "Tajweed knowledge recommended",
      courseLevel: "Advanced",
      period: "6 to 12 months",
      tutor: "Online Private Tutor",
      language: "English/Arabic"
    }
  }
];

const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; bgLight: string; text: string; border: string }> = {
    blue: { bg: 'bg-blue-600', bgLight: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    emerald: { bg: 'bg-emerald-600', bgLight: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    purple: { bg: 'bg-purple-600', bgLight: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    amber: { bg: 'bg-amber-600', bgLight: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  };
  return colors[color] || colors.blue;
};

export const CoursesPage: React.FC<CoursesPageProps> = ({ onBack, onGetStarted, onLogin, onWatchSalatVideos, onContactUs }) => {
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
                className="hidden md:inline-flex text-blue-700 bg-blue-50 text-sm font-semibold border-b-2 border-blue-700"
              >
                Courses
              </Button>
              <Button
                variant="ghost"
                onClick={onContactUs}
                className="hidden md:inline-flex text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm"
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
          <div className="inline-flex items-center px-4 py-2 bg-white/20 text-white rounded-full text-sm font-medium mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Comprehensive Quran Education
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Transform Your Quran Journey
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
            From beginners to advanced learners, we have the perfect course for you.
            Learn at your own pace with personalized one-on-one instruction.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {courses.map((course) => {
              const colors = getColorClasses(course.color);
              return (
                <Card
                  key={course.id}
                  variant="elevated"
                  className={`relative overflow-hidden hover:shadow-2xl transition-all duration-300 ${
                    course.featured ? 'ring-2 ring-blue-500 lg:col-span-2' : ''
                  }`}
                >
                  {course.featured && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="success" className="px-3 py-1">
                        <Star className="w-3 h-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 sm:p-8">
                    <div className={`${course.featured ? 'lg:grid lg:grid-cols-2 lg:gap-8' : ''}`}>
                      {/* Course Info */}
                      <div>
                        <div className={`w-16 h-16 ${colors.bgLight} rounded-2xl flex items-center justify-center mb-4`}>
                          {course.icon}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">
                          {course.title}
                        </h3>
                        <p className={`${colors.text} font-medium mb-4`}>
                          {course.subtitle}
                        </p>
                        <p className="text-slate-600 leading-relaxed mb-6">
                          {course.description}
                        </p>
                      </div>

                      {/* Course Structure */}
                      <div className={`${colors.bgLight} rounded-xl p-4 sm:p-6 ${course.featured ? '' : 'mt-4'}`}>
                        <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-slate-600" />
                          Course Structure
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs text-slate-500 block">Class Type</span>
                              <span className="text-sm font-medium text-slate-900">{course.structure.classType}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs text-slate-500 block">Duration</span>
                              <span className="text-sm font-medium text-slate-900">{course.structure.duration}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Users className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs text-slate-500 block">Age Level</span>
                              <span className="text-sm font-medium text-slate-900">{course.structure.ageLevel}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Award className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs text-slate-500 block">Course Level</span>
                              <span className="text-sm font-medium text-slate-900">{course.structure.courseLevel}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs text-slate-500 block">Course Period</span>
                              <span className="text-sm font-medium text-slate-900">{course.structure.period}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <Globe className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs text-slate-500 block">Language</span>
                              <span className="text-sm font-medium text-slate-900">{course.structure.language}</span>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 sm:col-span-2">
                            <CheckCircle className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <span className="text-xs text-slate-500 block">Requirements</span>
                              <span className="text-sm font-medium text-slate-900">{course.structure.requirements}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          onClick={onGetStarted}
                          className={`w-full mt-6 ${colors.bg} hover:opacity-90 text-white`}
                        >
                          Enroll in {course.title}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-700 to-blue-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Not Sure Which Course to Start With?
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Book a free consultation with our team. We'll help you choose the perfect course
            based on your current level and goals.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={onGetStarted}
            className="px-8"
          >
            Get Free Consultation
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
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
