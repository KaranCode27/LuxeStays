# LuxeStays - Online Hotel Booking Platform

LuxeStays is a production-grade full-stack MERN (MongoDB, Express, React, Node.js) application designed for booking luxury hotels, managing rooms, and processing secure transactions.

The project features a responsive glassmorphic UI built with TailwindCSS, Redux Toolkit, and Framer Motion, backed by a secure Node/Express server and integrated database controllers.

## 🚀 Key Features & Architectural Highlights

### 1. Booking Integrity & Concurrency Controls
* **Double-Booking Overlap Blocks**: Features backend date-range validation queries that scan check-in/check-out boundaries to block concurrent room reservations for identical dates.
* **React Mount Gate**: Guided checkout interfaces prevent React StrictMode's mount cycle from submitting duplicate or parallel payment orders.

### 2. ACID Transactional Workflows
* **Atomicity Fallback**: Checkout states, user notifications, and invoice records are processed within Mongoose database transactions. It features connection topology scanners to dynamically execute transaction boundaries on replica sets, falling back to safe sequential updates on standalone local MongoDB engines.
* **Manual Admin Confirmations**: Admin approvals automatically change booking statuses, mark payments as `'Paid'`, create invoice records, and trigger client notification emails.

### 3. Dynamic Visual Invoice PDFs
* **PDF Invoice Synchronization**: Generates dynamic A4 invoices on the backend using `pdfkit`. Its visual design, color palettes (dark blue `#0f172a` headers, gold `#d4af37` tags/outlines), grid tables, and billing blocks are synchronized with the frontend's jsPDF download layout, ensuring clients receive the identical invoice in their email as they download from their dashboard.

### 4. Advanced Review Aggregation
* **Mongoose Schema Triggers**: Uses Mongoose static aggregation pipelines bound to `post('save')` and `post('deleteOne')` hooks to automatically recalculate and update a hotel's average ratings in real-time when guest feedback is modified.

### 5. High-Performance Text Search
* **Compound Text Indexing**: Employs MongoDB compound text indexes mapped to property name and location fields, enabling fast server-side query lookups and sorting without performing regex scans.

### 6. Dynamic Notification System
* **Alert Triggers**: Features a database-backed notification log and router to record and present guest alerts during checkout milestones, admin approvals, cancellations, and review updates.

### 7. Global Error & Security Middleware
* **Centralized Async Error Handlers**: Incorporates custom async routers and formatting layers to standardize Mongoose validation, ObjectId cast errors, and duplicate key violations into unified JSON responses.
* **Security Sanitization**: Integrates CORS origin bounds and NoSQL query parsers to sanitize inputs and block query injection attempts.

## 🛠️ Tech Stack

* **Frontend:** React, Redux Toolkit, React Router, TailwindCSS, Framer Motion
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), HttpOnly Cookies, bcryptjs
* **Payments:** Razorpay API Merchant Checkout
* **Other Tools:** Cloudinary (media uploads), Nodemailer (emails), PDFKit (invoice PDFs)

## 📦 Installation & Setup

1. **Setup dependencies:**
   From the root directory, run the install script to automatically set up dependencies for the root, backend, and frontend:
   ```bash
   npm run install:all
   ```

2. **Environment Variables Configuration:**
   * Create a `.env` file inside the `backend` directory based on `backend/.env.example`.
   * Update the variables in `backend/.env` with your actual MongoDB connection string, Cloudinary credentials, Nodemailer SMTP account keys, and Razorpay API secret keys.

3. **Running the Application:**
   Start both backend and frontend servers concurrently by running the dev script from the root:
   ```bash
   npm run dev
   ```
   * The backend will run on: `http://localhost:5000`
   * The frontend will run on: `http://localhost:3000`

## 🗄️ Database Seeding

To quickly populate the database with dummy hotels, rooms, and an admin user, make sure MongoDB is running and `MONGO_URI` is configured in `backend/.env`, then run:

```bash
npm run data:import
```

To destroy all data in the database, run:

```bash
npm run data:destroy
```

> **Demo Admin Credentials:**
> **Email:** admin@luxestays.com | **Password:** password123

## License

This project is licensed under the ISC License.
