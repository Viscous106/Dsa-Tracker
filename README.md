# DSA Veda ⚡

> **A production-level, gamified DSA training simulator** — Level up your algorithm skills through interactive missions, earn XP, track your mastery, and crush coding interviews.

---

## 🎯 Problem Statement

**Who is the user?**  
Computer science students and software developers preparing for technical interviews, who need to master Data Structures & Algorithms.

**What problem does it solve?**  
Traditional DSA resources (textbooks, passive video courses) are non-interactive and fail to produce *retention*. Learners read solutions but can't reproduce them under pressure.

**Why does it matter?**  
Over 80% of FAANG-style technical interviews test DSA concepts. A hands-on, gamified simulator creates active recall, dramatically improving performance in real interviews.

**DSA Veda** solves this by turning 30 core DSA concepts into interactive missions with XP rewards, a rank system, and on-demand cheat notes — making interview prep engaging, trackable, and fun.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🚀 **30 Algorithm Missions** | Gamified challenges covering Arrays, Linked Lists, Trees, Graphs, DP, and more |
| 🏆 **XP & Rank System** | Earn XP on every mission; progress from Recruit → Master |
| 📖 **DSA Cheat Notes** | Real-time search through 30 algorithm notes with instant accordion reveal |
| 📊 **Dashboard** | Live progress tracking: session history, XP level, next mission |
| 🔐 **Firebase Authentication** | Secure login, signup, password reset |
| ☁️ **Firestore Sync** | Progress persisted to Firestore in real-time; offline-first with localStorage fallback |
| 📱 **Responsive Design** | Works on mobile and desktop |

---

## ⚛️ React Concepts Demonstrated

| Concept | Where |
|---|---|
| `useState` | All pages — form fields, quiz selection, accordion |
| `useEffect` | `AuthContext` (session), `GameContext` (Firestore sync), `Challenge` (scroll reset) |
| `useReducer` | `GameContext` — predictable progress state transitions |
| `useContext` | `useAuth()`, `useGame()` — global state consumption |
| `useMemo` | `GameContext` (stable value), `useProgress` hook (derived stats), `CheatNotes` (filtered list) |
| `useCallback` | `Challenge.jsx` — stable `handleSelect` and `handleNext` references |
| `useRef` | `Challenge.jsx` (scroll-to-top), `CheatNotes.jsx` (search auto-focus), `GameContext` (debounce timer) |
| `React.lazy` + `Suspense` | `App.jsx` — all pages code-split |
| Custom Hooks | `useDebounce`, `useLocalStorage`, `useProgress` |
| Context API | `AuthContext`, `GameContext` |
| Protected Routes | `ProtectedRoute` wrapper |
| Lifting State Up | Game state in Context, consumed by all pages |
| Controlled Components | All form inputs |
| Conditional Rendering | Challenge status, empty states, loading screens |
| Lists & Keys | Levels grid, session history, cheat notes |

---

## 🔐 Backend Integration

- **Firebase Auth** — Email/password authentication with session persistence
- **Firestore** — Real-time CRUD for user progress:
  - **Create/Update** — `saveProgress()` on every mission completion (debounced 800ms)
  - **Read** — `loadProgress()` on login to hydrate state from cloud
  - **Delete** — `deleteProgress()` on progress reset
- **Offline-first** — localStorage fallback ensures no data loss without internet

---

## 🏗️ Folder Structure

```
src/
├── components/
│   └── common/
│       ├── Loading/        # Suspense fallback
│       └── ProtectedRoute/ # Auth guard HOC
├── config/
│   └── firebase.js         # Firebase init (env-var based)
├── context/
│   ├── AuthContext.jsx     # Firebase Auth + session
│   ├── GameContext.jsx     # Progress state + Firestore sync
│   └── index.js
├── data/
│   └── levels.js           # 30 DSA missions definition
├── hooks/
│   ├── useDebounce.js      # Debounce hook
│   ├── useLocalStorage.js  # localStorage hook
│   ├── useProgress.js      # Derived stats hook (useMemo)
│   └── index.js
├── pages/
│   ├── Auth/               # Login, Signup, ForgotPassword
│   ├── Challenge/          # Mission runner (useCallback, useRef)
│   ├── CheatNotes/         # Searchable notes (useMemo, useRef, useDebounce)
│   ├── Dashboard/          # Progress overview (useProgress)
│   ├── Home/               # Landing hero
│   ├── Learn/              # Mission select grid
│   ├── Profile/            # User profile + reset
│   └── NotFound/
├── reducers/
│   ├── userProgressReducer.js  # Pure reducer function
│   └── index.js
├── services/
│   └── firestoreService.js # CRUD service layer (Firestore)
└── assets/
    └── styles/             # SCSS design system
```

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Vite) |
| Routing | React Router v7 |
| Styling | Custom SCSS design system (CyberShield aesthetic) |
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| State | Context API + useReducer |
| Deployment | Vercel (primary) / Netlify |

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 18+
- A Firebase project with **Authentication** and **Firestore** enabled

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/dsa-veda.git
cd dsa-veda
npm install
```

### 2. Configure Firebase
Create a `.env` file in the project root:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firestore Security Rules
In the Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/progress/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run locally
```bash
npm run dev
```

### 5. Build for production
```bash
npm run build
```

---

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import repo in Vercel
3. Add `VITE_FIREBASE_*` environment variables in Vercel dashboard
4. Deploy — `vercel.json` handles SPA routing automatically

### Netlify
1. Push to GitHub, connect in Netlify
2. Build command: `npm run build` | Publish dir: `dist`
3. Add environment variables in Netlify dashboard
4. `public/_redirects` handles SPA routing automatically

---

## 📊 Evaluation Rubric Coverage

| Criteria | Implementation |
|---|---|
| Problem Statement | Real interview-prep problem with genuine user value |
| React Fundamentals | All core + intermediate hooks demonstrated |
| Advanced React | `useMemo`, `useCallback`, `useRef`, lazy loading, custom hooks |
| Backend Integration | Firebase Auth + Firestore CRUD |
| UI/UX | CyberShield-inspired dark neon design, responsive |
| Code Quality | `/services`, `/hooks` separation, pure reducer, barrel exports |
| Functionality | Auth, 30 missions, cheat notes, dashboard, profile |

---

## 👤 Author

Built as a React end-term project demonstrating production-level architecture, real backend integration, and deep React fundamentals.