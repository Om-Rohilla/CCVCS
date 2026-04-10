# Course Content Version Control System

A project-based solution for managing frequent updates to course materials by teachers using Git-inspired version control concepts.

## Problem Statement

Teachers update lesson files frequently. Without version control, previous content can be lost, tracking changes is hard, and students may access outdated files.

## Objective

Maintain course material versions via Git repositories and provide a simple interface for teachers and students to manage and access versioned course content.

## Team Goal (2-Day Sprint)

Build a working mini system where:
- Teachers upload/update course files.
- Every update creates a new version.
- Students can view, compare, and download old versions.
- Team follows proper Git workflow (branches, PRs, commit messages).

---

## Suggested Tech Stack

- Frontend: Next.js + Tailwind CSS
- Backend: Next.js API routes or Node.js + Express
- Database: MongoDB (quick setup) or PostgreSQL
- Storage: Local filesystem (for demo) or Cloudinary/Firebase (optional)
- Auth: Basic teacher login (JWT/session)

---

## Core Features

### Must-Have (Complete first)
1. Teacher Login
2. Upload Course File
3. Auto Version Numbering (`v1`, `v2`, `v3`...)
4. Version History List
5. Download Any Previous Version

### High-Impact (For better demo marks)
6. Commit-style update message ("Updated Unit 2 examples")
7. Timeline view for versions
8. Compare two versions (simple text diff/highlight)
9. Rollback to previous version (optional advanced feature)

---

## Team Split (4 Members)

### Member 1: Lead + Backend
- Setup repo, branch rules, project structure
- Build APIs:
  - upload file
  - create version
  - fetch history
  - download version
- Design DB schema

### Member 2: Frontend UI
- Build dashboard and upload page
- Build version timeline/history screen
- Create clean UI with Tailwind
- Add responsive layout and basic animations

### Member 3: Integration + QA Logic
- Connect frontend to backend APIs
- Handle loading/error/success states
- Validate forms and edge cases
- Test complete flows and bug fixes

### Member 4: Documentation + Presentation + Testing
- Prepare synopsis report (major marks component)
- Capture screenshots and architecture diagrams
- Create presentation slides
- Prepare viva answers and demo script

---

## Git Workflow (Very Important)

Because the subject is Version Control Systems, your Git process is part of your evaluation quality.

### Branching Strategy
- `main` -> stable final code
- `dev` -> integration branch
- `feature/backend`
- `feature/frontend`
- `feature/integration`
- `feature/docs`

### Rules
- Do not push directly to `main`.
- Create PRs from feature branches to `dev`.
- Merge `dev` to `main` only after testing.
- Use meaningful commit messages:
  - `feat: add version upload API`
  - `fix: resolve version download bug`
  - `docs: add architecture diagram`

---

## 2-Day Execution Plan

## Day 1 - Build Working Core

### Morning (3-4 hrs)
- Initialize project and GitHub repo
- Create branches and assign roles
- Setup frontend and backend skeleton
- Define DB schema for courses/files/versions

### Afternoon (4-5 hrs)
- Implement file upload API
- Save metadata + version number in DB
- Build version history API and UI list
- Basic teacher authentication

### Night (3-4 hrs)
- Implement file download endpoint
- Connect full upload -> history -> download flow
- Fix bugs and prepare stable demo build

## Day 2 - Improve + Submit

### Morning (3-4 hrs)
- Add commit message field
- Add timeline UI
- Add compare versions feature (simple diff)

### Afternoon (3-4 hrs)
- Capture screenshots
- Write synopsis and finalize architecture diagram
- Build presentation deck

### Night (2-3 hrs)
- Full demo rehearsal (twice)
- Viva prep (Q&A practice)
- Final Git cleanup and README update

---

## Suggested Database Design

### `users`
- `_id`
- `name`
- `email`
- `passwordHash`
- `role` (`teacher`/`student`)

### `courses`
- `_id`
- `courseName`
- `courseCode`
- `teacherId`

### `course_files`
- `_id`
- `courseId`
- `title`
- `currentVersion`
- `createdAt`

### `file_versions`
- `_id`
- `fileId`
- `versionNumber`
- `filePath` or `fileUrl`
- `changeMessage`
- `uploadedBy`
- `createdAt`

---

## API Endpoints (Example)

- `POST /api/auth/login`
- `POST /api/files/upload`
- `GET /api/files/:fileId/versions`
- `GET /api/files/:fileId/versions/:version/download`
- `GET /api/files/:fileId/compare?v1=1&v2=2`
- `POST /api/files/:fileId/rollback`

---

## Demo Flow (Live Showcase)

1. Login as teacher.
2. Upload course file as Version 1.
3. Upload updated file as Version 2 with message.
4. Open version history timeline.
5. Compare V1 vs V2.
6. Download old version.
7. (Optional) Rollback to V1.

This demo directly proves your problem statement is solved.

---

## Evaluation-Focused Checklist

### Live Demo (10 Marks)
- [ ] End-to-end flow works without errors
- [ ] Versioning is clearly visible
- [ ] Compare or rollback shown

### Synopsis Report (20 Marks)
- [ ] Problem statement and objective
- [ ] System architecture and workflow diagram
- [ ] Feature list with screenshots
- [ ] Team contribution table

### Presentation (10 Marks)
- [ ] Problem -> Solution -> Architecture -> Demo -> Result
- [ ] 8-12 concise slides
- [ ] One presenter, one navigator

### Viva (10 Marks)
- [ ] Git vs GitHub
- [ ] What is commit/branch/merge/PR
- [ ] Why version control is needed in education
- [ ] How your DB stores file versions

---

## Viva Quick Answers (Preparation)

- **What is version control?**  
  A system to track and manage changes to files over time.

- **Why Git for this project?**  
  Git provides reliable tracking, history, and rollback concepts that match the project objective.

- **Difference between Git and GitHub?**  
  Git is the version control tool; GitHub is a cloud platform for hosting and collaboration using Git repositories.

- **What is a commit message in your app?**  
  A short description of what changed in a file update, similar to Git commits.

---

## Local Setup (Template)

```bash
git clone <your-repo-url>
cd <repo-name>
npm install
npm run dev
```

---

## Final Submission Checklist

- [ ] Google Drive link updated before deadline
- [ ] Repo has clean commit history
- [ ] README is updated
- [ ] Synopsis PDF ready
- [ ] PPT ready
- [ ] Demo script ready
- [ ] All 4 members can explain their part

---

## Contribution Guide (Recommended)

1. Pull latest `dev` branch.
2. Create your feature branch.
3. Commit small logical changes.
4. Open PR with description and screenshots.
5. Review each other's PR before merge.

---

## Project Outcome

This system provides a practical, Git-inspired version management workflow for educational course content, reducing confusion from frequent updates and improving traceability for both teachers and students.
