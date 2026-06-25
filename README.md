# Node.js Ecommerce API

![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express.js-API-black)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Jest](https://img.shields.io/badge/Jest-Testing-red)

RESTful API สำหรับระบบ Ecommerce พัฒนาด้วย Node.js, Express และ MongoDB

## Features

- User Authentication (JWT)
- Refresh Token
- Role-Based Authorization (Admin/User)
- Product CRUD
- Category CRUD
- Review System
- Input Validation
- File Upload
- Unit Testing (Jest)
- Integration Testing (Supertest)

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Jest
- Supertest
- Multer

## Installation

Clone Repository

```bash
git clone https://github.com/WeeraprawatSaprong/nodejs-ecommerce-api.git
cd nodejs-ecommerce-api
```

Install Dependencies

```bash
npm install
```

Create `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

Run Development Server

```bash
npm run dev
```

Run Production Server

```bash
npm start
```

## Testing

Run All Tests

```bash
npm test
```

Run Unit Tests

```bash
npm run test:unit
```

Run Integration Tests

```bash
npm run test:integration
```

## API Endpoints

### Authentication

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /auth/register        |
| POST   | /auth/login           |
| POST   | /auth/refresh         |
| POST   | /auth/logout          |
| POST   | /auth/forgot-password |
| POST   | /auth/reset-password  |

### Products

| Method | Endpoint      |
| ------ | ------------- |
| GET    | /products     |
| GET    | /products/:id |
| POST   | /products     |
| PUT    | /products/:id |
| DELETE | /products/:id |

### Categories

| Method | Endpoint        |
| ------ | --------------- |
| GET    | /categories     |
| POST   | /categories     |
| PUT    | /categories/:id |
| DELETE | /categories/:id |

## Test Coverage

### Integration Tests

- Auth API
- Product API

### Unit Tests

- Auth Controller
- Product Controller
- Protect Middleware
- Admin Middleware

## Project Structure

```txt
controllers/
models/
routes/
middleware/
utils/
tests/
  ├── unit/
  └── integration/
```

## Author

Weeraprawat Saprong
