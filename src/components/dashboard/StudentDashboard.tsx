import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
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
  MapPin,
  Star,
  ChevronRight,
  AlertCircle,
  Info
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PaymentModal } from '../ui/PaymentModal';
import { RecitationTracker } from '../ui/RecitationTracker';
import { UpcomingSessions } from '../ui/UpcomingSessions';
import { Session, User as UserType, Notification, Payment, RecitationEntry } from '../../types';

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

        {/* Enhanced Overview Tab - Compact Design */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Three Column Layout for Better Space Usage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Quick Stats */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {/* Compact Stats Cards */}
                  <div className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <Target className="w-8 h-8 text-white/80" />
                      <span className="text-2xl font-bold">{progressPercentage}%</span>
                    </div>
                    <p className="text-white/90 text-sm mt-2">Weekly Goal</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <Clock className="w-8 h-8 text-white/80" />
                      <span className="text-2xl font-bold">{user.progress.totalHours}</span>
                    </div>
                    <p className="text-white/90 text-sm mt-2">Total Hours</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <CheckCircle className="w-8 h-8 text-white/80" />
                      <span className="text-2xl font-bold">{user.progress.completedLessons}</span>
                    </div>
                    <p className="text-white/90 text-sm mt-2">Lessons</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl p-4 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                      <Award className="w-8 h-8 text-white/80" />
                      <span className="text-2xl font-bold">{user.progress.achievements.length}</span>
                    </div>
                    <p className="text-white/90 text-sm mt-2">Achievements</p>
                  </div>
                </div>

                {/* Current Learning - More Compact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/30">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">Current Surah</h3>
                        <p className="text-xs text-slate-600">{user.progress.currentSurah}</p>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-green-700">Progress</span>
                        <span className="text-sm font-bold text-green-800">75%</span>
                      </div>
                      <div className="bg-green-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full w-3/4"></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/30">
                    <h3 className="font-bold text-slate-800 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full flex items-center space-x-3 p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors">
                        <Play className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-slate-800">Continue Learning</span>
                      </button>
                      <button className="w-full flex items-center space-x-3 p-2 bg-purple-100 rounded-lg hover:bg-purple-200 transition-colors">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-slate-800">Schedule Session</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Announcements */}
              <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-4 border border-white/30">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800">Announcements</h3>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {/* Sample announcements - you can make this dynamic */}
                  <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-r-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Class Cancelled</p>
                        <p className="text-xs text-red-600">Tomorrow's evening session has been postponed to Friday.</p>
                        <p className="text-xs text-red-500 mt-1">2 hours ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">New Feature</p>
                        <p className="text-xs text-blue-600">Voice recording feature now available for practice sessions.</p>
                        <p className="text-xs text-blue-500 mt-1">1 day ago</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-r-lg">
                    <div className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-green-800">Achievement Unlocked</p>
                        <p className="text-xs text-green-600">You've completed 30 days of consistent learning!</p>
                        <p className="text-xs text-green-500 mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions - Compact Version */}
            <UpcomingSessions
              sessions={upcomingSessions}
              onJoinSession={onJoinSession}
              userName={`${user.firstName} ${user.lastName}`}
              userEmail={user.email}
            />
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Time Zone-Based Sessions</h3>
                <p className="text-sm text-slate-600 mt-1">Join sessions scheduled for your region with students of all skill levels</p>
              </div>
              <div className="flex space-x-2">
                <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option>All Regions</option>
                  <option>North America</option>
                  <option>Europe</option>
                  <option>Asia Pacific</option>
                  <option>Middle East</option>
                  <option>Africa</option>
                  <option>South America</option>
                </select>
                <select className="px-3 py-2 border border-slate-300 rounded-lg text-sm">
                  <option>All Categories</option>
                  <option>Recitation</option>
                  <option>Memorization</option>
                  <option>Tajweed</option>
                  <option>Translation</option>
                </select>
              </div>
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
                      Sessions are organized by time zones for your convenience. Each session welcomes students of all 
                      skill levels - from beginners just starting their Quran journey to advanced learners perfecting 
                      their recitation. You'll learn alongside peers from your region while benefiting from diverse 
                      perspectives and skill levels in the same virtual classroom.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableSessions.map((session) => (
                <Card key={session.id} variant="elevated" className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant="info">
                        {session.region}
                      </Badge>
                      <Badge variant={session.levelRange === 'mixed' ? 'success' : session.levelRange === 'beginner-focus' ? 'warning' : 'danger'}>
                        {session.levelRange === 'mixed' ? 'All Levels' : session.levelRange === 'beginner-focus' ? 'Beginner Focus' : 'Advanced Focus'}
                      </Badge>
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
                      <div className="flex items-center text-sm text-slate-500">
                        <Users className="w-4 h-4 mr-2" />
                        {session.enrolledStudents}/{session.maxStudents} students
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
                        disabled={session.enrolledStudents >= session.maxStudents}
                      >
                        {session.enrolledStudents >= session.maxStudents ? 'Full' : 'Enroll'}
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
                            <Button variant="outline" size="sm">
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

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4 text-indigo-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-white mb-2">{user.firstName} {user.lastName}</h2>
                  <p className="text-blue-100 mb-4">{user.email}</p>
                  <div className="flex items-center space-x-4">
                    <Badge className="bg-white/20 text-white border-white/30">
                      {user.userType === 'adult' ? 'Adult Student' : 'Young Student'}
                    </Badge>
                    <div className="flex items-center space-x-2 text-blue-100">
                      <Star className="w-4 h-4" />
                      <span>Level: Beginner</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-all backdrop-blur-sm flex items-center space-x-2"
                >
                  <Edit3 className="w-5 h-5" />
                  <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/30">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-slate-800">Personal Information</h3>
                  {!isEditingProfile && (
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center space-x-1"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                          <User className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-800">{user.firstName}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                          <User className="w-5 h-5 text-slate-400" />
                          <span className="text-slate-800">{user.lastName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                    {isEditingProfile ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                        <Mail className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-800">{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    {isEditingProfile ? (
                      <input
                        type="tel"
                        value={profileData.telephone}
                        onChange={(e) => setProfileData({...profileData, telephone: e.target.value})}
                        className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                        <Phone className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-800">{user.telephone || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
                    {isEditingProfile ? (
                      <input
                        type="text"
                        value={profileData.country}
                        onChange={(e) => setProfileData({...profileData, country: e.target.value})}
                        className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Enter your country"
                      />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                        <MapPin className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-800">{user.country || 'Not provided'}</span>
                      </div>
                    )}
                  </div>

                  {isEditingProfile && (
                    <div className="flex space-x-4 pt-4">
                      <button 
                        onClick={() => {
                          // Save logic would go here
                          setIsEditingProfile(false);
                        }}
                        className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all flex items-center justify-center space-x-2"
                      >
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </button>
                      <button 
                        onClick={() => setIsEditingProfile(false)}
                        className="px-6 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Learning Preferences */}
              <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/30">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Learning Preferences</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Weekly Learning Goal</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={profileData.weeklyGoal}
                        onChange={(e) => setProfileData({...profileData, weeklyGoal: parseInt(e.target.value)})}
                        className="flex-1"
                      />
                      <span className="text-xl font-bold text-indigo-600 min-w-[3rem]">{profileData.weeklyGoal}h</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-2">Set your weekly learning goal to track progress</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                    <select 
                      value={profileData.timezone}
                      onChange={(e) => setProfileData({...profileData, timezone: e.target.value})}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="UTC">UTC (Coordinated Universal Time)</option>
                      <option value="America/New_York">Eastern Time (EST/EDT)</option>
                      <option value="America/Chicago">Central Time (CST/CDT)</option>
                      <option value="America/Denver">Mountain Time (MST/MDT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PST/PDT)</option>
                      <option value="Europe/London">London (GMT/BST)</option>
                      <option value="Europe/Paris">Paris (CET/CEST)</option>
                      <option value="Asia/Dubai">Dubai (GST)</option>
                      <option value="Asia/Riyadh">Riyadh (AST)</option>
                    </select>
                  </div>

                  {/* Theme Preference */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">Theme Preference</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="p-4 border-2 border-indigo-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-indigo-300 transition-all">
                        <div className="flex items-center space-x-3">
                          <Sun className="w-6 h-6 text-indigo-600" />
                          <span className="font-medium text-slate-800">Light Mode</span>
                        </div>
                      </button>
                      <button className="p-4 border-2 border-slate-300 rounded-xl bg-slate-50 hover:border-slate-400 transition-all">
                        <div className="flex items-center space-x-3">
                          <Moon className="w-6 h-6 text-slate-600" />
                          <span className="font-medium text-slate-700">Dark Mode</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Notification Settings */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">Notifications</label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-slate-600" />
                          <span className="font-medium text-slate-800">Session Reminders</span>
                        </div>
                        <button className="w-12 h-6 bg-indigo-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Award className="w-5 h-5 text-slate-600" />
                          <span className="font-medium text-slate-800">Achievement Alerts</span>
                        </div>
                        <button className="w-12 h-6 bg-indigo-500 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-slate-600" />
                          <span className="font-medium text-slate-800">Email Updates</span>
                        </div>
                        <button className="w-12 h-6 bg-slate-300 rounded-full relative">
                          <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Security */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/30">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Account Security</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all border border-blue-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-slate-800">Change Password</h4>
                      <p className="text-slate-600 text-sm">Update your account password</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>

                <button className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all border border-green-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-semibold text-slate-800">Two-Factor Auth</h4>
                      <p className="text-slate-600 text-sm">Add extra security to your account</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </button>
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
    </div>
  );
};
