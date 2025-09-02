/**
 * Zoom Recording to Cloud Storage Integration
 * 
 * This service handles automatic upload of Zoom recordings to Google Drive or OneDrive
 * when a recording is completed using Zoom webhooks and cloud storage APIs.
 */

import { Session, ZoomMeeting } from '../types';

// Cloud storage configuration
interface CloudStorageConfig {
    provider: 'google_drive' | 'onedrive';
    credentials: {
        google?: {
            clientId: string;
            clientSecret: string;
            refreshToken: string;
        };
        microsoft?: {
            clientId: string;
            clientSecret: string;
            tenantId: string;
            refreshToken: string;
        };
    };
    folderStructure: {
        rootFolder: string; // "Quran Sessions"
        subfolders: {
            byDate: boolean; // Create folders by date (2025/September/02)
            byInstructor: boolean; // Create folders by instructor name
            byCategory: boolean; // Create folders by session category
        };
    };
}

interface ZoomRecordingWebhook {
    event: 'recording.completed';
    payload: {
        account_id: string;
        object: {
            uuid: string;
            id: number;
            host_id: string;
            topic: string;
            start_time: string;
            duration: number;
            recording_files: Array<{
                id: string;
                meeting_id: string;
                recording_start: string;
                recording_end: string;
                file_type: 'MP4' | 'M4A' | 'CHAT' | 'TRANSCRIPT';
                file_size: number;
                download_url: string;
                status: 'completed';
                recording_type: 'shared_screen_with_speaker_view' | 'audio_only' | 'chat_file';
            }>;
        };
    };
}

export class ZoomRecordingManager {
    private config: CloudStorageConfig;
    private googleDriveAPI: GoogleDriveAPI;
    private oneDriveAPI: OneDriveAPI;

    constructor(config: CloudStorageConfig) {
        this.config = config;
        this.googleDriveAPI = new GoogleDriveAPI(config.credentials.google);
        this.oneDriveAPI = new OneDriveAPI(config.credentials.microsoft);
    }

    /**
     * Webhook handler for Zoom recording completion
     * Call this from your webhook endpoint
     */
    async handleRecordingCompleted(webhook: ZoomRecordingWebhook): Promise<void> {
        try {
            console.log(`🎥 Processing recording for meeting: ${webhook.payload.object.topic}`);

            // 1. Find the session in your database
            const session = await this.findSessionByZoomMeetingId(webhook.payload.object.id.toString());
            if (!session) {
                console.error(`❌ Session not found for Zoom meeting ID: ${webhook.payload.object.id}`);
                return;
            }

            // 2. Download and process each recording file
            const uploadedFiles = [];
            for (const recordingFile of webhook.payload.object.recording_files) {
                if (recordingFile.file_type === 'MP4' || recordingFile.file_type === 'M4A') {
                    const uploadedFile = await this.processRecordingFile(session, recordingFile, webhook.payload.object);
                    uploadedFiles.push(uploadedFile);
                }
            }

            // 3. Update session with recording URLs
            await this.updateSessionWithRecordings(session.id, uploadedFiles);

            // 4. Notify enrolled students
            await this.notifyStudentsRecordingReady(session.id, uploadedFiles);

            console.log(`✅ Successfully processed ${uploadedFiles.length} recording files for session: ${session.title}`);

        } catch (error) {
            console.error(`❌ Failed to process recording:`, error);
            throw error;
        }
    }

    /**
     * Process and upload a single recording file
     */
    private async processRecordingFile(
        session: Session,
        recordingFile: any,
        meetingData: any
    ): Promise<CloudStorageFile> {
        // 1. Download file from Zoom
        const fileBuffer = await this.downloadFromZoom(recordingFile.download_url);

        // 2. Generate organized file path
        const filePath = this.generateFilePath(session, recordingFile, meetingData);

        // 3. Upload to cloud storage
        let uploadedFile: CloudStorageFile;

        if (this.config.provider === 'google_drive') {
            uploadedFile = await this.googleDriveAPI.uploadFile(fileBuffer, filePath);
        } else {
            uploadedFile = await this.oneDriveAPI.uploadFile(fileBuffer, filePath);
        }

        return uploadedFile;
    }

    /**
     * Generate organized file path based on configuration
     */
    private generateFilePath(session: Session, recordingFile: any, meetingData: any): string {
        const date = new Date(meetingData.start_time);
        const parts = [this.config.folderStructure.rootFolder];

        if (this.config.folderStructure.subfolders.byDate) {
            parts.push(
                date.getFullYear().toString(),
                date.toLocaleString('default', { month: 'long' }),
                date.getDate().toString().padStart(2, '0')
            );
        }

        if (this.config.folderStructure.subfolders.byInstructor) {
            parts.push(`Instructor - ${session.instructor.name}`);
        }

        if (this.config.folderStructure.subfolders.byCategory) {
            parts.push(`Category - ${session.category}`);
        }

        // Generate filename
        const timestamp = date.toISOString().slice(0, 16).replace('T', '_').replace(/:/g, '-');
        const fileExtension = recordingFile.file_type.toLowerCase();
        const fileName = `${session.title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`;

        parts.push(fileName);

        return parts.join('/');
    }

    /**
     * Download file from Zoom using download URL
     */
    private async downloadFromZoom(downloadUrl: string): Promise<Buffer> {
        const response = await fetch(downloadUrl, {
            headers: {
                'Authorization': `Bearer ${await this.getZoomAccessToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to download from Zoom: ${response.statusText}`);
        }

        return Buffer.from(await response.arrayBuffer());
    }

    private async getZoomAccessToken(): Promise<string> {
        // Implement Zoom OAuth token retrieval
        return process.env.ZOOM_ACCESS_TOKEN || '';
    }

    private async findSessionByZoomMeetingId(meetingId: string): Promise<Session | null> {
        // Implement database lookup
        return null;
    }

    private async updateSessionWithRecordings(sessionId: string, files: CloudStorageFile[]): Promise<void> {
        // Update session in database with recording URLs
        console.log(`Updating session ${sessionId} with ${files.length} recordings`);
    }

    private async notifyStudentsRecordingReady(sessionId: string, files: CloudStorageFile[]): Promise<void> {
        // Send notifications to enrolled students
        console.log(`Notifying students about available recordings for session ${sessionId}`);
    }
}

/**
 * Google Drive API Integration
 */
class GoogleDriveAPI {
    private credentials: any;

    constructor(credentials: any) {
        this.credentials = credentials;
    }

    async uploadFile(fileBuffer: Buffer, filePath: string): Promise<CloudStorageFile> {
        const pathParts = filePath.split('/');
        const fileName = pathParts.pop()!;
        const folderPath = pathParts.join('/');

        // 1. Ensure folder structure exists
        const folderId = await this.ensureFolderExists(folderPath);

        // 2. Upload file
        const formData = new FormData();
        formData.append('metadata', JSON.stringify({
            name: fileName,
            parents: [folderId]
        }));
        formData.append('file', new Blob([fileBuffer]));

        const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await this.getAccessToken()}`
            },
            body: formData
        });

        const result = await response.json();

        // 3. Make file publicly viewable (optional)
        await this.makeFilePublic(result.id);

        return {
            id: result.id,
            name: fileName,
            url: `https://drive.google.com/file/d/${result.id}/view`,
            downloadUrl: `https://drive.google.com/uc?id=${result.id}`,
            size: fileBuffer.length,
            provider: 'google_drive'
        };
    }

    private async ensureFolderExists(folderPath: string): Promise<string> {
        // Implementation to create folder structure in Google Drive
        return 'folder_id';
    }

    private async makeFilePublic(fileId: string): Promise<void> {
        await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${await this.getAccessToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                role: 'reader',
                type: 'anyone'
            })
        });
    }

    private async getAccessToken(): Promise<string> {
        // Implement Google OAuth token refresh
        return 'google_access_token';
    }
}

/**
 * Microsoft OneDrive API Integration
 */
class OneDriveAPI {
    private credentials: any;

    constructor(credentials: any) {
        this.credentials = credentials;
    }

    async uploadFile(fileBuffer: Buffer, filePath: string): Promise<CloudStorageFile> {
        const pathParts = filePath.split('/');
        const fileName = pathParts.pop()!;
        const folderPath = pathParts.join('/');

        // 1. Ensure folder structure exists
        await this.ensureFolderExists(folderPath);

        // 2. Upload file using Microsoft Graph API
        const uploadUrl = `https://graph.microsoft.com/v1.0/me/drive/root:/${filePath}:/content`;

        const response = await fetch(uploadUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${await this.getAccessToken()}`,
                'Content-Type': 'application/octet-stream'
            },
            body: fileBuffer
        });

        const result = await response.json();

        return {
            id: result.id,
            name: fileName,
            url: result.webUrl,
            downloadUrl: result['@microsoft.graph.downloadUrl'],
            size: fileBuffer.length,
            provider: 'onedrive'
        };
    }

    private async ensureFolderExists(folderPath: string): Promise<void> {
        // Implementation to create folder structure in OneDrive
    }

    private async getAccessToken(): Promise<string> {
        // Implement Microsoft OAuth token refresh
        return 'microsoft_access_token';
    }
}

interface CloudStorageFile {
    id: string;
    name: string;
    url: string;
    downloadUrl: string;
    size: number;
    provider: 'google_drive' | 'onedrive';
}

/**
 * Express.js webhook endpoint example
 */
/*
app.post('/webhook/zoom/recording-completed', async (req, res) => {
  try {
    // Verify webhook signature (important for security)
    const isValid = verifyZoomWebhookSignature(req);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const webhook: ZoomRecordingWebhook = req.body;
    
    if (webhook.event === 'recording.completed') {
      await recordingManager.handleRecordingCompleted(webhook);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
*/

export { ZoomRecordingManager, CloudStorageConfig, ZoomRecordingWebhook };
