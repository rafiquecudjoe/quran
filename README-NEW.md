# Quran Academy - Online Learning Platform

A beautiful, modern web application for teaching and learning the Holy Quran through live Zoom sessions with monthly subscription plans.

## ✨ Features

### 🎯 For Students
- **Beautiful Landing Page** - Modern, responsive design with engaging hero section
- **User Authentication** - Secure login/signup with user type and learning level selection
- **Interactive Dashboard** - Track progress, view achievements, manage sessions
- **Session Management** - Browse, enroll, and join live Zoom sessions
- **Progress Tracking** - Weekly goals, completed lessons, memorized verses
- **Achievement System** - Gamified learning with badges and milestones
- **Subscription Plans** - Flexible monthly plans (Basic, Premium, Unlimited)

### 👨‍🏫 For Instructors
- **Instructor Dashboard** - Comprehensive session and student management
- **Session Creation** - Easy-to-use form for creating new sessions
- **Student Analytics** - Track student progress and engagement
- **Revenue Tracking** - Monitor earnings and session performance
- **Zoom Integration Ready** - Built for seamless video call integration

### 🎨 Modern Design System
- **Tailwind CSS** - Utility-first CSS framework for rapid development
- **Beautiful UI Components** - Reusable, accessible components
- **Gradient Themes** - Emerald and teal color scheme
- **Responsive Design** - Mobile-first approach for all devices
- **Smooth Animations** - Delightful user interactions

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **State Management**: React Hooks + Local Storage
- **Future Integration**: Zoom API for video sessions

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   └── Loading.tsx
│   ├── auth/             # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   └── dashboard/        # Dashboard components
│       ├── StudentDashboard.tsx
│       └── InstructorDashboard.tsx
├── pages/
│   └── LandingPage.tsx   # Main landing page
├── hooks/
│   └── useAuth.ts        # Authentication hook
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   └── cn.ts             # Utility functions
└── App.tsx               # Main application component
```

## 🎨 UI Components

### Button Component
- Multiple variants: primary, secondary, outline, ghost, danger
- Different sizes: sm, md, lg
- Loading states and disabled states
- Gradient backgrounds with hover effects

### Card Components
- Card, CardHeader, CardContent, CardFooter
- Elevated, bordered, and default variants
- Consistent spacing and shadows

### Input Component
- Label, error, and helper text support
- Left and right icon support
- Focus states and validation styling

### Badge Component
- Color variants: default, success, warning, danger, info
- Multiple sizes
- Rounded pill design

## 📱 Pages & Features

### Landing Page
- **Hero Section**: Compelling introduction with call-to-action
- **Features Section**: Highlight platform benefits
- **Testimonials**: Student success stories
- **Pricing Plans**: Clear subscription options
- **Footer**: Links and company information

### Authentication
- **Login Form**: Email/password with remember me option
- **Signup Form**: Comprehensive registration with user type selection
- **Password visibility toggles**
- **Form validation and error handling**

### Student Dashboard
- **Overview Tab**: Progress stats, upcoming sessions, achievements
- **Sessions Tab**: Browse and enroll in available sessions
- **Progress Tab**: Detailed learning analytics
- **Schedule Tab**: Manage enrolled sessions

### Instructor Dashboard
- **Overview Tab**: Revenue, student count, session stats
- **Sessions Tab**: Create, edit, and manage sessions
- **Students Tab**: View all students and their progress
- **Analytics Tab**: Performance metrics and reports

## 🔧 Setup & Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learn-quran-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

## 🎮 Demo Credentials

### Student Login
- Email: `student@example.com`
- Password: `password`

### Instructor Login
- Email: `instructor@example.com`
- Password: `password`

## 🔮 Future Enhancements

### Backend Integration
- **User Authentication**: JWT-based authentication system
- **Database**: PostgreSQL with Prisma ORM
- **API**: RESTful API with Express.js/Node.js
- **Payment Processing**: Stripe integration for subscriptions
- **File Storage**: AWS S3 for materials and recordings

### Zoom Integration
- **Meeting Creation**: Automatic Zoom meeting creation
- **Join Links**: Seamless session joining
- **Recording Management**: Automatic recording and storage
- **Attendance Tracking**: Monitor student participation

### Advanced Features
- **Real-time Chat**: In-session messaging
- **Screen Sharing**: Quran text sharing during sessions
- **Mobile App**: React Native mobile application
- **Offline Learning**: Downloadable content for offline study
- **AI Assistant**: Pronunciation feedback and corrections

### Analytics & Reporting
- **Learning Analytics**: Detailed progress tracking
- **Instructor Insights**: Teaching effectiveness metrics
- **Revenue Analytics**: Financial reporting and forecasting
- **Student Retention**: Engagement and retention metrics

## 🎯 Business Model

### Subscription Plans
- **Basic** ($29/month): 2 sessions/week, basic tracking
- **Premium** ($49/month): 4 sessions/week, advanced features
- **Unlimited** ($79/month): Unlimited sessions, 1-on-1 support

### Revenue Streams
- Monthly subscription fees
- One-time session purchases
- Premium materials and resources
- Certification programs

## 🏗️ Architecture

### Component Architecture
- **Atomic Design**: Small, reusable components
- **Composition Pattern**: Flexible component composition
- **Props Interface**: Type-safe component props
- **Custom Hooks**: Reusable stateful logic

### State Management
- **Local State**: React useState for component state
- **Global State**: Context API for shared state
- **Persistent State**: Local storage for user preferences
- **Server State**: React Query for API data (future)

### Styling Strategy
- **Utility-First**: Tailwind CSS for rapid development
- **Component Variants**: Systematic component variations
- **Responsive Design**: Mobile-first responsive breakpoints
- **Design Tokens**: Consistent spacing, colors, and typography

## 📊 Performance

### Optimization Techniques
- **Code Splitting**: Lazy loading for route components
- **Bundle Optimization**: Vite for fast builds
- **Image Optimization**: Responsive images and lazy loading
- **Caching Strategy**: Browser caching for static assets

### Metrics to Track
- **Core Web Vitals**: LCP, FID, CLS measurements
- **Bundle Size**: JavaScript bundle optimization
- **Load Times**: Page load performance monitoring
- **User Experience**: Interaction and conversion metrics

## 🤝 Contributing

This platform is designed with modern React best practices and scalable architecture. The codebase is well-structured for future enhancements and team collaboration.

## 📄 License

This project is designed for educational and business purposes. Please ensure compliance with relevant licensing requirements.

---

**Built with ❤️ for the Muslim community worldwide**
