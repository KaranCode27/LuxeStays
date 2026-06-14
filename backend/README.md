# LuxeStays Backend API Server

This is the Node.js + Express backend service for the LuxeStays hotel booking platform. It connects to MongoDB and handles APIs for user management, room booking, payment transactions, and administrative features.

## Project Structure

```
backend/
├── config/           # Database and third-party API configurations
├── controllers/      # API controller logics
├── middleware/       # Express middlewares (auth, validation, errors)
├── models/           # Mongoose schemas
├── routes/           # Express API endpoints mapping
├── utils/            # Helper files and database seeding
├── server.js         # Entry point of the Express application
└── setup_images.js   # Image asset syncer
```

## Available Scripts

Runs the following commands within the `/backend` directory:

- **Start production server**: `npm start`
- **Start development server (Nodemon)**: `npm run dev`
- **Seed initial database mock data**: `npm run data:import`
- **Wipe database contents**: `npm run data:destroy`

## Configuration

Make sure your `/backend/.env` file is properly populated with the following variables:
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
