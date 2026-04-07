# ClassDesk API - Deployment Guide

Complete guide for deploying the ClassDesk API to production environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [MongoDB Setup](#mongodb-setup)
- [Local Development](#local-development)
- [Vercel Deployment](#vercel-deployment)
- [GitHub Integration](#github-integration)
- [Environment Variables](#environment-variables)
- [Security Configuration](#security-configuration)
- [Monitoring and Maintenance](#monitoring-and-maintenance)
- [Troubleshooting](#troubleshooting)

## Prerequisites

- **Node.js**: 18.x or higher
- **npm/yarn/pnpm**: Latest version
- **Git**: For version control
- **MongoDB Atlas**: For database (or self-hosted MongoDB)
- **GitHub Account**: For code hosting and Vercel integration
- **Vercel Account**: For hosting and deployment

## Environment Setup

### 1. Prepare Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```env
# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=classdesk

# JWT
JWT_SECRET=your_very_secure_random_key_here_use_strong_random_string
JWT_EXPIRATION=24h
REFRESH_TOKEN_EXPIRATION=7d

# Environment
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# API
API_VERSION=v1
API_BASE_URL=http://localhost:3000/api
```

### 2. Generate Secure JWT Secret

For production, generate a strong JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or using OpenSSL
openssl rand -hex 32
```

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended for Production)

1. **Create MongoDB Atlas Account**
   - Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Create Deployment"
   - Choose "M0 Free Cluster" for development
   - Select your preferred region (choose closest to your users)
   - Click "Create Deployment"

3. **Create Database User**
   - Go to "Security" → "Database Access"
   - Click "Add New Database User"
   - Username: `classdesk_user`
   - Auto-generate a secure password
   - Add user

4. **Get Connection String**
   - Go to "Clusters" → "Connect"
   - Click "Connect your application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database user credentials
   - Update `MONGODB_URI` in `.env.local`

5. **Configure Network Access**
   - Go to "Security" → "Network Access"
   - Add IP Address: `0.0.0.0/0` (allows all IPs - only for development)
   - For production: Add specific IP addresses only

### Option 2: Self-Hosted MongoDB

```bash
# Install MongoDB locally
# macOS
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Connection string
MONGODB_URI=mongodb://localhost:27017/classdesk
```

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### 3. Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/v1/health

# Register
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@school.com",
    "password": "TestPassword123",
    "confirmPassword": "TestPassword123",
    "instituteName": "Test School",
    "adminName": "Test Admin",
    "phone": "+919876543210"
  }'
```

### 4. Database Validation

```bash
# Connect to MongoDB Atlas
mongosh "mongodb+srv://username:password@cluster.mongodb.net/"

# Check database
use classdesk
db.users.find()
db.students.find()
```

## Vercel Deployment

### 1. Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add remote
git remote add origin https://github.com/yourusername/classdesk.git

# Commit and push
git add .
git commit -m "Initial commit: ClassDesk API"
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [https://vercel.com](https://vercel.com)
2. Sign up/Log in with GitHub
3. Click "New Project"
4. Select the `classdesk` repository
5. Click "Import"

### 3. Configure Environment Variables

In Vercel dashboard:

1. Go to Settings → Environment Variables
2. Add the following:

```
MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority
JWT_SECRET = your_secure_random_key_from_above
MONGODB_DB = classdesk
NODE_ENV = production
CORS_ORIGIN = https://your-domain.vercel.app
JWT_EXPIRATION = 24h
REFRESH_TOKEN_EXPIRATION = 7d
API_BASE_URL = https://your-domain.vercel.app/api
```

3. Make sure variables are available in:
   - Production
   - Preview
   - Development (if needed)

### 4. Deploy

```bash
# Deploy
vercel deploy --prod

# Or use Git push (auto-deploy)
git push origin main
```

## GitHub Integration

### 1. Set Up GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install Dependencies
        run: npm install
      
      - name: Run Tests
        run: npm run test --if-present
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 2. Add Secrets to GitHub

Go to Settings → Secrets and add:

```
VERCEL_TOKEN = <your-vercel-token>
VERCEL_ORG_ID = <your-vercel-org-id>
VERCEL_PROJECT_ID = <your-vercel-project-id>
```

## Environment Variables

### Development

```env
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/classdesk
JWT_SECRET=dev_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Staging

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@staging-cluster.mongodb.net/classdesk
JWT_SECRET=<strong-random-secret>
CORS_ORIGIN=https://staging.yourdomain.com
```

### Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@prod-cluster.mongodb.net/classdesk
JWT_SECRET=<very-strong-random-secret>
CORS_ORIGIN=https://yourdomain.com
```

## Security Configuration

### 1. MongoDB Security

- **Network Whitelist**: Only allow specific IPs
- **Database Users**: Create separate users for each environment
- **TLS/SSL**: Enable for all connections
- **Authentication**: Enforce strong passwords

### 2. JWT Security

- **Strong Secret**: Use at least 32 random characters
- **Token Expiration**: Set reasonable expiration times
- **Refresh Strategy**: Implement token refresh mechanism
- **HTTPS Only**: Ensure all API calls use HTTPS

### 3. CORS Configuration

```javascript
// Only allow specific origins
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
```

### 4. Rate Limiting

The API includes built-in rate limiting:
- Standard endpoints: 100 requests per 15 minutes
- Auth endpoints: 10 login attempts per 15 minutes
- Registration: 5 attempts per hour

### 5. API Security Headers

All responses include:
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

## Monitoring and Maintenance

### 1. Health Checks

Set up Vercel monitoring:

```bash
# Check API health
curl https://your-domain.vercel.app/api/v1/health
```

### 2. Error Logging

Monitor errors using:
- Vercel Analytics
- MongoDB Atlas Monitoring
- Custom logging solutions (Sentry, LogRocket, etc.)

### 3. Database Backup

For MongoDB Atlas:

1. Go to Backup section
2. Enable automatic backups
3. Set retention to 30+ days
4. Test restore process monthly

### 4. Performance Optimization

- **Connection Pooling**: MongoDB client already configured with pooling
- **Caching**: Consider Redis for frequently accessed data
- **Database Indexes**: Ensure proper indexes on frequently queried fields
- **API Response**: Implement pagination for all list endpoints

## Troubleshooting

### Issue: MONGODB_URI Connection Error

**Solution:**
```bash
# Verify connection string format
# Should be: mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Check IP whitelist in MongoDB Atlas
# Add your Vercel IP or 0.0.0.0/0 for all

# Test locally first
mongosh "your_connection_string"
```

### Issue: JWT Token Invalid

**Solution:**
```bash
# Regenerate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Update in Vercel environment variables
# Deploy again
```

### Issue: CORS Errors

**Solution:**
```env
# Check CORS_ORIGIN matches your domain
CORS_ORIGIN=https://yourdomain.com

# Avoid using localhost in production
# Use actual domain names
```

### Issue: Rate Limiting Too Strict

**Solution:**
Update in `lib/middleware.ts`:
```typescript
export function checkRateLimit(
  identifier: string,
  limit: number = 200,  // Increase from 100
  windowMs: number = 15 * 60 * 1000
): boolean {
  // ...
}
```

### Issue: Database Connection Timeout

**Solution:**
```bash
# Increase connection timeout in lib/db.ts
const client = new MongoClient(MONGODB_URI, {
  maxPoolSize: 20,  // Increase pool size
  minPoolSize: 5,
  serverSelectionTimeoutMS: 10000,  // Increase timeout
})
```

## Production Checklist

- [ ] MongoDB Atlas configured with backups
- [ ] JWT_SECRET is strong and random
- [ ] Environment variables set in Vercel
- [ ] CORS_ORIGIN set to production domain
- [ ] NODE_ENV set to production
- [ ] Database indexes created for frequently queried fields
- [ ] Health check endpoint working
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Monitoring and logging set up
- [ ] Error handling tested
- [ ] Rate limiting verified
- [ ] Security headers configured
- [ ] Database backups automated

## Next Steps

1. **Add Frontend**: Connect your Next.js frontend to these APIs
2. **Email Integration**: Set up SMTP for reminder emails
3. **Testing**: Add comprehensive test suite
4. **Documentation**: Generate API documentation with Swagger/OpenAPI
5. **Analytics**: Implement usage analytics and monitoring
6. **CI/CD**: Set up automated testing and deployment
7. **Database Migration**: Create migration tools for schema updates

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [JWT Introduction](https://jwt.io/introduction)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)

---

**Last Updated:** January 2024
**API Version:** 1.0.0
