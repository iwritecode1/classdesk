# ClassDesk - Quick Start Guide

## Installation & Setup (5 minutes)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd classdesk
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn install
```

### 3. Run Development Server
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## First Time Setup

### 1. Open the Application
Navigate to [http://localhost:3000](http://localhost:3000)

### 2. Sign Up for an Account
Click "Start Free Trial" or go to `/auth/signup`
- Institute Name: Enter any name (e.g., "My Academy")
- First Name: Your first name
- Email: Any email
- Phone: Optional
- Password: At least 6 characters
- Confirm Password: Must match
- Check "I agree to terms"
- Click "Create Account"

### 3. You're In!
You'll be redirected to the dashboard. You now have access to:
- ✅ Students management
- ✅ Batch management
- ✅ Payment tracking
- ✅ Fee collection reminders
- ✅ Analytics dashboard

## Demo Credentials

For quick testing without signing up:

```
Email: admin@classdesk.com
Password: anything (or demo123)
```

Navigate to `/auth/signin` and use these credentials.

## Explore the Features

### 1. Dashboard (`/dashboard`)
- View overview stats
- See recent activity
- Access quick actions

### 2. Students (`/dashboard/students`)
- View all students
- Search by name, phone, or email
- Filter by status or batch
- Click student name to view details
- Add new students

### 3. Batches (`/dashboard/batches`)
- View all batches with fee info
- See enrolled student count
- View fee configuration
- Add new batches

### 4. Payments (`/dashboard/payments`)
- Track all payments
- Filter by status or date range
- View payment history
- Record new payments

### 5. Profile (`/dashboard/profile`)
- View and edit your profile
- Update institute information
- Manage account details

### 6. Settings (`/dashboard/settings`)
- Configure institute details
- Set payment methods
- Configure notification preferences

## Common Tasks

### Add a New Student
1. Go to **Students** → Click **Add Student**
2. Fill in student details (name, email, phone, etc.)
3. Select a batch
4. Click **Save**

### View Student Details
1. Go to **Students**
2. Click on any student name
3. View complete profile and fee information

### Record a Payment
1. Go to **Payments**
2. Click **Add Payment**
3. Select student and fee plan
4. Enter payment amount and method
5. Click **Save**

### View Analytics
1. Go to **Dashboard**
2. View revenue chart
3. See pending fees
4. View overdue payments

### Update Settings
1. Go to **Settings**
2. Update institute details
3. Configure payment methods
4. Set notification preferences
5. Click **Save**

## User Menu Actions

### Profile Menu (Top Right)
- **Profile**: Edit your account information
- **Settings**: Manage institute settings
- **Sign Out**: Logout from your account

## Authentication

### Signing In
```
1. Go to /auth/signin
2. Enter email and password
3. Click "Sign In"
```

### Signing Up
```
1. Go to /auth/signup
2. Fill in all required fields
3. Accept terms and conditions
4. Click "Create Account"
```

### Signing Out
```
1. Click your avatar/profile in top right
2. Click "Sign out"
3. You'll be redirected to signin page
```

## Troubleshooting

### Page Won't Load
1. Check if dev server is running (`npm run dev`)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh page (Ctrl+Shift+R)
4. Check for console errors (F12)

### Form Won't Submit
1. Check all required fields are filled
2. Check form validation messages
3. Ensure passwords match
4. Check email format
5. Try disabling browser extensions

### Navigation Links Not Working
1. Check URL is correct
2. Refresh the page
3. Ensure you're logged in (for dashboard routes)
4. Check network tab in browser dev tools

### Batch Filter Not Working
1. Ensure batches exist (should have 3 demo batches)
2. Refresh the page
3. Try clearing browser cache
4. Check console for errors

### Profile Menu Not Showing Real Data
1. Sign in with valid credentials
2. Refresh the page
3. Check localStorage in dev tools
4. Try signing out and back in

## Development Tips

### View Application State
Open browser Developer Tools (F12) and check:
- **Storage** → **Local Storage** → `http://localhost:3000`
- Look for `user` key to see session data

### Check Console Logs
Press F12 and go to **Console** tab to see:
- API calls
- Error messages
- Debug information

### Inspect Network Requests
In Developer Tools → **Network** tab:
- See all API calls
- Check response status and time
- Debug API issues

### Test Responsive Design
In Developer Tools, click **Device Toolbar** (Ctrl+Shift+M) to:
- Test mobile layout
- Test tablet layout
- Test different screen sizes

## Features Available

### Current (Demo)
- ✅ User authentication & profiles
- ✅ Student management
- ✅ Batch management with fees
- ✅ Payment recording
- ✅ Dashboard analytics
- ✅ Reminders setup
- ✅ Institute settings

### Coming Soon (Production)
- 🔜 WhatsApp reminders
- 🔜 Email notifications
- 🔜 Payment gateway integration
- 🔜 SMS reminders
- 🔜 Multi-branch support
- 🔜 Advanced reporting
- 🔜 Mobile app

## Database

### Current Setup
- ✅ Uses mock data (in-memory)
- ✅ Perfect for development and testing
- ✅ Resets on app restart

### For Production
- Install MongoDB
- Update connection string in `.env`
- Run database migrations
- See DEPLOYMENT_GUIDE.md

## Environment Variables

For local development, defaults are used. For production:

Create `.env.local` file:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

See `.env.example` for all available variables.

## Building for Production

### Build the App
```bash
npm run build
# or
pnpm build
```

### Start Production Server
```bash
npm run start
# or
pnpm start
```

Server will run on `http://localhost:3000`

## Performance Tips

1. **Use Chrome DevTools**
   - Network tab to check load times
   - Performance tab to check rendering
   - Console for errors

2. **Monitor Bundle Size**
   ```bash
   npm run analyze
   ```

3. **Check TypeScript**
   ```bash
   npm run type-check
   ```

4. **Run Linter**
   ```bash
   npm run lint
   ```

## Getting Help

### Documentation
- 📖 **API_DOCUMENTATION.md** - API reference
- 📖 **PRODUCTION_READINESS.md** - Production setup
- 📖 **BUG_FIXES_SUMMARY.md** - All fixes documented
- 📖 **DEPLOYMENT_GUIDE.md** - Deployment steps

### Common Issues
- See **PRODUCTION_READINESS.md** → Known Issues
- Check browser console (F12)
- Check network requests (F12 → Network)
- Check localStorage state (F12 → Storage)

## Next Steps

1. ✅ Explore all features in development
2. ✅ Test authentication flow
3. ✅ Try adding students and batches
4. ✅ Record some payments
5. ✅ Check dashboard analytics
6. ✅ Read through documentation
7. ✅ Set up production environment
8. ✅ Deploy to Vercel

## Scripts Available

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript
npm run format       # Format code with Prettier
```

## File Structure

```
classdesk/
├── app/
│   ├── auth/               # Auth pages
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/          # Dashboard pages
│   │   ├── students/
│   │   ├── batches/
│   │   ├── payments/
│   │   ├── reminders/
│   │   ├── profile/
│   │   └── settings/
│   ├── api/v1/            # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── ui/                # UI components
│   └── auth-wrapper.tsx   # Auth protection
├── lib/
│   ├── api.ts            # API client
│   ├── types.ts          # TypeScript types
│   ├── validators.ts     # Form validators
│   ├── use-auth.ts       # Auth hook
│   └── mock-data.ts      # Demo data
├── public/               # Static assets
└── docs/                 # Documentation
```

## Ready to Launch?

When you're ready to deploy to production:

1. Read **DEPLOYMENT_GUIDE.md**
2. Follow **DEVELOPMENT_CHECKLIST.md**
3. Review **PRODUCTION_READINESS.md**
4. Configure environment variables
5. Deploy to Vercel
6. Monitor application

## Support

For issues or questions:
1. Check the documentation files
2. Review API_DOCUMENTATION.md
3. Look at BUG_FIXES_SUMMARY.md
4. Check browser console (F12)
5. Review network requests (F12 → Network)

---

**Happy coding! 🚀**

For detailed information, see the documentation files in the project root.
