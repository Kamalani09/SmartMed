# Backend scaffold for frontend-backend integration

## Setup (local)
1. Copy `.env.example` to `.env` and fill `MONGO_URI` and `JWT_SECRET`.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start server with nodemon (or `npm start`).

## Endpoints (examples)
- POST /api/auth/register  -- register new user. Body: { name, email, password }
- POST /api/auth/login     -- login. Body: { email, password }
- GET  /api/protected      -- protected route. Header: Authorization: Bearer <token>

## Integrating with frontend
- On registration form, POST to `http://localhost:5000/api/auth/register` with JSON body.
- On login form, POST to `http://localhost:5000/api/auth/login` and store returned `token` (localStorage/sessionStorage).
- For protected API calls, add header: `Authorization: Bearer <token>`.
