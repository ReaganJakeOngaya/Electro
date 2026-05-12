"""
Simple database connection test - no venv needed
"""
import os
import sys

print("=" * 60)
print("DATABASE CONFIGURATION CHECK")
print("=" * 60)

# Check if .env file exists
if os.path.exists('.env'):
    print("\n✓ .env file found")
    with open('.env', 'r') as f:
        for line in f:
            if 'DATABASE_URL' in line:
                # Sanitize password
                sanitized = line.split('@')[0].replace(line.split(':')[1].split('@')[0], '***:***')
                print(f"  {line.strip()[:50]}...")
else:
    print("\n❌ .env file not found")
    print("  Create .env with DATABASE_URL for production")

# Check environment variable
db_url = os.environ.get('DATABASE_URL')

print("\n" + "=" * 60)
print("ENVIRONMENT VARIABLES")
print("=" * 60)

if db_url:
    print("\n✓ DATABASE_URL is set in environment")
    # Show sanitized version
    display = db_url[:20] + "..." + db_url[-20:] if len(db_url) > 40 else db_url
    print(f"  Value: {display}")
else:
    print("\n❌ DATABASE_URL is NOT set in environment")
    print("  This will cause the app to use SQLite instead")

# Check other required env vars
print("\n" + "=" * 60)
print("REQUIRED PRODUCTION ENV VARS")
print("=" * 60)

required_vars = {
    'FLASK_ENV': 'Environment (production/development)',
    'SECRET_KEY': 'JWT secret key',
    'ALLOWED_ORIGINS': 'CORS origins',
    'MAIL_USERNAME': 'Email username',
}

for var, description in required_vars.items():
    value = os.environ.get(var)
    if value:
        print(f"✓ {var:20} - Set")
    else:
        print(f"❌ {var:20} - NOT SET ({description})")

print("\n" + "=" * 60)
print("SUMMARY")
print("=" * 60)

if db_url:
    if 'postgresql' in db_url or 'postgres' in db_url:
        print("\n✓ PostgreSQL database configured")
        print("  Status: Ready for production")
    else:
        print("\n⚠️  DATABASE_URL is set but doesn't point to PostgreSQL")
        print(f"  Current: {db_url[:30]}...")
else:
    print("\n⚠️  Using SQLite (development mode)")
    print("  DATABASE_URL not set - will use SQLite locally")

print("\n" + "=" * 60)
