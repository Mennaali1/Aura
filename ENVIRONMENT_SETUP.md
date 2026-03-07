# Environment Variables Setup Guide

## Backend Environment Variables

Create a file `backend/.env` with the following content:

```env
# ========================================
# AURA Backend Environment Variables
# ========================================

# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Database Configuration
MONGODB_URI=mongodb://localhost:27017/aura-app

# JWT Authentication Secret
# IMPORTANT: Change this to a strong, random string in production!
JWT_SECRET=mennaalyfahmy

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=AURA Support <noreply@aura-app.com>

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Session Secret (optional)
SESSION_SECRET=your-session-secret-here
```

### How to Set Up Gmail for Email Verification:

1. **Enable 2-Step Verification** in your Google Account
2. **Generate App Password:**

   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Copy the 16-character password
   - Use this as `EMAIL_PASSWORD` in .env

3. **Update .env:**
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   ```

### Generate Strong JWT Secret:

```bash
# Run this in terminal to generate a random secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Frontend Environment Variables

Create a file `frontend/.env.local` with the following content:

```env
# ========================================
# AURA Frontend Environment Variables
# ========================================

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Alternative name (both work):
BACKEND_URL=http://localhost:5000

# Optional: Analytics IDs
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
# NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Optional: Feature Flags
# NEXT_PUBLIC_ENABLE_DARK_MODE=false
# NEXT_PUBLIC_ENABLE_PWA=false
```

### Notes for Frontend:

- Prefix public variables with `NEXT_PUBLIC_` to expose them to the browser
- Never put sensitive secrets in frontend .env (they're exposed to clients)
- Use `.env.local` for local development (automatically ignored by git)
- Use `.env.production` for production builds

---

## Quick Setup Commands

### Backend:

```bash
cd backend
cp .env.example .env  # If you created .env.example
# OR create .env manually with the content above
npm install
node server.js
```

### Frontend:

```bash
cd frontend
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm install
npm run dev
```

---

## Environment Files Priority (Next.js)

1. `.env.local` (highest priority, not in git)
2. `.env.production` or `.env.development`
3. `.env`

---

## Security Checklist

### ✅ Development:

- [ ] `.env` files are in `.gitignore`
- [ ] Using localhost URLs
- [ ] JWT_SECRET is set (any value for dev)
- [ ] MongoDB running locally or Atlas connection working

### ✅ Production:

- [ ] `NODE_ENV=production`
- [ ] Strong JWT_SECRET (32+ characters, random)
- [ ] MongoDB Atlas or secure database
- [ ] HTTPS enabled
- [ ] Email service configured (SendGrid/Mailgun/AWS SES)
- [ ] CORS configured properly
- [ ] Environment variables set in hosting platform

---

## Testing Your Setup

### 1. Test Backend:

```bash
cd backend
node server.js
```

**Expected output:**

```
Connected to MongoDB
Server is running on port 5000
```

### 2. Test Frontend:

```bash
cd frontend
npm run dev
```

**Expected output:**

```
ready - started server on 0.0.0.0:3000
```

### 3. Test API Connection:

```bash
curl http://localhost:5000/api/health
```

**Expected response:**

```json
{ "message": "Server is running!" }
```

---

## Common Issues & Solutions

### Issue: MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solutions:**

1. Start MongoDB: `mongod` or `sudo systemctl start mongod`
2. Use MongoDB Atlas: Update `MONGODB_URI` to Atlas connection string
3. Check if MongoDB is running: `ps aux | grep mongod`

### Issue: JWT Secret Warning

```
Warning: JWT_SECRET not set
```

**Solution:**

```env
JWT_SECRET=your-secret-here
```

### Issue: Email Not Sending

```
Error: Invalid login
```

**Solution:**

- Enable 2FA on Gmail
- Generate App Password
- Use App Password in `EMAIL_PASSWORD`

### Issue: CORS Error on Frontend

```
Access to fetch blocked by CORS policy
```

**Solution:**

1. Check `FRONTEND_URL` in backend .env
2. Verify CORS is enabled in `backend/server.js`
3. Ensure backend is running on port 5000

---

## Production Deployment

### Backend (Heroku/Railway/Render):

```bash
# Set environment variables in platform dashboard:
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<strong-random-string>
FRONTEND_URL=https://your-app.vercel.app
```

### Frontend (Vercel/Netlify):

```bash
# Set environment variables in platform dashboard:
NEXT_PUBLIC_API_URL=https://your-api.herokuapp.com
```

---

## Example `.gitignore` Entries

Make sure these are in your `.gitignore`:

```gitignore
# Environment variables
.env
.env.local
.env.*.local
.env.production
.env.development

# Next.js
.next/
out/

# Dependencies
node_modules/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

---

## Need Help?

### Generate Random Secrets:

```bash
# JWT Secret (32 bytes = 64 hex characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Session Secret (64 bytes)
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Simple password (for testing)
node -e "console.log(Math.random().toString(36).slice(-12))"
```

### Check Environment Variables:

```javascript
// In your code:
console.log("Environment:", process.env.NODE_ENV);
console.log("Port:", process.env.PORT);
// NEVER log secrets like JWT_SECRET in production!
```

---

**Last Updated:** 2025-10-27
**Version:** 1.0.0
