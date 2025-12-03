import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Users,
  Video,
  Star,
  Award,
  Clock,
  Globe,
  CheckCircle,
  Play,
  ArrowRight,
  User,
  Calendar,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onWatchSalatVideos: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onWatchSalatVideos }) => {
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  useEffect(() => {
    const video = document.getElementById('landing-hero-video') as HTMLVideoElement;
    if (video) {
      setIsVideoMuted(video.muted);
    }
  }, []);

  const handleToggleMute = () => {
    const video = document.getElementById('landing-hero-video') as HTMLVideoElement;
    if (video) {
      video.muted = !video.muted;
      setIsVideoMuted(video.muted);
    }
  };

  const features = [
    {
      icon: <Video className="w-6 h-6 text-blue-700" />,
      title: "Live Zoom Sessions",
      description: "Interactive live classes with qualified Quran teachers through Zoom video calls"
    },
    {
      icon: <Users className="w-6 h-6 text-blue-700" />,
      title: "Expert Instructors",
      description: "Learn from certified Quran teachers with years of teaching experience"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-700" />,
      title: "Time Zone Based Sessions",
      description: "Join sessions scheduled for your time zone with students of all skill levels"
    },
    {
      icon: <Award className="w-6 h-6 text-blue-700" />,
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed progress reports and achievements"
    },
    {
      icon: <Globe className="w-6 h-6 text-blue-700" />,
      title: "Global Community",
      description: "Join students from around the world in your Quran learning journey"
    },
    {
      icon: <BookOpen className="w-6 h-6 text-blue-700" />,
      title: "Mixed-Level Sessions",
      description: "Learn alongside students of different levels in time zone-based classes"
    }
  ];

  const testimonials = [
    {
      name: "Aisha Mohammed",
      location: "London, UK",
      rating: 5,
      text: "The live sessions are amazing! My teacher is so patient and knowledgeable. I've learned more in 3 months than I did in years of self-study.",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%234F46E5'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3EA%3C/text%3E%3C/svg%3E"
    },
    {
      name: "Ahmad Hassan",
      location: "Toronto, Canada", 
      rating: 5,
      text: "Perfect for busy parents like me. The flexible scheduling allows me to learn while my kids are at school. Highly recommended!",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%2306B6D4'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3EA%3C/text%3E%3C/svg%3E"
    },
    {
      name: "Fatima Ali",
      location: "Sydney, Australia",
      rating: 5,
      text: "My daughter loves her Quran classes! The teacher makes learning fun and engaging. We can see her progress every week.",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Ccircle cx='24' cy='24' r='24' fill='%2310B981'/%3E%3Ctext x='24' y='30' text-anchor='middle' fill='white' font-size='16' font-family='Arial'%3EF%3C/text%3E%3C/svg%3E"
    }
  ];

  const plans = [
    {
      name: "Free Salat Videos",
      price: "$0",
      period: "/always",
      features: [
        "Complete Salat prayer tutorials",
        "Step-by-step guidance",
        "Multiple camera angles",
        "Arabic pronunciation help",
        "No registration required",
        "Watch anytime, anywhere"
      ],
      popular: false,
      isFree: true
    },
    {
      name: "Quran Learning Premium",
      price: "$29",
      period: "/month", 
      features: [
        "4 live Quran sessions per week",
        "Time zone-based scheduling",
        "Mixed skill level classes",
        "Expert certified instructors",
        "Progress tracking & reports",
        "Interactive Zoom classes",
        "Community access",
        "Mobile app access",
        "Downloadable resources"
      ],
      popular: true,
      isFree: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
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
                onClick={onWatchSalatVideos}
                className="hidden sm:inline-flex text-blue-700 hover:text-blue-800 hover:bg-blue-50 text-sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Salat Videos
              </Button>
              <Button
                variant="ghost"
                onClick={onLogin}
                className="hidden xs:inline-flex text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-sm px-2 sm:px-4"
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
      <section className="relative py-8 sm:py-12 lg:py-16 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-16 items-center">

            {/* Left Column - Text Content */}
            <div className="order-1 lg:order-1 space-y-5 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Join 10,000+ students worldwide
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight">
                  Learn the Holy{' '}
                  <span className="bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                    Quran
                  </span>{' '}
                  Online
                </h1>

                <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed">
                  Join live interactive Quran sessions scheduled for your time zone, where students
                  of all skill levels learn together with certified instructors. <strong>Plus, watch our complete Salat prayer tutorials
                  absolutely free</strong> - no registration required!
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
                <Button
                  size="lg"
                  onClick={onGetStarted}
                  className="w-full sm:max-w-xs px-6 sm:px-8 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"
                >
                  Start Learning Today
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:max-w-xs px-6 sm:px-8 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 text-sm sm:text-base"
                  onClick={onWatchSalatVideos}
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Free Salat Videos
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-4 sm:gap-6 pt-2 sm:pt-4">
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">F</div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-indigo-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">M</div>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-600">10,000+ active students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                  <span className="text-xs sm:text-sm text-slate-600 ml-2">4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Right Column - Video */}
            <div className="order-2 lg:order-2 flex justify-center lg:justify-end items-center w-full">
              <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
                {/* Video Container with decorative elements */}
                <div className="relative z-10">
                  {/* Main video card */}
                  <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl sm:rounded-3xl shadow-2xl p-2 sm:p-3 lg:p-4 border border-slate-200">
                    {/* Video element - 480x800 aspect ratio maintained */}
                    <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-lg bg-slate-900 border-2 border-transparent hover:border-blue-400/50 transition-all duration-500" style={{ aspectRatio: '480/800' }}>
                      {/* Animated glow effect */}
                      <div className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(96, 165, 250, 0.1) 0%, transparent 70%)'
                        }}
                      ></div>

                      <video
                        id="landing-hero-video"
                        className="w-full h-full object-cover"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                      >
                        <source src="/video.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>

                      {/* Video overlay badge */}
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                      </div>

                      {/* Audio Control Button */}
                      <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-10">
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                          <button
                            onClick={handleToggleMute}
                            className={`p-2 sm:p-3 rounded-full shadow-lg transition-all hover:shadow-xl hover:scale-110 backdrop-blur-sm ${
                              isVideoMuted
                                ? 'bg-slate-700/90 hover:bg-slate-800 ring-2 ring-white/30'
                                : 'bg-white/95 hover:bg-white ring-2 ring-blue-400/50'
                            }`}
                            aria-label={isVideoMuted ? 'Unmute video' : 'Mute video'}
                          >
                            {isVideoMuted ? (
                              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            ) : (
                              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                            )}
                          </button>
                          <span className="text-white text-xs font-semibold bg-black/50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded backdrop-blur-sm whitespace-nowrap">
                            {isVideoMuted ? 'Muted' : 'Unmuted'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Video caption */}
                    <div className="mt-2 sm:mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-700 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 text-xs sm:text-sm truncate">Imam Adubofour Ismail</h3>
                          <p className="text-xs text-slate-500">Quran Instructor</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative background elements */}
                <div className="absolute -top-6 -right-6 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-gradient-to-br from-teal-400/20 to-indigo-600/20 rounded-full blur-3xl -z-10"></div>

                {/* Floating accent elements */}
                <div className="absolute top-1/4 -left-4 w-20 h-20 bg-blue-500/10 rounded-lg rotate-12 -z-10"></div>
                <div className="absolute bottom-1/4 -right-4 w-16 h-16 bg-teal-500/10 rounded-lg -rotate-12 -z-10"></div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto">
              Experience the most comprehensive and interactive way to learn the Quran
              from the comfort of your home.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="elevated" className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 sm:p-8 text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Time Zone Sessions Explanation */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Global Learning Community
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Sessions Organized By Time Zone
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-4xl mx-auto mb-8 sm:mb-10 lg:mb-12">
              We schedule our live sessions based on time zones, not skill levels. This means you'll learn
              alongside students from your region who may be beginners, intermediate, or advanced learners.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start lg:items-center">
            <div className="space-y-6 sm:space-y-8">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1 sm:mb-2">
                    Regional Time Zones
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Join sessions scheduled for North America, Europe, Asia, or other regions
                    at times that work best for your local schedule.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1 sm:mb-2">
                    Adaptive Learning Environment
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    Our sessions are designed to accommodate all skill levels. Whether you're
                    just starting or advancing your knowledge, you'll receive personalized
                    attention suited to your learning pace.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-1 sm:mb-2">
                    Convenient Timing
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    No more staying up late or waking up early for sessions. Join classes
                    at reasonable hours in your local time zone.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 text-center">
                Sample Session Schedule
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-50 rounded-lg gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-sm sm:text-base">Session 1</div>
                    <div className="text-xs sm:text-sm text-slate-600">Morning</div>
                  </div>
                  <div className="text-blue-700 font-semibold text-xs sm:text-sm whitespace-nowrap">9:00 - 11:00</div>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-50 rounded-lg gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-sm sm:text-base">Session 2</div>
                    <div className="text-xs sm:text-sm text-slate-600">Afternoon</div>
                  </div>
                  <div className="text-blue-700 font-semibold text-xs sm:text-sm whitespace-nowrap">2:00 - 4:00 PM</div>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-50 rounded-lg gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-sm sm:text-base">Session 3</div>
                    <div className="text-xs sm:text-sm text-slate-600">Evening</div>
                  </div>
                  <div className="text-blue-700 font-semibold text-xs sm:text-sm whitespace-nowrap">7:00 - 9:00 PM</div>
                </div>
                <div className="flex justify-between items-center p-3 sm:p-4 bg-slate-50 rounded-lg gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 text-sm sm:text-base">Session 4</div>
                    <div className="text-xs sm:text-sm text-slate-600">Late Afternoon</div>
                  </div>
                  <div className="text-blue-700 font-semibold text-xs sm:text-sm whitespace-nowrap">4:00 - 6:00 PM</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Salat Videos Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
              Always Free • No Registration Required
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Learn Perfect Salat Prayer 🕌
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl mx-auto mb-6 sm:mb-8">
              Master the proper way to perform your daily prayers with our comprehensive video tutorials.
              Available 24/7 for everyone, completely free.
            </p>
            <Button
              size="lg"
              variant="primary"
              onClick={onWatchSalatVideos}
              className="px-6 sm:px-8 bg-blue-600 hover:bg-blue-700 text-sm sm:text-base w-full sm:w-auto"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Watch Salat Videos Now
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <Card variant="elevated" className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Video className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-4">
                  Complete Prayer Guide
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Step-by-step instructions for all five daily prayers with proper movements and recitations.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Globe className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-4">
                  Multiple Languages
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Arabic pronunciation with English explanations to help you understand every step.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-900 mb-2 sm:mb-4">
                  Watch Anytime
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Access our prayer tutorials 24/7 from any device. Perfect for learning at your own pace.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-br from-blue-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              What Our Students Say
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              Join thousands of satisfied students who have transformed their Quran learning journey
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="elevated" className="hover:shadow-xl transition-all duration-300">
                <CardContent className="p-5 sm:p-6 lg:p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-slate-600 mb-5 sm:mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900 text-sm sm:text-base truncate">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-slate-500 truncate">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">
              Choose Your Learning Plan
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600">
              Free Salat videos for everyone, premium Quran learning with monthly subscription
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                variant={plan.popular ? "elevated" : "default"}
                className={`relative hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
                } ${plan.isFree ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <Badge variant="success" className="px-3 sm:px-4 py-1 text-xs sm:text-sm">Most Popular</Badge>
                  </div>
                )}
                {plan.isFree && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-3 sm:px-4 py-1 bg-blue-600 text-white text-xs sm:text-sm">Always Free</Badge>
                  </div>
                )}
                <CardContent className="p-6 sm:p-8 text-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-6 sm:mb-8">
                    <span className="text-3xl sm:text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-sm sm:text-base text-slate-500">{plan.period}</span>
                  </div>
                  <ul className="space-y-2 sm:space-y-4 mb-6 sm:mb-8 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-700 flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-base text-slate-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "primary" : plan.isFree ? "outline" : "outline"}
                    className="w-full text-sm sm:text-base"
                    onClick={plan.isFree ? onWatchSalatVideos : onGetStarted}
                  >
                    {plan.isFree ? "Watch Free Videos" : "Start Learning"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-r from-blue-700 to-blue-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Begin Your Quran Learning Journey?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto">
            Join our community of dedicated learners and start your transformation today.
            Your first session is just a click away.
          </p>
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="px-6 sm:px-8 text-sm sm:text-base w-full sm:w-auto"
              onClick={onGetStarted}
            >
              Start Watching free videos
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-6 sm:px-8 border-white text-white hover:bg-white hover:text-blue-700 text-sm sm:text-base w-full sm:w-auto"
              onClick={onGetStarted}
            >
              Join the academy
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="sm:col-span-2 lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold">Ismail Academy</h3>
              </div>
              <p className="text-slate-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                Empowering Muslims worldwide to learn and connect with the Holy Quran through
                innovative online education and expert instruction.
              </p>
              <div className="flex space-x-4">
                {/* Social media icons would go here */}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Our Instructors</a></li>
                <li><a href="#" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Curriculum</a></li>
                <li><a href="#" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Success Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-6 sm:pt-8 text-center">
            <p className="text-slate-400 text-xs sm:text-sm">
              © 2024 Ismail Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
