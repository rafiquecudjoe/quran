import React from 'react';
import { Calendar, Clock, Users, User, Play } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Session } from '../../types';

interface SessionCardProps {
  session: Session;
  onJoin?: (sessionId: string) => void;
  onEnroll?: (sessionId: string) => void;
  onEdit?: (sessionId: string) => void;
  onDelete?: (sessionId: string) => void;
  showActions?: 'student' | 'instructor' | 'none';
  isEnrolled?: boolean;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  onJoin,
  onEnroll,
  onEdit,
  onDelete,
  showActions = 'none',
  isEnrolled = false
}) => {
  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getLevelVariant = (level: string) => {
    switch (level) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      case 'hifz': return 'info';
      default: return 'default';
    }
  };

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'recitation': return 'info';
      case 'memorization': return 'warning';
      case 'tajweed': return 'success';
      case 'translation': return 'default';
      case 'islamic-studies': return 'danger';
      default: return 'default';
    }
  };

  return (
    <Card variant="elevated" className="hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex space-x-2">
            <Badge variant={getLevelVariant(session.level)}>
              {session.level}
            </Badge>
            <Badge variant={getCategoryVariant(session.category)}>
              {session.category}
            </Badge>
          </div>
          {session.status && (
            <Badge variant={session.status === 'active' ? 'success' : 'warning'}>
              {session.status}
            </Badge>
          )}
        </div>
        
        <h4 className="font-semibold text-slate-900 mb-2 text-lg">{session.title}</h4>
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
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm text-slate-600">{session.instructor.name}</span>
          </div>
          <span className="text-lg font-bold text-emerald-600">${session.price}</span>
        </div>

        {/* Progress bar for enrollment */}
        <div className="mb-4">
          <div className="bg-slate-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full" 
              style={{ width: `${(session.enrolledStudents / session.maxStudents) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {session.maxStudents - session.enrolledStudents} spots remaining
          </p>
        </div>
        
        {/* Action buttons based on user type */}
        {showActions === 'student' && (
          <div className="flex space-x-2">
            {isEnrolled ? (
              <Button 
                className="flex-1" 
                onClick={() => onJoin?.(session.id)}
                disabled={!session.zoomLink}
              >
                <Play className="w-4 h-4 mr-2" />
                Join Session
              </Button>
            ) : (
              <Button 
                className="flex-1"
                onClick={() => onEnroll?.(session.id)}
                disabled={session.enrolledStudents >= session.maxStudents}
              >
                {session.enrolledStudents >= session.maxStudents ? 'Full' : 'Enroll Now'}
              </Button>
            )}
            <Button variant="outline" size="sm">
              Details
            </Button>
          </div>
        )}

        {showActions === 'instructor' && (
          <div className="flex space-x-2">
            <Button 
              className="flex-1" 
              onClick={() => onJoin?.(session.id)}
            >
              Start Session
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit?.(session.id)}
            >
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete?.(session.id)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
