// Test script to verify session status logic
import { ZoomLinkService } from '../services/zoomLinkService';
import { Session } from '../types';

// Test session scenarios
const testSessions = [
    {
        id: 'test1',
        title: 'Future Session',
        zoomMeeting: {
            id: 'zm-test1',
            sessionId: 'test1',
            meetingId: '123456789',
            joinUrl: 'https://zoom.us/j/123456789',
            hostUrl: 'https://zoom.us/s/123456789',
            password: 'test123',
            startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
            duration: 60,
            recordingEnabled: true,
            status: 'scheduled' as const,
            isReady: true
        }
    },
    {
        id: 'test2',
        title: 'Starting Soon',
        zoomMeeting: {
            id: 'zm-test2',
            sessionId: 'test2',
            meetingId: '123456789',
            joinUrl: 'https://zoom.us/j/123456789',
            hostUrl: 'https://zoom.us/s/123456789',
            password: 'test123',
            startTime: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
            duration: 60,
            recordingEnabled: true,
            status: 'scheduled' as const,
            isReady: true
        }
    },
    {
        id: 'test3',
        title: 'Live Now',
        zoomMeeting: {
            id: 'zm-test3',
            sessionId: 'test3',
            meetingId: '123456789',
            joinUrl: 'https://zoom.us/j/123456789',
            hostUrl: 'https://zoom.us/s/123456789',
            password: 'test123',
            startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // Started 10 minutes ago
            duration: 60,
            recordingEnabled: true,
            status: 'scheduled' as const,
            isReady: true
        }
    },
    {
        id: 'test4',
        title: 'Ended Session',
        zoomMeeting: {
            id: 'zm-test4',
            sessionId: 'test4',
            meetingId: '123456789',
            joinUrl: 'https://zoom.us/j/123456789',
            hostUrl: 'https://zoom.us/s/123456789',
            password: 'test123',
            startTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // Started 90 minutes ago
            duration: 60,
            recordingEnabled: true,
            status: 'scheduled' as const,
            isReady: true
        }
    }
];

console.log('🧪 Testing Session Status Logic:');
console.log('Current time:', new Date().toISOString());
console.log('');

testSessions.forEach(session => {
    const status = ZoomLinkService.getMeetingStatus(session as Session);
    console.log(`📅 ${session.title}:`);
    console.log(`   Start Time: ${session.zoomMeeting.startTime}`);
    console.log(`   Status: ${status.status.toUpperCase()}`);
    console.log(`   Message: ${status.message}`);
    console.log(`   Can Join: ${status.canJoin ? '✅' : '❌'}`);
    console.log('');
});

export { testSessions };
