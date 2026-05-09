# models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    is_admin = db.Column(db.Boolean, default=False)
    deletion_requested_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.now)
    theme_preference = db.Column(db.String(10), default='light')
    avatar = db.Column(db.String(200), nullable=True)
    phone = db.Column(db.String(20), nullable=True)
    address = db.Column(db.Text, nullable=True)
    city = db.Column(db.String(100), nullable=True)
    postal_code = db.Column(db.String(20), nullable=True)
    country = db.Column(db.String(100), default='Kenya')

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=False)
    color = db.Column(db.String(50), nullable=True)
    brand = db.Column(db.String(100), nullable=True)
    manufacture_date = db.Column(db.Date, nullable=True)
    images = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    discount = db.Column(db.Float, default=0.0)
    stock = db.Column(db.Integer, default=0)                
    low_stock_threshold = db.Column(db.Integer, default=5)
    category = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    customer_first_name = db.Column(db.String(50), nullable=False)
    customer_last_name = db.Column(db.String(50), nullable=False)
    customer_email = db.Column(db.String(120), nullable=False)
    customer_phone = db.Column(db.String(20), nullable=False)
    shipping_address = db.Column(db.Text, nullable=False)
    shipping_city = db.Column(db.String(100), nullable=False)
    shipping_postal_code = db.Column(db.String(20), nullable=True)
    shipping_country = db.Column(db.String(100), default='Kenya')
    payment_method = db.Column(db.String(50), nullable=False)
    total = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    product_name = db.Column(db.String(120), nullable=False)
    product_price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(200), nullable=True)

class Setting(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False)
    value = db.Column(db.Text, nullable=True)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(100), nullable=True)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)
    product = db.relationship('Product', backref=db.backref('reviews', lazy=True, cascade='all, delete-orphan'))
    user = db.relationship('User', backref='reviews')

class Coupon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    discount_type = db.Column(db.String(20), default='percentage')
    discount_value = db.Column(db.Float, nullable=False)
    min_order_amount = db.Column(db.Float, default=0)
    max_discount = db.Column(db.Float, nullable=True)
    usage_limit = db.Column(db.Integer, nullable=True)
    used_count = db.Column(db.Integer, default=0)
    valid_from = db.Column(db.DateTime, nullable=False)
    valid_to = db.Column(db.DateTime, nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    
    