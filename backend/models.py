from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    deletion_requested_at = db.Column(db.DateTime)
    
    
    
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    color = db.Column(db.String(50), nullable=True)
    manufacture_date = db.Column(db.Date, nullable=True)  # Change to db.Date
    images = db.Column(db.Text, nullable=True)  # Stores comma-separated paths
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(100), nullable=False)
