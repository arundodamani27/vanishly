# vanishly 🚀

vanishly is a secure temporary file transfer web application that enables instant device-to-device file sharing without requiring login, email, USB drives, or third-party apps.

It was built to solve a real problem observed during college presentations, where students wasted time logging into Gmail on classroom systems just to transfer PPT files.

vanishly makes file sharing fast, simple, and secure.

---

## Live Demo

🔗 https://vanishly.vercel.app

---

## Problem Statement

During classroom presentations, teams often struggle to quickly transfer presentation files to the college system.

Typical process:

- Open Gmail
- Log in
- Attach file
- Open Gmail on classroom PC
- Log in again
- Download attachment

This wastes time and causes delays.

vanishly solves this by allowing instant temporary file transfer between devices.

---

## Features

### File Transfer
- Upload files instantly
- Drag and drop file upload
- One-time secure access code
- QR code sharing
- Direct share link support
- Instant download on another device

### Security
- No login required
- Temporary file storage
- Automatic file expiry after 10 minutes
- Secure signed download URLs
- Temporary access code system

### File Support
Supports all file types except:

❌ Video files  
❌ Audio files

Examples of supported files:

- PDF
- DOC / DOCX
- PPT / PPTX
- ODP
- XLS / XLSX
- TXT
- ZIP / RAR / 7Z
- APK
- Images
- HTML
- CSS
- JavaScript
- TypeScript
- Python
- Java
- C / C++
- JSON
- XML
- SQL
- Shell scripts
- and more

### UI/UX
- Mobile responsive design
- Upload progress bar
- Selected file preview
- Copy access code
- Copy direct share link
- Clean modern interface

---

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- React Dropzone
- QRCode React
- Lucide React Icons

### Backend
- Next.js API Routes
- Supabase Storage
- Supabase Database

### Deployment
- Vercel

---

## How It Works

### Upload
1. Open vanishly
2. Drag & drop or choose file
3. Upload completes
4. Get:
   - Access code
   - QR code
   - Share link

### Download
On another device:

Option 1:
- Open vanishly
- Enter access code
- Download file

Option 2:
- Scan QR code
- Download instantly

Option 3:
- Open direct share link
- Download file

---

## Project Structure

```bash
vanishly/
│
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/
│   │   │   └── access/
│   │   ├── receive/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── UploadCard.tsx
│   │   └── ReceiveCard.tsx
│   │
│   └── lib/
│       └── supabase/
│
├── public/
├── .env.local
├── package.json
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/vanishly.git
```

### Move Into Project

```bash
cd vanishly
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```

---

## Environment Variables

Create:

```bash
.env.local
```

Add:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

---

## Supabase Setup

### Create Storage Bucket

Create bucket:

```text
temp-files
```

---

### Create Database Table

Run this SQL:

```sql
create table temporary_files (
  id uuid primary key default gen_random_uuid(),
  access_code text unique not null,
  file_name text not null,
  file_path text not null,
  mime_type text,
  file_size bigint,
  expires_at timestamp,
  created_at timestamp default now()
);
```

---

## API Endpoints

### Upload File

```http
POST /api/upload
```

Uploads file to Supabase storage.

Returns:

```json
{
  "success": true,
  "accessCode": "ABC123",
  "fileName": "presentation.pptx",
  "expiresAt": "2026-05-21T12:00:00Z"
}
```

---

### Access File

```http
POST /api/access
```

Request:

```json
{
  "accessCode": "ABC123"
}
```

Returns:

```json
{
  "success": true,
  "fileName": "presentation.pptx",
  "downloadUrl": "signed_url_here"
}
```

---

## Deployment (Vercel)

### Step 1
Push project to GitHub.

### Step 2
Open Vercel.

### Step 3
Import repository.

### Step 4
Add environment variables.

### Step 5
Deploy.

---

## Future Improvements

Planned enhancements:

- Multi-file upload
- Password protected transfer
- Custom expiry timer
- File preview before upload
- File transfer history
- Better analytics
- Dark/light mode
- File sharing stats
- Optional authentication

---

## Inspiration

This project was inspired by a real college classroom problem.

During presentations, teams struggled to quickly transfer PPT files to the classroom computer.

Instead of relying on Gmail logins, USB drives, or messaging apps, vanishly was created as a simple instant solution.

A small real-world inconvenience became a full-stack project.

---

## Author

**Arun**  
MCA Student | Aspiring Full Stack Developer

LinkedIn: https://linkedin.com/in/arundodamani


---

## License

This project is for educational and portfolio purposes.