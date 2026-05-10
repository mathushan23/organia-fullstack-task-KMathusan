# Organia Fullstack Task Management App

## Project Overview

This is a full-stack Task Management Web Application built for the Organia Innovations Labs internship assessment.

The application supports secure authentication, role-based access, and task management. Regular users can manage their own tasks, while admins can view users, search users, and manage user task history.

## Technology Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Anime.js

### Backend
- Spring Boot
- Spring Security
- JWT Authentication
- BCrypt Password Hashing
- Spring Data JPA

### Database
- MySQL
- Aiven MySQL for deployed database

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Aiven MySQL

### Other
- Docker
- Docker Compose

## Live URLs

Frontend:

```text
https://organia-fullstack-task-k-mathusan.vercel.app
```

Backend:

```text
https://organia-fullstack-task-kmathusan.onrender.com
```

Backend API Base URL:

```text
https://organia-fullstack-task-kmathusan.onrender.com/api
```
The backend is hosted on Render free tier. The first request may take 50+ seconds if the service is sleeping.

## Demo Credentials

Admin:

```text
Email: admin@gmail.com
Password: Admin@12345
```

User:

```text
Email: mathu@gmail.com
Password: mathu@123
```

## Set Up And Run Locally

### 1. Clone The Repository

```bash
git clone https://github.com/mathushan23/organia-fullstack-task-KMathusan.git
cd organia_fullstack_task
```

### 2. Create Environment File

Copy the example environment file:

```bash
copy .env.example .env
```

For local Docker MySQL, the default `.env.example` values can be used.

For Aiven MySQL, update:

```env
DB_CONNECTION=mysql
DB_HOST=your-aiven-host
DB_PORT=your-aiven-port
DB_DATABASE=defaultdb
DB_USERNAME=avnadmin
DB_PASSWORD=your-aiven-password
JWT_SECRET=your-long-random-secret
JWT_EXPIRATION_MS=86400000
```

### 3. Run With Docker

From the project root:

```bash
docker compose up --build
```

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8082
```

### 4. Run Backend Manually

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

Backend runs on:

```text
http://localhost:8082
```

### 5. Run Frontend Manually

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

For deployed frontend, set this Vercel environment variable:

```env
VITE_API_URL=https://organia-fullstack-task-kmathusan.onrender.com/api
```

## API Documentation

### Authentication

#### Register User

```http
POST /api/auth/signup
```

Request body:

```json
{
  "name": "User",
  "email": "user@example.com",
  "password": "Password123",
  "confirmPassword": "Password123"
}
```

#### Login

```http
POST /api/auth/login
```

Request body:

```json
{
  "email": "admin@gmail.com",
  "password": "Admin@12345"
}
```

Response includes JWT token:

```json
{
  "token": "jwt-token",
  "id": 1,
  "name": "Admin",
  "email": "admin@gmail.com",
  "role": "ADMIN"
}
```

### User Task APIs

All task APIs require:

```http
Authorization: Bearer <jwt-token>
```

#### Get Tasks

```http
GET /api/tasks
```

Optional status filter:

```http
GET /api/tasks?status=TO_DO
GET /api/tasks?status=IN_PROGRESS
GET /api/tasks?status=COMPLETED
```

#### Create Task

```http
POST /api/tasks
```

Request body:

```json
{
  "title": "Complete assessment",
  "description": "Finish the full-stack task management app",
  "status": "TO_DO",
  "dueDate": "2026-05-20"
}
```

#### Update Task

```http
PUT /api/tasks/{id}
```

Request body:

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "status": "IN_PROGRESS",
  "dueDate": "2026-05-20"
}
```

#### Delete Task

```http
DELETE /api/tasks/{id}
```

### Admin APIs

Admin APIs require an admin JWT token.

#### Get All Users

```http
GET /api/admin/users
```

#### Create User

```http
POST /api/admin/users
```

Request body:

```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "Password123",
  "role": "USER"
}
```

#### Update User

```http
PUT /api/admin/users/{id}
```

Request body:

```json
{
  "name": "Updated User",
  "email": "updated@example.com",
  "password": "",
  "role": "USER"
}
```

#### Delete User

```http
DELETE /api/admin/users/{id}
```

#### Get All Tasks

```http
GET /api/admin/tasks
```

#### Create Task For User

```http
POST /api/admin/tasks
```

Request body:

```json
{
  "userId": 2,
  "title": "Admin assigned task",
  "description": "Task created by admin",
  "status": "TO_DO",
  "dueDate": "2026-05-20"
}
```

#### Update Any Task

```http
PUT /api/admin/tasks/{id}
```

Request body:

```json
{
  "userId": 2,
  "title": "Updated admin task",
  "description": "Updated by admin",
  "status": "COMPLETED",
  "dueDate": "2026-05-20"
}
```

#### Delete Any Task

```http
DELETE /api/admin/tasks/{id}
```

## Features

- User registration and login
- JWT based authentication
- BCrypt password hashing
- Role based access control
- Admin seeded automatically
- User task CRUD
- Admin user management
- Admin task history view
- Search users in admin panel
- Frontend validation
- Responsive UI
- Toast messages
- Animated UI with Anime.js
- Docker setup
