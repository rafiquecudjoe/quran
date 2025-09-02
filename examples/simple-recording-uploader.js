/**
 * Simple Recording Upload Service
 * Ready-to-use implementation for uploading Zoom recordings to Google Drive
 */

// Required packages:
// npm install googleapis google-auth-library

const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

class SimpleRecordingUploader {
  constructor(serviceAccountKey, rootFolderId) {
    // Initialize Google Drive API
    this.auth = new google.auth.GoogleAuth({
      keyFile: serviceAccountKey,
      scopes: ["https://www.googleapis.com/auth/drive.file"],
    });

    this.drive = google.drive({ version: "v3", auth: this.auth });
    this.rootFolderId = rootFolderId;
  }

  /**
   * Upload recording to Google Drive
   * @param {string} recordingUrl - Zoom recording download URL
   * @param {object} sessionInfo - Session details
   */
  async uploadRecording(recordingUrl, sessionInfo) {
    try {
      console.log(`🎥 Uploading recording for: ${sessionInfo.title}`);

      // 1. Download recording from Zoom
      const recordingBuffer = await this.downloadRecording(recordingUrl);

      // 2. Create organized folder structure
      const folderId = await this.createFolderStructure(sessionInfo);

      // 3. Upload to Google Drive
      const uploadedFile = await this.uploadToGoogleDrive(
        recordingBuffer,
        sessionInfo,
        folderId
      );

      // 4. Make file accessible to students
      await this.shareWithStudents(uploadedFile.id, sessionInfo.studentEmails);

      console.log(
        `✅ Recording uploaded successfully: ${uploadedFile.webViewLink}`
      );

      return {
        id: uploadedFile.id,
        name: uploadedFile.name,
        url: uploadedFile.webViewLink,
        downloadUrl: `https://drive.google.com/uc?id=${uploadedFile.id}`,
        size: recordingBuffer.length,
      };
    } catch (error) {
      console.error(`❌ Failed to upload recording:`, error);
      throw error;
    }
  }

  /**
   * Download recording from Zoom
   */
  async downloadRecording(recordingUrl) {
    const response = await fetch(recordingUrl, {
      headers: {
        Authorization: `Bearer ${process.env.ZOOM_ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to download recording: ${response.statusText}`);
    }

    return Buffer.from(await response.arrayBuffer());
  }

  /**
   * Create organized folder structure in Google Drive
   */
  async createFolderStructure(sessionInfo) {
    const date = new Date(sessionInfo.date);
    const year = date.getFullYear().toString();
    const month = date.toLocaleString("default", { month: "long" });
    const day = date.getDate().toString().padStart(2, "0");

    // Create folder hierarchy: Quran Sessions/2025/September/02/Instructor Name
    let currentFolderId = this.rootFolderId;

    const folders = [
      year,
      month,
      day,
      `Instructor - ${sessionInfo.instructor}`,
    ];

    for (const folderName of folders) {
      currentFolderId = await this.findOrCreateFolder(
        folderName,
        currentFolderId
      );
    }

    return currentFolderId;
  }

  /**
   * Find existing folder or create new one
   */
  async findOrCreateFolder(folderName, parentId) {
    // Check if folder already exists
    const searchResponse = await this.drive.files.list({
      q: `name='${folderName}' and parents='${parentId}' and mimeType='application/vnd.google-apps.folder'`,
      fields: "files(id, name)",
    });

    if (searchResponse.data.files.length > 0) {
      return searchResponse.data.files[0].id;
    }

    // Create new folder
    const createResponse = await this.drive.files.create({
      requestBody: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: [parentId],
      },
      fields: "id",
    });

    return createResponse.data.id;
  }

  /**
   * Upload file to Google Drive
   */
  async uploadToGoogleDrive(fileBuffer, sessionInfo, folderId) {
    const fileName = this.generateFileName(sessionInfo);

    const response = await this.drive.files.create({
      requestBody: {
        name: fileName,
        parents: [folderId],
      },
      media: {
        mimeType: "video/mp4",
        body: require("stream").Readable.from(fileBuffer),
      },
      fields: "id, name, webViewLink",
    });

    return response.data;
  }

  /**
   * Generate standardized file name
   */
  generateFileName(sessionInfo) {
    const date = new Date(sessionInfo.date);
    const timestamp = date
      .toISOString()
      .slice(0, 16)
      .replace("T", "_")
      .replace(/:/g, "-");
    const cleanTitle = sessionInfo.title.replace(/[^a-zA-Z0-9]/g, "_");

    return `${cleanTitle}_${timestamp}.mp4`;
  }

  /**
   * Share recording with enrolled students
   */
  async shareWithStudents(fileId, studentEmails) {
    for (const email of studentEmails) {
      try {
        await this.drive.permissions.create({
          fileId: fileId,
          requestBody: {
            role: "reader",
            type: "user",
            emailAddress: email,
          },
        });
        console.log(`✅ Shared recording with: ${email}`);
      } catch (error) {
        console.error(`❌ Failed to share with ${email}:`, error.message);
      }
    }
  }
}

// Usage example
const uploadRecording = async () => {
  const uploader = new SimpleRecordingUploader(
    "./google-service-account-key.json", // Path to your service account key
    "your_root_folder_id" // Google Drive folder ID
  );

  const sessionInfo = {
    title: "Evening Quran Recitation",
    instructor: "Ahmed Hassan",
    date: "2025-09-02T19:00:00Z",
    studentEmails: ["student1@example.com", "student2@example.com"],
  };

  const recordingUrl =
    "https://zoom.us/rec/download/recording_url_from_webhook";

  try {
    const result = await uploader.uploadRecording(recordingUrl, sessionInfo);
    console.log("🎉 Recording uploaded:", result);
  } catch (error) {
    console.error("💥 Upload failed:", error);
  }
};

module.exports = { SimpleRecordingUploader };

/*
WEBHOOK ENDPOINT EXAMPLE:

app.post('/webhook/zoom/recording', async (req, res) => {
  if (req.body.event === 'recording.completed') {
    const recording = req.body.payload.object;
    
    // Find your session in database using recording.id
    const session = await findSessionByZoomId(recording.id);
    
    if (session) {
      const uploader = new SimpleRecordingUploader(
        process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
        process.env.GOOGLE_DRIVE_ROOT_FOLDER
      );
      
      // Upload each recording file
      for (const file of recording.recording_files) {
        if (file.file_type === 'MP4') {
          await uploader.uploadRecording(file.download_url, {
            title: session.title,
            instructor: session.instructor.name,
            date: session.date,
            studentEmails: session.enrolledStudents.map(s => s.email)
          });
        }
      }
    }
  }
  
  res.status(200).json({ success: true });
});
*/
