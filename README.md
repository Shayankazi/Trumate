# TruMate - College Roommate Matcher 🎯

TruMate is a premium, mobile-first roommate matching platform designed specifically for college students in India. Finding a compatible roommate shouldn't be a gamble—TruMate uses a smart matching algorithm to connect students based on their city, area proximity, lifestyle habits, and shared interests.

![TruMate Demo](https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern+mobile+app+interface+on+iphone+showing+a+dating+app+style+card+for+roommate+matching+dark+mode+purple+accents&image_size=landscape_16_9)

## 🚀 Features

- **Swipe Discovery**: A Tinder-like interface to discover potential roommates.
- **Strict City Filtering**: You'll only see students in your city (e.g., Pune users won't see Mumbai listings).
- **Proximity Matching**: Higher compatibility scores for roommates living in the same or nearby areas (Kothrud, Viman Nagar, Juhu, etc.).
- **Lifestyle Compatibility**: Matches based on smoking/drinking preferences, sleep schedules, cleanliness levels, and more.
- **Request & Accept**: A secure connection flow where you send a request and can only chat once accepted.
- **Real-time Chat**: Instant messaging powered by Socket.io.
- **Premium UI**: Dark mode with glassmorphism effects and smooth Framer Motion animations.

## 🛠️ Tech Stack

- **Frontend**: React 18, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express
- **Database**: MongoDB (Mongoose)
- **Real-time**: Socket.io
- **State Management**: Zustand

---

## 💻 Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)

### 1. Clone the repository
```bash
git clone https://github.com/Shayankazi/Trumate.git
cd Trumate
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=3001
VITE_API_URL=http://localhost:3001
```

### 4. Run the development server
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🐳 Deployment (Docker & AWS EC2)

This project is containerized for easy deployment on AWS EC2.

### 1. Build and Run with Docker Compose
```bash
docker-compose up --build -d
```

### 2. Manual Deployment on EC2
1. Launch an EC2 instance (Ubuntu recommended).
2. Install Docker and Docker Compose.
3. Clone this repo.
4. Set up your `.env` file.
5. Run `docker-compose up -d`.
6. Configure your Security Group to allow traffic on port 80/443 (using Nginx as a reverse proxy).

---

## 📄 License
This project is for educational purposes as part of a WADL assignment.

Built with ❤️ for the student community.
