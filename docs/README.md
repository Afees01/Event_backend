# Event Management API Documentation

## Overview

This is a Node.js/Express API for an Event Management System with role-based access (Admin and User). It supports user authentication, event management, and event registrations with soft deletes.

**Tech Stack:**
- Backend: Node.js, Express.js
- Database: MySQL (via mysql2)
- Authentication: JWT
- Documentation: Swagger/OpenAPI

## Database Models

### Users Table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    PASSWORD VARCHAR(255),
    ROLE VARCHAR(20),  -- 'user' or 'admin'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted INT DEFAULT 0
);
```

### Events Table
```sql
CREATE TABLE EVENTS (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200),
    DATE DATE,
    location VARCHAR(200),
    DESCRIPTION TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted INT DEFAULT 0
);
```

### Registrations Table
```sql
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,  -- FK to users.id
    event_id INT, -- FK to events.id
    NAME VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_deleted INT DEFAULT 0
);
```

**Notes:**
- All tables use soft deletes (`is_deleted = 1` instead of hard delete).
- Foreign keys are not enforced in SQL but checked in code.
- Run the above SQL to set up the database.

## API Endpoints

All responses follow this format:
```json
{
  "success": true|false,
  "message": "Description",
  "data": { ... }  // only on success with data
}
```

### Authentication

#### Signup
- **URL:** `POST /api/auth/signup`
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"  // optional, defaults to "user"; use "admin" for admin
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "User created successfully",
    "data": { "token": "jwt_token_here" }
  }
  ```

#### Login
- **URL:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123",
    "role": "user"  // optional - validates that user has this role
  }
  ```
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": { 
      "token": "jwt_token_here",
      "role": "user"
    }
  }
  ```
- **Response (403) - Role mismatch:**
  ```json
  {
    "success": false,
    "message": "User is registered as user, not admin"
  }
  ```

### Events

#### Get All Events
- **URL:** `GET /api/events`
- **Auth:** None
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Events fetched successfully",
    "data": [
      {
        "id": 1,
        "title": "Event Title",
        "DATE": "2026-03-10",
        "location": "Location",
        "DESCRIPTION": "Description",
        "created_at": "2026-03-05T10:00:00.000Z"
      }
    ]
  }
  ```

#### Get Event by ID
- **URL:** `GET /api/events/:id`
- **Auth:** None
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Event fetched successfully",
    "data": { ...event object... }
  }
  ```
- **Response (404):**
  ```json
  {
    "success": false,
    "message": "Event not found"
  }
  ```

#### Create Event (Admin Only)
- **URL:** `POST /api/events`
- **Auth:** Bearer Token (Admin)
- **Body:** (multipart/form-data)
  ```text
  title=New Event
  date=2026-03-15
  location=Venue
  description=Details
  image=@/path/to/file.jpg
  ```
  (multipart form with optional `image` file)
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Event created successfully",
    "data": { "id": 2, "title": "New Event", ... }
  }
  ```

#### Update Event (Admin Only)
- **URL:** `PUT /api/events/:id`
- **Auth:** Bearer Token (Admin)
- **Body:** Same as create
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Event updated successfully",
    "data": { ...updated event... }
  }
  ```

#### Delete Event (Admin Only)
- **URL:** `DELETE /api/events/:id`
- **Auth:** Bearer Token (Admin)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Event deleted successfully"
  }
  ```

### Registrations

#### Register for Event
- **URL:** `POST /api/registrations/:eventId`
- **Auth:** Bearer Token (User)
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
  ```
- **Response (201):**
  ```json
  {
    "success": true,
    "message": "Registration successful",
    "data": { "id": 1, "eventId": 1, ... }
  }
  ```

#### Update Registration
- **URL:** `POST /api/registrations/:id/update`
- **Auth:** Bearer Token (User, owns registration)
- **Body:** Same as register
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Registration updated successfully",
    "data": { ... }
  }
  ```

#### Cancel Registration
- **URL:** `POST /api/registrations/:id/delete`
- **Auth:** Bearer Token (User, owns registration)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Registration cancelled"
  }
  ```

#### Get My Registrations
- **URL:** `GET /api/registrations/me`
- **Auth:** Bearer Token (User)
- **Response (200):**
  ```json
  {
    "success": true,
    "message": "Registrations fetched successfully",
    "data": [
      {
        "id": 1,
        "event_id": 1,
        "title": "Event Title",
        "DATE": "2026-03-10",
        "NAME": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890"
      }
    ]
  }
  ```

## Authentication Details

- **JWT Secret:** Set in `.env` as `JWT_SECRET`
- **Token Expiry:** 1 hour
- **Roles:**
  - `user`: Can view events, register, manage own registrations
  - `admin`: All user permissions + create/edit/delete events
- **Headers:** Include `Authorization: Bearer <token>` for protected routes

## Setup Instructions

1. **Clone/Setup Project:**
   ```bash
   cd Event_backend
   npm install
   ```

2. **Environment Variables:**
   Create `.env` file:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=events_db
   JWT_SECRET=your_secret_key
   PORT=3000
   ```

3. **Database:**
   - Install MySQL
   - Run `db_schema.sql` to create tables

4. **Start Server:**
   ```bash
   npm run start  # or npm run dev for nodemon
   ```

5. **Access:**
   - API: `http://localhost:3000`
   - Docs: `http://localhost:3000/api-docs`

## Usage Examples

### Create Admin User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"admin123","role":"admin"}'
```

### Login and Get Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
# Note the token from response
```

### Create Event (Admin)
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Tech Conference","date":"2026-04-01","location":"Convention Center","description":"Annual tech event"}'
```

### Register for Event (User)
```bash
curl -X POST http://localhost:3000/api/registrations/1 \
  -H "Authorization: Bearer USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"555-1234"}'
```

For interactive testing, use the Swagger UI at `/api-docs`.