import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Users, ExternalLink, Play, Smartphone, Globe } from 'lucide-react';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';
import { Session } from '../../types';
import { ZoomLinkService } from '../../services/zoomLinkService';

interface UpcomingSessionsProps {
  sessions: Session[];
  onJoinSession: (sessionId: string) => void;
  userName?: string;
  userEmail?: string;
}

export const UpcomingSessions: React.FC<UpcomingSessionsProps> = ({
  sessions,
  onJoinSession,
  userName,
  userEmail
}) => {
  const [zoomAppAvailable, setZoomAppAvailable] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    // Check Zoom app availability for each session
    sessions.forEach(async (session) => {
      if (session.zoomMeeting) {
        const hasZoom = await ZoomLinkService.detectZoomApp();
        setZoomAppAvailable(prev => ({
          ...prev,
          [session.id]: hasZoom
        }));
      }
    });
  }, [sessions]);

  const handleSmartJoin = async (session: Session) => {
    if (!session.zoomMeeting) {
      onJoinSession(session.id);
      return;
    }

    try {
      await ZoomLinkService.joinSession(session.zoomMeeting, userName, userEmail);
    } catch (error) {
      console.error('Failed to join session:', error);
      // Fallback to original join handler
      onJoinSession(session.id);
    }
  };

  const getMeetingStatusInfo = (session: Session) => {
    return ZoomLinkService.getMeetingStatus(session);
  };

  const getJoinButtonProps = (session: Session) => {
    const statusInfo = getMeetingStatusInfo(session);
    const hasZoomApp = zoomAppAvailable[session.id];
    
    if (!statusInfo.canJoin) {
      return {
        variant: 'outline' as const,
        disabled: true,
        text: statusInfo.message,
        icon: <Clock className="w-4 h-4" />
      };
    }

    if (statusInfo.status === 'live') {
      return {
        variant: 'default' as const,
        disabled: false,
        text: hasZoomApp ? 'Join with App' : 'Join in Browser',
        icon: hasZoomApp ? <Smartphone className="w-4 h-4" /> : <Globe className="w-4 h-4" />
      };
    }

    return {
      variant: 'default' as const,
      disabled: false,
      text: 'Join Session',
      icon: <Video className="w-4 h-4" />
    };
  };
    const minutesDiff = Math.round(timeDiff / (1000 * 60));
    
    if (minutesDiff < 0) return 'In progress';
    if (minutesDiff === 0) return 'Starting now';
    if (minutesDiff < 60) return `Starts in ${minutesDiff}min`;
    
    const hours = Math.floor(minutesDiff / 60);
    const minutes = minutesDiff % 60;
    return `Starts in ${hours}h ${minutes}m`;
  };

  if (sessions.length === 0) {
    return (
      <Card variant="elevated">
        <CardContent className="text-center py-12">
          <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Upcoming Sessions</h3>
          <p className="text-slate-600 mb-4">
            You haven't enrolled in any sessions yet. Browse available sessions to get started.
          </p>
          <Button>Browse Sessions</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900">Upcoming Sessions</h2>
        <Badge variant="info">{sessions.length} enrolled</Badge>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => {
          const status = getSessionStatus(session);
          const canJoin = status === 'live' || status === 'starting-soon';

          return (
            <Card key={session.id} variant="elevated" className="hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">{session.title}</h3>
                      {status === 'live' && (
                        <Badge variant="success" className="animate-pulse">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          LIVE
                        </Badge>
                      )}
                      {status === 'starting-soon' && (
                        <Badge variant="warning">Starting Soon</Badge>
                      )}
                    </div>
                    <p className="text-slate-600 mb-3">{session.description}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">{session.schedule.day}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">
                      {session.schedule.startTime} - {session.schedule.endTime} ({session.schedule.timezone})
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">
                      {session.enrolledStudents}/{session.maxStudents} students
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    {formatTimeUntilSession(session)}
                  </div>
                  
                  <div className="flex space-x-3">
                    {session.zoomMeeting && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(session.zoomMeeting!.joinUrl, '_blank')}
                        className="flex items-center space-x-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Session Details</span>
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => onJoinSession(session.id)}
                      disabled={!canJoin}
                      variant={canJoin ? "primary" : "outline"}
                      size="sm"
                      className={`flex items-center space-x-2 ${
                        status === 'live' ? 'bg-green-600 hover:bg-green-700' : ''
                      }`}
                    >
                      {status === 'live' ? (
                        <>
                          <Play className="w-4 h-4" />
                          <span>Join Now</span>
                        </>
                      ) : status === 'starting-soon' ? (
                        <>
                          <Video className="w-4 h-4" />
                          <span>Join Session</span>
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4" />
                          <span>Join Session</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Zoom Meeting Info */}
                {session.zoomMeeting && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2 text-slate-600">
                        <Video className="w-4 h-4" />
                        <span>Zoom Meeting ID: {session.zoomMeeting.meetingId}</span>
                      </div>
                      {session.zoomMeeting.recordingEnabled && (
                        <Badge variant="info" className="text-xs">Recording Enabled</Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
