import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, Users, Smartphone, Globe } from 'lucide-react';
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
    
    // Handle cancelled sessions
    if (session.status === 'cancelled') {
      return {
        variant: 'outline' as const,
        disabled: true,
        text: 'Session Cancelled',
        icon: <Clock className="w-4 h-4" />
      };
    }
    
    // Handle ended sessions
    if (session.zoomMeeting?.status === 'ended') {
      return {
        variant: 'outline' as const,
        disabled: true,
        text: 'Session Ended',
        icon: <Clock className="w-4 h-4" />
      };
    }
    
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
        variant: 'primary' as const,
        disabled: false,
        text: hasZoomApp ? 'Join Live Session' : 'Join in Browser',
        icon: hasZoomApp ? <Smartphone className="w-4 h-4" /> : <Globe className="w-4 h-4" />
      };
    }

    return {
      variant: 'primary' as const,
      disabled: false,
      text: 'Join Session',
      icon: <Video className="w-4 h-4" />
    };
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
        <Badge variant="info">{sessions.length} upcoming</Badge>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => {
          const statusInfo = getMeetingStatusInfo(session);
          const buttonProps = getJoinButtonProps(session);
          
          return (
            <Card key={session.id} variant="elevated" className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900">{session.title}</h3>
                      <Badge 
                        variant={
                          statusInfo.status === 'live' ? 'success' : 
                          statusInfo.status === 'ready' ? 'warning' : 
                          session.status === 'cancelled' ? 'danger' :
                          session.zoomMeeting?.status === 'ended' ? 'default' : 'info'
                        }
                      >
                        {statusInfo.status === 'live' ? 'LIVE - JOIN NOW' : 
                         statusInfo.status === 'ready' ? 'READY TO JOIN' : 
                         session.status === 'cancelled' ? 'CANCELLED' :
                         session.zoomMeeting?.status === 'ended' ? 'SESSION ENDED' : 'UPCOMING'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-slate-600 mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Instructor: {session.instructor.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{session.schedule.startTime} - {session.schedule.endTime} ({session.schedule.timezone})</span>
                        <span className="text-xs text-slate-500">• {session.zoomMeeting?.duration || 120} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{session.schedule.day}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <span className="font-medium text-slate-900">{statusInfo.message}</span>
                        {session.zoomMeeting?.isReady && statusInfo.status === 'upcoming' && (
                          <div className="flex items-center gap-1 mt-1 text-green-600">
                            <Video className="w-3 h-3" />
                            <span className="text-xs">Meeting ready</span>
                          </div>
                        )}
                        {!session.zoomMeeting?.isReady && statusInfo.status === 'upcoming' && (
                          <div className="flex items-center gap-1 mt-1 text-amber-600">
                            <Clock className="w-3 h-3" />
                            <span className="text-xs">Meeting details will be available 1 hour before</span>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        variant={buttonProps.variant}
                        disabled={buttonProps.disabled}
                        onClick={() => handleSmartJoin(session)}
                        className="flex items-center gap-2"
                      >
                        {buttonProps.icon}
                        {buttonProps.text}
                      </Button>
                    </div>

                    {/* Show link type indicator for ready sessions */}
                    {statusInfo.canJoin && session.zoomMeeting && (
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          {zoomAppAvailable[session.id] ? (
                            <div className="flex items-center gap-1">
                              <Smartphone className="w-3 h-3" />
                              <span>Will open in Zoom app</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              <span>Will open in browser</span>
                            </div>
                          )}
                          {session.zoomMeeting.recordingEnabled && (
                            <div className="flex items-center gap-1">
                              <Video className="w-3 h-3" />
                              <span>Recording enabled</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
