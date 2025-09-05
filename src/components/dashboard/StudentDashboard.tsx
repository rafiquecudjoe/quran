import React, { useState } from 'react';
import { useToast } from '../../hooks/useToast';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Award, 
  Video,
  Bell,
  LogOut,
  TrendingUp,
  Target,
  Play,
  CheckCircle,
  User,
  Globe,
  Settings,
  Edit3,
  Camera,
  Save,
  Shield,
  Moon,
  Sun,
  Mail,
  Phone,
  Star,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PaymentModal } from '../ui/PaymentModal';
import { RecitationTracker } from '../ui/RecitationTracker';
import { TestimonialModal } from '../ui/TestimonialModal';
import { SessionDetailsModal } from '../ui/SessionDetailsModal';

// Helper functions for session status and button props
const getMeetingStatusInfo = (session: any) => {
  const now = new Date();
  const today = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const sessionDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(session.schedule.day);
  const sessionStartTime = parseInt(session.schedule.startTime.split(':')[0]) * 60 + parseInt(session.schedule.startTime.split(':')[1]);
  const sessionEndTime = parseInt(session.schedule.endTime.split(':')[0]) * 60 + parseInt(session.schedule.endTime.split(':')[1]);
  
  if (today === sessionDay && currentTime >= sessionStartTime && currentTime <= sessionEndTime) {
    return { status: 'live', message: 'Session is currently live' };
  }
  
  return { status: 'scheduled', message: 'Session scheduled' };
};

const getJoinButtonProps = (session: any) => {
  const statusInfo = getMeetingStatusInfo(session);
  
  if (statusInfo.status === 'live') {
    return {
      text: 'Join Now',
      variant: 'primary' as const,
      disabled: false,
      icon: <Video className="w-3 h-3" />
    };
  }
  
  return {
    text: 'View Details',
    variant: 'outline' as const,
    disabled: false,
    icon: <Calendar className="w-3 h-3" />
  };
};
import { TestimonialService } from '../../services/testimonialService';
import { Session, User as UserType, Notification, Payment, RecitationEntry, Testimonial } from '../../types';

interface StudentDashboardProps {
  user: UserType;
  availableSessions: Session[];
  upcomingSessions: Session[];
  notifications: Notification[];
  recitationEntries: RecitationEntry[];
  onJoinSession: (sessionId: string) => void;
  onPaymentComplete: (payment: Payment) => void;
  onAddRecitation: (entry: Omit<RecitationEntry, 'id' | 'userId' | 'createdAt'>) => void;
  onLogout: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  availableSessions,
  upcomingSessions,
  notifications,
  recitationEntries,
  onJoinSession,
  onPaymentComplete,
  onAddRecitation,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'progress' | 'schedule' | 'recitation' | 'profile'>('overview');
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; session: Session | null }>({
    isOpen: false,
    session: null
  });
  
  const [testimonialModal, setTestimonialModal] = useState(false);
  const [sessionDetailsModal, setSessionDetailsModal] = useState<{ isOpen: boolean; session: Session | null }>({
    isOpen: false,
    session: null
  });
  const { success, error } = useToast();
  
  // Profile editing states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    telephone: user.telephone || '',
    country: user.country || '',
    timezone: user.timezone || 'UTC',
    weeklyGoal: user.progress.weeklyGoal || 5
  });
  
  const progressPercentage = user.progress.weeklyGoal > 0 
    ? Math.round((user.progress.weeklyProgress / user.progress.weeklyGoal) * 100)
    : 0;

  // Handle testimonial submission
  const handleTestimonialSubmit = async (testimonialData: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt' | 'approved' | 'featured'>) => {
    try {
      await TestimonialService.submitTestimonial(testimonialData);
      success('Thank you for your testimonial! It will be reviewed and may be featured on our website.');
      setTestimonialModal(false);
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      error('Failed to submit testimonial. Please try again.');
    }
  };
  
  const handleEnrollClick = (session: Session) => {
    setPaymentModal({ isOpen: true, session });
  };

  const handlePaymentComplete = (payment: Payment) => {
    onPaymentComplete(payment);
    setPaymentModal({ isOpen: false, session: null });
  };
  
  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const TabButton: React.FC<{ 
    tab: string; 
    label: string; 
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
  }> = ({ label, icon, isActive, onClick }) => (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg transform scale-105' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-white/80 hover:shadow-md hover:scale-105'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Modern Header with Glass Effect */}
      <header className="backdrop-blur-md bg-white/70 border-b border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Ismail Academy
                </h1>
                <p className="text-sm text-slate-500">Quran Learning Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Notifications with Modern Design */}
              <div className="relative">
                <button className="p-3 bg-gradient-to-r from-indigo-100 to-blue-100 rounded-xl hover:from-indigo-200 hover:to-blue-200 transition-all duration-200 group">
                  <Bell className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-medium shadow-lg animate-pulse">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              </div>
              
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-white/60 to-blue-50/60 rounded-xl px-4 py-2 backdrop-blur-sm border border-white/30">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-slate-500 capitalize">{user.userType} Student</p>
                </div>
              </div>
              
              {/* Logout with Modern Style */}
              <button 
                onClick={onLogout}
                className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-xl hover:from-red-200 hover:to-pink-200 transition-all duration-200 group"
                title="Logout"
              >
                <LogOut className="w-6 h-6 text-red-600 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Enhanced Welcome Section - Made More Compact */}
        <div className="mb-4 relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-4 shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">
                  Welcome back, {user.firstName}! 🌟
                </h2>
                <p className="text-blue-100 text-sm mb-2">
                  Continue your Quran learning journey. You have {upcomingSessions.length} upcoming sessions.
                </p>
                <div className="flex items-center space-x-4 text-blue-100 text-sm">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Goal: {user.progress.weeklyGoal}h</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="w-4 h-4" />
                    <span>{user.progress.achievements.length} Achievements</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-4 p-2 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg border border-white/30">
          <TabButton
            tab="overview"
            label="Overview"
            icon={<TrendingUp className="w-5 h-5" />}
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            tab="sessions"
            label="Sessions"
            icon={<Video className="w-5 h-5" />}
            isActive={activeTab === 'sessions'}
            onClick={() => setActiveTab('sessions')}
          />
          <TabButton
            tab="progress"
            label="Progress"
            icon={<Award className="w-5 h-5" />}
            isActive={activeTab === 'progress'}
            onClick={() => setActiveTab('progress')}
          />
          <TabButton
            tab="schedule"
            label="Schedule"
            icon={<Calendar className="w-5 h-5" />}
            isActive={activeTab === 'schedule'}
            onClick={() => setActiveTab('schedule')}
          />
          <TabButton
            tab="recitation"
            label="Daily Recitation"
            icon={<BookOpen className="w-5 h-5" />}
            isActive={activeTab === 'recitation'}
            onClick={() => setActiveTab('recitation')}
          />
          <TabButton
            tab="profile"
            label="Profile"
            icon={<Settings className="w-5 h-5" />}
            isActive={activeTab === 'profile'}
            onClick={() => setActiveTab('profile')}
          />
        </div>

        {/* Enhanced Overview Tab - Well-Spaced Design for Single Screen */}
        {activeTab === 'overview' && (
          <div className="space-y-8 py-6">
            {/* Four Column Grid with Better Spacing */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Column 1: Quick Stats (Better Spacing) */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg p-4 text-white shadow-lg">
                    <Target className="w-7 h-7 text-white/80 mb-2" />
                    <span className="text-2xl font-bold block">{progressPercentage}%</span>
                    <p className="text-white/90 text-sm">Goal</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg p-4 text-white shadow-lg">
                    <Clock className="w-7 h-7 text-white/80 mb-2" />
                    <span className="text-2xl font-bold block">{user.progress.totalHours}</span>
                    <p className="text-white/90 text-sm">Hours</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg p-4 text-white shadow-lg">
                    <CheckCircle className="w-7 h-7 text-white/80 mb-2" />
                    <span className="text-2xl font-bold block">{user.progress.completedLessons}</span>
                    <p className="text-white/90 text-sm">Lessons</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg p-4 text-white shadow-lg">
                    <Award className="w-7 h-7 text-white/80 mb-2" />
                    <span className="text-2xl font-bold block">{user.progress.achievements.length}</span>
                    <p className="text-white/90 text-sm">Awards</p>
                  </div>
                </div>

                {/* Learning Progress with Better Spacing */}
                <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">Current: {user.progress.currentSurah}</h3>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="bg-green-200 rounded-full h-2 w-32">
                            <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full w-3/4"></div>
                          </div>
                          <span className="text-sm text-green-700 font-bold">75%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                        <Play className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-800">Continue</span>
                      </button>
                      <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-slate-800">Schedule</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Column 2: Announcements with More Space */}
              <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/30">
                <div className="flex items-center space-x-3 mb-4">
                  <Bell className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-800 text-lg">Updates</h3>
                </div>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r">
                    <p className="text-sm font-medium text-red-800">Class Cancelled</p>
                    <p className="text-sm text-red-600">Tomorrow → Friday</p>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r">
                    <p className="text-sm font-medium text-blue-800">New Feature</p>
                    <p className="text-sm text-blue-600">Voice recording available</p>
                  </div>
                </div>
              </div>

              {/* Column 3: Testimonial - More Spacious */}
              <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/30">
                <div className="text-center">
                  <MessageSquare className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-lg mb-3">Share Experience</h3>
                  <button
                    onClick={() => setTestimonialModal(true)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 font-medium text-sm flex items-center justify-center space-x-2"
                  >
                    <Star className="w-4 h-4" />
                    <span>Write Review</span>
                  </button>
                </div>
              </div>
            </div>

            {/* More Spaced Upcoming Sessions */}
            <div className="bg-white/70 backdrop-blur-md rounded-lg shadow-lg p-6 border border-white/30 mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Next Sessions</h2>
                <Badge variant="info">{upcomingSessions.length} upcoming</Badge>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingSessions.slice(0, 2).map((session) => {
                  const statusInfo = getMeetingStatusInfo(session);
                  const buttonProps = getJoinButtonProps(session);
                  
                  return (
                    <div key={session.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">{session.title}</h3>
                            <Badge 
                              variant={statusInfo.status === 'live' ? 'success' : 'warning'}
                              className="text-sm"
                            >
                              {statusInfo.status === 'live' ? 'LIVE' : session.schedule.day}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 mb-4">
                            {session.schedule.startTime} - {session.schedule.endTime}
                          </p>
                          <Button 
                            size="sm" 
                            onClick={() => onJoinSession(session.id)}
                            disabled={buttonProps.disabled}
                            variant={buttonProps.variant}
                            className="text-sm px-4 py-2"
                          >
                            {buttonProps.icon}
                            <span className="ml-2">{buttonProps.text}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {upcomingSessions.length > 2 && (
                <div className="text-center mt-6">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium py-2">
                    View all {upcomingSessions.length} sessions →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Sessions</h3>
              <p className="text-sm text-slate-600 mt-1">Join sessions with students of all skill levels</p>
            </div>

            {/* Info Card */}
            <Card variant="elevated" className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Globe className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">How Our Sessions Work</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      Each session welcomes students of all skill levels - from beginners just starting their Quran 
                      journey to advanced learners perfecting their recitation. You'll learn alongside peers while 
                      benefiting from diverse perspectives and skill levels in the same virtual classroom.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSessions.slice(0, 4).map((session) => (
                <Card key={session.id} variant="elevated" className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <Badge variant={session.levelRange === 'mixed' ? 'success' : session.levelRange === 'beginner-focus' ? 'warning' : 'danger'}>
                          {session.levelRange === 'mixed' ? 'Mixed Levels' : session.levelRange === 'beginner-focus' ? 'Beginner Focus' : 'Advanced Focus'}
                        </Badge>
                        {user.selectedSessions?.includes(session.id) && (
                          <Badge variant="success" className="bg-green-100 text-green-800">
                            Enrolled
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-slate-900 mb-2">{session.title}</h4>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{session.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        {session.schedule.day}
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {formatTime(session.schedule.startTime)} - {formatTime(session.schedule.endTime)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-700" />
                        </div>
                        <span className="text-sm text-slate-600">{session.instructor.name}</span>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => handleEnrollClick(session)}
                        disabled={
                          session.enrolledStudents >= session.maxStudents || 
                          user.selectedSessions?.includes(session.id) ||
                          (user.selectedSessions && user.selectedSessions.length >= 1 && !user.selectedSessions.includes(session.id))
                        }
                        variant={user.selectedSessions?.includes(session.id) ? "secondary" : "primary"}
                        className={!user.selectedSessions?.includes(session.id) && user.selectedSessions && user.selectedSessions.length >= 1 ? "opacity-50 cursor-not-allowed" : ""}
                      >
                        {user.selectedSessions?.includes(session.id) 
                          ? 'Enrolled' 
                          : session.enrolledStudents >= session.maxStudents 
                            ? 'Full' 
                            : user.selectedSessions && user.selectedSessions.length >= 1 
                              ? 'Cannot Enroll'
                              : 'Enroll'
                        }
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="elevated">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Learning Progress</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600">Weekly Goal Progress</span>
                        <span className="text-sm font-medium text-slate-900">
                          {user.progress.weeklyProgress}/{user.progress.weeklyGoal} hours
                        </span>
                      </div>
                      <div className="bg-slate-200 rounded-full h-3">
                        <div 
                          className="bg-blue-500 h-3 rounded-full" 
                          style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{user.progress.totalHours}</p>
                          <p className="text-sm text-slate-500">Total Hours</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-slate-900">{user.progress.completedLessons}</p>
                          <p className="text-sm text-slate-500">Lessons Completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <h3 className="text-lg font-semibold text-slate-900">Current Studies</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Current Surah</p>
                      <p className="text-lg font-semibold text-slate-900">{user.progress.currentSurah}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Verses Memorized</p>
                      <p className="text-lg font-semibold text-slate-900">{user.progress.memorizedVerses}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Learning Level</p>
                      <Badge variant="success">Mixed Levels</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900">All Achievements</h3>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.progress.achievements.map((achievement) => (
                    <div key={achievement.id} className="p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-medium text-slate-900">{achievement.title}</h4>
                          <p className="text-sm text-slate-500">{achievement.description}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">{new Date(achievement.dateEarned).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-6">
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900">My Schedule</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.selectedSessions.length > 0 ? (
                    user.selectedSessions.map((sessionId) => {
                      const session = [...availableSessions, ...upcomingSessions].find(s => s.id === sessionId);
                      if (!session) return null;
                      
                      return (
                        <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Video className="w-6 h-6 text-blue-700" />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-900">{session.title}</h4>
                              <p className="text-sm text-slate-500">
                                {session.schedule.day} at {formatTime(session.schedule.startTime)} - {formatTime(session.schedule.endTime)}
                              </p>
                              <p className="text-sm text-slate-500">Instructor: {session.instructor.name}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            {session.zoomMeeting && (
                              <Button size="sm" onClick={() => onJoinSession(session.id)}>
                                <Play className="w-4 h-4 mr-2" />
                                Join
                              </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={() => 
                              setSessionDetailsModal({ isOpen: true, session })
                            }>
                              View Details
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-slate-500 text-center py-8">No sessions enrolled</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Daily Recitation Tab */}
        {activeTab === 'recitation' && (
          <RecitationTracker
            entries={recitationEntries}
            onAddEntry={onAddRecitation}
          />
        )}

        {/* Profile Tab - Compact Single Screen Design */}
        {activeTab === 'profile' && (
          <div className="space-y-6 py-4">
            {/* Compact Profile Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-xl p-6 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-3 h-3 text-indigo-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-1">{user.firstName} {user.lastName}</h2>
                  <p className="text-blue-100 text-sm mb-2">{user.email}</p>
                  <div className="flex items-center space-x-3">
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      {user.userType === 'adult' ? 'Adult Student' : 'Young Student'}
                    </Badge>
                    <div className="flex items-center space-x-1 text-blue-100 text-xs">
                      <Star className="w-3 h-3" />
                      <span>Beginner</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all backdrop-blur-sm flex items-center space-x-2 text-sm"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit'}</span>
                </button>
              </div>
            </div>

            {/* Three Column Compact Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Personal Information - Compact */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-5 border border-white/30">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-slate-800">Personal Info</h3>
                  {!isEditingProfile && (
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1 text-sm"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">First Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          className="w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-800 text-sm">{user.firstName}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Last Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          className="w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
                          <User className="w-3 h-3 text-slate-400" />
                          <span className="text-slate-800 text-sm">{user.lastName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Email</label>
                    {isEditingProfile ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-800 text-sm">{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Phone</label>
                    {isEditingProfile ? (
                      <input
                        type="tel"
                        value={profileData.telephone}
                        onChange={(e) => setProfileData({...profileData, telephone: e.target.value})}
                        className="w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                        placeholder="Phone number"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 bg-slate-50 rounded-lg">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-800 text-sm">{user.telephone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {isEditingProfile && (
                    <div className="flex space-x-2 pt-2">
                      <button 
                        onClick={() => {
                          setIsEditingProfile(false);
                        }}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-3 py-2 rounded-lg hover:from-indigo-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-1 text-sm"
                      >
                        <Save className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                      <button 
                        onClick={() => setIsEditingProfile(false)}
                        className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Preferences - Compact */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-5 border border-white/30">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Learning Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Weekly Goal</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={profileData.weeklyGoal}
                        onChange={(e) => setProfileData({...profileData, weeklyGoal: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="text-lg font-bold text-indigo-600 min-w-[2.5rem]">{profileData.weeklyGoal}h</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Timezone</label>
                    <select 
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                      className="w-full px-3 py-2 bg-white/80 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="Europe/London">London Time</option>
                      <option value="Asia/Dubai">Dubai Time</option>
                    </select>
                  </div>

                  {/* Compact Theme Selection */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Theme</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button className="p-2 border border-indigo-200 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-indigo-300 transition-all">
                        <div className="flex items-center space-x-2">
                          <Sun className="w-4 h-4 text-indigo-600" />
                          <span className="font-medium text-slate-800 text-xs">Light</span>
                        </div>
                      </button>
                      <button className="p-2 border border-slate-300 rounded-lg bg-slate-50 hover:border-slate-400 transition-all">
                        <div className="flex items-center space-x-2">
                          <Moon className="w-4 h-4 text-slate-600" />
                          <span className="font-medium text-slate-700 text-xs">Dark</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Compact Notifications */}
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Notifications</label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-3 h-3 text-slate-600" />
                          <span className="font-medium text-slate-800 text-xs">Reminders</span>
                        </div>
                        <button className="w-8 h-4 bg-indigo-500 rounded-full relative">
                          <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Award className="w-3 h-3 text-slate-600" />
                          <span className="font-medium text-slate-800 text-xs">Achievements</span>
                        </div>
                        <button className="w-8 h-4 bg-indigo-500 rounded-full relative">
                          <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Security - Compact */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-5 border border-white/30">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Security</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-slate-800 text-sm">Change Password</h4>
                        <p className="text-slate-600 text-xs">Update password</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-slate-800 text-sm">Two-Factor Auth</h4>
                        <p className="text-slate-600 text-xs">Extra security</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-all border border-purple-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-semibold text-slate-800 text-sm">Privacy Settings</h4>
                        <p className="text-slate-600 text-xs">Manage privacy</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>

                  {/* Account Stats */}
                  <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-800 text-sm mb-2">Account Stats</h4>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div>
                        <p className="text-lg font-bold text-slate-900">{user.progress.totalHours}</p>
                        <p className="text-xs text-slate-500">Hours</p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-slate-900">{user.progress.achievements.length}</p>
                        <p className="text-xs text-slate-500">Achievements</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        session={paymentModal.session!}
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, session: null })}
        onPaymentComplete={handlePaymentComplete}
      />
      
      {/* Session Details Modal */}
      {sessionDetailsModal.session && (
        <SessionDetailsModal
          session={sessionDetailsModal.session}
          isOpen={sessionDetailsModal.isOpen}
          onClose={() => setSessionDetailsModal({ isOpen: false, session: null })}
          onJoinSession={onJoinSession}
        />
      )}
      
      {/* Testimonial Modal */}
      <TestimonialModal
        isOpen={testimonialModal}
        onClose={() => setTestimonialModal(false)}
        onSubmit={handleTestimonialSubmit}
        userName={`${user.firstName} ${user.lastName}`}
        userEmail={user.email}
        userId={user.id}
      />
    </div>
  );
};
