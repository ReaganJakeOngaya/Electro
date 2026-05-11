# Electro - Deployment Guide

## Production Readiness Checklist ✓

### Backend (Render)
- [x] Environment variables configured
- [x] Database setup for PostgreSQL
- [x] CORS configured dynamically
- [x] Secret key from environment
- [x] Debug mode disabled in production
- [x] Gunicorn WSGI server configured
- [x] .gitignore created

### Frontend (Vercel)
- [x] API URL from environment variables
- [x] Environment configuration setup
- [x] Build optimization ready

---

## Part 1: Backend Deployment on Render

### Step 1: Prepare Database on Render

1. Go to [render.com](https://render.com)
2. Create a new PostgreSQL database
3. Note the connection string (you'll need this)

### Step 2: Push Code to GitHub

```bash
cd backend
git add .
git commit -m "Add production configuration for Render"
git push
```

### Step 3: Deploy on Render

1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Fill in the following:
   - **Name**: `electro-backend`
   - **Environment**: Python 3.12
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Plan**: Free or Starter (as needed)

### Step 4: Add Environment Variables on Render

In Render dashboard, go to your service → Environment:

```
FLASK_ENV=production
SECRET_KEY=<generate-a-secure-random-string>
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.your-domain.com
DATABASE_URL=<your-postgresql-connection-string>
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=<your-app-specific-password>
MPESA_SHORTCODE=174379
MPESA_PASSKEY=<your-mpesa-passkey>
MAX_CONTENT_LENGTH=16777216
```

**How to generate SECRET_KEY:**
```python
import secrets
print(secrets.token_hex(32))
```

### Step 5: Deploy
- Click "Deploy" and wait for the build to complete
- Once deployed, note your backend URL: `https://your-app.onrender.com`

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Create .env.local

In the frontend folder, create `.env.local`:

```
VITE_API_URL=https://your-backend.onrender.com
```

### Step 2: Push Code to GitHub

```bash
cd frontend
git add .
git commit -m "Configure frontend for production"
git push
```

### Step 3: Deploy on Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select the `frontend` folder as root directory
5. Add environment variables:
   - **VITE_API_URL**: `https://your-backend.onrender.com`

### Step 4: Deploy
- Vercel will automatically build and deploy
- Your site will be available at the provided URL

---

## Part 3: Post-Deployment Setup

### 1. Create Admin User

Make a POST request to your backend:

```bash
curl -X POST https://your-backend.onrender.com/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@your-domain.com",
    "password": "secure-password-here"
  }'
```

Then update the user to admin status in the database.

### 2. Configure M-Pesa

Update these settings in the database `Setting` table:
- `mpesa_shortcode`: Your Safaricom shortcode
- `mpesa_passkey`: Your M-Pesa passkey
- `enable_mpesa`: Set to true

### 3. Test the Application

1. Visit your Vercel frontend URL
2. Test user registration and login
3. Test product browsing
4. Make a test order

---

## Important Notes

### Database Migrations (Optional but Recommended)

For future schema changes, consider using Flask-Migrate:

```bash
pip install Flask-Migrate
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

Then update `Procfile`:
```
web: gunicorn app:app
release: flask db upgrade
```

### Security Reminders

1. **Never commit `.env` files** to Git
2. **Change all default credentials** (admin password, SECRET_KEY, etc.)
3. **Use strong passwords** for MAIL_USERNAME and MAIL_PASSWORD
4. **Enable HTTPS** (Vercel and Render both provide this by default)
5. **Rotate secrets regularly** and update environment variables

### API CORS Configuration

The backend now accepts requests from:
- `https://your-frontend.vercel.app`
- `https://www.your-domain.com`
- Any other domain listed in `ALLOWED_ORIGINS` env variable

Update this before going live if you have a custom domain.

### File Uploads

- **Local Development**: Files stored in `backend/uploads/`
- **Production**: Use Render's ephemeral file system or configure cloud storage (AWS S3, Cloudinary, etc.)

**Important**: Render's file system is ephemeral. For persistent file storage, you should configure a cloud service.

---

## Troubleshooting

### Backend won't deploy
- Check that `requirements.txt` includes `python-dotenv` and `gunicorn`
- Verify all environment variables are set in Render dashboard
- Check Render logs for specific errors

### Frontend can't reach backend
- Verify `VITE_API_URL` is set correctly in Vercel environment variables
- Check CORS settings in backend (ALLOWED_ORIGINS)
- Test the API endpoint directly in browser

### Database connection errors
- Verify DATABASE_URL format is correct
- Check if database service is running on Render
- Test connection string locally if possible

---

## Environment Variables Reference

### Backend (.env)

| Variable | Purpose | Example |
|----------|---------|---------|
| FLASK_ENV | Debug mode | production |
| SECRET_KEY | JWT signing | (random 64-char string) |
| DATABASE_URL | PostgreSQL | postgresql://... |
| ALLOWED_ORIGINS | CORS whitelist | https://domain.vercel.app |
| MAIL_* | Email config | Gmail SMTP settings |
| MPESA_* | M-Pesa config | Safaricom settings |

### Frontend (.env.local)

| Variable | Purpose | Example |
|----------|---------|---------|
| VITE_API_URL | Backend URL | https://backend.onrender.com |

---

## Next Steps

1. Deploy backend to Render
2. Deploy frontend to Vercel
3. Test all features in production
4. Set up analytics/monitoring
5. Configure custom domain (optional)
6. Set up automated backups for database
7. Monitor logs for errors
