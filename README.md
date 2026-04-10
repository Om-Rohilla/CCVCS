# CCVCS

Course Content Version Control System built with Next.js App Router, TypeScript, Tailwind, and Supabase.

## What is implemented

- Authentication (Supabase email/password) with protected routes.
- Course creation and listing.
- File upload as `v1` and new version uploads (`v2`, `v3`, ...).
- Version timeline with download per version.
- Compare two versions (line-level summary).
- Rollback any old version as a new latest version.

## Tech stack

- Next.js (App Router, TypeScript)
- Tailwind CSS
- Supabase (Auth + PostgreSQL + Storage + RLS)
- Vercel (deployment target)

## Local setup

1) Install dependencies

```bash
npm install
```

2) Create `.env` from `.env.example`

```bash
cp .env.example .env
```

3) Add these values in `.env`

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4) Start the app

```bash
npm run dev
```

App runs at `http://localhost:3000`.

## Supabase setup (required)

1) Open Supabase SQL editor and run:
- `supabase/schema.sql`

2) Ensure bucket exists:
- `course-files` (private)

3) Confirm RLS policies were created for:
- `courses`
- `course_files`
- `file_versions`
- `storage.objects` for `course-files`

4) Create users in Supabase Auth and set role in app metadata:
- `teacher`, `student`, or `admin`

Example app metadata:

```json
{
  "role": "teacher"
}
```

## API endpoints

### Auth
- `POST /api/auth/login`
- `POST /api/auth/logout`

### Courses
- `GET /api/courses`
- `POST /api/courses`
- `GET /api/courses/:courseId`

### Files + Versions
- `POST /api/files/upload`
- `GET /api/files/:fileId`
- `GET /api/files/:fileId/versions`
- `POST /api/files/:fileId/versions`
- `GET /api/files/:fileId/versions/:version/download`
- `GET /api/files/:fileId/compare?v1=1&v2=2`
- `POST /api/files/:fileId/rollback`

### Ops
- `GET /api/health`

## Demo flow

1. Login as teacher/admin.
2. Create course from dashboard.
3. Open course, upload first file (`v1`).
4. Upload a new version (`v2`) with a change message.
5. Open file details to view timeline and download old version.
6. Open compare page (`v1` vs `v2`).
7. Rollback to an old version and verify a new latest version is created.

## Deployment (Vercel)

1) Push to GitHub.
2) Import project in Vercel.
3) Add env vars in Vercel project settings:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4) Deploy.
5) Verify:
- `/api/health` returns `status: ok`
- login + upload + compare + rollback works on production URL.

## Notes

- The app enforces server-side protection for protected routes.
- Environment variables are required at runtime and validated by the app.
- Compare is optimized for text-based files and limits very large outputs.
