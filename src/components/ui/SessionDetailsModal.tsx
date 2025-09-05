import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Video, 
  Download, 
  Phone, 
  Globe, 
  BookOpen,
  Award,
  Bell,
  MessageSquare,
  Settings,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { Button } from './Button';
import { Card, CardContent, CardHeader } from './Card';
import { Badge } from './Badge';
import { Session } from '../../types';

interface SessionDetailsModalProps {
  session: Session;
  isOpen: boolean;
  onClose: () => void;
  onJoinSession: (sessionId: string) => void;
  userAttendance?: {
    attended: number;
    total: number;
    rate: number;
  };
}

export const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({
  session,
  isOpen,
  onClose,
  onJoinSession,
  userAttendance = { attended: 8, total: 16, rate: 87 }
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const generateCalendarEvent = () => {
    const startTime = new Date(session.zoomMeeting?.startTime || '');
    const endTime = new Date(startTime.getTime() + (session.zoomMeeting?.duration || 120) * 60000);
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Ismail Academy//Quran Sessions//EN',
      'BEGIN:VEVENT',
      `DTSTART:${startTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTEND:${endTime.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:${session.title} - Quran Learning Session`,
      `DESCRIPTION:Join your Quran learning session with ${session.instructor.name}\\n\\nZoom Meeting ID: ${session.zoomMeeting?.meetingId}\\nPassword: ${session.zoomMeeting?.password}\\n\\nJoin URL: ${session.zoomMeeting?.joinUrl}`,
      `LOCATION:Online via Zoom`,
      'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${session.title.replace(/\s+/g, '_')}_Schedule.ics`;
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">{session.title}</h2>
            <p className="text-blue-100 mt-1">{session.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            
            {/* Left Column - Main Details */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Schedule Information */}
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Schedule Details</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Weekly Pattern</p>
                      <p className="font-medium">Monday - Thursday</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Time</p>
                      <p className="font-medium">{formatTime(session.schedule.startTime)} - {formatTime(session.schedule.endTime)} {session.schedule.timezone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Duration</p>
                      <p className="font-medium">{session.zoomMeeting?.duration || 120} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Status</p>
                      <Badge variant={
                        session.status === 'active' ? 'success' :
                        session.status === 'in-progress' ? 'warning' :
                        session.status === 'ended' ? 'danger' : 'default'
                      }>
                        {session.status === 'in-progress' ? 'Live Now' : session.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-200">
                    <Button onClick={generateCalendarEvent} variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Add to Calendar (.ics)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Zoom Meeting Details */}
              {session.zoomMeeting && (
                <Card variant="elevated">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Video className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-semibold">Meeting Details</h3>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Meeting ID</p>
                        <div className="flex items-center space-x-2">
                          <p className="font-mono font-medium">{session.zoomMeeting.meetingId}</p>
                          <button
                            onClick={() => copyToClipboard(session.zoomMeeting!.meetingId, 'Meeting ID')}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            {copiedText === 'Meeting ID' ? 
                              <Check className="w-4 h-4 text-green-600" /> : 
                              <Copy className="w-4 h-4 text-slate-400" />
                            }
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Password</p>
                        <div className="flex items-center space-x-2">
                          <p className="font-mono font-medium">{session.zoomMeeting.password}</p>
                          <button
                            onClick={() => copyToClipboard(session.zoomMeeting!.password, 'Password')}
                            className="p-1 hover:bg-slate-100 rounded"
                          >
                            {copiedText === 'Password' ? 
                              <Check className="w-4 h-4 text-green-600" /> : 
                              <Copy className="w-4 h-4 text-slate-400" />
                            }
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-slate-600">Join Options</p>
                      <div className="space-y-2">
                        <Button 
                          onClick={() => onJoinSession(session.id)}
                          className="w-full"
                          disabled={session.status === 'ended' || session.status === 'cancelled'}
                        >
                          <Video className="w-4 h-4 mr-2" />
                          Join with Zoom App
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => window.open(session.zoomMeeting?.webLink, '_blank')}
                          className="w-full"
                          disabled={session.status === 'ended' || session.status === 'cancelled'}
                        >
                          <Globe className="w-4 h-4 mr-2" />
                          Join in Browser
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Session Materials */}
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Materials & Resources</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-slate-600 mb-2">Required Materials</p>
                      <div className="space-y-1">
                        {session.materials?.map((material, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="text-sm">{material}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-slate-200">
                      <p className="text-sm text-slate-600 mb-2">Additional Resources</p>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Download className="w-4 h-4 mr-2" />
                          Download Session Guide (PDF)
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Previous Recordings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              
              {/* Instructor Info */}
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Instructor</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                      <User className="w-8 h-8 text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{session.instructor.name}</h4>
                      <p className="text-sm text-slate-600">{session.instructor.experience}+ years experience</p>
                      <div className="flex items-center justify-center space-x-1 mt-1">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{session.instructor.rating}/5.0</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Contact Instructor
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Tracking */}
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Award className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Your Progress</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Attendance Rate</span>
                      <span className="font-medium">{userAttendance.rate}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${userAttendance.rate}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {userAttendance.attended} of {userAttendance.total} sessions attended
                    </p>
                  </div>
                  
                  <div className="pt-3 border-t border-slate-200">
                    <Button variant="outline" size="sm" className="w-full">
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Detailed Progress
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card variant="elevated">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Quick Actions</h3>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Bell className="w-4 h-4 mr-2" />
                    Set Reminders
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Test Audio/Video
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start text-red-600 hover:text-red-700">
                    <X className="w-4 h-4 mr-2" />
                    Leave Session
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-slate-200 bg-slate-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button 
            onClick={() => onJoinSession(session.id)}
            disabled={session.status === 'ended' || session.status === 'cancelled'}
          >
            <Video className="w-4 h-4 mr-2" />
            {session.status === 'in-progress' ? 'Join Live Session' : 'Join Session'}
          </Button>
        </div>
      </div>
    </div>
  );
};
