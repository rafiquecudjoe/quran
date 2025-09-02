# Zoom Recording Auto-Upload Setup Guide

## 🎯 Overview
This guide shows you how to automatically save Zoom recordings to Google Drive or Microsoft OneDrive for your Quran learning platform.

## 📋 Available Options

### Option 1: Zoom Webhooks + Cloud Storage APIs (Recommended)
**Best for**: Production applications with full control
- ✅ Automatic upload after each session
- ✅ Organized folder structure
- ✅ Custom file naming
- ✅ Student notifications
- ✅ Free (except storage costs)

### Option 2: Zapier Integration (Easy Setup)
**Best for**: Quick setup without coding
- ✅ No coding required
- ✅ GUI configuration
- ✅ Multiple cloud providers
- ❌ Monthly subscription cost
- ❌ Less customization

### Option 3: Manual Upload Tools
**Best for**: Small scale operations
- ✅ Simple to set up
- ✅ One-time cost
- ❌ Requires manual intervention
- ❌ Not scalable

## 🚀 Recommended Implementation

### Step 1: Setup Zoom Webhooks

1. **Go to Zoom Marketplace**
   - Visit: https://marketplace.zoom.us/
   - Create a Webhook-only app

2. **Configure Webhook Events**
   ```
   Event: recording.completed
   Endpoint: https://yourdomain.com/webhook/zoom/recording-completed
   ```

3. **Get Webhook Credentials**
   ```env
   ZOOM_WEBHOOK_SECRET_TOKEN=your_secret_token
   ZOOM_VERIFICATION_TOKEN=your_verification_token
   ```

### Step 2: Setup Cloud Storage APIs

#### Google Drive Setup:
1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create new project or select existing

2. **Enable Google Drive API**
   - Go to APIs & Services > Library
   - Search "Google Drive API" and enable it

3. **Create Service Account**
   - Go to APIs & Services > Credentials
   - Create Service Account
   - Download JSON key file

4. **Share Drive Folder**
   - Create "Quran Sessions" folder in Google Drive
   - Share with service account email (found in JSON)

#### Microsoft OneDrive Setup:
1. **Go to Azure Portal**
   - Visit: https://portal.azure.com/
   - Register new application

2. **Configure Permissions**
   ```
   Microsoft Graph API Permissions:
   - Files.ReadWrite.All
   - Sites.ReadWrite.All
   ```

3. **Get Credentials**
   ```env
   MICROSOFT_CLIENT_ID=your_client_id
   MICROSOFT_CLIENT_SECRET=your_client_secret
   MICROSOFT_TENANT_ID=your_tenant_id
   ```

### Step 3: Environment Configuration

```env
# Zoom Configuration
ZOOM_API_KEY=your_zoom_api_key
ZOOM_API_SECRET=your_zoom_api_secret
ZOOM_WEBHOOK_SECRET_TOKEN=your_webhook_secret

# Google Drive Configuration (if using Google Drive)
GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY=path/to/service-account-key.json
GOOGLE_DRIVE_ROOT_FOLDER_ID=your_root_folder_id

# Microsoft OneDrive Configuration (if using OneDrive)
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_TENANT_ID=your_tenant_id

# Storage Configuration
CLOUD_STORAGE_PROVIDER=google_drive # or onedrive
ORGANIZE_BY_DATE=true
ORGANIZE_BY_INSTRUCTOR=true
ORGANIZE_BY_CATEGORY=true
```

### Step 4: Backend Implementation

```javascript
// server.js - Express.js webhook endpoint
const express = require('express');
const { ZoomRecordingManager } = require('./services/recordingCloudStorage');

const app = express();
app.use(express.json());

// Initialize recording manager
const recordingManager = new ZoomRecordingManager({
  provider: process.env.CLOUD_STORAGE_PROVIDER,
  credentials: {
    google: {
      serviceAccountKey: process.env.GOOGLE_DRIVE_SERVICE_ACCOUNT_KEY,
      rootFolderId: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID
    },
    microsoft: {
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      tenantId: process.env.MICROSOFT_TENANT_ID
    }
  },
  folderStructure: {
    rootFolder: 'Quran Sessions',
    subfolders: {
      byDate: true,
      byInstructor: true,
      byCategory: true
    }
  }
});

// Webhook endpoint
app.post('/webhook/zoom/recording-completed', async (req, res) => {
  try {
    console.log('📥 Received Zoom webhook:', req.body.event);
    
    if (req.body.event === 'recording.completed') {
      await recordingManager.handleRecordingCompleted(req.body);
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
  console.log('🚀 Webhook server running on port 3000');
});
```

## 📁 Folder Organization

The system automatically organizes recordings like this:

```
Quran Sessions/
├── 2025/
│   ├── September/
│   │   ├── 02/
│   │   │   ├── Instructor - Ahmed Hassan/
│   │   │   │   ├── Category - Recitation/
│   │   │   │   │   └── Evening_Quran_Session_2025-09-02_19-00.mp4
│   │   │   │   └── Category - Tajweed/
│   │   │   │       └── Advanced_Tajweed_Class_2025-09-02_20-00.mp4
│   │   │   └── Instructor - Fatima Ali/
│   │   │       └── Category - Memorization/
│   │   │           └── Hifz_Session_Weekend_2025-09-02_14-00.mp4
```

## 🔒 Security & Privacy

### Important Considerations:
1. **Recording Consent**: Ensure students consent to recording
2. **Data Protection**: Comply with GDPR/privacy laws
3. **Access Control**: Limit recording access to enrolled students only
4. **Retention Policy**: Auto-delete old recordings after set period

### Implementation:
```javascript
// Example privacy controls
const recordingAccess = {
  // Only enrolled students can access
  restrictToEnrolledStudents: true,
  
  // Auto-delete after 90 days
  autoDeleteAfterDays: 90,
  
  // Require password for access
  passwordProtected: true,
  
  // Log all access attempts
  auditLog: true
};
```

## 💰 Cost Breakdown

### Google Drive:
- **Free**: 15GB storage
- **Paid**: $1.99/month for 100GB
- **Business**: $6/user/month for unlimited

### Microsoft OneDrive:
- **Free**: 5GB storage
- **Personal**: $1.99/month for 100GB
- **Business**: $5/user/month for 1TB

### Zoom Cloud Recording:
- **Pro**: $14.99/month (1GB cloud storage)
- **Business**: $19.99/month (1GB per license)

## 📊 Storage Estimates

For a Quran learning platform:
- **1-hour session**: ~500MB (video) + ~50MB (audio)
- **10 sessions/week**: ~5.5GB/week
- **Monthly**: ~22GB/month
- **Yearly**: ~264GB/year

**Recommendation**: Start with 100GB plan, upgrade as needed.

## 🛠️ Alternative Tools

### Zapier Integration (No-Code Solution):
1. **Create Zapier Account**: zapier.com
2. **Setup Trigger**: Zoom > Recording Ready
3. **Setup Action**: Google Drive > Upload File
4. **Cost**: $20/month for unlimited zaps

### OBS + Auto-Upload:
1. **Use OBS for local recording**
2. **Auto-upload with sync tools**
3. **Good for backup recordings**

## 📱 Student Access

Students can access recordings through:

```javascript
// Frontend component for recording access
const RecordingLibrary = ({ userSessions }) => {
  return (
    <div className="recording-library">
      <h2>📚 Session Recordings</h2>
      {userSessions.map(session => (
        <div key={session.id} className="session-card">
          <h3>{session.title}</h3>
          <p>Date: {session.date}</p>
          {session.recordings.map(recording => (
            <a 
              href={recording.url} 
              target="_blank"
              className="recording-link"
            >
              🎥 Watch Recording ({recording.duration})
            </a>
          ))}
        </div>
      ))}
    </div>
  );
};
```

## 🚀 Quick Start Checklist

- [ ] Create Zoom webhook app
- [ ] Setup Google Drive or OneDrive API
- [ ] Configure environment variables
- [ ] Deploy webhook endpoint
- [ ] Test with sample recording
- [ ] Setup folder structure
- [ ] Configure student access
- [ ] Test end-to-end flow

## 📞 Support & Troubleshooting

### Common Issues:
1. **Webhook not receiving**: Check endpoint URL and SSL
2. **Upload failing**: Verify API credentials and permissions
3. **Storage full**: Monitor usage and upgrade plan
4. **Access denied**: Check sharing permissions

Need help implementing this? I can assist with any specific part of the setup!
