# app.py
from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime, timedelta
import secrets
import os
from werkzeug.utils import secure_filename
from models import db, User, Product, Order, OrderItem, Setting
from utils import generate_token, verify_token

def product_to_dict(p):
    return {
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'brand': p.brand,
        'color': p.color,
        'manufacture_date': p.manufacture_date.strftime('%Y-%m-%d') if p.manufacture_date else None,
        'images': p.images.split(',') if p.images else [],
        'price': p.price,
        'discount': p.discount,
        'category': p.category,
        'created_at': p.created_at.isoformat() if p.created_at else None
    }

app = Flask(__name__)
CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'webp'}
db.init_app(app)

# Admin: Store settings helper functions
def get_setting(key, default=None):
    setting = Setting.query.filter_by(key=key).first()
    return setting.value if setting else default

def set_setting(key, value):
    setting = Setting.query.filter_by(key=key).first()
    if setting:
        setting.value = value
    else:
        setting = Setting(key=key, value=value)
        db.session.add(setting)
    db.session.commit()

# Ensure upload directory exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])
    
with app.app_context():
    db.create_all()
    # Create default admin if no admin exists
    admin = User.query.filter_by(is_admin=True).first()
    if not admin:
        hashed = bcrypt.generate_password_hash('admin123').decode('utf-8')
        admin_user = User(
            first_name='Admin',
            last_name='User',
            email='admin@example.com',
            password=hashed,
            is_admin=True
        )
        db.session.add(admin_user)
        # db.session.execute('ALTER TABLE product ADD COLUMN brand VARCHAR(100)')
        db.session.commit()
        print('Default admin created: admin@example.com / admin123')
        
    # Seed default settings if empty
    if not Setting.query.first():
        default_settings = {
            'store_name': 'DeviceYangu',
            'store_email': 'info@deviceyangu.com',
            'store_phone': '+254 700 000 000',
            'store_address': 'Nairobi, Kenya',
            'enable_mpesa': 'true',
            'mpesa_shortcode': '174379',
            'mpesa_passkey': 'your_passkey_here',
            'enable_cash_on_delivery': 'true',
            'enable_card': 'false',
            'theme': 'light'
        }
        for key, val in default_settings.items():
            set_setting(key, val)

# Helper: allowed file check
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

# Helper: admin required decorator
def admin_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'message': 'Missing or invalid token'}), 401
        token = auth_header.split(' ')[1]
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'message': 'Invalid or expired token'}), 401
        user = User.query.get(user_id)
        if not user or not user.is_admin:
            return jsonify({'message': 'Admin access required'}), 403
        return f(*args, **kwargs)
    return decorated

# ──────────────────────────────────────────────────────────────
# Existing routes (register, login, get_user, delete_account, recover_account)
# ──────────────────────────────────────────────────────────────

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email'],
        password=hashed_password
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        token = generate_token(user.id)
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_admin": user.is_admin
            }
        }), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/user', methods=['GET'])
def get_user():
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'id': user.id,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_admin': user.is_admin,
            'avatar': user.avatar,
            'phone': user.phone,
            'address': user.address,
            'city': user.city,
            'postal_code': user.postal_code,
            'country': user.country
        }), 200
    return jsonify({"message": "User not found"}), 404

@app.route('/user/profile', methods=['PUT'])
def update_profile():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid token'}), 401
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    data = request.get_json()
    if 'first_name' in data:
        user.first_name = data['first_name']
    if 'last_name' in data:
        user.last_name = data['last_name']
    if 'phone' in data:
        user.phone = data['phone']
    if 'address' in data:
        user.address = data['address']
    if 'city' in data:
        user.city = data['city']
    if 'postal_code' in data:
        user.postal_code = data['postal_code']
    if 'country' in data:
        user.country = data['country']
    
    db.session.commit()
    return jsonify({'message': 'Profile updated successfully'}), 200

@app.route('/user/avatar', methods=['POST'])
def upload_avatar():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid token'}), 401
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 401
    
    if 'avatar' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['avatar']
    if file.filename == '' or not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type'}), 400
    
    filename = secure_filename(file.filename)
    name, ext = os.path.splitext(filename)
    filename = f"avatar_{user_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
    file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    
    user = User.query.get(user_id)
    # Delete old avatar if exists (optional)
    if user.avatar:
        old_path = os.path.join(app.config['UPLOAD_FOLDER'], user.avatar)
        if os.path.exists(old_path):
            os.remove(old_path)
    user.avatar = filename
    db.session.commit()
    
    return jsonify({'avatar': filename}), 200

@app.route('/delete_account', methods=['POST'])
def delete_account():
    data = request.get_json()
    user = User.query.get(data['user_id'])
    if not user:
        return jsonify({"message": "User not found"}), 404
    user.is_active = False
    user.deletion_requested_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Account deletion requested. Recover within 7 days."}), 200

@app.route('/recover_account', methods=['POST'])
def recover_account():
    data = request.get_json()
    user = User.query.get(data['user_id'])
    if user and not user.is_active:
        if datetime.utcnow() - user.deletion_requested_at < timedelta(days=7):
            user.is_active = True
            user.deletion_requested_at = None
            db.session.commit()
            return jsonify({"message": "Account successfully recovered"}), 200
        else:
            return jsonify({"message": "Account recovery period expired"}), 403
    return jsonify({"message": "Account not found or already active"}), 404

# ──────────────────────────────────────────────────────────────
# Product routes (public)
# ──────────────────────────────────────────────────────────────

@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([product_to_dict(p) for p in products])

@app.route('/api/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '')
    if query:
        results = Product.query.filter(
            (Product.name.ilike(f"%{query}%")) |
            (Product.description.ilike(f"%{query}%"))
        ).all()
        products = [
            {"id": p.id, "name": p.name, "description": p.description,
             "price": p.price, "category": p.category}
            for p in results
        ]
        return jsonify(products), 200
    return jsonify([]), 200

@app.route('/uploads/<filename>')
def serve_image(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

# ──────────────────────────────────────────────────────────────
# Helper: generate unique 12-digit numeric order number
# ──────────────────────────────────────────────────────────────

def generate_order_number():
    """Generate a 12-digit unique numeric order number."""
    return str(secrets.randbelow(10**12 - 10**11) + 10**11)

# ──────────────────────────────────────────────────────────────
# Checkout: create order
# ──────────────────────────────────────────────────────────────

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    # Validate required fields
    required = ['customer', 'shipping', 'paymentMethod', 'items', 'total']
    if not all(k in data for k in required):
        return jsonify({'message': 'Missing required order data'}), 400

    # Generate unique 12-digit order number
    order_number = generate_order_number()
    while Order.query.filter_by(order_number=order_number).first():
        order_number = generate_order_number()

    # Extract customer info
    customer = data['customer']
    shipping = data['shipping']

    # Create order record
    order = Order(
        user_id=data.get('user_id'),
        order_number=order_number,
        customer_first_name=customer['firstName'],
        customer_last_name=customer['lastName'],
        customer_email=customer['email'],
        customer_phone=customer['phone'],
        shipping_address=shipping['address'],
        shipping_city=shipping['city'],
        shipping_postal_code=shipping.get('postalCode', ''),
        shipping_country=shipping.get('country', 'Kenya'),
        payment_method=data['paymentMethod'],
        total=data['total'],
        status='pending'
    )
    db.session.add(order)
    db.session.flush()  # get order.id

    # Create order items
    for item in data['items']:
        order_item = OrderItem(
            order_id=order.id,
            product_id=item['product_id'],
            product_name=item['name'],
            product_price=item['price'],
            quantity=item['quantity'],
            image=item.get('image')
        )
        db.session.add(order_item)

    db.session.commit()
    return jsonify({
        'message': 'Order placed successfully',
        'order_id': order.id,
        'order_number': order_number
    }), 201
    
# ──────────────────────────────────────────────────────────────
#  Get order history for a specific user
# ──────────────────────────────────────────────────────────────

@app.route('/user/<int:user_id>/orders', methods=['GET'])
def get_user_orders(user_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid token'}), 401
    token = auth_header.split(' ')[1]
    token_user_id = verify_token(token)
    if not token_user_id or token_user_id != user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    orders = Order.query.filter_by(user_id=user_id).order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        items = OrderItem.query.filter_by(order_id=o.id).all()
        result.append({
            'id': o.id,
            'order_number': o.order_number,
            'total': o.total,
            'status': o.status,
            'paymentMethod': o.payment_method,
            'createdAt': o.created_at.isoformat(),
            'customer': {
                'firstName': o.customer_first_name,
                'lastName': o.customer_last_name,
                'email': o.customer_email,
                'phone': o.customer_phone
            },
            'shipping': {
                'address': o.shipping_address,
                'city': o.shipping_city,
                'postalCode': o.shipping_postal_code,
                'country': o.shipping_country
            },
            'items': [{
                'product_id': i.product_id,
                'name': i.product_name,
                'price': i.product_price,
                'quantity': i.quantity,
                'image': i.image
            } for i in items]
        })
    return jsonify(result), 200

@app.route('/products/deals', methods=['GET'])
def get_deals():
    products = Product.query.filter(Product.discount > 0).order_by(Product.discount.desc()).all()
    return jsonify([product_to_dict(p) for p in products])

@app.route('/products/new-arrivals', methods=['GET'])
def get_new_arrivals():
    products = Product.query.order_by(Product.created_at.desc()).limit(30).all()
    return jsonify([product_to_dict(p) for p in products])

# ──────────────────────────────────────────────────────────────
# ADMIN ROUTES (all require admin token)
# ──────────────────────────────────────────────────────────────

# Admin: Get dashboard stats
@app.route('/admin/stats', methods=['GET'])
@admin_required
def admin_stats():
    total_products = Product.query.count()
    total_orders = Order.query.count()
    total_users = User.query.count()
    revenue = db.session.query(db.func.sum(Order.total)).filter(Order.status == 'delivered').scalar() or 0
    return jsonify({
        'totalProducts': total_products,
        'totalOrders': total_orders,
        'totalUsers': total_users,
        'revenue': revenue
    })

# Admin: Product management
@app.route('/admin/products', methods=['GET'])
@admin_required
def admin_get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id,
        'name': p.name,
        'description': p.description,
        'color': p.color,
        'brand': p.brand,
        'manufacture_date': p.manufacture_date.strftime('%Y-%m-%d') if p.manufacture_date else None,
        'images': p.images.split(',') if p.images else [],
        'price': p.price,
        'discount': p.discount,
        'category': p.category
    } for p in products])

@app.route('/admin/products', methods=['POST'])
@admin_required
def admin_add_product():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON payload'}), 400
    
    # Validate required fields
    required = ['name', 'description', 'price', 'category']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'Missing field: {field}'}), 400
    
    # Parse manufacture_date if provided
    manufacture_date = None
    if data.get('manufacture_date'):
        try:
            manufacture_date = datetime.strptime(data['manufacture_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    
    product = Product(
        name=data['name'],
        description=data['description'],
        color=data.get('color'),
        brand=data.get('brand'),
        manufacture_date=manufacture_date,
        images=','.join(data.get('images', [])),
        price=float(data['price']),
        discount=float(data.get('discount', 0)),
        category=data['category']
    )
    db.session.add(product)
    db.session.commit()
    return jsonify({'message': 'Product created', 'id': product.id}), 201

@app.route('/admin/products/<int:product_id>', methods=['PUT'])
@admin_required
def admin_update_product(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.get_json()
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.brand = data.get('brand', product.brand)
    product.color = data.get('color', product.color)
    product.discount = data.get('discount', product.discount)
    if data.get('manufacture_date'):
        product.manufacture_date = datetime.strptime(data['manufacture_date'], '%Y-%m-%d').date()
    product.price = data.get('price', product.price)
    product.category = data.get('category', product.category)
    if 'images' in data:
        product.images = ','.join(data['images'])
    db.session.commit()
    return jsonify({'message': 'Product updated'})

@app.route('/admin/products/<int:product_id>', methods=['DELETE'])
@admin_required
def admin_delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'})

# Admin: Upload images (returns filenames)
@app.route('/admin/upload', methods=['POST'])
@admin_required
def admin_upload_images():
    if 'images' not in request.files:
        return jsonify({'error': 'No images provided'}), 400
    files = request.files.getlist('images')
    filenames = []
    for file in files:
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            name, ext = os.path.splitext(filename)
            filename = f"{name}_{datetime.now().strftime('%Y%m%d%H%M%S')}{ext}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            filenames.append(filename)
    return jsonify({'filenames': filenames}), 200

# Admin: Orders management
@app.route('/admin/orders', methods=['GET'])
@admin_required
def admin_get_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        items = OrderItem.query.filter_by(order_id=o.id).all()
        result.append({
            'id': o.id,
            'order_number': o.order_number,
            'customer': {
                'firstName': o.customer_first_name,
                'lastName': o.customer_last_name,
                'email': o.customer_email,
                'phone': o.customer_phone
            },
            'shipping': {
                'address': o.shipping_address,
                'city': o.shipping_city,
                'postalCode': o.shipping_postal_code,
                'country': o.shipping_country
            },
            'paymentMethod': o.payment_method,
            'total': o.total,
            'status': o.status,
            'createdAt': o.created_at.isoformat(),
            'items': [{
                'id': i.id,
                'product_id': i.product_id,
                'name': i.product_name,
                'price': i.product_price,
                'quantity': i.quantity,
                'image': i.image
            } for i in items]
        })
    return jsonify(result)

@app.route('/admin/orders/<int:order_id>/status', methods=['PUT'])
@admin_required
def admin_update_order_status(order_id):
    order = Order.query.get_or_404(order_id)
    data = request.get_json()
    new_status = data.get('status')
    if new_status not in ['pending', 'processing', 'shipped', 'delivered', 'cancelled']:
        return jsonify({'message': 'Invalid status'}), 400
    order.status = new_status
    db.session.commit()
    return jsonify({'message': 'Order status updated'})

# Admin: Users management
@app.route('/admin/users', methods=['GET'])
@admin_required
def admin_get_users():
    users = User.query.all()
    return jsonify([{
        'id': u.id,
        'first_name': u.first_name,
        'last_name': u.last_name,
        'email': u.email,
        'is_admin': u.is_admin,
        'created_at': u.created_at.isoformat()
    } for u in users])

@app.route('/admin/users/<int:user_id>/role', methods=['PUT'])
@admin_required
def admin_toggle_role(user_id):
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    user.is_admin = data.get('is_admin', False)
    db.session.commit()
    return jsonify({'message': 'User role updated'})

@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
def admin_delete_user(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted'})

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

# ──────────────────────────────────────────────────────────────
# Admin: Store settings (key-value)
# ──────────────────────────────────────────────────────────────

def get_setting(key, default=None):
    setting = Setting.query.filter_by(key=key).first()
    return setting.value if setting else default

def set_setting(key, value):
    setting = Setting.query.filter_by(key=key).first()
    if setting:
        setting.value = value
    else:
        setting = Setting(key=key, value=value)
        db.session.add(setting)
    db.session.commit()

@app.route('/admin/settings', methods=['GET'])
@admin_required
def admin_get_settings():
    # Return all settings as a dict
    settings = Setting.query.all()
    return jsonify({s.key: s.value for s in settings})

@app.route('/admin/settings', methods=['PUT'])
@admin_required
def admin_update_settings():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
    for key, value in data.items():
        set_setting(key, value)
    return jsonify({'message': 'Settings updated successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)