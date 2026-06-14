# Church Ibafo Backend (Minimal)

This is a minimal Node.js + SQLite backend to support the Church Ibafo static site. It provides:

- REST APIs for `sermons`, `announcements`, and `contact` submissions
- A basic admin UI at `/admin` to create/edit sermons and announcements

Quick start

1. Install dependencies:

```bash
cd firstcodes-backend
npm install
```

2. Copy `.env.example` to `.env` and set a secure `ADMIN_TOKEN`.

3. Start server:

```bash
npm start
```

4. Open admin UI in your browser:

```
http://localhost:3000/admin?token=YOUR_ADMIN_TOKEN
```

API endpoints

- `GET /api/sermons` — list sermons
- `GET /api/sermons/:id` — get sermon
- `POST /api/sermons` — create sermon (admin)
- `PUT /api/sermons/:id` — update sermon (admin)
- `DELETE /api/sermons/:id` — delete sermon (admin)

- `GET /api/announcements` — list announcements
- `POST /api/announcements` — create announcement (admin)
- `PUT /api/announcements/:id` — update announcement (admin)
- `DELETE /api/announcements/:id` — delete announcement (admin)

- `POST /api/contact` — submit contact form

Security

This is intentionally minimal: it uses a single `ADMIN_TOKEN` environment variable for admin endpoints. For production use, add proper authentication and HTTPS.
