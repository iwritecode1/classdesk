# ClassDesk RESTful API

A complete, production-ready RESTful API for the ClassDesk SaaS platform built with Next.js and MongoDB.

## Quick Overview

- **31 API Endpoints** covering all CRUD operations
- **JWT Authentication** with secure token management
- **MongoDB Integration** with multi-tenant architecture
- **Comprehensive Validation** using Zod
- **Advanced Error Handling** with standardized responses
- **Rate Limiting** and security best practices
- **Complete Documentation** and deployment guides
- **Vercel Ready** for seamless deployment

## What's Included

### API Endpoints

#### Authentication (4)
- User registration with institute creation
- Login with JWT token generation
- Logout with token clearing
- Token refresh mechanism

#### Students (5)
- List students with filtering and pagination
- Get student details
- Create new student
- Update student information
- Delete student record

#### Batches (5)
- List course batches
- Get batch details with enrollment stats
- Create batch with fee configuration
- Update batch information
- Delete batch

#### Fee Plans (5)
- List fee plans with filters
- Get fee plan details
- Create fee plan from batch config
- Update fee plan
- Delete fee plan

#### Payments (5)
- List payments with date filtering
- Get payment details
- Record new payment with multiple methods
- Update payment status
- Delete payment with refund handling

#### Reminders (5)
- List reminders with filters
- Get reminder details
- Create scheduled reminders
- Update reminder
- Delete reminder

#### Health (1)
- API health check endpoint

### Infrastructure

**Database Layer** (`lib/db.ts`)
- MongoDB connection management
- Connection pooling (2-10 connections)
- Automatic retry and error handling
- Environment-based configuration

**Authentication** (`lib/auth.ts`)
- JWT token generation and verification
- Password hashing with bcrypt
- Token refresh mechanism
- Configurable expiration times

**Validation** (`lib/validators.ts`)
- Zod schemas for all endpoints
- Request body validation
- Query parameter validation
- Complex type definitions
- Email and phone validation

**Error Handling** (`lib/api-error.ts`)
- Standardized error responses
- 13 predefined error types
- HTTP status code mapping
- Development vs production error details

**Middleware** (`lib/middleware.ts`)
- Authentication verification
- Request body validation
- Query parameter validation
- Rate limiting
- CORS and security headers
- Error handling wrapper

## Getting Started

### Installation

```bash
npm install
```

This installs all dependencies including:
- `mongodb` - MongoDB driver
- `jsonwebtoken` - JWT token management
- `bcryptjs` - Password hashing
- `zod` - Request validation

### Configuration

Create `.env.local`:

```bash
cp .env.example .env.local
```

Update with your values:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_random_secure_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Server available at: `http://localhost:3000/api/v1`

### Test the API

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "SecurePassword123",
    "confirmPassword": "SecurePassword123",
    "instituteName": "My School",
    "adminName": "Admin",
    "phone": "+919876543210"
  }'
```

## Project Structure

```
app/api/v1/
├── auth/                    # Authentication endpoints
│   ├── register/route.ts
│   ├── login/route.ts
│   ├── logout/route.ts
│   └── refresh/route.ts
├── students/               # Student management
│   ├── route.ts           # List & create
│   └── [id]/route.ts      # Get, update, delete
├── batches/                # Batch management
│   ├── route.ts
│   └── [id]/route.ts
├── fee-plans/              # Fee planning
│   ├── route.ts
│   └── [id]/route.ts
├── payments/               # Payment tracking
│   ├── route.ts
│   └── [id]/route.ts
├── reminders/              # Fee reminders
│   ├── route.ts
│   └── [id]/route.ts
└── health/                 # Health check
    └── route.ts

lib/
├── db.ts                   # MongoDB connection
├── auth.ts                 # JWT & password handling
├── validators.ts           # Zod validation schemas
├── api-error.ts            # Error types & handling
└── middleware.ts           # Auth, validation, rate-limiting
```

## Key Features

### 1. Multi-Tenant Architecture

All data is isolated by tenant (institution):
- Tenant ID extracted from JWT token
- All queries filtered by tenant ID
- Cross-tenant access prevented
- Separate metrics per tenant

### 2. Security

- **Authentication**: JWT tokens with configurable expiration
- **Password**: Bcrypt hashing with 10 salt rounds
- **Validation**: Zod schema validation for all inputs
- **Rate Limiting**: Per-IP request limiting
- **CORS**: Configurable origin support
- **Security Headers**: X-Frame-Options, X-Content-Type-Options, etc.
- **Multi-tenant**: Strict tenant isolation

### 3. Error Handling

Standardized error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* additional info */ }
}
```

Common error codes:
- `UNAUTHORIZED` (401)
- `TOKEN_EXPIRED` (401)
- `VALIDATION_ERROR` (400)
- `NOT_FOUND` (404)
- `EMAIL_ALREADY_EXISTS` (409)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_ERROR` (500)

### 4. Pagination

All list endpoints support pagination:

```
GET /students?page=2&limit=20
```

Response includes:
```json
{
  "pagination": {
    "total": 150,
    "page": 2,
    "limit": 20,
    "pages": 8
  }
}
```

### 5. Filtering & Search

Advanced filtering options:

```
GET /students?status=active&batchId=batch_001&search=raj
GET /payments?status=completed&studentId=abc&startDate=2024-01-01&endDate=2024-12-31
```

## API Examples

### Authentication Flow

```bash
# 1. Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{...}'

# Response: { data: { user, tokens: { accessToken, refreshToken } } }

# 2. Use access token in requests
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer {accessToken}"

# 3. Refresh token when expired
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "{refreshToken}"}'

# 4. Logout
curl -X POST http://localhost:3000/api/v1/auth/logout \
  -H "Authorization: Bearer {accessToken}"
```

### Student Management

```bash
# List students
curl "http://localhost:3000/api/v1/students?page=1&limit=20" \
  -H "Authorization: Bearer {token}"

# Create student
curl -X POST http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj",
    "email": "raj@example.com",
    "phone": "+919876543210",
    "parentName": "Parent",
    "parentPhone": "+919876543211",
    "schoolName": "School",
    "class": "12th",
    "subjectsOpted": ["Maths", "Physics"],
    "batchId": "batch_001"
  }'

# Get student
curl http://localhost:3000/api/v1/students/{id} \
  -H "Authorization: Bearer {token}"

# Update student
curl -X PUT http://localhost:3000/api/v1/students/{id} \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name"}'

# Delete student
curl -X DELETE http://localhost:3000/api/v1/students/{id} \
  -H "Authorization: Bearer {token}"
```

## Database Schema

### Collections

**users**
- _id, tenantId, name, email, phone, password, role, status, createdAt, updatedAt

**institutes**
- _id, name, status, createdAt, updatedAt

**students**
- _id, tenantId, name, email, phone, parentName, parentPhone, academicInfo, status, createdAt, updatedAt

**batches**
- _id, tenantId, name, subject, timing, description, capacity, enrolledCount, feeConfig, status, createdAt, updatedAt

**fee-plans**
- _id, tenantId, studentId, batchId, totalAmount, installments, paidAmount, dueDate, status, createdAt, updatedAt

**payments**
- _id, tenantId, feePlanId, studentId, amount, method, transactionId, notes, status, createdAt, updatedAt

**reminders**
- _id, tenantId, studentId, feePlanId, type, subject, message, scheduledDate, status, createdAt, updatedAt

## Deployment

### Vercel

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Environment Variables for Production

```env
MONGODB_URI=<production-uri>
JWT_SECRET=<strong-random-secret>
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

## Documentation

- **API_DOCUMENTATION.md** - Complete API reference with all endpoints
- **API_QUICK_START.md** - 5-minute setup guide with examples
- **DEPLOYMENT_GUIDE.md** - Production deployment instructions
- **API_IMPLEMENTATION_SUMMARY.md** - Technical implementation details
- **.env.example** - Environment variables template

## Testing

### Using cURL

See API_QUICK_START.md for examples.

### Using Postman

1. Import endpoints into Postman
2. Set environment variables
3. Use pre-configured requests

### Using JavaScript

```javascript
const token = 'your_access_token';

// Get students
const response = await fetch('http://localhost:3000/api/v1/students', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const data = await response.json();
console.log(data);
```

## Performance

- Connection pooling: 2-10 MongoDB connections
- Pagination: Max 100 items per request
- Rate limiting: 100 req/15 min (standard), 10 req/15 min (auth)
- Caching: Ready for Redis integration

## Security

- [x] JWT authentication
- [x] Password hashing (bcrypt)
- [x] Request validation (Zod)
- [x] Rate limiting
- [x] CORS configuration
- [x] Security headers
- [x] Multi-tenant isolation
- [x] SQL injection prevention (MongoDB parameterized queries)
- [x] XSS protection (JSON responses)
- [x] CSRF ready (token-based auth)
- [x] Error message sanitization

## Troubleshooting

### MongoDB Connection Error

```bash
# Verify connection string
mongosh "your_connection_string"

# Check IP whitelist in MongoDB Atlas
```

### Authentication Issues

```bash
# Regenerate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update environment variables
```

### API Not Responding

```bash
# Check health endpoint
curl http://localhost:3000/api/v1/health

# Check server logs for errors
```

## Support & Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/)
- [JWT.io](https://jwt.io/)
- [Zod Documentation](https://zod.dev/)
- [Vercel Documentation](https://vercel.com/docs)

## What's Next

1. Read complete documentation
2. Set up development environment
3. Test all endpoints
4. Configure MongoDB Atlas
5. Deploy to Vercel
6. Connect frontend application
7. Set up monitoring
8. Configure email notifications

## Version

- **API Version**: 1.0.0
- **Status**: Production Ready
- **Node.js**: 18+
- **Next.js**: 14+
- **MongoDB**: 5.0+

---

**Ready to get started?** Follow [API_QUICK_START.md](./API_QUICK_START.md) for setup in 5 minutes!
