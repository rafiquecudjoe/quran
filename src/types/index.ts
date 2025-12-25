export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    country: string;
    dateOfBirth: string;
    role: 'student' | 'instructor' | 'admin';
    userType: 'child' | 'adult'; // child: 6-17, adult: 18+
    age?: number;
    profileImage?: string;
    dateJoined: string;
    subscription: Subscription;
    selectedSessions: string[];
    progress: LearningProgress;
    timezone: string;
    parentInfo?: ParentInfo; // Required for minors
}

export interface ParentInfo {
    firstName: string;
    lastName: string;
    email: string;
    telephone: string;
    relationship: 'mother' | 'father' | 'guardian';
}

export interface SignupFormData {
    // Step 1: Basic Information
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;

    // Step 2: Personal Details
    telephone: string;
    profilePicture?: File | string;
    country: string;
    dateOfBirth: string;
    quranLevel: string;
    timezone?: string;

    // Step 3: Parent/Guardian Information (if under 18)
    parentInfo?: {
        firstName: string;
        lastName: string;
        email: string;
        telephone: string;
        relationship: 'mother' | 'father' | 'guardian';
    };

    // Computed fields
    userType: 'child' | 'adult';
    age: number;
}

// Multi-child registration types
export type RegistrationType = 'adult' | 'parent';

export interface ChildInfo {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    quranLevel: string;
    age?: number;
}

export interface FamilySignupFormData {
    // Parent/Guardian contact information
    parentFirstName: string;
    parentLastName: string;
    parentEmail: string;
    parentTelephone: string;
    relationship: 'mother' | 'father' | 'guardian';
    country: string;
    timezone?: string;

    // Children information
    numberOfChildren: number;
    children: ChildInfo[];
}

export interface FamilyRegistrationResponse {
    success: boolean;
    message: string;
    data?: {
        parentEmail: string;
        childrenRegistered: {
            firstName: string;
            lastName: string;
            username: string;
            // Password not returned for security - sent via email only
        }[];
    };
    error?: string;
}

export interface Instructor {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    bio: string;
    qualifications: string[];
    experience: number;
    rating: number;
    totalStudents: number;
    specializations: string[];
}

export interface Session {
    id: string;
    title: string;
    description: string;
    instructor: Instructor;
    schedule: {
        day: string;
        startTime: string; // GMT time
        endTime: string; // GMT time
        timezone: string;
    };
    region: 'North America' | 'Europe' | 'Asia Pacific' | 'Middle East' | 'Africa' | 'South America'; // Sessions organized by time zone regions
    levelRange: 'mixed' | 'beginner-focus' | 'advanced-focus'; // Indicates if session has any particular focus, but all levels welcome
    ageGroup: 'child' | 'adult' | 'all'; // child: 6-17, adult: 18+
    maxStudents: number;
    enrolledStudents: number;
    price: number;
    category: 'recitation' | 'memorization' | 'tajweed' | 'translation' | 'islamic-studies';
    status: 'active' | 'inactive' | 'full' | 'cancelled' | 'in-progress' | 'ended';
    zoomMeeting?: ZoomMeeting;
    materials: string[];
}

export interface Subscription {
    id: string;
    plan: 'free' | 'basic' | 'premium' | 'unlimited'; // free: salat videos only
    status: 'active' | 'inactive' | 'cancelled' | 'pending';
    startDate: string;
    endDate: string;
    price: number;
    autoRenew: boolean;
    sessionsIncluded: number;
    sessionsUsed: number;
}

export interface LearningProgress {
    totalHours: number;
    completedLessons: number;
    currentSurah: string;
    memorizedVerses: number;
    achievements: Achievement[];
    weeklyGoal: number;
    weeklyProgress: number;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    dateEarned: string;
    category: 'memorization' | 'recitation' | 'attendance' | 'milestone';
}

export interface Notification {
    id: string;
    type: 'session_reminder' | 'achievement' | 'payment' | 'announcement';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    actionUrl?: string;
}

export interface ZoomMeeting {
    id: string;
    sessionId: string;
    meetingId: string;
    joinUrl: string;
    hostUrl: string;
    password: string;
    startTime: string;
    duration: number;
    recordingEnabled: boolean;
    recordingUrl?: string;
    status: 'scheduled' | 'started' | 'ended';
    nativeAppLink?: string; // For mobile/desktop app deep linking
    webLink?: string; // Fallback web browser link
    generatedAt?: string; // When the links were generated
    isReady: boolean; // Whether meeting is ready to join
}

export interface ZoomLinkGeneration {
    sessionId: string;
    scheduledFor: string; // When to generate the link (2 hours before session)
    status: 'pending' | 'generating' | 'completed' | 'failed';
    attempts: number;
    lastAttempt?: string;
    error?: string;
    createdAt: string;
}

export interface Payment {
    id: string;
    userId: string;
    sessionId: string;
    amount: number;
    currency: 'USD';
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: 'card' | 'paypal';
    transactionId?: string;
    createdAt: string;
    completedAt?: string;
}

export interface RecitationEntry {
    id: string;
    userId: string;
    date: string;
    surahName: string;
    verses: string;
    duration: number; // in minutes
    notes: string;
    createdAt: string;
}

export interface Recommendation {
    id: string;
    userId: string;
    title: string;
    description: string;
    category: 'feature' | 'content' | 'instructor' | 'technical' | 'general';
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
    createdAt: string;
    updatedAt?: string;
}

export interface Testimonial {
    id?: string;
    userId: string;
    userName: string;
    userEmail: string;
    rating: 1 | 2 | 3 | 4 | 5; // Star rating
    title: string;
    message: string;
    course?: string; // Which course/session they're testimonial about
    approved: boolean; // Whether it's approved for public display
    featured: boolean; // Whether to feature on homepage
    createdAt: string;
    updatedAt?: string;
}

export interface SalatVideo {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnailUrl?: string;
    duration: number; // in minutes
    category: 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'general';
    language: string;
    uploadDate: string;
    views: number;
    isPublished: boolean;
}

export interface SessionSubscription {
    id: string;
    userId: string;
    sessionId: string;
    subscriptionDate: string;
    status: 'active' | 'cancelled' | 'completed';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    price: number;
    discount?: number;
    totalPaid: number;
    nextPaymentDate?: string;
    userName: string;
    userEmail: string;
    sessionTitle: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    type: 'general' | 'session_specific' | 'urgent';
    targetAudience: 'all_students' | 'session_subscribers' | 'specific_users';
    sessionId?: string; // If targeting specific session subscribers
    targetUserIds?: string[]; // If targeting specific users
    createdBy: string; // Instructor ID
    createdAt: string;
    scheduledFor?: string; // If announcement is scheduled for later
    status: 'draft' | 'published' | 'scheduled';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    readBy: string[]; // Array of user IDs who have read the announcement
}
