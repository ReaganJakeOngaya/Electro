# Quick Reference - Deployment Configuration

## Files Created/Modified

### Backend

#### New Files
- **`.gitignore`** - Excludes env files, uploads, database backups
- **`.env.example`** - Template for environment variables
- **`Procfile`** - Render deployment configuration
- **`wsgi.py`** - WSGI application entry point
- **`render.yaml`** - Render service configuration

#### Modified Files
- **`requirements.txt`** 
  - Added: psycopg2-binary, gunicorn, python-dotenv, Pillow, reportlab
  - Reason: PostgreSQL driver, WSGI server, environment loading, image processing

- **`app.py`**
  - Added: `load_dotenv()` for environment variables
  - Changed: CORS to use ALLOWED_ORIGINS env variable
  - Changed: Database URL to support PostgreSQL
  - Changed: Email config to use environment variables
  - Changed: Debug mode to be conditional
  - Changed: Server to bind to 0.0.0.0 for containerization

- **`utils.py`**
  - Changed: SECRET_KEY to use environment variable

### Frontend

#### New Files
- **`.env.example`** - Template for environment variables
- Updated **`.gitignore`** - Added .env files

#### Modified Files
- **`src/Components/common/constants/index.js`**
  - Changed: API URL to use `import.meta.env.VITE_API_URL`

---

## Environment Variables

### Backend (.env)

```bash
# Flask Settings
FLASK_ENV=production
FLASK_DEBUG=false
SECRET_KEY=<64-character-random-string>

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# CORS
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-domain.com

# Email
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=<app-specific-password>

# M-Pesa
MPESA_SHORTCODE=174379
MPESA_PASSKEY=<your-passkey>

# File Upload
MAX_CONTENT_LENGTH=16777216

# Server
PORT=5000
```

### Frontend (.env.local)

```bash
VITE_API_URL=https://your-backend.onrender.com
```

---

## Deployment Commands

### Local Development Setup

```bash
# Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
flask run

# Frontend
cd frontend
npm install
npm run dev
```

### Production Build

```bash
# Frontend
npm run build
# Output: dist/ folder ready for Vercel
```

---

## URL Structure

| Service | Development | Production |
|---------|-------------|-----------|
| Frontend | http://localhost:5173 | https://your-app.vercel.app |
| Backend | http://localhost:5000 | https://your-backend.onrender.com |
| API Base | /api/* | https://your-backend.onrender.com/api/* |
| Database | SQLite (local) | PostgreSQL (Render) |

---

## Security Improvements Made

1. **Secrets Management**
   - ✓ Moved SECRET_KEY to environment
   - ✓ Email credentials use environment
   - ✓ Database credentials in environment

2. **CORS Security**
   - ✓ Dynamic CORS origins from environment
   - ✓ No localhost hardcoded in production

3. **Database**
   - ✓ Supports PostgreSQL (production-grade)
   - ✓ SQLite for development

4. **Server**
   - ✓ Debug mode disabled in production
   - ✓ Gunicorn for multi-worker support
   - ✓ 0.0.0.0 binding for containerization

---

## What Still Needs Work

### Critical Before Launch
1. Input validation on all endpoints
2. Rate limiting on auth endpoints
3. Better error handling to avoid info leakage
4. Implement proper file storage strategy
5. Add error tracking (Sentry)

### Important
1. Email verification flow
2. Password reset functionality
3. Stronger password requirements
4. Admin dashboard security
5. API documentation

### Nice to Have
1. Two-factor authentication
2. Analytics integration
3. Performance monitoring
4. Advanced logging
5. Cache layer (Redis)

---

## Testing Before Deployment

### API Endpoints to Test
```bash
# Auth
POST /register
POST /login
GET /user?user_id=1

# Products
GET /products?page=1&per_page=20
GET /products/<id>

# Orders
POST /orders
GET /user/<user_id>/orders
GET /orders/<order_id>/invoice

# Admin (requires auth)
GET /admin/stats
GET /admin/products
GET /admin/orders
GET /admin/users
```

### Frontend Pages to Test
- [ ] Landing page
- [ ] Authentication (login/register)
- [ ] Product browsing and search
- [ ] Product filtering and sorting
- [ ] Cart functionality
- [ ] Checkout process
- [ ] Order confirmation
- [ ] Order history
- [ ] User profile
- [ ] Admin dashboard (if applicable)

---

## Database Migration (Optional)

If you want to use Flask-Migrate for schema versioning:

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

---

## Important Notes

### File Uploads
- **Local**: Stored in `backend/uploads/`
- **Production**: Render's file system is ephemeral
- **Solution**: Consider using cloud storage (AWS S3, Cloudinary, etc.)

### Database Backups
- Render provides automated backups
- Configure in Render dashboard
- Keep at least 30 days of backups

### Performance Monitoring
- Monitor response times
- Track error rates
- Set up alerts for issues
- Consider Sentry for error tracking

### Cost Estimates (Monthly)
- Render Backend: $12-25 (depending on tier)
- Vercel Frontend: Free-$20 (Pro with analytics)
- PostgreSQL: $12+ (Render starter)
- **Total**: ~$24-57/month for production

---

## Helpful Resources

- [Render Deployment Docs](https://render.com/docs/deploy-flask)
- [Vercel Guide](https://vercel.com/guides/deploying-react-with-vite)
- [Flask Production Deployment](https://flask.palletsprojects.com/deployment/)
- [Gunicorn](https://gunicorn.org/)
- [PostgreSQL on Render](https://render.com/docs/databases)

---

Last Updated: 2026-05-11
