import React, { useState } from 'react';
import { 
  Plus,
  Calendar, 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Video,
  Bell,
  Settings,
  LogOut,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  User,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Session, Instructor, User as UserType } from '../../types';

interface InstructorDashboardProps {
  instructor: Instructor;
  sessions: Session[];
  students: UserType[];
  onCreateSession: (sessionData: Partial<Session>) => void;
  onDeleteSession: (sessionId: string) => void;
  onStartSession: (sessionId: string) => void;
  onLogout: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  instructor,
  sessions,
  students,
  onCreateSession,
  onDeleteSession,
  onStartSession,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'students' | 'analytics'>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const totalRevenue = sessions.reduce((sum, session) => sum + (session.price * session.enrolledStudents), 0);
  const totalStudents = sessions.reduce((sum, session) => sum + session.enrolledStudents, 0);
  const averageRating = instructor.rating;

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
          ? 'bg-blue-100 text-blue-800 shadow-sm' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const CreateSessionModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [formData, setFormData] = useState({
      title: '',
      description: '',
      day: 'Monday',
      startTime: '',
      endTime: '',
      region: 'North America' as 'North America' | 'Europe' | 'Asia Pacific' | 'Middle East' | 'Africa' | 'South America',
      levelRange: 'mixed' as 'mixed' | 'beginner-focus' | 'advanced-focus',
      ageGroup: 'all' as 'child' | 'adult' | 'all',
      maxStudents: 10,
      price: 0,
      category: 'recitation' as 'recitation' | 'memorization' | 'tajweed' | 'translation' | 'islamic-studies'
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onCreateSession(formData);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl max-h-screen overflow-y-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-900">Create New Session</h3>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Session Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value as Session['category']})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="recitation">Recitation</option>
                    <option value="memorization">Memorization</option>
                    <option value="tajweed">Tajweed</option>
                    <option value="translation">Translation</option>
                    <option value="islamic-studies">Islamic Studies</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg h-24"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Day</label>
                  <select
                    value={formData.day}
                    onChange={(e) => setFormData({...formData, day: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <Input
                  type="time"
                  label="Start Time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  required
                />
                <Input
                  type="time"
                  label="End Time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Region</label>
                  <select
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value as Session['region']})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                    <option value="Middle East">Middle East</option>
                    <option value="Africa">Africa</option>
                    <option value="South America">South America</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Level Focus</label>
                  <select
                    value={formData.levelRange}
                    onChange={(e) => setFormData({...formData, levelRange: e.target.value as Session['levelRange']})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="mixed">Mixed Levels (Recommended)</option>
                    <option value="beginner-focus">Beginner Focus</option>
                    <option value="advanced-focus">Advanced Focus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age Group</label>
                  <select
                    value={formData.ageGroup}
                    onChange={(e) => setFormData({...formData, ageGroup: e.target.value as Session['ageGroup']})}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="all">All Ages</option>
                    <option value="child">Children</option>
                    <option value="adult">Adults</option>
                  </select>
                </div>
                <Input
                  type="number"
                  label="Max Students"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({...formData, maxStudents: parseInt(e.target.value)})}
                  min="1"
                  max="50"
                  required
                />
              </div>

              <Input
                type="number"
                label="Price per Session ($)"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                min="0"
                step="0.01"
                required
              />

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Session
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-700 to-blue-800 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
                Instructor Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-2 text-slate-600 hover:text-slate-900 relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-700" />
                </div>
                <span className="text-sm font-medium text-slate-700">{instructor.name}</span>
              </div>
              
              <button className="p-2 text-slate-600 hover:text-slate-900">
                <Settings className="w-6 h-6" />
              </button>
              
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
            Welcome, {instructor.name}!
          </h2>
          <p className="text-slate-600">
            Manage your sessions and track your teaching progress.
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
            tab="students"
            label="Students"
            icon={<Users className="w-4 h-4" />}
            isActive={activeTab === 'students'}
            onClick={() => setActiveTab('students')}
          />
          <TabButton
            tab="analytics"
            label="Analytics"
            icon={<BarChart3 className="w-4 h-4" />}
            isActive={activeTab === 'analytics'}
            onClick={() => setActiveTab('analytics')}
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
                      <p className="text-sm text-slate-500 mb-1">Total Students</p>
                      <p className="text-2xl font-bold text-slate-900">{totalStudents}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Active Sessions</p>
                      <p className="text-2xl font-bold text-slate-900">{sessions.filter(s => s.status === 'active').length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-blue-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-slate-900">${totalRevenue}</p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500 mb-1">Average Rating</p>
                      <p className="text-2xl font-bold text-slate-900">{averageRating.toFixed(1)}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Sessions */}
            <Card variant="elevated">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-slate-900">Today's Sessions</h3>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    New Session
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Video className="w-6 h-6 text-blue-700" />
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-900">{session.title}</h4>
                          <p className="text-sm text-slate-500">
                            {formatTime(session.schedule.startTime)} - {formatTime(session.schedule.endTime)}
                          </p>
                          <p className="text-sm text-slate-500">
                            {session.enrolledStudents}/{session.maxStudents} students
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={() => onStartSession(session.id)}>
                          Start Session
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-slate-900">Manage Sessions</h3>
              <Button onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Session
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sessions.map((session) => (
                <Card key={session.id} variant="elevated" className="hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <Badge variant={session.status === 'active' ? 'success' : 'warning'}>
                        {session.status}
                      </Badge>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => console.log('Edit session:', session.id)}
                          className="p-1 text-slate-400 hover:text-slate-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteSession(session.id)}
                          className="p-1 text-slate-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                      <div className="flex items-center text-sm text-slate-500">
                        <Users className="w-4 h-4 mr-2" />
                        {session.enrolledStudents}/{session.maxStudents} students
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-700">${session.price}</span>
                      <Button size="sm" onClick={() => onStartSession(session.id)}>
                        Start Session
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900">All Students</h3>
            
            <Card variant="elevated">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="text-left p-4 font-medium text-slate-700">Student</th>
                        <th className="text-left p-4 font-medium text-slate-700">Level</th>
                        <th className="text-left p-4 font-medium text-slate-700">Sessions</th>
                        <th className="text-left p-4 font-medium text-slate-700">Progress</th>
                        <th className="text-left p-4 font-medium text-slate-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => (
                        <tr key={student.id} className="border-b border-slate-100 hover:bg-slate-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-700" />
                              </div>
                              <div>
                                <p className="font-medium text-slate-900">{student.name}</p>
                                <p className="text-sm text-slate-500">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="info">{student.learningLevel}</Badge>
                          </td>
                          <td className="p-4 text-slate-600">
                            {student.selectedSessions.length} sessions
                          </td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full" 
                                  style={{ width: `${Math.min(student.progress.weeklyGoal > 0 ? (student.progress.weeklyProgress / student.progress.weeklyGoal) * 100 : 0, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm text-slate-600">
                                {student.progress.weeklyGoal > 0 ? Math.round((student.progress.weeklyProgress / student.progress.weeklyGoal) * 100) : 0}%
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-slate-900">Analytics & Reports</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="elevated">
                <CardHeader>
                  <h4 className="font-semibold text-slate-900">Monthly Revenue</h4>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-700 mb-2">${totalRevenue}</div>
                  <p className="text-sm text-slate-500">+12% from last month</p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <h4 className="font-semibold text-slate-900">Student Retention</h4>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">94%</div>
                  <p className="text-sm text-slate-500">Above average retention</p>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <h4 className="font-semibold text-slate-900">Session Completion</h4>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                  <p className="text-sm text-slate-500">Excellent completion rate</p>
                </CardContent>
              </Card>
            </div>

            <Card variant="elevated">
              <CardHeader>
                <h4 className="font-semibold text-slate-900">Session Performance</h4>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-slate-900">{session.title}</h5>
                        <p className="text-sm text-slate-500">{session.enrolledStudents} students enrolled</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-slate-900">${session.price * session.enrolledStudents}</p>
                        <p className="text-sm text-slate-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Create Session Modal */}
      {showCreateModal && (
        <CreateSessionModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};
