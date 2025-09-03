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
import { useAuth } from './hooks/useAuth';
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
  selectedSessions: ['1', '2', '4'], // Mock user enrolled in 3 sessions
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
      isReady: true
    },
    materials: ['Quran', 'Tajweed Rules', 'Practice Sheets']
  },
  {
    id: '3',
    title: 'Beginner Memorization Circle',
    description: 'Learn Quranic memorization techniques with fellow beginners.',
    instructor: mockInstructor,
    schedule: {
      day: 'Tuesday',
      startTime: '19:00',
      endTime: '20:00',
      timezone: 'EST'
    },
    region: 'North America',
    levelRange: 'beginner-focus',
    ageGroup: 'all',
    maxStudents: 12,
    enrolledStudents: 9,
    price: 20,
    category: 'memorization',
    status: 'active',
    zoomMeeting: {
      id: 'zm3',
      sessionId: '3',
      meetingId: '456789123',
      joinUrl: 'https://zoom.us/j/456789123?pwd=example',
      hostUrl: 'https://zoom.us/s/456789123?zak=example',
      password: 'hifz123',
      startTime: '2025-09-04T19:00:00Z',
      duration: 60,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=456789123&pwd=hifz123',
      webLink: 'https://zoom.us/wc/join/456789123?pwd=hifz123',
      generatedAt: '2025-09-04T17:00:00Z',
      isReady: true
    },
    materials: ['Quran', 'Memorization Journal']
  },
  {
    id: '4',
    title: 'Weekend Family Session',
    description: 'Family-friendly Quran learning session for parents and children.',
    instructor: mockInstructor,
    schedule: {
      day: 'Saturday',
      startTime: '10:00',
      endTime: '11:00',
      timezone: 'EST'
    },
    region: 'North America',
    levelRange: 'mixed',
    ageGroup: 'all',
    maxStudents: 20,
    enrolledStudents: 15,
    price: 15,
    category: 'recitation',
    status: 'active',
    zoomMeeting: {
      id: 'zm4',
      sessionId: '4',
      meetingId: '789123456',
      joinUrl: 'https://zoom.us/j/789123456?pwd=example',
      hostUrl: 'https://zoom.us/s/789123456?zak=example',
      password: 'family123',
      startTime: '2025-09-06T10:00:00Z',
      duration: 60,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=789123456&pwd=family123',
      webLink: 'https://zoom.us/wc/join/789123456?pwd=family123',
      generatedAt: '2025-09-06T08:00:00Z',
      isReady: true
    },
    materials: ['Quran', 'Children\'s Activity Sheets']
  },
  {
    id: '5',
    title: 'Advanced Tajweed Mastery',
    description: 'Deep dive into advanced Tajweed rules and perfect pronunciation.',
    instructor: mockInstructor,
    schedule: {
      day: 'Thursday',
      startTime: '21:00',
      endTime: '22:30',
      timezone: 'EST'
    },
    region: 'North America',
    levelRange: 'advanced-focus',
    ageGroup: 'adult',
    maxStudents: 8,
    enrolledStudents: 6,
    price: 45,
    category: 'tajweed',
    status: 'active',
    zoomMeeting: {
      id: 'zm5',
      sessionId: '5',
      meetingId: '321654987',
      joinUrl: 'https://zoom.us/j/321654987?pwd=example',
      hostUrl: 'https://zoom.us/s/321654987?zak=example',
      password: 'advanced123',
      startTime: '2025-09-05T21:00:00Z',
      duration: 90,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=321654987&pwd=advanced123',
      webLink: 'https://zoom.us/wc/join/321654987?pwd=advanced123',
      generatedAt: '2025-09-05T19:00:00Z',
      isReady: true
    },
    materials: ['Quran', 'Advanced Tajweed Manual', 'Audio Recordings']
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
  const { user: currentUser } = useAuth(); // Get user from useAuth hook instead of local state
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
        // Ensure the user object has all required properties for the dashboard
        const userData: User = {
          ...response.data.user,
          selectedSessions: ['1', '3'], // Give new users sample enrolled sessions
          subscription: {
            id: '1',
            plan: 'free' as const,
            status: 'active' as const,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            price: 0,
            autoRenew: false,
            sessionsIncluded: 0,
            sessionsUsed: 0
          },
          progress: {
            totalHours: 0,
            completedLessons: 0,
            currentSurah: '',
            memorizedVerses: 0,
            achievements: [],
            weeklyGoal: 5,
            weeklyProgress: 0
          },
          dateJoined: new Date().toISOString(),
          timezone: response.data.user.timezone || 'UTC'
        };
        
        // setCurrentUser(userData); // TODO: Need to update useAuth to handle user updates
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
    // setCurrentUser(null); // TODO: Use useAuth logout function
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
      // setCurrentUser(updatedUser); // TODO: Need to update useAuth to handle user updates
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
      // setCurrentUser(updatedUser); // TODO: Need to update useAuth to handle user updates
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
          onToastSuccess={success}
          onToastError={error}
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
          upcomingSessions={
            currentUser.selectedSessions && currentUser.selectedSessions.length > 0
              ? mockSessions.filter(s => currentUser.selectedSessions?.includes(s.id) || false)
              : mockSessions.slice(0, 3) // Show first 3 sessions as upcoming for new users
          }
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
      <div className="fixed top-4 right-4 z-[9999] pointer-events-none">
        <div className="flex flex-col space-y-2 w-80 max-w-[calc(100vw-2rem)]">
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

    </div>
  );
}

export default App;
