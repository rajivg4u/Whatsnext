# Supabase notes

The schema is a starting point, not a complete production backend. It includes row-level security policies so authenticated users can access only their own records (and subtasks belonging to their own tasks).

Before production use, add:
- Auth flows and server-side session handling.
- Updated-at/completed-at triggers.
- Task history trigger or explicit application writes.
- Validation and tests for all database operations.
- A reviewed migration process.
