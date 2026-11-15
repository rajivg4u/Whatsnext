# TaskFlow – Task Manager Starter

A responsive Next.js starter for a personal task manager. It includes a dashboard, task creation, status updates, overdue identification, search/filter controls, progress summary and a simple 7-day calendar strip.

## Important current limitation

The UI currently uses sample tasks held in React state. Tasks reset when the page is refreshed. Supabase is included as the recommended persistence layer, but database CRUD, authentication and Google Calendar integration are **not yet wired into the UI**. The SQL schema is provided as a starting point.

## Requirements

- Node.js 20.9 or newer
- npm
- A GitHub account
- A Vercel account
- (Optional for next phase) a Supabase project

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## GitHub

1. Create a new empty repository on GitHub.
2. Extract this ZIP.
3. Open a terminal in the extracted `taskflow-starter` folder.
4. Run:

```bash
git init
git add .
git commit -m "Initial TaskFlow starter"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your repository URL.

## Deploy to Vercel

1. Sign in to Vercel and choose **Add New > Project**.
2. Import your GitHub repository.
3. Keep the detected Next.js settings.
4. Deploy.

Vercel will create preview deployments for branches and production deployments from the configured production branch.

## Supabase setup (for the persistence phase)

1. Create a Supabase project.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run `supabase/schema.sql`.
4. Copy `.env.example` to `.env.local`.
5. Fill in the project URL and anon/publishable key from Supabase project settings.
6. Add the same environment variables in Vercel Project Settings > Environment Variables.

Never put a Supabase service-role key in browser code or commit secrets to GitHub.

## Suggested next development steps

1. Add Supabase Auth and protected routes.
2. Replace local React state with Supabase task CRUD.
3. Add subtask management and calculated progress.
4. Add a full month/week/day calendar view.
5. Add reminders and recurring tasks.
6. Add task history and richer reporting.

## Overdue logic

A task is displayed as overdue when its due date is before the current date and its status is not `Completed`. Overdue is derived from the due date; it is not a separate task status.
