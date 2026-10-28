# Doctor Tracker 🏥

A complete, full-stack Doctor & Patient Appointment Management application built with **Next.js (React 19)** on the frontend, **Express.js** on the backend, and **MongoDB Atlas** for database persistence.

---

## 🌟 Features

- **Dashboard Overview**: Key metrics including total doctors, active practitioners, total appointments, today's schedule, completion rate, and specialty distributions.
- **Doctor Management**:
  - Browse doctors with instant search and filter by specialty (Cardiology, Neurology, Pediatrics, Orthopedics, Dermatology, General Medicine, etc.) or availability.
  - Create, view, edit, and delete doctor profiles with consultation fees, visiting hours, and chamber details.
  - Quick "Book Visit" button to book directly with a specific specialist.
- **Appointment Tracker**:
  - Comprehensive patient bookings tracker.
  - Search by patient name, phone, or symptoms.
  - Filter by date, doctor, or status (`Scheduled`, `Confirmed`, `Completed`, `Cancelled`).
  - Quick inline status changes directly from the table or full edit modal.
- **One-Click Demo Data**:
  - Includes a "Load Demo Data" button to instantly populate 6 realistic doctors and 8 categorized appointments.
- **Live Health & Atlas Indicator**:
  - Real-time indicator displaying the live connection status of Express and MongoDB Atlas.

---

## 📂 Project Architecture

```
doctor_tracker/
├── package.json              # Root monorepo script runner
├── backend/
│   ├── .env                  # MongoDB Atlas URI & Port configuration
│   ├── package.json          # Express, Mongoose, Cors, Dotenv
│   ├── server.js             # Express server entry point & health check
│   └── src/
│       ├── config/
│       │   └── db.js         # Mongoose connection with Atlas
│       ├── controllers/
│       │   ├── doctorController.js
│       │   ├── appointmentController.js
│       │   ├── statsController.js
│       │   └── seedController.js
│       ├── models/
│       │   ├── Doctor.js
│       │   └── Appointment.js
│       └── routes/
│           ├── doctorRoutes.js
│           ├── appointmentRoutes.js
│           ├── statsRoutes.js
│           └── seedRoutes.js
└── frontend/
    ├── .env.local            # NEXT_PUBLIC_API_URL=http://localhost:5001/api
    ├── package.json          # Next.js 16, React 19, Tailwind CSS v4
    └── src/
        ├── app/
        │   ├── globals.css
        │   ├── layout.js
        │   └── page.js       # Main application page & state management
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Dashboard.jsx
        │   ├── DoctorsList.jsx
        │   ├── AppointmentsList.jsx
        │   ├── DoctorModal.jsx
        │   ├── AppointmentModal.jsx
        │   └── Icons.jsx
        └── lib/
            └── api.js        # API service layer connecting to Express
```

---

## 🚀 How to Run the Project

Both servers are currently configured and running. If you ever need to start or restart them:

### 1. Start the Express Backend (Port 5001)

```bash
cd backend
npm run dev
# or: node server.js
```
The backend will run at `http://localhost:5001` and connect to MongoDB Atlas.
- Health Check: `http://localhost:5001/api/health`

### 2. Start the Next.js Frontend (Port 3000)

```bash
cd frontend
npm run dev
```
Open your browser and navigate to:
**`http://localhost:3000`**

### 3. Or Run via Root Scripts

From the project root directory:
```bash
# Run backend
npm run dev:backend

# Run frontend (in another terminal)
npm run dev:frontend
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & MongoDB Atlas connection status |
| `GET` | `/api/stats` | Aggregated dashboard metrics & specialty breakdown |
| `POST` | `/api/seed` | Seed realistic doctors and patient appointments |
| `GET` | `/api/doctors` | List doctors (supports search, specialty, status query) |
| `POST` | `/api/doctors` | Create a new doctor profile |
| `GET` | `/api/doctors/:id` | Get details for a single doctor |
| `PUT` | `/api/doctors/:id` | Update doctor details |
| `DELETE`| `/api/doctors/:id` | Delete doctor and associated appointments |
| `GET` | `/api/appointments` | List appointments (supports search, status, doctor, date) |
| `POST` | `/api/appointments` | Book a new patient appointment |
| `GET` | `/api/appointments/:id` | Get single appointment |
| `PUT` | `/api/appointments/:id` | Update appointment or change status |
| `DELETE`| `/api/appointments/:id` | Delete an appointment |

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xoaol6y.mongodb.net/doctor_tracker?retryWrites=true&w=majority
CLIENT_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```
