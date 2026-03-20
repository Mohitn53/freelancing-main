# Online Clothes Store - Project Documentation

## Project Overview
This project is an e-commerce platform encompassing both a public-facing storefront and a secured admin dashboard. It follows a decoupled client-server architecture, where the React-based frontend communicates with a Node.js/Express backend, utilizing Supabase as a robust serverless Database-as-a-Service (BaaS) for PostgreSQL data storage and authentication.

This architecture ensures a clear separation of concerns, scalability, and enhanced security.

---

## 1. Frontend (`/frontend`)

The frontend is a dynamic and responsive Single Page Application (SPA) designed with a modern streetwear aesthetic.

### Tech Stack
* **Core Framework:** React 19 (using Vite as the build tool for fast HMR and compilation)
* **Routing:** `react-router-dom` v7 (handles client-side navigation between storefront and admin panel)
* **Styling:** Tailwind CSS v3 (utility-first CSS for rapid UI development)
* **Animations:** Framer Motion (for smooth page transitions and micro-interactions)
* **Icons:** Lucide React
* **Data Visualization:** Recharts (used in the admin dashboard to display sales and traffic metrics)

### Folder Structure Overview
* **`src/components/`**: Reusable UI elements such as `Navbar`, `Footer`, `ProductCard`, and layout wrappers.
* **`src/pages/`**: Primary page views.
  * **Storefront:** `HomePage`, `ProductListingPage`, `ProductDetailsPage`, `CheckoutPage`, `ProfilePage`, etc.
  * **`admin/`**: Secured pages specifically for the store administrator (`Orders`, `Products`, `Dashboard`, etc.).
* **`src/context/`**: React Context providers for global state management.
  * `AuthContext`: Tracks the current user's authentication and JWT state.
  * `CartContext`: Manages the user's shopping cart items continuously.
* **`src/services/`**: API handlers. Contains `api.js` utilizing the native `fetch` API to intercept and structure backend HTTP calls seamlessly.

---

## 2. Backend (`/backend`)

The backend is a RESTful API built on Node.js to act as middleware between the client and Supabase. It implements critical business logic, security layers, input sanitization, and routing. 

### Tech Stack
* **Core Framework:** Node.js with Express.js (ES Modules)
* **Database & Auth Driver:** `@supabase/supabase-js`
* **Security & Middleware:** 
  * `helmet` (HTTP headers security)
  * `cors` (Cross-Origin Resource Sharing restrictions)
  * `express-rate-limit` (Prevents brute-force or DDoS attacks)
  * `express-mongo-sanitize` (Prevents injection attacks)
* **Security/Auth:** JSON Web Tokens (`jsonwebtoken`)

### Folder Structure Overview
* **`server.js` & `app.js`**: Application entry points where global middleware and routes are bootstrapped.
* **`config/`**: Contains database connectivity logic.
  * `supabaseClient.js`: Uses the highly privileged Service Role Key for unhindered database manipulations bypassing RLS (Row Level Security).
  * `supabaseAuthClient.js`: Uses the Anon key exclusively for processing client-based Authentication methods to explicitly prevent shared client session contamination.
* **`controllers/`**: Core functions processing incoming requests, coordinating data from Supabase DB, and responding with formatted JSON.
* **`routes/`**: Express Router endpoints acting as the API map (e.g., `/api/products`, `/api/orders`, `/auth`).
* **`middleware/`**: 
  * `authMiddleware.js`: Intercepts protected requests to verify valid user/admin JWTs against Supabase before permitting access.
  * `errorMiddleware.js`: Handles system fallbacks for unregistered endpoints and caught operational errors.
* **`supabase/`**: Contains crucial raw SQL migration scripts to construct the PostgreSQL database schema and required RLS structures.

---

## Data Flow Example (Checkout Process)
1. **Frontend:** The user places an order on `/checkout` sending cart/payment details gracefully to via `orderApi.create()`.
2. **Backend Router:** `orderRoutes.js` captures `POST /api/orders` and passes the provided JWT to the `authMiddleware`.
3. **Authentication:** The backend verifies the token locally or via `supabaseAuth.auth.getUser()`, allowing the request to proceed.
4. **Database Mutation:** The router uses the `supabaseClient.js` (service-role) to execute direct insertions into `public.orders` and `public.order_items`.
5. **Completion:** A `200 Success` JSON payload is returned to the frontend.

## Summary 
The separation of the `frontend` (Visuals and Client State) from the `backend` (Security and Business Logic), backed by Supabase (Storage), creates a robust, highly maintainable application structure capable of scaling efficiently.