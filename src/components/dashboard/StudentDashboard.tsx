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
  Globe
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
  onEnrollInSession: (sessionId: string) => void;
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
  onEnrollInSession,
  onPaymentComplete,
  onAddRecitation,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'progress' | 'schedule' | 'recitation'>('overview');
  const [paymentModal, setPaymentModal] = useState<{ isOpen: boolean; session: Session | null }>({
    isOpen: false,
    session: null
  });
  
  const progressPercentage = Math.round((user.progress.weeklyProgress / user.progress.weeklyGoal) * 100);
  
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
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
        isActive 
          ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Quran Academy
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-slate-600 hover:text-slate-900 relative">
                  <Bell className="w-6 h-6" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm font-medium text-slate-700">{user.firstName} {user.lastName}</span>
              </div>
              
              <button 
                onClick={onLogout}
                className="p-2 text-slate-600 hover:text-slate-900"
              >
                <LogOut className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user.firstName}!
          </h2>
          <p className="text-slate-600">
            Continue your Quran learning journey. You have {upcomingSessions.length} upcoming sessions.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-white p-1 rounded-lg shadow-sm border border-slate-200 w-fit">
          <TabButton
            tab="overview"
            label="Overview"
            icon={<TrendingUp className="w-4 h-4" />}
            isActive={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
          />
          <TabButton
            tab="sessions"
            label="Sessions"
            icon={<Video className="w-4 h-4" />}
            isActive={activeTab === 'sessions'}
            onClick={() => setActiveTab('sessions')}
          />
          <TabButton
            tab="progress"
            label="Progress"
            icon={<Award className="w-4 h-4" />}
            isActive={activeTab === 'progress'}
            onClick={() => setActiveTab('progress')}
          />
          <TabButton
            tab="schedule"
            label="Schedule"
            icon={<Calendar className="w-4 h-4" />}
            isActive={activeTab === 'schedule'}
            onClick={() => setActiveTab('schedule')}
          />
          <TabButton
            tab="recitation"
            label="Daily Recitation"
            icon={<BookOpen className="w-4 h-4" />}
            isActive={activeTab === 'recitation'}
            onClick={() => setActiveTab('recitation')}
          />
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Weekly Progress</p>
                      <p className="text-2xl font-bold text-slate-900">{progressPercentage}%</p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Target className="w-6 h-6 text-emerald-600" />
                    </div>
                  </div>
                  <div className="mt-3 bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Total Hours</p>
                      <p className="text-2xl font-bold text-slate-900">{user.progress.totalHours}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Completed Lessons</p>
                      <p className="text-2xl font-bold text-slate-900">{user.progress.completedLessons}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Achievements</p>
                      <p className="text-2xl font-bold text-slate-900">{user.progress.achievements.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Sessions */}
            <UpcomingSessions
              sessions={upcomingSessions}
              onJoinSession={onJoinSession}
              userName={`${user.firstName} ${user.lastName}`}
              userEmail={user.email}
            />

            {/* Recent Achievements */}
            <Card variant="elevated">
              <CardHeader>
                <h3 className="text-lg font-semibold text-slate-900">Recent Achievements</h3>
              </CardHeader>
              <CardContent>
                {user.progress.achievements.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.progress.achievements.slice(0, 4).map((achievement) => (
                      <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h4 className="font-medium text-slate-900">{achievement.title}</h4>
                          <p className="text-sm text-slate-500">{achievement.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No achievements yet</p>
                )}
              </CardContent>
            </Card>
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
                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-emerald-600" />
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
                          className="bg-emerald-500 h-3 rounded-full" 
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
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <Video className="w-6 h-6 text-emerald-600" />
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
