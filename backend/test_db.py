#!/usr/bin/env python
"""
Database connection test script
Run this to verify the backend can communicate with PostgreSQL
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_database_connection():
    """Test database connection and display configuration"""
    
    print("=" * 60)
    print("DATABASE CONNECTION TEST")
    print("=" * 60)
    
    # Check DATABASE_URL
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        print("\n❌ ERROR: DATABASE_URL environment variable not set!")
        print("\nFor production (PostgreSQL):")
        print("  Set DATABASE_URL in your .env or Render environment variables")
        print("  Format: postgresql://user:password@host:port/dbname")
        print("\nFor development (SQLite):")
        print("  Leave DATABASE_URL unset - will use SQLite by default")
        return False
    
    print("\n✓ DATABASE_URL found")
    
    # Sanitize for display (hide password)
    display_url = database_url.replace(database_url.split('@')[0].split('://')[1], '***:***')
    print(f"  URL (sanitized): {display_url}")
    
    # Convert postgres:// to postgresql://
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
        print("  ✓ Converted postgres:// to postgresql://")
    
    try:
        print("\n📦 Importing Flask and SQLAlchemy...")
        from flask import Flask
        from flask_sqlalchemy import SQLAlchemy
        from models import db, User
        
        print("  ✓ Imports successful")
        
        print("\n🔗 Creating Flask app and initializing database...")
        app = Flask(__name__)
        app.config['SQLALCHEMY_DATABASE_URI'] = database_url
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        db.init_app(app)
        
        print("  ✓ Flask app created")
        
        print("\n🧪 Testing database connection...")
        with app.app_context():
            # Try to execute a simple query
            result = db.session.execute(db.text("SELECT 1"))
            print("  ✓ Query executed successfully")
            
            # Check if tables exist
            inspector_query = db.text("""
                SELECT table_name FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            tables = db.session.execute(inspector_query).fetchall()
            
            if tables:
                print(f"\n✓ Database connection successful!")
                print(f"  Found {len(tables)} tables:")
                for table in tables:
                    print(f"    - {table[0]}")
                return True
            else:
                print("\n⚠️  Database connected but no tables found.")
                print("  You may need to run database migrations.")
                print("  Run: flask db upgrade")
                return True
    
    except Exception as e:
        print(f"\n❌ DATABASE CONNECTION FAILED!")
        print(f"\nError: {str(e)}")
        print(f"Type: {type(e).__name__}")
        
        if "could not connect" in str(e).lower():
            print("\n💡 Troubleshooting:")
            print("  - Verify DATABASE_URL is correct")
            print("  - Check if PostgreSQL server is running")
            print("  - Verify network connectivity to the database host")
            print("  - Check database credentials (user/password)")
        elif "no module named" in str(e).lower():
            print("\n💡 Missing dependencies:")
            print("  Run: pip install -r requirements.txt")
        
        return False

if __name__ == '__main__':
    try:
        success = test_database_connection()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ FATAL ERROR: {str(e)}")
        sys.exit(1)
