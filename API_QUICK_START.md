# ClassDesk API - Quick Start Guide

Get the ClassDesk API up and running in minutes.

## Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier available)
- npm or yarn

## 5-Minute Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET=your_random_secret_key
```

### 3. Start Development Server

```bash
npm run dev
```

Server running at `http://localhost:3000/api/v1`

### 4. Test the API

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Register new user
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "instituteName": "My School",
    "adminName": "Admin Name",
    "phone": "+919876543210"
  }'
```

## API Endpoints Overview

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh token

### Students
- `GET /students` - List all students
- `GET /students/{id}` - Get student details
- `POST /students` - Create new student
- `PUT /students/{id}` - Update student
- `DELETE /students/{id}` - Delete student

### Batches
- `GET /batches` - List all batches
- `GET /batches/{id}` - Get batch details
- `POST /batches` - Create batch
- `PUT /batches/{id}` - Update batch
- `DELETE /batches/{id}` - Delete batch

### Fee Plans
- `GET /fee-plans` - List fee plans
- `GET /fee-plans/{id}` - Get fee plan details
- `POST /fee-plans` - Create fee plan
- `PUT /fee-plans/{id}` - Update fee plan
- `DELETE /fee-plans/{id}` - Delete fee plan

### Payments
- `GET /payments` - List payments
- `GET /payments/{id}` - Get payment details
- `POST /payments` - Record payment
- `PUT /payments/{id}` - Update payment status
- `DELETE /payments/{id}` - Delete payment

### Reminders
- `GET /reminders` - List reminders
- `GET /reminders/{id}` - Get reminder details
- `POST /reminders` - Create reminder
- `PUT /reminders/{id}` - Update reminder
- `DELETE /reminders/{id}` - Delete reminder

### Health
- `GET /health` - Check API status

## Database Setup

### MongoDB Atlas (Recommended)

1. Create free account: https://mongodb.com/cloud/atlas
2. Create M0 cluster
3. Create database user
4. Get connection string and add to `.env.local`

### Local MongoDB

```bash
# macOS
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
MONGODB_URI=mongodb://localhost:27017/classdesk
```

## Common Tasks

### Register and Login

```bash
# Register
RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "SecurePass123",
    "confirmPassword": "SecurePass123",
    "instituteName": "My School",
    "adminName": "Admin",
    "phone": "+919876543210"
  }')

# Extract token
TOKEN=$(echo $RESPONSE | jq -r '.data.tokens.accessToken')

echo "Token: $TOKEN"
```

### Create a Batch

```bash
curl -X POST http://localhost:3000/api/v1/batches \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JEE 2026 Morning",
    "subject": "JEE Main",
    "timing": "6:00 AM - 9:00 AM",
    "capacity": 50,
    "feeConfig": {
      "mode": "quarterly",
      "baseAmount": 120000,
      "discount": 10000,
      "finalAmount": 110000,
      "startDate": "2024-04-01T00:00:00Z"
    }
  }'
```

### Create a Student

```bash
curl -X POST http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Raj Kumar",
    "email": "raj@example.com",
    "phone": "+919876543210",
    "parentName": "Mr. Kumar",
    "parentPhone": "+919876543211",
    "schoolName": "Delhi Public School",
    "class": "12th",
    "subjectsOpted": ["Mathematics", "Physics", "Chemistry"],
    "batchId": "batch_id_here"
  }'
```

### List Students with Filters

```bash
# Get all active students
curl "http://localhost:3000/api/v1/students?status=active&page=1&limit=20" \
  -H "Authorization: Bearer $TOKEN"

# Search by name
curl "http://localhost:3000/api/v1/students?search=Raj&limit=10" \
  -H "Authorization: Bearer $TOKEN"

# Filter by batch
curl "http://localhost:3000/api/v1/students?batchId=batch_001" \
  -H "Authorization: Bearer $TOKEN"
```

## Production Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Deploy with `git push`

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## Development Tools

### Using Postman

1. Import collection from API documentation
2. Set `{{base_url}}` = `http://localhost:3000/api/v1`
3. Set `{{token}}` from login response
4. Use pre-configured requests

### Using cURL

```bash
# Login
RESPONSE=$(curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"SecurePass123"}')

# Extract token
TOKEN=$(echo $RESPONSE | jq -r '.data.tokens.accessToken')

# Use in subsequent requests
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer $TOKEN"
```

### Using JavaScript/Node.js

```javascript
// Login
const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@school.com',
    password: 'SecurePass123'
  })
});

const loginData = await loginResponse.json();
const token = loginData.data.tokens.accessToken;

// Get students
const studentsResponse = await fetch('http://localhost:3000/api/v1/students', {
  headers: { 'Authorization': `Bearer ${token}` }
});

const students = await studentsResponse.json();
console.log(students.data);
```

## Response Format

All responses follow this format:

### Success
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* additional info */ }
}
```

## Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `UNAUTHORIZED` | 401 | Missing/invalid token |
| `TOKEN_EXPIRED` | 401 | Token has expired |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `NOT_FOUND` | 404 | Resource not found |
| `EMAIL_ALREADY_EXISTS` | 409 | Email already registered |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

## Troubleshooting

### Connection Issues

```bash
# Test MongoDB connection
mongosh "your_connection_string"

# Check environment variables
echo $MONGODB_URI
echo $JWT_SECRET
```

### API Not Responding

```bash
# Check health endpoint
curl http://localhost:3000/api/v1/health

# Check server logs
# Look for errors in terminal where `npm run dev` is running
```

### Authentication Issues

```bash
# Verify token is valid
curl http://localhost:3000/api/v1/students \
  -H "Authorization: Bearer your_token_here"

# Get new token if expired
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"your_refresh_token"}'
```

## Next Steps

1. Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference
2. Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for production deployment
3. Set up monitoring and error tracking
4. Connect your frontend application
5. Configure email for reminders
6. Set up automated backups

## Support

- Check API logs for errors
- Review error response codes
- Verify environment variables
- Test endpoints with cURL/Postman
- Check MongoDB connection status

## Version Info

- **API Version**: 1.0.0
- **Node.js**: 18+
- **Next.js**: 14+
- **MongoDB**: 5.0+

---

**Ready to build?** Start with the health check endpoint and then try registering your first user!
