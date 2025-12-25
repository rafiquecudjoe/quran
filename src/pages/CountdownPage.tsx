import React, { useState, useEffect } from 'react';
import { Book, Calendar, Clock, Star, Bell, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

interface CountdownPageProps {
  userName?: string;
  onNotifyMe?: () => void;
  onLogout?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownPage: React.FC<CountdownPageProps> = ({ 
  userName = 'Student',
  onNotifyMe,
  onLogout 
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isNotified, setIsNotified] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);

  // Launch date: January 5th, 2026 at 00:00:00
  const launchDate = new Date('2026-01-05T00:00:00');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference <= 0) {
        setIsLaunched(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNotifyMe = () => {
    setIsNotified(true);
    onNotifyMe?.();
  };

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 border border-blue-400/20">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white font-mono">
            {value.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full animate-pulse"></div>
      </div>
      <span className="mt-2 text-xs sm:text-sm font-medium text-slate-400 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );

  if (isLaunched) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl p-8 text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">We're Live! 🎉</h1>
            <p className="text-xl text-slate-600">
              Ismail Academy is now open. Start your Quran learning journey today!
            </p>
          </div>
          <Button size="lg" className="px-8">
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden flex flex-col">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-48 lg:w-72 h-48 lg:h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-64 lg:w-96 h-64 lg:h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] lg:w-[800px] h-[500px] lg:h-[800px] bg-blue-600/5 rounded-full blur-3xl"></div>
        
        {/* Animated stars */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: Math.random() * 0.5 + 0.3,
            }}
          ></div>
        ))}
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-3 sm:p-4 flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg sm:rounded-xl flex items-center justify-center">
            <Book className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <span className="text-white font-semibold text-sm sm:text-lg">Ismail Academy</span>
        </div>
        {onLogout && (
          <Button variant="ghost" onClick={onLogout} className="text-white/70 hover:text-white hover:bg-white/10 text-sm px-3 py-1">
            Logout
          </Button>
        )}
      </header>

      {/* Main content - flex-grow to fill available space */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 py-4 sm:py-6 overflow-y-auto">
        {/* Welcome message */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 mb-3 sm:mb-4">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
            <span className="text-blue-200 text-xs sm:text-sm font-medium">Welcome, {userName}!</span>
          </div>
          
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3">
            Something Amazing is
            <span className="block mt-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Coming Soon
            </span>
          </h1>
          
          <p className="text-sm sm:text-base lg:text-lg text-blue-200/80 max-w-xl mx-auto px-2">
            We're preparing an incredible Quran learning experience. 
            Launching <span className="text-white font-semibold">January 5th, 2026</span>.
          </p>
        </div>

        {/* Countdown timer */}
        <div className="flex justify-center gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6 lg:mb-8">
          <TimeBlock value={timeLeft.days} label="Days" />
          <div className="hidden sm:flex items-center text-2xl lg:text-3xl text-blue-400 font-bold self-start mt-6 lg:mt-8">:</div>
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <div className="hidden sm:flex items-center text-2xl lg:text-3xl text-blue-400 font-bold self-start mt-6 lg:mt-8">:</div>
          <TimeBlock value={timeLeft.minutes} label="Min" />
          <div className="hidden sm:flex items-center text-2xl lg:text-3xl text-blue-400 font-bold self-start mt-6 lg:mt-8">:</div>
          <TimeBlock value={timeLeft.seconds} label="Sec" />
        </div>

        {/* Launch date card - hidden on mobile, shown on tablet+ */}
        <div className="hidden sm:block mb-4 lg:mb-6 w-full max-w-sm">
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm lg:text-base">Launch Date</h3>
                <p className="text-blue-200 text-xs lg:text-sm">Monday, January 5th, 2026</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Notify button */}
        <div className="flex flex-col items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          {!isNotified ? (
            <Button 
              size="lg" 
              onClick={handleNotifyMe}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-base shadow-lg shadow-blue-500/30"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Notify Me at Launch
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-full px-4 py-2 sm:px-6 sm:py-3">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-green-300 font-medium text-sm sm:text-base">You'll be notified at launch!</span>
            </div>
          )}
          
          <p className="text-blue-300/60 text-xs sm:text-sm">
            We'll send you an email when we go live
          </p>
        </div>

        {/* Features preview - compact on mobile */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-2xl px-2">
          {[
            { icon: <Book className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />, title: 'Live Classes', desc: 'Via Zoom' },
            { icon: <Clock className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />, title: 'Flexible', desc: 'All time zones' },
            { icon: <Star className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />, title: 'Expert', desc: 'Certified teachers' },
          ].map((feature, i) => (
            <div 
              key={i}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-2 sm:p-3 lg:p-4 text-center hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-1 sm:mb-2 text-blue-400">
                {feature.icon}
              </div>
              <h4 className="text-white font-medium text-xs sm:text-sm lg:text-base">{feature.title}</h4>
              <p className="text-blue-200/60 text-[10px] sm:text-xs lg:text-sm hidden sm:block">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer - minimal */}
      <footer className="relative z-10 text-center py-2 sm:py-3 text-blue-300/40 text-xs flex-shrink-0">
        © 2026 Ismail Academy
      </footer>
    </div>
  );
};

export default CountdownPage;
