# 💻 StockMaster - Frontend Client

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logoColor=white)

This is the frontend client for **StockMaster**, a professional multi-branch inventory management system. It is a Single Page Application (SPA) built with React, Vite, and Tailwind CSS, featuring a modern glassmorphism design (using a premium Rose/Wine color palette) and real-time state management.

---

## 🏗️ Architecture & State Management

* **Global State:** Handled by **Zustand**. It manages the authentication session (JWT), the active supermarket selection, and user permissions across the entire app seamlessly.
* **Routing:** Protected routes using `react-router-dom`. Users are automatically redirected to the login or recovery flow if no valid token is present.
* **HTTP Client:** Configured with **Axios interceptors** in the `/api` folder to automatically attach JWT tokens to every request and handle unauthorized (401) responses gracefully.
* **Styling:** Fully responsive, utility-first styling with **Tailwind CSS**, providing a consistent UI across mobile and desktop environments.

---

## 📂 Folder Structure

```text
client/
├── public/                 # Static assets (favicons, external images)
├── src/
│   ├── api/                # Axios configuration and API interceptors
│   ├── components/         # Reusable UI components broken down by feature
│   │   ├── inventory/      # Product tables, modals, and Kardex UI
│   │   ├── layout/         # Topbar, Sidebar, Notification bell, and main wrappers
│   │   ├── supermarkets/   # Branch management cards and modals
│   │   └── users/          # User management and role assignment UI
│   ├── pages/              # Main routing views (Login, ForgotPassword, Dashboard, etc.)
│   ├── store/              # Zustand global state stores (e.g., authStore.ts)
│   ├── types/              # TypeScript interfaces and global types
│   ├── App.tsx             # Root component and Router configuration
│   ├── index.css           # Global CSS and Tailwind directives
│   └── main.tsx            # React DOM rendering entry point
├── .env                    # Environment variables (Ignored by Git)
├── eslint.config.js        # Linter configuration
├── index.html              # Main HTML template
├── package.json            # Dependencies and NPM scripts
├── tsconfig.json           # TypeScript compiler configuration
└── vite.config.ts          # Vite bundler configuration

```



## 📦 Main Libraries & Technologies
* **React 18:** Core UI library for building the component tree.

* **Vite:** Next-generation frontend tooling for ultra-fast HMR (Hot Module Replacement) and optimized builds.

* **Tailwind CSS:** Utility-first CSS framework used for the custom UI theme and glassmorphism effects.

* **Zustand:** A small, fast, and scalable bearbones state-management solution.

* **Axios:** Promise-based HTTP client for the browser.

* **Lucide React:** Beautiful and consistent icon toolkit used throughout the application.

---

## 🔐 Environment Variables (`.env`)
Create a `.env` file in the root of the `client/` directory. Since we are using Vite, variables must be prefixed with `VITE_`. Do not commit this file to version control.

```
# API Backend URL
# Use your localhost port for development, or your deployed server URL for production
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Scripts & Lifecycle
### Development Server
Starts the Vite development server with blazing fast Hot Module Replacement (HMR).

```
npm run dev
```

### Production Build
Compiles TypeScript and bundles the React application for production into the `dist/` folder.

```
npm run build
```

### Preview Production
Locally preview the production build (acts like a mini static web server for the `dist/` folder) to ensure everything works before deployment.

```
npm run preview
```

---


## 🎨 Key Features Implemented
* **Role-Based UI:** The interface adapts dynamically based on the user's role (`admin`, `manager`, `provider`, `worker`). For example, global branch selectors and creation buttons only appear for authorized personnel.

* **Password Recovery Flow:** Complete UI for requesting a reset link via email and securely setting a new password via time-sensitive tokens.

* **Dynamic Dashboard:** Data visualization for KPIs, category distribution charts, and urgent low-stock alerts.

* **Responsive Design:** A mobile-first approach ensuring the inventory can be managed from warehouse tablets or smartphones.

---

## 👨‍💻 Author
Ernesto - Information Technology and Digital Innovation Engineering Student at Universidad Politécnica de Durango (UNIPOLI DGO).