import { ZoomMeeting, Session } from '../types';

export interface ZoomLinkOptions {
    meetingId: string;
    password: string;
    displayName?: string;
    userEmail?: string;
}

export class ZoomLinkService {

    /**
     * Detects if user device has Zoom app installed
     */
    static async detectZoomApp(): Promise<boolean> {
        return new Promise((resolve) => {
            const isMobile = /Android|iPhone|iPad/.test(navigator.userAgent);

            if (isMobile) {
                // For mobile, we can attempt to open zoom scheme
                // If it fails, we know app isn't installed
                const testLink = document.createElement('a');
                testLink.href = 'zoomus://zoom.us/test';

                let timeout = setTimeout(() => {
                    resolve(false); // App not installed
                }, 2000);

                window.addEventListener('blur', () => {
                    clearTimeout(timeout);
                    resolve(true); // App opened successfully
                }, { once: true });

                testLink.click();
            } else {
                // For desktop, check if zoom:// protocol is registered
                // This is a simplified check - in production you'd use more robust detection
                resolve(true); // Assume zoom is available on desktop
            }
        });
    }

    /**
     * Generates native app deep link for Zoom
     */
    static generateNativeAppLink(options: ZoomLinkOptions): string {
        const { meetingId, password, displayName, userEmail } = options;
        const isMobile = /Android|iPhone|iPad/.test(navigator.userAgent);

        const params = new URLSearchParams({
            confno: meetingId,
            pwd: password,
            ...(displayName && { uname: displayName }),
            ...(userEmail && { email: userEmail })
        });

        if (isMobile) {
            // Mobile deep link
            return `zoomus://zoom.us/join?${params.toString()}`;
        } else {
            // Desktop deep link
            return `zoommtg://zoom.us/join?${params.toString()}`;
        }
    }

    /**
     * Generates web browser fallback link
     */
    static generateWebLink(options: ZoomLinkOptions): string {
        const { meetingId, password, displayName } = options;

        const params = new URLSearchParams({
            confno: meetingId,
            pwd: password,
            ...(displayName && { uname: displayName })
        });

        return `https://zoom.us/wc/join/${meetingId}?${params.toString()}`;
    }

    /**
     * Smart link generation based on device and preferences
     */
    static async generateSmartLinks(zoomMeeting: ZoomMeeting, userDisplayName?: string, userEmail?: string) {
        const linkOptions: ZoomLinkOptions = {
            meetingId: zoomMeeting.meetingId,
            password: zoomMeeting.password,
            displayName: userDisplayName,
            userEmail: userEmail
        };

        const hasZoomApp = await this.detectZoomApp();

        const nativeAppLink = this.generateNativeAppLink(linkOptions);
        const webLink = this.generateWebLink(linkOptions);

        return {
            nativeAppLink,
            webLink,
            hasZoomApp,
            recommended: hasZoomApp ? 'native' : 'web'
        };
    }

    /**
     * Handle join session with smart routing
     */
    static async joinSession(zoomMeeting: ZoomMeeting, userDisplayName?: string, userEmail?: string) {
        const links = await this.generateSmartLinks(zoomMeeting, userDisplayName, userEmail);

        if (links.hasZoomApp) {
            // Try native app first
            window.location.href = links.nativeAppLink;

            // Fallback to web after 3 seconds if app doesn't open
            setTimeout(() => {
                const fallbackConfirm = confirm(
                    'Zoom app didn\'t open? Click OK to join via web browser instead.'
                );
                if (fallbackConfirm) {
                    window.open(links.webLink, '_blank');
                }
            }, 3000);
        } else {
            // Direct to web version
            window.open(links.webLink, '_blank');
        }
    }

    /**
     * Check if meeting is ready to join (within 10 minutes of start time)
     */
    static isMeetingReady(session: Session): boolean {
        if (!session.zoomMeeting) return false;

        const startTime = new Date(session.zoomMeeting.startTime);
        const now = new Date();
        const diffMinutes = (startTime.getTime() - now.getTime()) / (1000 * 60);

        // Allow joining 10 minutes before start time
        return diffMinutes <= 10 && diffMinutes >= -session.zoomMeeting.duration;
    }

    /**
     * Get meeting status for UI display
     */
    static getMeetingStatus(session: Session): {
        status: 'upcoming' | 'ready' | 'live' | 'ended';
        message: string;
        canJoin: boolean;
    } {
        if (!session.zoomMeeting) {
            return {
                status: 'upcoming',
                message: 'Meeting details will be available 1 hour before session',
                canJoin: false
            };
        }

        const startTime = new Date(session.zoomMeeting.startTime);
        const endTime = new Date(startTime.getTime() + session.zoomMeeting.duration * 60000);
        const now = new Date();

        if (now < new Date(startTime.getTime() - 10 * 60000)) {
            // More than 10 minutes before start
            const hoursUntil = Math.ceil((startTime.getTime() - now.getTime()) / (1000 * 60 * 60));
            return {
                status: 'upcoming',
                message: `Starts in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''}`,
                canJoin: false
            };
        } else if (now < startTime) {
            // Within 10 minutes of start
            const minutesUntil = Math.ceil((startTime.getTime() - now.getTime()) / (1000 * 60));
            return {
                status: 'ready',
                message: `Starting in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''} - You can join now`,
                canJoin: true
            };
        } else if (now < endTime) {
            // Session is live
            const minutesElapsed = Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
            return {
                status: 'live',
                message: `Live now (${minutesElapsed} min elapsed)`,
                canJoin: true
            };
        } else {
            // Session ended
            return {
                status: 'ended',
                message: 'Session ended',
                canJoin: false
            };
        }
    }
}

/**
 * Background worker simulation for link generation
 * In production, this would be a separate backend service
 */
export class ZoomLinkGenerator {

    /**
     * Simulates the background worker that generates Zoom links
     * Should run 2 hours before each session
     */
    static async generateLinksForSession(session: Session): Promise<ZoomMeeting> {
        console.log(`🔄 Generating Zoom links for session: ${session.title}`);

        try {
            // Simulate API call to Zoom
            const zoomApiResponse = await this.createZoomMeeting({
                topic: session.title,
                start_time: session.schedule.startTime,
                duration: 60, // Default 1 hour
                settings: {
                    host_video: true,
                    participant_video: true,
                    auto_recording: 'cloud',
                    waiting_room: true,
                    join_before_host: false,
                    mute_upon_entry: true,
                    approval_type: 0 // Automatically approve
                }
            });

            const zoomMeeting: ZoomMeeting = {
                id: `zoom_${session.id}`,
                sessionId: session.id,
                meetingId: zoomApiResponse.id.toString(),
                joinUrl: zoomApiResponse.join_url,
                hostUrl: zoomApiResponse.start_url,
                password: zoomApiResponse.password,
                startTime: session.schedule.startTime,
                duration: 60,
                recordingEnabled: true,
                status: 'scheduled',
                isReady: true,
                generatedAt: new Date().toISOString()
            };

            // Generate smart links
            const smartLinks = await ZoomLinkService.generateSmartLinks(zoomMeeting);
            zoomMeeting.nativeAppLink = smartLinks.nativeAppLink;
            zoomMeeting.webLink = smartLinks.webLink;

            console.log(`✅ Zoom links generated successfully for session: ${session.title}`);
            return zoomMeeting;

        } catch (error) {
            console.error(`❌ Failed to generate Zoom links for session: ${session.title}`, error);
            throw error;
        }
    }

    /**
     * Simulates Zoom API call to create meeting
     */
    private static async createZoomMeeting(meetingData: any): Promise<any> {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate Zoom API response
        return {
            id: Math.floor(Math.random() * 1000000000),
            join_url: `https://zoom.us/j/${Math.floor(Math.random() * 1000000000)}`,
            start_url: `https://zoom.us/s/${Math.floor(Math.random() * 1000000000)}`,
            password: Math.random().toString(36).substring(2, 8),
            topic: meetingData.topic,
            start_time: meetingData.start_time,
            duration: meetingData.duration
        };
    }

    /**
     * Schedule link generation for all upcoming sessions
     * This would run as a cron job in production
     */
    static scheduleLinksGeneration(sessions: Session[]): void {
        sessions.forEach(session => {
            const sessionStart = new Date(session.schedule.startTime);
            const generateAt = new Date(sessionStart.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
            const now = new Date();

            if (generateAt > now && !session.zoomMeeting?.isReady) {
                const timeUntilGeneration = generateAt.getTime() - now.getTime();

                console.log(`📅 Scheduled Zoom link generation for "${session.title}" at ${generateAt.toLocaleString()}`);

                setTimeout(async () => {
                    try {
                        const zoomMeeting = await this.generateLinksForSession(session);
                        // In production, update the session in database
                        session.zoomMeeting = zoomMeeting;
                        console.log(`✅ Links ready for session: ${session.title}`);
                    } catch (error) {
                        console.error(`❌ Failed to generate links for session: ${session.title}`, error);
                        // In production, implement retry logic
                    }
                }, timeUntilGeneration);
            }
        });
    }
}
