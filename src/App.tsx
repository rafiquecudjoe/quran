import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { SalatVideosPage } from './pages/SalatVideosPage';
import { CoursesPage } from './pages/CoursesPage';
import { ContactPage } from './pages/ContactPage';
import { CountdownPage } from './pages/CountdownPage';
import { LoginForm } from './components/auth/LoginForm';
import { EnhancedSignupForm } from './components/auth/SignupForm';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { InstructorDashboard } from './components/dashboard/InstructorDashboardNew';
import { Toast } from './components/ui/Toast';
import { User, Session, Instructor, Notification, Payment, RecitationEntry, SignupFormData, FamilySignupFormData } from './types';
import { authService, RegisterRequest } from './services/authService';
import { useAuth } from './hooks/useAuth';
import { useToast } from './hooks/useToast';

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
  selectedSessions: ['1'], // Mock user enrolled in 1 session only
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

// Helper function to create session instances for Mon-Thu
const createWeeklySessionInstances = (baseSession: any, sessionNumber: number) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const instances = [];
  
  for (let i = 0; i < days.length; i++) {
    const day = days[i];
    instances.push({
      ...baseSession,
      id: `${sessionNumber}-${i + 1}`, // Session 1-1, 1-2, 1-3, 1-4
      schedule: {
        ...baseSession.schedule,
        day: day
      },
      // Vary status across the week for demo
      status: i === 0 ? 'ended' : i === 1 ? 'in-progress' : i === 2 ? 'active' : 'cancelled'
    });
  }
  
  return instances;
};

const baseSessionTemplates = [
  {
    title: 'Session 1',
    description: 'Mixed-level Quran learning session.',
    instructor: mockInstructor,
    schedule: {
      startTime: '09:00',
      endTime: '11:00',
      timezone: 'EST'
    },
    region: 'North America',
    levelRange: 'mixed',
    ageGroup: 'all',
    maxStudents: 12,
    enrolledStudents: 10, // Increased to include our mock user
    price: 30,
    category: 'memorization',
    zoomMeeting: {
      id: 'zm1',
      sessionId: '1',
      meetingId: '123456789',
      joinUrl: 'https://zoom.us/j/123456789?pwd=example',
      hostUrl: 'https://zoom.us/s/123456789?zak=example',
      password: 'quran123',
      startTime: '2025-09-03T09:00:00Z',
      duration: 120,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=123456789&pwd=quran123',
      webLink: 'https://zoom.us/wc/join/123456789?pwd=quran123',
      generatedAt: '2025-09-03T07:00:00Z',
      isReady: true
    },
    materials: ['Quran', 'Basic Tajweed Guide']
  },
  {
    title: 'Session 2',
    description: 'Advanced Tajweed and recitation techniques.',
    instructor: mockInstructor,
    schedule: {
      startTime: '14:00',
      endTime: '16:00',
      timezone: 'EST'
    },
    region: 'North America',
    levelRange: 'advanced-focus',
    ageGroup: 'adult',
    maxStudents: 10,
    enrolledStudents: 8,
    price: 45,
    category: 'tajweed',
    zoomMeeting: {
      id: 'zm2',
      sessionId: '2',
      meetingId: '987654321',
      joinUrl: 'https://zoom.us/j/987654321?pwd=example',
      hostUrl: 'https://zoom.us/s/987654321?zak=example',
      password: 'tajweed123',
      startTime: '2025-09-04T14:00:00Z',
      duration: 120,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=987654321&pwd=tajweed123',
      webLink: 'https://zoom.us/wc/join/987654321?pwd=tajweed123',
      generatedAt: '2025-09-04T12:00:00Z',
      isReady: true
    },
    materials: ['Quran', 'Tajweed Rules', 'Practice Sheets']
  },
  {
    title: 'Session 3',
    description: 'Beginner-friendly memorization techniques.',
    instructor: mockInstructor,
    schedule: {
      startTime: '19:00',
      endTime: '21:00',
      timezone: 'EST'
    },
    region: 'North America',
    levelRange: 'beginner-focus',
    ageGroup: 'all',
    maxStudents: 15,
    enrolledStudents: 12,
    price: 25,
    category: 'memorization',
    zoomMeeting: {
      id: 'zm3',
      sessionId: '3',
      meetingId: '456789123',
      joinUrl: 'https://zoom.us/j/456789123?pwd=example',
      hostUrl: 'https://zoom.us/s/456789123?zak=example',
      password: 'hifz123',
      startTime: '2025-09-04T19:00:00Z',
      duration: 120,
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
    title: 'Session 4',
    description: 'Family-friendly Quran learning session.',
    instructor: mockInstructor,
    schedule: {
      startTime: '16:00',
      endTime: '18:00',
      timezone: 'EST'
    },
    region: 'North America',
    levelRange: 'mixed',
    ageGroup: 'all',
    maxStudents: 20,
    enrolledStudents: 15,
    price: 20,
    category: 'recitation',
    zoomMeeting: {
      id: 'zm4',
      sessionId: '4',
      meetingId: '789456123',
      joinUrl: 'https://zoom.us/j/789456123?pwd=example',
      hostUrl: 'https://zoom.us/s/789456123?zak=example',
      password: 'family123',
      startTime: '2025-09-04T16:00:00Z',
      duration: 120,
      recordingEnabled: true,
      status: 'scheduled',
      nativeAppLink: 'zoommtg://zoom.us/join?confno=789456123&pwd=family123',
      webLink: 'https://zoom.us/wc/join/789456123?pwd=family123',
      generatedAt: '2025-09-04T14:00:00Z',
      isReady: true
    },
    materials: ['Quran', 'Family Activity Sheets']
  }
];

// Generate all session instances (Mon-Thu for each template)
const mockSessions: Session[] = baseSessionTemplates.flatMap((template, index) => 
  createWeeklySessionInstances(template, index + 1)
);

// Create simple sessions for the sessions tab (just one instance of each)
const mockSessionsForTab: Session[] = baseSessionTemplates.map((template, index) => ({
  ...template as Session,
  id: (index + 1).toString(),
  schedule: {
    ...template.schedule,
    day: 'Monday' 
  },
  status: 'active' as const
}));

// Helper to get upcoming sessions for enrolled sessions only
const getUpcomingEnrolledSessions = (allSessions: Session[], enrolledSessionIds: string[]) => {
  // Simulate Tuesday (Sept 3, 2025) to show in-progress session
  const today = new Date('2025-09-03'); // September 3, 2025 (Tuesday)
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1); // Monday
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Wednesday
  
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Get sessions for yesterday, today, tomorrow
  const relevantDays: string[] = [];
  
  // Add yesterday if it's a session day (Mon-Thu)
  const yesterdayName = days[yesterday.getDay()];
  if (['Monday', 'Tuesday', 'Wednesday', 'Thursday'].includes(yesterdayName)) {
    relevantDays.push(yesterdayName);
  }
  
  // Add today if it's a session day (Mon-Thu)
  const todayName = days[today.getDay()];
  if (['Monday', 'Tuesday', 'Wednesday', 'Thursday'].includes(todayName)) {
    relevantDays.push(todayName);
  }
  
  // Add tomorrow if it's a session day (Mon-Thu)
  const tomorrowName = days[tomorrow.getDay()];
  if (['Monday', 'Tuesday', 'Wednesday', 'Thursday'].includes(tomorrowName)) {
    relevantDays.push(tomorrowName);
  }
  
  // If we don't have enough days (weekends), add Monday for next week perspective
  if (relevantDays.length < 2) {
    relevantDays.push('Monday');
  }
  
  // Filter sessions: must be enrolled AND in relevant days
  return allSessions.filter(session => {
    const baseSessionId = session.id.split('-')[0]; // Get base session ID (1, 2, 3, 4)
    return enrolledSessionIds.includes(baseSessionId) && 
           relevantDays.includes(session.schedule.day);
  }).slice(0, 6); // Limit to 6 sessions for display
};
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

// Main App Content Component
function AppContent() {
  const { user: currentUser, logout } = useAuth();
  const { toasts, removeToast, success, error } = useToast();
  const navigate = useNavigate();

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
        age: userData.age,
        timezone: userData.timezone,
        parentInfo: userData.parentInfo
      };

      const response = await authService.register(registerData);
      
      console.log('Registration response:', response);
      console.log('Response success:', response.success, 'Response data:', response.data);
      
      if (response.success && response.data) {
        console.log('Registration successful, navigating to /countdown');
        success('Welcome to Ismail Academy!', 'Your account has been created successfully.');
        // Use window.location for hard navigation to avoid React Router issues
        window.location.href = '/countdown';
        return; // Prevent any further execution
      } else {
        console.error('Registration failed:', response.message || response.error);
        error('Registration Failed', response.message || response.error || 'An unknown error occurred.');
        // Throw error so SignupForm can reset its loading state (but don't show another toast)
        throw new Error('HANDLED_ERROR');
      }
    } catch (err: any) {
      // Only show toast if it's not already handled above
      if (err?.message !== 'HANDLED_ERROR') {
        console.error('Registration error:', err);
        error('Registration Error', 'Registration failed. Please check your connection and try again.');
      }
      // Re-throw so SignupForm can catch and reset loading state
      throw err;
    }
  };

  const handleFamilySignup = async (familyData: FamilySignupFormData) => {
    console.log('Family signup attempt:', familyData);
    
    try {
      const response = await authService.registerFamily(familyData);
      
      console.log('Family registration response:', response);
      
      if (response.success) {
        const childCount = familyData.children.length;
        success(
          'Registration Successful!', 
          `${childCount} ${childCount === 1 ? 'child has' : 'children have'} been registered. Login credentials have been sent to ${familyData.parentEmail}`
        );
        // Use window.location for hard navigation to avoid React Router issues
        window.location.href = '/countdown';
        return; // Prevent any further execution
      } else {
        console.error('Family registration failed:', response.message || response.error);
        error('Registration Failed', response.message || response.error || 'An unknown error occurred.');
        // Throw error so SignupForm can reset its loading state (but don't show another toast)
        throw new Error('HANDLED_ERROR');
      }
    } catch (err: any) {
      // Only show toast if it's not already handled above
      if (err?.message !== 'HANDLED_ERROR') {
        console.error('Family registration error:', err);
        error('Registration Error', 'Registration failed. Please check your connection and try again.');
      }
      // Re-throw so SignupForm can catch and reset loading state
      throw err;
    }
  };

  const handleLogout = () => {
    logout(); // Use the useAuth logout function
    success('Logged Out', 'You have been successfully logged out.');
    // Force navigation to home page
    navigate('/', { replace: true });
  };

  const handleJoinSession = (sessionId: string) => {
    console.log('Joining session:', sessionId);
    success('Joining Session', 'Redirecting to Zoom meeting...');
    window.open('https://zoom.us/j/meeting-id', '_blank');
  };

  const handleDeleteSession = (sessionId: string) => {
    console.log('Deleting session:', sessionId);
    success('Session Deleted', 'The session has been removed.');
  };

  const handleStartSession = (sessionId: string) => {
    console.log('Starting session:', sessionId);
    success('Session Started', 'The session is now live.');
    window.open('https://zoom.us/start/meeting-id', '_blank');
  };

  const handlePaymentComplete = (payment: Payment) => {
    console.log('Payment completed:', payment);
    success('Payment Successful', 'Your payment has been processed successfully.');
  };

  const handleAddRecitation = (entry: Omit<RecitationEntry, 'id' | 'userId' | 'createdAt'>) => {
    console.log('Adding recitation entry:', entry);
    success('Recitation Added', 'Your recitation entry has been saved.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Routes>
        <Route 
          path="/" 
          element={
            <LandingPage
              onGetStarted={() => {
                console.log('Get Started clicked - navigating to /signup');
                navigate('/signup');
              }}
              onLogin={() => {
                console.log('Sign In clicked - navigating to /login');
                navigate('/login');
              }}
              onWatchSalatVideos={() => {
                console.log('Watch Salat Videos clicked - navigating to /salat-videos');
                navigate('/salat-videos');
              }}
              onViewCourses={() => {
                console.log('Courses clicked - navigating to /courses');
                navigate('/courses');
              }}
              onContactUs={() => {
                console.log('Contact clicked - navigating to /contact');
                navigate('/contact');
              }}
            />
          } 
        />
        
        <Route 
          path="/salat-videos" 
          element={
            <SalatVideosPage
              onBack={() => navigate('/')}
              onGetStarted={() => navigate('/signup')}
              onLogin={() => navigate('/login')}
              onViewCourses={() => navigate('/courses')}
              onContactUs={() => navigate('/contact')}
            />
          } 
        />

        <Route 
          path="/courses" 
          element={
            <CoursesPage
              onBack={() => navigate('/')}
              onGetStarted={() => navigate('/signup')}
              onLogin={() => navigate('/login')}
              onWatchSalatVideos={() => navigate('/salat-videos')}
              onContactUs={() => navigate('/contact')}
            />
          } 
        />

        <Route 
          path="/contact" 
          element={
            <ContactPage
              onBack={() => navigate('/')}
              onGetStarted={() => navigate('/signup')}
              onLogin={() => navigate('/login')}
              onWatchSalatVideos={() => navigate('/salat-videos')}
              onViewCourses={() => navigate('/courses')}
            />
          } 
        />
        
        <Route 
          path="/login" 
          element={
            currentUser ? 
              <Navigate to={currentUser.role === 'instructor' ? '/instructor-dashboard' : '/dashboard'} replace /> :
              <LoginForm
                onBack={() => navigate('/')}
                onSignupClick={() => navigate('/signup')}
                onLoginSuccess={() => {
                  // Wait for useAuth state to update before navigating
                  setTimeout(() => {
                    // Navigate to countdown page - launching January 5th, 2026
                    navigate('/countdown', { replace: true });
                  }, 100); // Small delay to allow state update
                }}
                onToastSuccess={success}
                onToastError={error}
              />
          } 
        />
        
        <Route 
          path="/signup" 
          element={
            currentUser ? 
              <Navigate to={currentUser.role === 'instructor' ? '/instructor-dashboard' : '/dashboard'} replace /> :
              <EnhancedSignupForm
                onSignup={handleSignup}
                onFamilySignup={handleFamilySignup}
                onLoginClick={() => navigate('/login')}
              />
          } 
        />

        <Route 
          path="/countdown" 
          element={
            <CountdownPage
              userName={currentUser?.firstName || 'Student'}
              onNotifyMe={() => {
                success('Notification Set!', 'We\'ll email you when we launch on January 5th, 2026.');
              }}
              onLogout={handleLogout}
            />
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            (() => {
              // During login process, check both currentUser and localStorage
              const userFromStorage = localStorage.getItem('quran-academy-user');
              const fallbackUser = userFromStorage ? JSON.parse(userFromStorage) : null;
              const effectiveUser = currentUser || fallbackUser;
              
              if (effectiveUser && effectiveUser.role === 'student') {
                // For demo purposes, ensure user is enrolled in Session 1
                const userWithEnrollment = {
                  ...effectiveUser,
                  selectedSessions: effectiveUser.selectedSessions?.length > 0 ? effectiveUser.selectedSessions : ['1']
                };
                
                return (
                  <StudentDashboard
                    user={userWithEnrollment}
                    availableSessions={mockSessionsForTab}
                    upcomingSessions={getUpcomingEnrolledSessions(mockSessions, userWithEnrollment.selectedSessions || [])}
                    notifications={mockNotifications}
                    recitationEntries={mockRecitationEntries}
                    onJoinSession={handleJoinSession}
                    onPaymentComplete={handlePaymentComplete}
                    onAddRecitation={handleAddRecitation}
                    onLogout={handleLogout}
                  />
                );
              } else {
                return <Navigate to="/login" replace />;
              }
            })()
          } 
        />
        
        <Route 
          path="/instructor-dashboard" 
          element={
            (() => {
              // During login process, check both currentUser and localStorage
              const userFromStorage = localStorage.getItem('quran-academy-user');
              const fallbackUser = userFromStorage ? JSON.parse(userFromStorage) : null;
              const effectiveUser = currentUser || fallbackUser;
              
              if (effectiveUser && effectiveUser.role === 'instructor') {
                return (
                  <InstructorDashboard
                    instructor={mockInstructor}
                    sessions={mockSessions}
                    students={[mockUser]}
                    onDeleteSession={handleDeleteSession}
                    onStartSession={handleStartSession}
                    onLogout={handleLogout}
                  />
                );
              } else {
                return <Navigate to="/login" replace />;
              }
            })()
          } 
        />
        
        {/* Catch all route - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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

// Main App Component with Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
