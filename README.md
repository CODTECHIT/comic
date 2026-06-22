# Comic Book Platform

This project is a full-stack platform built for a Comic Book ecosystem, enabling authors and studios to host, sell, and distribute digital comics securely. It utilizes a React frontend with a Node.js/Express backend, all protected with strong security and validation layers.

## Features & Improvements

### Architecture
- **Frontend Modularization**: Migration from an initial `App.tsx` monolith into independent pages (e.g. `LoginPage.tsx`) with dedicated routing structures to separate concerns.
- **Backend API**: Structured Express application adopting RESTful principles with an `/api/v1` namespace.

### Security Enhancements
- **JWT HTTP-Only Cookies**: Replaced less secure header-based token authentication with cookies configured as `HttpOnly`, preventing XSS exposure of access tokens.
- **Validation**: Strict validation pipelines implemented across the stack:
  - **Backend**: Express Zod validation middleware rejecting malformed payloads before they reach controllers.
  - **Frontend**: Form schemas using Zod and React Hook Form (implemented in `src/lib/validations.ts` and `LoginPage.tsx`).
- **Rate Limiting**: Configured `express-rate-limit` to deter brute-force and DDoS attempts globally.
- **CORS Policies**: Explicit origin requirements allowing credential transmissions between frontend clients and the backend layer.

### Infrastructure
- **Centralized Configuration**: Extracted scattered environment-specific URLs into a unified `src/config/api.ts` module relying on environment variables.
- **Error Handling**: Graceful database connection strategies preventing server crashes and obscuring internal architecture from end-users on fault.
- **Testing**: Frontend integrated with `Vitest` and React Testing Library for component unit testing.

## Running the Application

### Backend
Navigate to the `backend/` directory:
```sh
npm install
npm run dev
```
Make sure you have an `.env` file (refer to `.env.example`).

### Frontend
Navigate to the root directory:
```sh
npm install
npm run dev
```

### Testing
Run `npm run test` (assuming testing scripts are configured in `package.json` for vitest).