# Drone Delivery Frontend (Demo)

This React application demonstrates the full flow for the drone delivery capstone project. It interacts with the Spring Boot backend under `src/` via REST APIs.

## Features

- Authentication screen that persists the issued JWT token and role.
- CRUD management for restaurants and dishes.
- Menu listing per restaurant for quick selection.
- Order creation form that collects customer details and chosen dishes.
- Restaurant order management with confirm / cancel actions.
- Payment view that requests a VNPAY payment URL from the backend and redirects to it.
- Dispatch workflow for marking orders ready and picked up by drones.
- Drone tracking page that fetches telemetry or falls back to a demo timeline.
- Customer delivery confirmation form to complete the flow.

## Getting Started

```bash
cd FE
npm install
npm run dev
```

Copy `.env.example` to `.env` and adjust `VITE_API_BASE_URL` to point at the running backend instance.

The UI relies on the backend controllers: `Auth`, `Restaurant`, `Dish`, `Order`, `Payment`, `TrackingRest`, and `VnpayGateway`. Adjust endpoint paths in `src/api/index.js` if your backend uses different routes or request shapes.
