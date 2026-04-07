# ClassDesk API Documentation

Complete RESTful API documentation for the ClassDesk application built with Next.js and MongoDB.

## Table of Contents

- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Base URL](#api-base-url)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Endpoints](#endpoints)
  - [Authentication](#authentication-endpoints)
  - [Students](#students-endpoints)
  - [Batches](#batches-endpoints)
  - [Fee Plans](#fee-plans-endpoints)
  - [Payments](#payments-endpoints)
  - [Reminders](#reminders-endpoints)
  - [Health Check](#health-check)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB instance)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Update `.env.local` with your MongoDB URI and JWT secret:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_here
```

5. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000/api/v1`

## Authentication

### JWT Token Authentication

All protected endpoints require an Authorization header with a Bearer token:

```
Authorization: Bearer <access_token>
```

Tokens are also stored in HTTP-only cookies for convenience.

### Token Refresh

Access tokens expire after 24 hours. Use the refresh endpoint to get a new token:

```
POST /api/v1/auth/refresh
```

## API Base URL

```
http://localhost:3000/api/v1
```

For production:
```
https://your-domain.vercel.app/api/v1
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* validation errors or additional details */ }
}
```

## Error Handling

### Common Error Codes

- `UNAUTHORIZED` (401) - Missing or invalid authentication token
- `TOKEN_EXPIRED` (401) - JWT token has expired
- `FORBIDDEN` (403) - Insufficient permissions
- `NOT_FOUND` (404) - Resource not found
- `VALIDATION_ERROR` (400) - Invalid request data
- `EMAIL_ALREADY_EXISTS` (409) - Email already registered
- `RATE_LIMIT_EXCEEDED` (429) - Too many requests
- `INTERNAL_ERROR` (500) - Server error

## Endpoints

### Authentication Endpoints

#### Register New User

**POST** `/auth/register`

Creates a new user account and returns authentication tokens.

**Request Body:**
```json
{
  "email": "admin@school.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123",
  "instituteName": "Delhi Public School",
  "adminName": "John Doe",
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "userId",
      "email": "admin@school.com",
      "name": "John Doe",
      "role": "admin",
      "tenantId": "tenantId"
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token"
    }
  },
  "message": "Registration successful"
}
```

#### Login

**POST** `/auth/login`

Authenticates user and returns tokens.

**Request Body:**
```json
{
  "email": "admin@school.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "tokens": { /* token pair */ }
  },
  "message": "Login successful"
}
```

#### Logout

**POST** `/auth/logout`

Clears authentication tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Logout successful"
  }
}
```

#### Refresh Token

**POST** `/auth/refresh`

Generates new access and refresh tokens.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

Or pass the refresh token via cookie.

**Response:**
```json
{
  "success": true,
  "data": {
    "tokens": {
      "accessToken": "new_jwt_token",
      "refreshToken": "new_refresh_token"
    }
  },
  "message": "Token refreshed successfully"
}
```

### Students Endpoints

#### List Students

**GET** `/students`

Retrieves paginated list of students with optional filtering.

**Query Parameters:**
- `page` (number, default: 1) - Page number
- `limit` (number, default: 20) - Items per page (max: 100)
- `status` (string, optional) - Filter by status: `active` or `inactive`
- `batchId` (string, optional) - Filter by batch ID
- `search` (string, optional) - Search by name, email, or phone

**Example:**
```
GET /students?page=1&limit=20&status=active&batchId=batch_001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [ /* array of students */ ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
}
```

#### Get Student Details

**GET** `/students/{id}`

Retrieves details of a specific student.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "studentId",
    "tenantId": "tenantId",
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "phone": "+919876543210",
    "parentName": "Mr. Kumar",
    "parentPhone": "+919876543211",
    "academicInfo": {
      "schoolName": "Delhi Public School",
      "class": "12th",
      "subjectsOpted": ["Mathematics", "Physics", "Chemistry"],
      "batchId": "batch_001"
    },
    "status": "active",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Create Student

**POST** `/students`

Creates a new student record.

**Request Body:**
```json
{
  "name": "Raj Kumar",
  "email": "raj@example.com",
  "phone": "+919876543210",
  "parentName": "Mr. Kumar",
  "parentPhone": "+919876543211",
  "schoolName": "Delhi Public School",
  "class": "12th",
  "subjectsOpted": ["Mathematics", "Physics", "Chemistry"],
  "batchId": "batch_001"
}
```

**Response:** (201 Created)
```json
{
  "success": true,
  "data": { /* student object */ },
  "message": "Student created successfully"
}
```

#### Update Student

**PUT** `/students/{id}`

Updates student information.

**Request Body:**
```json
{
  "name": "Raj Kumar Updated",
  "phone": "+919876543212"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated student object */ },
  "message": "Student updated successfully"
}
```

#### Delete Student

**DELETE** `/students/{id}`

Deletes a student record.

**Response:**
```json
{
  "success": true,
  "data": {
    "deletedId": "studentId"
  },
  "message": "Student deleted successfully"
}
```

### Batches Endpoints

#### List Batches

**GET** `/batches`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional) - Filter by: `active`, `archived`, `planned`

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [ /* array of batches */ ],
    "pagination": { /* pagination info */ }
  }
}
```

#### Get Batch Details

**GET** `/batches/{id}`

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "batchId",
    "tenantId": "tenantId",
    "name": "JEE 2026 Morning",
    "subject": "JEE Main",
    "timing": "6:00 AM - 9:00 AM",
    "description": "Comprehensive JEE Main preparation",
    "capacity": 50,
    "enrolledCount": 25,
    "feeConfig": {
      "mode": "quarterly",
      "frequency": 3,
      "baseAmount": 120000,
      "discount": 10000,
      "finalAmount": 110000,
      "startDate": "2024-04-01T00:00:00Z"
    },
    "status": "active",
    "createdAt": "2024-03-01T00:00:00Z",
    "updatedAt": "2024-03-01T00:00:00Z"
  }
}
```

#### Create Batch

**POST** `/batches`

**Request Body:**
```json
{
  "name": "JEE 2026 Morning",
  "subject": "JEE Main",
  "timing": "6:00 AM - 9:00 AM",
  "description": "Comprehensive JEE Main preparation",
  "capacity": 50,
  "feeConfig": {
    "mode": "quarterly",
    "frequency": 3,
    "baseAmount": 120000,
    "discount": 10000,
    "finalAmount": 110000,
    "startDate": "2024-04-01T00:00:00Z"
  }
}
```

**Response:** (201 Created)

#### Update Batch

**PUT** `/batches/{id}`

**Request Body:** (all fields optional)
```json
{
  "name": "Updated Batch Name",
  "capacity": 60,
  "feeConfig": { /* updated fee config */ }
}
```

**Response:**

#### Delete Batch

**DELETE** `/batches/{id}`

**Response:**

### Fee Plans Endpoints

#### List Fee Plans

**GET** `/fee-plans`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional) - `pending`, `active`, `completed`, `cancelled`
- `studentId` (string, optional) - Filter by student

**Response:**

#### Get Fee Plan Details

**GET** `/fee-plans/{id}`

**Response:**

#### Create Fee Plan

**POST** `/fee-plans`

**Request Body:**
```json
{
  "studentId": "studentId",
  "batchId": "batchId",
  "totalAmount": 110000,
  "installments": 4,
  "dueDate": "2024-12-31T00:00:00Z"
}
```

**Response:** (201 Created)

#### Update Fee Plan

**PUT** `/fee-plans/{id}`

**Request Body:** (all fields optional)

#### Delete Fee Plan

**DELETE** `/fee-plans/{id}`

**Response:**

### Payments Endpoints

#### List Payments

**GET** `/payments`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional) - `completed`, `pending`, `failed`
- `studentId` (string, optional)
- `startDate` (string, optional) - ISO date
- `endDate` (string, optional) - ISO date

**Example:**
```
GET /payments?status=completed&studentId=abc123&startDate=2024-01-01&endDate=2024-12-31
```

**Response:**

#### Get Payment Details

**GET** `/payments/{id}`

**Response:**

#### Record Payment

**POST** `/payments`

**Request Body:**
```json
{
  "feePlanId": "feePlanId",
  "studentId": "studentId",
  "amount": 27500,
  "method": "online",
  "transactionId": "TXN123456",
  "notes": "First installment paid"
}
```

**Response:** (201 Created)

#### Update Payment Status

**PUT** `/payments/{id}`

**Request Body:**
```json
{
  "status": "completed",
  "notes": "Payment verified"
}
```

**Response:**

#### Delete Payment

**DELETE** `/payments/{id}`

**Response:**

### Reminders Endpoints

#### List Reminders

**GET** `/reminders`

**Query Parameters:**
- `page` (number, default: 1)
- `limit` (number, default: 20)
- `status` (string, optional) - `pending`, `sent`, `failed`
- `studentId` (string, optional)

**Response:**

#### Get Reminder Details

**GET** `/reminders/{id}`

**Response:**

#### Create Reminder

**POST** `/reminders`

**Request Body:**
```json
{
  "studentId": "studentId",
  "feePlanId": "feePlanId",
  "type": "email",
  "subject": "Fee Payment Reminder",
  "message": "This is a reminder that your fee installment is due on 2024-04-30",
  "scheduledDate": "2024-04-25T10:00:00Z"
}
```

**Response:** (201 Created)

#### Update Reminder

**PUT** `/reminders/{id}`

**Request Body:** (all fields optional)

#### Delete Reminder

**DELETE** `/reminders/{id}`

**Response:**

### Health Check

#### API Health Status

**GET** `/health`

No authentication required.

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0",
  "database": "connected"
}
```

## Pagination

All list endpoints support pagination with the following parameters:

- `page`: Current page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

Response includes pagination metadata:
```json
{
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "pages": 8
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- Standard endpoints: 100 requests per 15 minutes per IP
- Auth endpoints: 10 login attempts per 15 minutes per IP, 5 registration attempts per hour per IP

Rate limit exceeded responses include:
```json
{
  "success": false,
  "error": "Too many requests, please try again later",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

## Security Headers

All API responses include security headers:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`

## CORS

CORS is configured for the specified origin in `CORS_ORIGIN` environment variable.

Allowed methods: GET, POST, PUT, DELETE, OPTIONS
Allowed headers: Content-Type, Authorization

## Deployment

### Vercel Deployment

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - Other configuration variables

4. Deploy:
```bash
vercel deploy --prod
```

### Environment Variables for Production

Ensure these are set in Vercel:
```
MONGODB_URI=<production-mongodb-uri>
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com
```

## API Testing

### Using cURL

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "password123",
    "confirmPassword": "password123",
    "instituteName": "Test School",
    "adminName": "Admin",
    "phone": "+919876543210"
  }'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "password123"
  }'

# List students (requires token)
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer <access_token>"
```

### Using Postman

1. Import the API endpoints into Postman
2. Set up environment variables:
   - `base_url`: `http://localhost:3000/api/v1`
   - `token`: Token from login response
3. Use the requests with proper headers and body

## Support

For issues or questions:

1. Check the error code in the response
2. Verify environment variables are correctly set
3. Ensure MongoDB connection is working
4. Check API logs for more details
5. Review this documentation

## Changelog

### Version 1.0.0 (Initial Release)

- Complete authentication system (register, login, refresh)
- Student management (CRUD operations)
- Batch management with fee configuration
- Fee plan tracking
- Payment recording and management
- Reminder system for fee collection
- Multi-tenant architecture
- Comprehensive error handling
- Rate limiting
- Security headers
- Health check endpoint

---

Last Updated: January 2024
