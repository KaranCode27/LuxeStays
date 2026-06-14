# LuxeStays - Online Hotel Booking Platform

A comprehensive, full-stack MERN (MongoDB, Express, React, Node.js) application for booking luxury hotels and managing rooms. It features robust user authentication, Stripe payments, and distinct dashboards for both standard users and administrators.

## Features

* **User Authentication:** Secure JWT-based login, registration, and password reset functionalities.
* **Hotel & Room Search:** Filter, search, and view detailed information regarding hotels and rooms.
* **Payment Integration:** Secure checkout and payment processing via Stripe or Razorpay.
* **User Dashboard:** Users can manage profiles, view booking history, and maintain a wishlist.
* **Admin Dashboard:** Comprehensive administration portal to manage hotels, rooms, bookings, and users.
* **Responsive Design:** A beautiful UI built with TailwindCSS and Framer Motion animated details.

## Tech Stack

* **Frontend:** React, Redux Toolkit, React Router, TailwindCSS, Framer Motion
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Payments:** Stripe API
* **Other Tools:** Cloudinary (for image uploads), Nodemailer (for emails)

## Installation & Setup

1. **Setup dependencies:**
   From the root directory, run the install script to automatically set up dependencies for the root, backend, and frontend:
   ```bash
   npm run install:all
   ```

2. **Environment Variables Configuration:**
   * Create a `.env` file inside the `backend` directory based on `backend/.env.example`.
   * Update the variables in `backend/.env` with your actual MongoDB URI, Razorpay, and Stripe keys.

3. **Running the Application:**
   Start both backend and frontend servers concurrently by running the dev script from the root:
   ```bash
   npm run dev
   ```
   * The backend will run on: `http://localhost:5000`
   * The frontend will run on: `http://localhost:3000`

## Database Seeding

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
