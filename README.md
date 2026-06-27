# Taskflow 📋🚀

Taskflow is a real-time Kanban-based task management platform (Trello-clone) designed for seamless team collaboration. The platform is equipped with intelligent automation powered by artificial intelligence (AI) to help teams optimize productivity and streamline workflows.

---

## 🌟 Key Features

* **Interactive Kanban Board:** Intuitive task card management using a drag-and-drop system.
* **Real-Time Collaboration:** Instant data synchronization across users utilizing **Socket.io** without needing to refresh the page.
* **Automated Sub-task Generation (AI Feature):** Integrated with **Google Gemini AI** to automatically break down complex, large tasks into manageable sub-tasks based on project descriptions.
* **Authentication & Authorization Management:** Secure user access control to ensure data privacy and security across every board.

---

## 🛠️ Tech Stack

### Backend (Server)
* **Runtime Environment:** Node.js
* **Framework:** Express.js
* **Database:** Supabase (PostgreSQL)
* **ORM:** Sequelize
* **Real-Time Communication:** Socket.io
* **AI Integration:** Google Gen-AI (Gemini API)

### Frontend (Client)
* **Library:** React.js

---

## 🚀 Installation & Setup Guide

Run the following command blocks in your terminal to quickly configure and run both the **Server** and **Client** in your local environment:

```bash
# ==========================================
# 1. CLONE REPOSITORY & INITIAL SETUP
# ==========================================
git clone [https://github.com/yourusername/taskflow.git](https://github.com/yourusername/taskflow.git) && cd taskflow

# ==========================================
# 2. BACKEND SETUP (SERVER)
# ==========================================
# Navigate to the server folder, install dependencies, and setup environment variables
cd server && npm install
echo "PORT=3000
DATABASE_URL=your_supabase_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key" > .env

# Run PostgreSQL database migrations
npx sequelize-cli db:migrate

# Start the backend server (Development Mode)
npm run start &

# ==========================================
# 3. FRONTEND SETUP (CLIENT)
# ==========================================
# Return to the root folder, navigate to the client folder, and install dependencies
cd ../client && npm install

# Start the frontend development server
npm run dev
