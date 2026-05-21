# Electro Project - Folder Structure Guide

## Project Overview

```
Electro/
├── backend/                    # Flask REST API server
├── frontend/                   # React + Vite web application
├── uploads/                    # Shared uploads directory
├── DEPLOYMENT_GUIDE.md         # Detailed deployment instructions
├── PRODUCTION_CHECKLIST.md     # Pre-launch checklist
├── QUICK_REFERENCE.md          # Configuration quick reference
└── README.md                   # Project documentation
```

---

## Backend Structure

```
backend/
├── app.py                      # Main Flask application & API routes
├── models.py                   # Database models (SQLAlchemy)
├── utils.py                    # Utility functions (JWT tokens, etc)
├── requirements.txt            # Python dependencies
├── Procfile                    # Render deployment config
├── render.yaml                 # Render service definitions
├── wsgi.py                     # WSGI entry point for Gunicorn
├── runtime.txt                 # Python version specification
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore patterns
│
├── test_db.py                  # Database connection test script
├── check_config.py             # Configuration checker script
│
├── venv/ or Scripts/           # Python virtual environment
│   ├── lib/                    # Python packages
│   └── Scripts/                # Executable scripts (Windows)
│       ├── python.exe
│       ├── pip.exe
│       ├── flask.exe
│       └── gunicorn.exe
│
├── Lib/site-packages/          # Installed packages directory
│   ├── flask/                  # Flask framework
│   ├── sqlalchemy/             # Database ORM
│   ├── bcrypt/                 # Password hashing
│   ├── flask_cors/             # CORS handling
│   ├── flask_mail/             # Email sending
│   └── ...other packages
│
├── instance/                   # Flask instance data
│   └── database.db.backup      # SQLite backup (local only)
│
├── Include/                    # Virtual environment includes
│   └── site/python3.12/greenlet/
│
└── uploads/                    # File uploads directory
    └── (user uploaded files)
```

### Backend Key Files

| File | Purpose |
|------|---------|
| `app.py` | Main Flask app, all API routes, configuration |
| `models.py` | Database models for Users, Products, Orders, etc |
| `utils.py` | Helper functions like token generation |
| `requirements.txt` | All Python package dependencies |
| `Procfile` | How Render starts the app: `gunicorn app:app` |
| `.env.example` | Template showing all required env variables |
| `wsgi.py` | WSGI application entry point |

### Backend API Routes Structure

```
Backend Routes:
├── Auth
│   ├── POST   /register              # User registration
│   ├── POST   /login                 # User login
│   └── GET    /user                  # Get user info
│
├── Products
│   ├── GET    /products              # List products
│   ├── GET    /products/<id>         # Get single product
│   ├── POST   /products              # Add product (admin)
│   ├── PUT    /products/<id>         # Edit product (admin)
│   └── DELETE /products/<id>         # Delete product (admin)
│
├── Orders
│   ├── POST   /orders                # Create order
│   ├── GET    /user/<id>/orders      # Get user orders
│   ├── GET    /orders/<id>/invoice   # Download invoice
│   └── GET    /admin/orders          # All orders (admin)
│
├── Admin
│   ├── GET    /admin/stats           # Dashboard stats
│   ├── GET    /admin/products        # All products (admin)
│   ├── GET    /admin/users           # All users (admin)
│   └── GET    /admin/orders          # All orders (admin)
│
└── Settings
    ├── GET    /settings              # Get store settings
    └── POST   /settings              # Update settings (admin)
```

---

## Frontend Structure

```
frontend/
├── index.html                  # Main HTML entry point
├── package.json                # NPM dependencies & scripts
├── package-lock.json           # Locked dependency versions
├── vite.config.js              # Vite bundler configuration
├── eslint.config.js            # ESLint code quality rules
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore patterns
├── vercel.json                 # Vercel deployment config (SPA routing)
├── README.md                   # Frontend documentation
│
├── public/                     # Static files (served as-is)
│   ├── index.html              # Alternative HTML entry
│   ├── sw.js                   # Service worker (offline support)
│   ├── manifest.json           # PWA manifest
│   └── images/                 # Static images
│       ├── logo.png
│       ├── favicon.ico
│       └── ...other images
│
├── src/                        # Source code (compiled by Vite)
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component
│   ├── App.css                 # Global styles
│   │
│   ├── assets/                 # Images & media (imported in code)
│   │   └── (images, videos, etc)
│   │
│   ├── Components/             # Reusable components
│   │   ├── admin/              # Admin dashboard components
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   ├── AdminSettings.jsx
│   │   │   ├── AdminSidebar.jsx
│   │   │   ├── AdminStats.jsx
│   │   │   ├── AdminUsers.jsx
│   │   │   ├── OrderDetailsModal.jsx
│   │   │   └── ProductFormModal.jsx
│   │   │
│   │   ├── common/             # Shared components
│   │   │   ├── CartDrawer.jsx
│   │   │   ├── OrderDetailsModal.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── ProductModal.jsx
│   │   │   ├── RecentlyViewed.jsx
│   │   │   ├── constants/
│   │   │   │   └── index.js    # API URL & constants
│   │   │   └── utils/
│   │   │       ├── auth.js     # Authentication utilities
│   │   │       └── iconHelpers.js
│   │   │
│   │   ├── layouts/            # Layout components
│   │   │   ├── MobileNav.jsx
│   │   │   └── Sidebar.jsx
│   │   │
│   │   └── views/              # Page view components
│   │       ├── AccountView.jsx
│   │       ├── CheckoutView.jsx
│   │       ├── DealsView.jsx
│   │       ├── HomeView.jsx
│   │       ├── NewArrivalsView.jsx
│   │       ├── OrderHistoryView.jsx
│   │       ├── ProductsView.jsx
│   │       └── WishlistView.jsx
│   │
│   └── Pages/                  # Full page components (routes)
│       ├── AboutUs.jsx
│       ├── AdminDashboard.jsx
│       ├── Auth.jsx            # Login/Register page
│       ├── LandingPage.jsx     # Home page
│       ├── NotFound.jsx        # 404 page
│       ├── Support.jsx
│       └── UserDashboard.jsx
│
├── node_modules/               # NPM packages (not in git)
│   └── (3000+ dependencies)
│
└── dist/                       # Production build output (not in git)
    ├── index.html
    ├── assets/
    │   ├── index-XXXXX.js     # Bundled JavaScript
    │   └── index-XXXXX.css    # Bundled CSS
    └── ...other files
```

### Frontend Key Directories

| Directory | Purpose |
|-----------|---------|
| `public/` | Static files served as-is (images, manifest, service worker) |
| `src/main.jsx` | React app entry point |
| `src/App.jsx` | Root React component |
| `src/Components/` | Reusable components organized by type |
| `src/Pages/` | Full page components (each is a route) |
| `src/Components/common/constants/` | Shared constants (API URL, categories) |
| `src/Components/common/utils/` | Helper functions (auth, icons) |

### Frontend Build Artifacts

```
dist/                          # Production build (created by npm run build)
├── index.html                 # Main HTML file
├── assets/
│   ├── index-ABC123.js        # Bundled & minified JavaScript
│   ├── index-ABC123.css       # Bundled & minified CSS
│   └── ...other assets
└── sw.js                      # Service worker (cached)
```

---

## File Dependencies

### Backend Dependencies Flow

```
app.py (main)
├── requires: models.py (database models)
├── requires: utils.py (JWT functions)
├── requires: requirements.txt (all packages)
└── connects to: database (SQLite local, PostgreSQL production)

models.py
└── requires: Flask-SQLAlchemy

utils.py
└── requires: PyJWT
```

### Frontend Component Hierarchy

```
src/main.jsx
└── App.jsx
    ├── Pages/
    │   ├── LandingPage
    │   ├── Auth (login/register)
    │   ├── UserDashboard
    │   │   └── uses: Components/views/*
    │   ├── AdminDashboard
    │   │   └── uses: Components/admin/*
    │   └── Other pages
    │
    ├── Layouts/
    │   ├── MobileNav
    │   └── Sidebar
    │
    └── Uses: Components/common/*
        └── Constants from: Components/common/constants/index.js
```

---

## Environment Configuration Files

### Backend (.env)

```
FLASK_ENV=production
SECRET_KEY=<64-char-secret>
DATABASE_URL=postgresql://user:pass@host:5432/db
ALLOWED_ORIGINS=https://deviceyangu.vercel.app
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=email@gmail.com
MAIL_PASSWORD=app-password
MPESA_SHORTCODE=174379
MPESA_PASSKEY=passkey
MAX_CONTENT_LENGTH=16777216
```

### Frontend (.env.local)

```
VITE_API_URL=https://electro-nm31.onrender.com
```

---

## Deployment Structure

### On Vercel (Frontend)

```
https://deviceyangu.vercel.app/
├── / (index.html)
├── /login (routed to index.html → React Router)
├── /products (routed to index.html → React Router)
├── /user (routed to index.html → React Router)
└── /admin (routed to index.html → React Router)

Files served:
├── HTML, CSS, JS from dist/
├── Images from public/
└── Service worker from public/sw.js
```

### On Render (Backend)

```
https://electro-nm31.onrender.com/
├── /register (POST)
├── /login (POST)
├── /products (GET/POST)
├── /orders (GET/POST)
├── /admin/* (admin routes)
└── /uploads/* (user files)

Connected to:
└── PostgreSQL database on Render
```

---

## Database Schema (Models)

```
Database: PostgreSQL (production) or SQLite (development)

Tables:
├── user
│   ├── id (PK)
│   ├── email (UNIQUE)
│   ├── password
│   ├── first_name, last_name
│   ├── is_admin
│   ├── avatar, phone, address, city, postal_code
│   └── created_at, theme_preference
│
├── product
│   ├── id (PK)
│   ├── name, description, category
│   ├── price, discount
│   ├── images (comma-separated URLs)
│   ├── stock, low_stock_threshold
│   ├── brand, color, manufacture_date
│   └── created_at, updated_at
│
├── order
│   ├── id (PK)
│   ├── user_id (FK → user)
│   ├── order_number (UNIQUE)
│   ├── customer_*, shipping_* (address info)
│   ├── total, payment_method, status
│   └── created_at, updated_at
│
├── order_item
│   ├── id (PK)
│   ├── order_id (FK → order)
│   ├── product_id (FK → product)
│   ├── product_name, product_price
│   ├── quantity
│   └── image
│
├── review
│   ├── id (PK)
│   ├── product_id (FK → product)
│   ├── user_id (FK → user)
│   ├── rating (1-5)
│   ├── title, comment
│   └── created_at
│
├── coupon
│   ├── id (PK)
│   ├── code (UNIQUE)
│   ├── discount_type, discount_value
│   ├── min_order_amount, max_discount
│   ├── usage_limit, used_count
│   ├── valid_from, valid_to
│   └── is_active
│
└── setting
    ├── id (PK)
    ├── key (UNIQUE)
    ├── value
    └── updated_at
```

---

## Git Ignore Patterns

### Backend (.gitignore)
```
.env                    # Environment variables
__pycache__/           # Python cache
*.db                   # SQLite database
instance/              # Flask instance folder
uploads/               # User uploads
venv/                  # Virtual environment
```

### Frontend (.gitignore)
```
node_modules/          # NPM packages
dist/                  # Build output
.env.local             # Local environment
.DS_Store              # macOS files
```

---

## Development vs Production

### Local Development

```
Backend:
- Database: SQLite (instance/database.db)
- Server: Flask dev server (port 5000)
- Debug: True
- Uploads: backend/uploads/

Frontend:
- Build tool: Vite dev server (port 5173)
- API: http://localhost:5000
- Building: npm run dev
```

### Production (Render + Vercel)

```
Backend:
- Database: PostgreSQL (Render hosted)
- Server: Gunicorn (production WSGI)
- Debug: False
- Uploads: Render ephemeral (should use cloud storage)

Frontend:
- Hosting: Vercel CDN
- API: https://electro-nm31.onrender.com
- Building: npm run build (generates dist/)
```

---

## Key File Purposes

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies, build scripts |
| `requirements.txt` | Python dependencies |
| `vite.config.js` | Vite build configuration |
| `eslint.config.js` | Code quality rules |
| `vercel.json` | Vercel SPA routing config |
| `Procfile` | How Render runs the app |
| `.env.example` | Environment variables template |

### Entry Points

| File | Purpose |
|------|---------|
| `backend/app.py` | Flask application start |
| `backend/wsgi.py` | WSGI application (Gunicorn) |
| `frontend/src/main.jsx` | React application start |
| `frontend/index.html` | HTML entry point |

### Documentation

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Step-by-step deployment |
| `PRODUCTION_CHECKLIST.md` | Pre-launch verification |
| `QUICK_REFERENCE.md` | Quick config reference |
| `README.md` | Project overview |

---

## Common Development Tasks

### Backend Development

```
# Install dependencies
cd backend
pip install -r requirements.txt

# Run development server
flask run

# Test database connection
python test_db.py

# Check configuration
python check_config.py
```

### Frontend Development

```
# Install dependencies
cd frontend
npm install

# Run dev server (hot reload)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Deployment

```
# Push changes
git add .
git commit -m "message"
git push

# Vercel: Auto-deploys on push
# Render: Auto-deploys on push (or manual redeploy in dashboard)
```

---

## Storage Locations

### Local Development
- Database: `backend/instance/database.db`
- Uploads: `backend/uploads/`
- Node modules: `frontend/node_modules/`
- Packages: `backend/Lib/site-packages/`

### Production (Render)
- Database: Render PostgreSQL
- Uploads: Render ephemeral `/uploads/` (temporary - should migrate to cloud)
- Code: `/opt/render/project/src/`

### Production (Vercel)
- Frontend: Vercel CDN (automatic)
- Build cache: Vercel cache

---

## Security Considerations

### Files to NEVER commit

```
.env                   # Environment variables with secrets
node_modules/          # Contains all packages (reinstalled from package.json)
venv/ or Scripts/      # Virtual environment (reinstalled from requirements.txt)
dist/                  # Build output (regenerated on deploy)
instance/database.db   # SQLite database (regenerated on Render)
uploads/               # User uploads
__pycache__/           # Python cache
*.pyc                  # Compiled Python
```

### Files to ALWAYS commit

```
requirements.txt       # Python dependencies
package.json           # NPM dependencies
package-lock.json      # Locked versions
.env.example           # Template (no secrets)
.gitignore             # What to ignore
```

---

## Project Statistics

- **Backend**: ~20 Python files (app, models, utils, routes)
- **Frontend**: ~30 React components
- **Database**: 8 tables
- **API Routes**: 50+ endpoints
- **Dependencies**: 
  - Backend: ~20 packages
  - Frontend: ~150 packages (including transitive)
- **Database**: PostgreSQL (production), SQLite (development)

---

Last Updated: May 12, 2026
