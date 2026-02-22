# Money Manager 🚀

A comprehensive personal finance management application built with **Spring Boot** and **React**. This platform allows users to track income/expenses, manage budgets, set financial goals, and get AI-powered investment suggestions.

## ✨ Features

- **Income & Expense Tracking:** Log your transactions with categories and descriptions.
- **Budget Management:** Set monthly limits for different categories and track adherence.
- **Financial Analytics:** Visual dashboards (charts/graphs) to understand spending patterns.
- **Goal Tracking:** Set savings goals and monitor progress over time.
- **AI Suggestions:** Get optimization tips for wasteful spending and investment recommendations.
- **Secure Authentication:** JWT-based user login and registration.
- **Dark Theme:** Premium Nexus Dark aesthetic for a futuristic feel.

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Recharts.
- **Backend:** Java, Spring Boot, Spring Security, JWT.
- **Database:** MongoDB.
- **Icons:** Lucide React.

---

## 🚀 How to Run

### Prerequisites

- **Java 17+**
- **Node.js 18+**
- **Maven**
- **MongoDB** (Local or Cloud Atlas)

### 1. Database Setup

1. Create a MongoDB database (e.g., `MoneyManager`).
2. Obtain your MongoDB URI.

### 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd money-manager/backend
   ```
2. Create a `.env` file (see `.env` section below) and add your connection string.
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start at `http://localhost:8081`.

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and set the API URL:
   ```env
   VITE_API_BASE_URL=http://localhost:8081/api
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`.

---

## 🔒 Environment Variables

### Backend (`money-manager/backend/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB Connection String | (Required) |
| `MONGODB_DATABASE` | Database Name | `MoneyManager` |
| `JWT_SECRET` | Secret key for JWT | (Required) |
| `JWT_EXPIRATION` | Token expiration time (ms) | `86400000` |
| `SERVER_PORT` | Backend server port | `8081` |
| `CORS_ALLOWED_ORIGINS` | Permitted frontend URLs | `http://localhost:5173` |

### Frontend (`app/.env`)
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API URL | `http://localhost:8081/api` |

---

## 📂 Project Structure

- `app/` - React frontend application.
- `money-manager/backend/` - Spring Boot backend application.
- `Idea.md` - Detailed development plan and feature roadmap.

---

## 📜 License

This project is for personal financial management and educational purposes.
