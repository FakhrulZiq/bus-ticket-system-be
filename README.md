# 🚌 Bus Ticket System (NestJS + MongoDB)

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

A robust backend system for bus ticket management with user authentication, role-based access control, and audit trails.

## ✨ Features

- **User Management**
  - Registration & authentication (JWT)
  - Role-based access (PASSENGER, ADMIN)
  - Password hashing with bcrypt
- **Data Handling**
  - Pagination & search filters
  - Audit trails (createdBy, updatedBy timestamps)
  - UUID generation for all entities
- **Architecture**
  - Clean modular structure
  - Repository pattern implementation
  - Custom decorators and interceptors
  - Comprehensive error handling

## 🛠 Tech Stack

| Component          | Technology                          |
|--------------------|-------------------------------------|
| Framework          | NestJS                              |
| Database           | MongoDB                             |
| ODM                | Mongoose                            |
| Authentication     | JWT                                 |
| Containerization   | Docker (optional)                   |
| Environment        | ConfigModule (@nestjs/config)       |
| Validation         | Class-validator, class-transformer  |

## 🏗 Project Structure

```text
src/
├── infrastructure/
│   └──dataAccess                    # DB
│       └── database/
│           ├── database.module.ts
│       ├── repositories/            # Type definitions
│       └── shcemas/                 # Type definitions
├── modules/
│   └── user/                        # User management
│       ├── controllers/             # API endpoints
│       ├── services/                # Business logic
│       └── dto/                     # Data transfer objects
```

## 🚀 Getting Started

- **Prerequisites**
  - Node.js v16+
  - MongoDB (local or Docker)
  - npm

### Installation

Clone the repository:
```bash
git clone https://github.com/your-username/bus-ticket-system.git
cd bus-ticket-system
```

Install dependencies:
```bash
npm install
```

Set up environment variables (create .env file):
```env
MONGO_URI=mongodb://localhost:27017/bus-ticket-system
JWT_SECRET=your_jwt_secret_key
PORT=3000
```

### Running the Application

#### Option 1: Local MongoDB
```bash
# Start MongoDB service (Mac)
brew services start mongodb-community

# Run application
npm run start:dev
```

#### Option 2: Dockerized MongoDB
```bash
docker-compose up -d
npm run start:dev
```

## 📚 API Documentation
```bash
# Run application
npm run start:dev
```
View Swagger API Documentation 👉 http://localhost:3000/api



