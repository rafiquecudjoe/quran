import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { SalatVideosPage } from './pages/SalatVideosPage';
import { LoginForm } from './components/auth/LoginForm';
import { EnhancedSignupForm } from './components/auth/EnhancedSignupForm';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { InstructorDashboard } from './components/dashboard/InstructorDashboard';
import { User, Session, Instructor, Notification, Payment, RecitationEntry, SignupFormData } from './types';

type Page = 'home' | 'login' | 'signup' | 'student-dashboard' | 'instructor-dashboard' | 'salat-videos';

// Mock data for demonstration
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
  selectedSessions: ['1', '2', '4'], // Added session 4 (the "starting soon" test session)
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
      },
      {
        id: '2',
        title: 'Tajweed Master',
        description: 'Mastered basic Tajweed rules',
        icon: '📖',
        dateEarned: '2024-02-01',
        category: 'recitation'
      }
    ],
    weeklyGoal: 10,
    weeklyProgress: 7
  }
};

const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Evening Quran Session - North America',
    description: 'Mixed-level Quran learning session for students in North American time zones. All skill levels welcome.',
    instructor: mockInstructor,
    schedule: {
      day: 'Monday',
      startTime: '23:00', // 7 PM EST
      endTime: '24:00',   // 8 PM EST
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
      startTime: '2025-09-03T23:00:00Z', // Tomorrow at 7 PM EST
      duration: 60,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=123456789&pwd=quran123',
      webLink: 'https://zoom.us/wc/join/123456789?pwd=quran123',
      generatedAt: '2025-09-03T21:00:00Z', // Generated 2 hours before
      isReady: true
    },
    materials: ['Quran', 'Basic Tajweed Guide']
  },
  {
    id: '2',
    title: 'Evening Quran Session - Europe',
    description: 'Time zone-friendly session for European students. Beginner to advanced levels learning together.',
    instructor: mockInstructor,
    schedule: {
      day: 'Wednesday',
      startTime: '20:00', // 8 PM CET
      endTime: '21:30',   // 9:30 PM CET
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
      startTime: '2025-09-04T20:00:00Z', // Day after tomorrow at 8 PM CET
      duration: 90,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=987654321&pwd=tajweed123',
      webLink: 'https://zoom.us/wc/join/987654321?pwd=tajweed123',
      generatedAt: '2025-09-04T18:00:00Z', // Will be generated 2 hours before
      isReady: false
    },
    materials: ['Advanced Tajweed Book', 'Audio Recordings']
  },
  {
    id: '3',
    title: 'Weekend Morning Session - Asia Pacific',
    description: 'Weekend Quran session for Asia Pacific region. Mixed levels with focus on memorization techniques.',
    instructor: mockInstructor,
    schedule: {
      day: 'Saturday',
      startTime: '02:00', // 10 AM JST/11 AM AEDT
      endTime: '03:30',   // 11:30 AM JST/12:30 PM AEDT
      timezone: 'JST'
    },
    region: 'Asia Pacific',
    levelRange: 'mixed',
    ageGroup: 'all',
    maxStudents: 8,
    enrolledStudents: 6,
    price: 40,
    category: 'memorization',
    status: 'active',
    zoomMeeting: {
      id: 'zm3',
      sessionId: '3',
      meetingId: '456789123',
      joinUrl: 'https://zoom.us/j/456789123?pwd=example',
      hostUrl: 'https://zoom.us/s/456789123?zak=example',
      password: 'hifz123',
      startTime: '2025-09-07T02:00:00Z', // Saturday early morning for Asia Pacific
      duration: 90,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=456789123&pwd=hifz123',
      webLink: 'https://zoom.us/wc/join/456789123?pwd=hifz123',
      generatedAt: '2025-09-07T00:00:00Z', // Generated 2 hours before
      isReady: true
    },
    materials: ['Memorization Guide', 'Progress Tracker']
  },
  {
    id: '4',
    title: 'Test Session - Starting Soon',
    description: 'Demo session to test the "ready" status - starts in 5 minutes',
    instructor: mockInstructor,
    schedule: {
      day: 'Today',
      startTime: (() => {
        const now = new Date();
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);
        return fiveMinutesFromNow.toTimeString().slice(0, 5); // HH:MM format
      })(),
      endTime: (() => {
        const now = new Date();
        const oneHourFromNow = new Date(now.getTime() + 65 * 60000);
        return oneHourFromNow.toTimeString().slice(0, 5); // HH:MM format
      })(),
      timezone: 'Local'
    },
    region: 'North America',
    levelRange: 'mixed',
    ageGroup: 'all',
    maxStudents: 10,
    enrolledStudents: 1,
    price: 30,
    category: 'recitation',
    status: 'active',
    zoomMeeting: {
      id: 'zm4',
      sessionId: '4',
      meetingId: '111222333',
      joinUrl: 'https://zoom.us/j/111222333?pwd=test123',
      hostUrl: 'https://zoom.us/s/111222333?zak=test',
      password: 'test123',
      startTime: (() => {
        const now = new Date();
        const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000);
        return fiveMinutesFromNow.toISOString();
      })(),
      duration: 60,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=111222333&pwd=test123',
      webLink: 'https://zoom.us/wc/join/111222333?pwd=test123',
      generatedAt: new Date().toISOString(),
      isReady: true
    },
    materials: ['Test Materials']
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
  },
  {
    id: '2',
    userId: '1',
    date: '2024-02-02',
    surahName: 'Al-Baqarah',
    verses: '1-20',
    duration: 30,
    notes: 'Working on memorizing the first verses',
    createdAt: '2024-02-02T09:00:00Z'
  },
  {
    id: '3',
    userId: '1',
    date: '2024-02-03',
    surahName: 'Al-Ikhlas',
    verses: 'complete',
    duration: 10,
    notes: 'Review session before sleep',
    createdAt: '2024-02-03T22:00:00Z'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const handleLogin = (email: string, password: string) => {
    // Mock login logic
    console.log('Login attempt:', { email, password });
    
    // Simulate instructor login check
    if (email.includes('instructor')) {
      setCurrentPage('instructor-dashboard');
    } else {
      setCurrentUser(mockUser);
      setCurrentPage('student-dashboard');
    }
  };

  const handleSignup = (userData: SignupFormData) => {
    console.log('Signup attempt:', userData);
    
    const newUser: User = {
      ...mockUser,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      telephone: userData.telephone,
      country: userData.country,
      dateOfBirth: userData.dateOfBirth,
      userType: userData.userType,
      age: userData.age,
      parentInfo: userData.parentInfo
    };
    
    setCurrentUser(newUser);
    setCurrentPage('student-dashboard');
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
          onLogin={handleLogin}
          onBack={() => setCurrentPage('home')}
          onSignupClick={() => setCurrentPage('signup')}
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
    </div>
  );
}

export default App;
