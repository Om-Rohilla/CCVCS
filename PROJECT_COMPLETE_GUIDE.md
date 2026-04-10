# Course Content Version Control System

Complete project guide for problem understanding, technical solution, workflow, routes, team execution, and submission readiness.

---

## 1) Project Overview

### Project Name
Course Content Version Control System

### Problem Statement
Teachers update lesson files frequently. In normal file-sharing systems, old files get overwritten, students lose track of the latest version, and there is no clear history of what changed and when.

### Objective
Build a system that maintains versioned course material using Git-inspired principles:
- Track every file update as a new version
- Preserve older versions
- Show history and change notes
- Allow download/rollback of previous versions

---

## 2) Why This Project Matters

### Existing Issues in Colleges
- Files are shared in random folders/chats/emails
- Students study outdated files by mistake
- Teachers cannot easily restore older content
- No proper traceability for changes

### What Your System Solves
- Single source of truth for course files
- Transparent version history
- Controlled updates by teacher/admin
- Easy recovery from mistakes through rollback

---

## 3) Proposed Solution (High-Level)

Build a web app where:
1. Teacher logs in
2. Teacher uploads course material (`notes`, `ppt`, `pdf`, etc.)
3. Every update creates a new version (`v1`, `v2`, `v3`...)
4. Students can view history and download any version
5. Teacher can compare versions and optionally rollback

This is a simplified "mini GitHub-style" content management flow for education.

---

## 4) System Architecture

### Frontend
- Next.js (App Router)
- Tailwind CSS for styling
- Dashboard pages for teacher and student

### Backend
- Next.js API routes (recommended for faster 2-day execution)
- Business logic for auth, upload, versioning, compare, rollback

### Database
- MongoDB (quick and flexible) or PostgreSQL
- Stores users, courses, files, versions, and activity

### File Storage
- Option A (fast demo): local uploads folder
- Option B (production-like): Cloudinary/Firebase/S3

---

## 5) User Roles and Permissions

### Teacher/Admin
- Create or select course
- Upload new file
- Upload new version of existing file
- Add change message ("Updated Unit 3 examples")
- View history
- Compare two versions
- Rollback to old version

### Student
- View available course files
- View version history
- Download versions
- Read update messages

---

## 6) Detailed Functional Workflow

## A) Authentication Workflow
1. User opens login page.
2. Sends credentials to auth route.
3. Backend validates user and role.
4. JWT/session token issued.
5. Protected pages and APIs check token.

## B) New File Upload Workflow
1. Teacher selects course + file + title.
2. Frontend sends `multipart/form-data`.
3. Backend validates type/size/teacher role.
4. File stored in storage location.
5. `course_files` entry created with `currentVersion = 1`.
6. `file_versions` entry created as `v1`.

## C) File Update (New Version) Workflow
1. Teacher opens existing file card.
2. Uploads updated file + change message.
3. Backend reads current version from DB.
4. New file stored with incremented version.
5. `file_versions` new row inserted (`vN+1`).
6. `course_files.currentVersion` updated.

## D) Version History Workflow
1. User opens file details page.
2. Frontend calls history route.
3. Backend returns version list sorted newest-first.
4. UI shows timeline: version number, date, author, change note.

## E) Download Workflow
1. User clicks download for a selected version.
2. Frontend hits download route with `fileId` + `version`.
3. Backend locates exact file path/url.
4. File streamed/downloaded to browser.

## F) Compare Workflow (High-Impact)
1. Teacher selects two versions (`v2` vs `v5`).
2. Backend fetches both files.
3. If text-based file, compute diff.
4. Return additions/deletions/changes summary.
5. UI renders highlighted compare view.

## G) Rollback Workflow (Optional Advanced)
1. Teacher selects previous version to restore.
2. Backend copies selected version as a new latest version.
3. New `file_versions` row created (do not delete history).
4. `currentVersion` updated to newest rollback-generated version.

---

## 7) Database Schema (Suggested)

### `users`
- `_id`
- `name`
- `email` (unique)
- `passwordHash`
- `role` (`teacher`, `student`, `admin`)
- `createdAt`

### `courses`
- `_id`
- `courseName`
- `courseCode`
- `teacherId`
- `semester`
- `createdAt`

### `course_files`
- `_id`
- `courseId`
- `title`
- `fileType`
- `currentVersion` (number)
- `createdBy`
- `createdAt`
- `updatedAt`

### `file_versions`
- `_id`
- `fileId`
- `versionNumber`
- `storagePath` or `fileUrl`
- `changeMessage`
- `uploadedBy`
- `uploadedAt`
- `checksum` (optional integrity check)

### `activity_logs` (Optional but good for viva/demo)
- `_id`
- `userId`
- `actionType` (`UPLOAD`, `UPDATE`, `ROLLBACK`, `DOWNLOAD`)
- `fileId`
- `versionNumber`
- `timestamp`

---

## 8) API Routes (Proper Explanation)

Below structure assumes Next.js API routes in `app/api/...`.

### Auth Routes

#### `POST /api/auth/login`
Purpose: Authenticate user and issue token/session.

Request:
- `email`
- `password`

Response:
- `token`
- `user` object (`id`, `name`, `role`)

Errors:
- `401` invalid credentials
- `400` missing fields

#### `POST /api/auth/logout`
Purpose: Invalidate session or clear auth cookie/token.

---

### Course Routes

#### `POST /api/courses`
Purpose: Create course (teacher/admin only).

#### `GET /api/courses`
Purpose: List courses for current user.

#### `GET /api/courses/:courseId`
Purpose: Fetch single course details.

---

### File Routes

#### `POST /api/files/upload`
Purpose: Upload first version of a new file.

Request:
- `courseId`
- `title`
- `file` (multipart)

Response:
- `fileId`
- `version = 1`

Validation:
- teacher/admin role required
- file type and size checks

#### `POST /api/files/:fileId/versions`
Purpose: Upload next version of existing file.

Request:
- `file` (multipart)
- `changeMessage`

Response:
- `newVersionNumber`

Logic:
- read current version
- increment
- persist in storage + DB

#### `GET /api/files/:fileId`
Purpose: Return file metadata and current version.

#### `GET /api/files/:fileId/versions`
Purpose: Return version history timeline.

Response includes:
- version number
- uploadedBy
- uploadedAt
- changeMessage

#### `GET /api/files/:fileId/versions/:version/download`
Purpose: Download a specific version.

Behavior:
- locate storage path for requested version
- stream file response

Errors:
- `404` version not found
- `403` unauthorized

#### `GET /api/files/:fileId/compare?v1=1&v2=2`
Purpose: Compare two versions.

Response:
- changed lines/blocks (for text files)
- summary stats

#### `POST /api/files/:fileId/rollback`
Purpose: Restore previous content as a new latest version.

Request:
- `targetVersion`
- `reason` (optional)

Response:
- `newVersionAfterRollback`

Important:
- Never delete old versions
- Rollback creates another version entry

---

## 9) Project Folder Structure (Recommended)

```txt
course-content-vcs/
  app/
    (dashboard)/
      teacher/
      student/
    api/
      auth/
      courses/
      files/
  components/
    ui/
    files/
    timeline/
  lib/
    auth/
    db/
    storage/
    versioning/
  models/
    User.ts
    Course.ts
    CourseFile.ts
    FileVersion.ts
  public/
  uploads/              # if local storage used
  README.md
  PROJECT_COMPLETE_GUIDE.md
```

---

## 10) Team of 4 - Role-Based Execution

### Member 1 (Backend + Lead)
- DB models + auth + file/version APIs
- route protection and validations

### Member 2 (Frontend UI)
- dashboard, upload form, version timeline
- responsive Tailwind pages

### Member 3 (Integration + Compare)
- connect API with frontend state
- compare view + error/loading flows

### Member 4 (Docs + QA + Submission)
- synopsis report + diagrams + screenshots
- PPT + test checklist + demo script

---

## 11) 2-Day Fast Delivery Plan

## Day 1 (Build Core)
- Setup repo, branches, base layout, DB
- Implement login + upload v1 + history listing
- Implement upload next version + download specific version
- Smoke test end-to-end flow

## Day 2 (Polish + Marks)
- Add timeline UI + compare
- Add rollback (if time permits)
- Create screenshots and report
- Prepare PPT and viva Q&A
- Practice live demo as a team

---

## 12) Git Collaboration Workflow (Exam-Relevant)

### Branch Plan
- `main` (stable)
- `dev` (integration)
- `feature/backend`
- `feature/frontend`
- `feature/integration`
- `feature/docs`

### Pull Request Flow
1. Create feature branch from `dev`.
2. Push changes with clear commits.
3. Open PR to `dev`.
4. Teammate review and approve.
5. Merge after checks pass.
6. Merge `dev` to `main` for release/demo.

### Commit Message Standard
- `feat: add upload version endpoint`
- `fix: handle missing fileId validation`
- `ui: build version timeline component`
- `docs: update synopsis architecture section`

---

## 13) Testing Checklist

- [ ] Login works for teacher and student
- [ ] Unauthorized users cannot upload
- [ ] New upload creates `v1`
- [ ] Each update increments version correctly
- [ ] Version history order is correct
- [ ] Download specific version works
- [ ] Compare route works for text files
- [ ] Rollback creates new version entry
- [ ] No route exposes data without auth

---

## 14) Demo Script (Live Showcasing)

1. Login as teacher.
2. Create/select a course.
3. Upload initial file (`v1`).
4. Upload update (`v2`) with change message.
5. Open version timeline and explain entries.
6. Compare `v1` vs `v2`.
7. Download old version.
8. (Optional) Rollback and show new latest version created.

---

## 15) Viva Preparation (High Probability Questions)

1. What is version control and why needed?
2. How is your system similar to Git and how is it different?
3. Why maintain immutable history?
4. Why rollback creates a new version instead of deleting latest?
5. How do you secure routes and file access?
6. How did your team use branching and PRs?

---

## 16) Submission Readiness Checklist

- [ ] Working project in GitHub repository
- [ ] Updated Google Drive link before deadline
- [ ] Synopsis report completed
- [ ] PPT completed
- [ ] README + this guide included
- [ ] All 4 members can explain their module

---

## 17) Final Outcome Statement

The Course Content Version Control System provides a structured and traceable way to manage frequent educational content updates, ensuring reliability, accountability, and easy recovery through version history, compare, download, and rollback capabilities.
