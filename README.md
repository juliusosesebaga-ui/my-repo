# Church Ibafo — Landing + Backend

This repository contains a static landing site (`firstcodes`) and a small Node/Express backend (`firstcodes-backend`) providing editable sermons, announcements, and a contact form.

Getting started

1. Copy `firstcodes-backend/.env.example` to `firstcodes-backend/.env` and set secure values (an example `.env` is present locally but not committed).
2. Install dependencies and start the backend:

```powershell
cd firstcodes-backend
npm install
npm start
```

3. Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the admin UI.

Security

- Do NOT commit `.env` or the `data/` folder. The repo includes `.gitignore` to prevent this.
- The admin UI uses a simple token-based auth; change the token before production.

License

This project is licensed under the MIT License (see `LICENSE`).
