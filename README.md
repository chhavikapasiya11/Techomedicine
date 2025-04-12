# Techomedicine - AI-Powered Telemedicine Platform

Techomedicine is an AI-powered telemedicine platform built using the MERN stack. It provides seamless patient-doctor interaction through digital appointment booking, online consultations, electronic health records, and AI-driven health insights.

## Features

- Role-based Login (Patient / Doctor)
- Appointment Booking System
- Video Consultation Link Generation
- Digital Health Records Management
- AI-Powered Health Suggestions using Gemini API (or any LLM)
- Patient Dashboard with Personal & Health Info
- Doctor Dashboard with Appointment Control
- Peer-to-Peer Growth & Learning Modules (Swapping, Mentorship)

## Tech Stack

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for secure authentication

### Frontend:
- React.js
- React Router
- Axios
- Tailwind CSS or Bootstrap (customizable)

### AI Integration:
- Gemini API or similar LLM-based health suggestion service

### Other Integrations:
- Jitsi  video appointments


## Setup Instructions

### 1. Clone the Repository
git clone https://github.com/chhavikapasiya11/techomedicine.git
cd techomedicine

--backend setup
cd backend
npm install

Create a .env file inside the backend directory:
PORT=7000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Frontend Setup
cd frontend
npm install
npm start
