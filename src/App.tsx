import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { SalatVideosPage } from './pages/SalatVideosPage';
import { LoginForm } from './components/auth/LoginForm';
import { EnhancedSignupForm } from './components/auth/SignupForm';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { InstructorDashboard } from './components/dashboard/InstructorDashboard';
import { Toast } from './components/ui/Toast';
import { User, Session, Instructor, Notification, Payment, RecitationEntry, SignupFormData } from './types';
import { authService, RegisterRequest } from './services/authService';
import { useToast } from './hooks/useToast';

type Page = 'home' | 'login' | 'signup' | 'student-dashboard' | 'instructor-dashboard' | 'salat-videos';

// Mock data for demonstration (will be replaced with real API data)
const mockInstructor: Instructor = {
  id: '1',
  name: 'Ustadh Muhammad Ali',
  email: 'instructor@example.com',
  bio: 'Certified Quran instructor with 10+ years of experience',
  qualifications: ['Ijazah in Quran', 'Islamic Studies Degree'],
  experience: 10,
  rating: 4.9,
  totalStudents: 150,
  specializations: ['Tajweed', 'Memorization', 'Recitation']
};

const mockUser: User = {
  id: '1',
  firstName: 'Ahmed',
  lastName: 'Hassan',
  email: 'ahmed@example.com',
  telephone: '+1-555-123-4567',
  country: 'United States',
  dateOfBirth: '1990-05-15',
  role: 'student',
  userType: 'adult',
  age: 35,
  dateJoined: '2024-01-15',
  timezone: 'America/New_York',
  subscription: {
    id: '1',
    plan: 'premium',
    status: 'active',
    startDate: '2024-01-15',
    endDate: '2024-12-15',
    price: 49,
    autoRenew: true,
    sessionsIncluded: 16,
    sessionsUsed: 8
  },
  selectedSessions: ['1', '2'],
  progress: {
    totalHours: 45,
    completedLessons: 12,
    currentSurah: 'Al-Baqarah',
    memorizedVerses: 150,
    achievements: [
      {
        id: '1',
        title: 'First Week Complete',
        description: 'Completed your first week of learning',
        icon: '🎉',
        dateEarned: '2024-01-22',
        category: 'attendance'
      }
    ],
    weeklyGoal: 10,
    weeklyProgress: 7
  }
};

const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Evening Quran Session',
    description: 'Mixed-level Quran learning session for students in North American time zones.',
    instructor: mockInstructor,
    schedule: {
      day: 'Monday',
      startTime: '23:00',
      endTime: '24:00',
      timezone: 'EST'
    },
    region: 'North America',
    levelRange: 'mixed',
    ageGroup: 'all',
    maxStudents: 15,
    enrolledStudents: 12,
    price: 25,
    category: 'recitation',
    status: 'active',
    zoomMeeting: {
      id: 'zm1',
      sessionId: '1',
      meetingId: '123456789',
      joinUrl: 'https://zoom.us/j/123456789?pwd=example',
      hostUrl: 'https://zoom.us/s/123456789?zak=example',
      password: 'quran123',
      startTime: '2025-09-03T23:00:00Z',
      duration: 60,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=123456789&pwd=quran123',
      webLink: 'https://zoom.us/wc/join/123456789?pwd=quran123',
      generatedAt: '2025-09-03T21:00:00Z',
      isReady: true
    },
    materials: ['Quran', 'Basic Tajweed Guide']
  },
  {
    id: '2',
    title: 'European Evening Session',
    description: 'Time zone-friendly session for European students.',
    instructor: mockInstructor,
    schedule: {
      day: 'Wednesday',
      startTime: '20:00',
      endTime: '21:30',
      timezone: 'CET'
    },
    region: 'Europe',
    levelRange: 'mixed',
    ageGroup: 'adult',
    maxStudents: 10,
    enrolledStudents: 8,
    price: 35,
    category: 'tajweed',
    status: 'active',
    zoomMeeting: {
      id: 'zm2',
      sessionId: '2',
      meetingId: '987654321',
      joinUrl: 'https://zoom.us/j/987654321?pwd=example',
      hostUrl: 'https://zoom.us/s/987654321?zak=example',
      password: 'tajweed123',
      startTime: '2025-09-04T20:00:00Z',
      duration: 90,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=987654321&pwd=tajweed123',
      webLink: 'https://zoom.us/wc/join/987654321?pwd=tajweed123',
      generatedAt: '2025-09-04T18:00:00Z',
      isReady: false
    },
    materials: ['Advanced Tajweed Book']
  }
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'session_reminder',
    title: 'Session Starting Soon',
    message: 'Your Tajweed class starts in 30 minutes',
    timestamp: '2024-01-15T18:30:00Z',
    read: false
  }
];

const mockRecitationEntries: RecitationEntry[] = [
  {
    id: '1',
    userId: '1',
    date: '2024-02-01',
    surahName: 'Al-Fatiha',
    verses: 'complete',
    duration: 15,
    notes: 'Focused on pronunciation and rhythm',
    createdAt: '2024-02-01T08:00:00Z'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toasts, removeToast, success, error } = useToast();

  const handleSignup = async (userData: SignupFormData) => {
    console.log('Signup attempt:', userData);
    
    try {
      // Map SignupFormData to RegisterRequest format
      const registerData: RegisterRequest = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        userType: userData.userType,
        telephone: userData.telephone,
        country: userData.country,
        dateOfBirth: userData.dateOfBirth,
        age: userData.age, // Include age field
        timezone: userData.timezone, // Include timezone
        parentInfo: userData.parentInfo
      };

      // Call the backend registration API
      const response = await authService.register(registerData);
      
      console.log('Registration response:', response);
      
      if (response.success && response.data) {
        // Successfully registered - set the user from backend response
        setCurrentUser(response.data.user);
        setCurrentPage('student-dashboard');
        success('Welcome to Ismail Academy!', 'Your account has been created successfully.');
        console.log('Registration successful:', response.message);
      } else {
        // Registration failed - show error message
        console.error('Registration failed:', response.message || response.error);
        error('Registration Failed', response.message || response.error || 'An unknown error occurred.');
      }
    } catch (err) {
      console.error('Registration error:', err);
      error('Registration Error', 'Registration failed. Please check your connection and try again.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleJoinSession = (sessionId: string) => {
    console.log('Joining session:', sessionId);
    // Here you would integrate with Zoom API
    window.open('https://zoom.us/j/meeting-id', '_blank');
  };

  const handleEnrollInSession = (sessionId: string) => {
    console.log('Enrolling in session:', sessionId);
    // Add session to user's selected sessions
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        selectedSessions: [...currentUser.selectedSessions, sessionId]
      };
      setCurrentUser(updatedUser);
    }
  };

  const handleCreateSession = (sessionData: Partial<Session>) => {
    console.log('Creating session:', sessionData);
    // Here you would call your backend API to create the session
  };

  const handleDeleteSession = (sessionId: string) => {
    console.log('Deleting session:', sessionId);
    // Here you would call your backend API to delete the session
  };

  const handleStartSession = (sessionId: string) => {
    console.log('Starting session:', sessionId);
    // Here you would integrate with Zoom API to start the meeting
    window.open('https://zoom.us/start/meeting-id', '_blank');
  };

  const handlePaymentComplete = (payment: Payment) => {
    console.log('Payment completed:', payment);
    // Process payment and enroll user in session
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        selectedSessions: [...currentUser.selectedSessions, payment.sessionId]
      };
      setCurrentUser(updatedUser);
    }
  };

  const handleAddRecitation = (entry: Omit<RecitationEntry, 'id' | 'userId' | 'createdAt'>) => {
    console.log('Adding recitation entry:', entry);
    // Here you would call your backend API to save the recitation entry
    // For now, we'll just log it
  };

  return (
    <div className="App">
      {currentPage === 'home' && (
        <LandingPage
          onGetStarted={() => setCurrentPage('signup')}
          onLogin={() => setCurrentPage('login')}
          onWatchSalatVideos={() => setCurrentPage('salat-videos')}
        />
      )}
      
      {currentPage === 'salat-videos' && (
        <SalatVideosPage
          onBack={() => setCurrentPage('home')}
        />
      )}
      
      {currentPage === 'login' && (
        <LoginForm
          onBack={() => setCurrentPage('home')}
          onSignupClick={() => setCurrentPage('signup')}
          onLoginSuccess={() => setCurrentPage('student-dashboard')}
        />
      )}
      
      {currentPage === 'signup' && (
        <EnhancedSignupForm
          onSignup={handleSignup}
          onLoginClick={() => setCurrentPage('login')}
        />
      )}
      
      {currentPage === 'student-dashboard' && currentUser && (
        <StudentDashboard
          user={currentUser}
          availableSessions={mockSessions}
          upcomingSessions={mockSessions.filter(s => currentUser.selectedSessions.includes(s.id))}
          notifications={mockNotifications}
          recitationEntries={mockRecitationEntries}
          onJoinSession={handleJoinSession}
          onEnrollInSession={handleEnrollInSession}
          onPaymentComplete={handlePaymentComplete}
          onAddRecitation={handleAddRecitation}
          onLogout={handleLogout}
        />
      )}
      
      {currentPage === 'instructor-dashboard' && (
        <InstructorDashboard
          instructor={mockInstructor}
          sessions={mockSessions}
          students={[mockUser]}
          onCreateSession={handleCreateSession}
          onDeleteSession={handleDeleteSession}
          onStartSession={handleStartSession}
          onLogout={handleLogout}
        />
      )}
      
      {/* Toast notifications */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-sm w-full sm:w-auto">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            onClose={removeToast}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
