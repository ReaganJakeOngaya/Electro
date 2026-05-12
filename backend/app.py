# app.py
from flask import Flask, jsonify, request, send_from_directory, send_file
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from flask_cors import CORS
from datetime import datetime, timedelta
import secrets
import os
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from models import db, User, Product, Order, OrderItem, Setting, Review, Coupon
from utils import generate_token, verify_token

# Load environment variables
load_dotenv()
from PIL import Image
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from io import BytesIO

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
        'created_at': p.created_at.isoformat() if p.created_at else None,
        'avg_rating': db.session.query(db.func.avg(Review.rating)).filter(Review.product_id == p.id).scalar() or 0,
        'reviews_count': Review.query.filter_by(product_id=p.id).count(),
        'stock': p.stock,
        'low_stock_threshold': p.low_stock_threshold,
    }

app = Flask(__name__)

# CORS Configuration
allowed_origins = os.environ.get('ALLOWED_ORIGINS', 'https://deviceyangu.vercel.app').split(',')
CORS(app, origins=allowed_origins, supports_credentials=True)

bcrypt = Bcrypt(app)

# Database Configuration
if os.environ.get('DATABASE_URL'):
    # PostgreSQL for production
    database_url = os.environ.get('DATABASE_URL')
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    # SQLite for development
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'webp'}
db.init_app(app)

# Email configuration
app.config['MAIL_SERVER'] = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.environ.get('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.environ.get('MAIL_USE_TLS', 'true').lower() == 'true'
app.config['MAIL_USERNAME'] = os.environ.get('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.environ.get('MAIL_PASSWORD')
mail = Mail(app)

# Application settings
app.config['MAX_CONTENT_LENGTH'] = int(os.environ.get('MAX_CONTENT_LENGTH', 16777216))

def send_order_confirmation(order, user_email):
    subject = f"Order Confirmation #{order.order_number}"
    body = f"Thank you for your order!\n\nOrder #{order.order_number}\nTotal: KSh {order.total}\nWe'll notify you when it ships."
    msg = Message(subject, recipients=[user_email], body=body)
    mail.send(msg)

def convert_to_webp(source_path, dest_path):
    img = Image.open(source_path)
    img.save(dest_path, 'webp', quality=85)

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

if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

with app.app_context():
    db.create_all()
    admin = User.query.filter_by(is_admin=True).first()
    if not admin:
        hashed = bcrypt.generate_password_hash('admin123').decode('utf-8')
        admin_user = User(
            first_name='Admin', last_name='User', email='admin@example.com',
            password=hashed, is_admin=True
        )
        db.session.add(admin_user)
        db.session.commit()
        print('Default admin created: admin@example.com / admin123')
    if not Setting.query.first():
        default_settings = {
            'store_name': 'DeviceYangu', 'store_email': 'info@deviceyangu.com',
            'store_phone': '+254 700 000 000', 'store_address': 'Nairobi, Kenya',
            'enable_mpesa': 'true', 'mpesa_shortcode': '174379',
            'mpesa_passkey': 'your_passkey_here', 'enable_cash_on_delivery': 'true',
            'enable_card': 'false', 'theme': 'light'
        }
        for key, val in default_settings.items():
            set_setting(key, val)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

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

# ----------------------------------------------
#  AUTH & USER ROUTES
# ----------------------------------------------
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(
        first_name=data['firstName'], last_name=data['lastName'],
        email=data['email'], password=hashed_password
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
            "message": "Login successful", "token": token,
            "user": {
                "id": user.id, "email": user.email, "first_name": user.first_name,
                "last_name": user.last_name, "is_admin": user.is_admin
            }
        }), 200
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/user', methods=['GET'])
def get_user():
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'id': user.id, 'email': user.email, 'first_name': user.first_name,
            'last_name': user.last_name, 'is_admin': user.is_admin, 'avatar': user.avatar,
            'phone': user.phone, 'address': user.address, 'city': user.city,
            'postal_code': user.postal_code, 'country': user.country
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

# ----------------------------------------------
#  PUBLIC PRODUCT ROUTES
# ----------------------------------------------
@app.route('/products', methods=['GET'])
def get_products():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 12, type=int)
    paginated = Product.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        'products': [product_to_dict(p) for p in paginated.items],
        'total': paginated.total,
        'pages': paginated.pages,
        'current_page': paginated.page,
        'per_page': per_page
    })

@app.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product_to_dict(product))

@app.route('/api/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '')
    if query:
        results = Product.query.filter(
            (Product.name.ilike(f"%{query}%")) |
            (Product.description.ilike(f"%{query}%"))
        ).all()
        products = [{"id": p.id, "name": p.name, "description": p.description,
                     "price": p.price, "category": p.category} for p in results]
        return jsonify(products), 200
    return jsonify([]), 200

@app.route('/uploads/<filename>')
def serve_image(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

# ----------------------------------------------
#  PRODUCT REVIEWS
# ----------------------------------------------
@app.route('/products/<int:product_id>/reviews', methods=['GET'])
def get_product_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).order_by(Review.created_at.desc()).all()
    return jsonify([{
        'id': r.id,
        'user_name': f"{r.user.first_name} {r.user.last_name}",
        'rating': r.rating,
        'title': r.title,
        'comment': r.comment,
        'created_at': r.created_at.isoformat()
    } for r in reviews])

@app.route('/products/<int:product_id>/reviews', methods=['POST'])
def add_review(product_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing or invalid token'}), 401
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 401
    data = request.get_json()
    if not data.get('rating') or not data.get('comment'):
        return jsonify({'error': 'Rating and comment are required'}), 400
    review = Review(
        product_id=product_id, user_id=user_id, rating=data['rating'],
        title=data.get('title'), comment=data['comment']
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review added successfully'}), 201

# ----------------------------------------------
#  COUPON VALIDATION
# ----------------------------------------------
@app.route('/validate-coupon', methods=['POST'])
def validate_coupon():
    data = request.get_json()
    code = data.get('code', '').upper()
    subtotal = data.get('subtotal', 0)
    coupon = Coupon.query.filter_by(code=code, is_active=True).first()
    if not coupon:
        return jsonify({'valid': False, 'message': 'Invalid coupon code'}), 404
    now = datetime.now()
    if now < coupon.valid_from or now > coupon.valid_to:
        return jsonify({'valid': False, 'message': 'Coupon expired'}), 400
    if coupon.usage_limit and coupon.used_count >= coupon.usage_limit:
        return jsonify({'valid': False, 'message': 'Coupon usage limit reached'}), 400
    if subtotal < coupon.min_order_amount:
        return jsonify({'valid': False, 'message': f'Minimum order of KSh {coupon.min_order_amount} required'}), 400
    if coupon.discount_type == 'percentage':
        discount = subtotal * (coupon.discount_value / 100)
        if coupon.max_discount:
            discount = min(discount, coupon.max_discount)
    else:
        discount = coupon.discount_value
    discount = min(discount, subtotal)
    return jsonify({
        'valid': True,
        'discount': discount,
        'final_total': subtotal - discount,
        'code': coupon.code
    }), 200

# ----------------------------------------------
#  ORDER CREATION (stock deduction)
# ----------------------------------------------
def generate_order_number():
    return str(secrets.randbelow(10**12 - 10**11) + 10**11)

@app.route('/orders', methods=['POST'])
def create_order():
    data = request.get_json()
    required = ['customer', 'shipping', 'paymentMethod', 'items', 'total']
    if not all(k in data for k in required):
        return jsonify({'message': 'Missing required order data'}), 400

    # Stock validation
    for item in data['items']:
        product = Product.query.get(item['product_id'])
        if not product or product.stock < item['quantity']:
            return jsonify({'message': f'Insufficient stock for {item["name"]}. Only {product.stock if product else 0} left.'}), 400

    order_number = generate_order_number()
    while Order.query.filter_by(order_number=order_number).first():
        order_number = generate_order_number()

    customer = data['customer']
    shipping = data['shipping']

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
    db.session.flush()

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

        # Reduce stock
        product = Product.query.get(item['product_id'])
        product.stock -= item['quantity']

    db.session.commit()

    try:
        send_order_confirmation(order, customer['email'])
    except Exception as e:
        print(f"Email failed: {e}")

    return jsonify({
        'message': 'Order placed successfully',
        'order_id': order.id,
        'order_number': order_number
    }), 201

# ----------------------------------------------
#  INVOICE GENERATION
# ----------------------------------------------
@app.route('/orders/<int:order_id>/invoice', methods=['GET'])
def generate_invoice(order_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'message': 'Missing token'}), 401
    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 401

    order = Order.query.get_or_404(order_id)
    user = User.query.get(user_id)
    if order.user_id != user_id and not user.is_admin:
        return jsonify({'message': 'Unauthorized'}), 403

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter)
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle('TitleStyle', parent=styles['Title'], fontSize=16, spaceAfter=20)
    normal_style = styles['Normal']

    story = []
    store_name = get_setting('store_name', 'DeviceYangu')
    store_email = get_setting('store_email', 'info@deviceyangu.com')
    store_phone = get_setting('store_phone', '+254 700 000 000')
    store_address = get_setting('store_address', 'Nairobi, Kenya')

    story.append(Paragraph(f"<b>{store_name}</b>", title_style))
    story.append(Paragraph(f"{store_address}", normal_style))
    story.append(Paragraph(f"Email: {store_email} | Phone: {store_phone}", normal_style))
    story.append(Spacer(1, 12))

    story.append(Paragraph(f"INVOICE #{order.order_number}", title_style))
    story.append(Paragraph(f"Date: {order.created_at.strftime('%Y-%m-%d %H:%M')}", normal_style))
    story.append(Paragraph(f"Customer: {order.customer_first_name} {order.customer_last_name}", normal_style))
    story.append(Paragraph(f"Email: {order.customer_email}", normal_style))
    story.append(Spacer(1, 12))

    items = OrderItem.query.filter_by(order_id=order.id).all()
    table_data = [['Product', 'Qty', 'Unit Price', 'Total']]
    for item in items:
        total = item.product_price * item.quantity
        table_data.append([item.product_name, str(item.quantity), f"KSh {item.product_price:,.2f}", f"KSh {total:,.2f}"])

    table = Table(table_data, colWidths=[250, 50, 80, 80])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.grey),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('BACKGROUND', (0,1), (-1,-1), colors.beige),
        ('GRID', (0,0), (-1,-1), 1, colors.black),
    ]))
    story.append(table)
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"<b>Total: KSh {order.total:,.2f}</b>", title_style))
    story.append(Paragraph("Thank you for shopping with us!", normal_style))

    doc.build(story)
    buffer.seek(0)
    return send_file(buffer, as_attachment=True, download_name=f"invoice_{order.order_number}.pdf", mimetype='application/pdf')

# ----------------------------------------------
#  USER ORDER HISTORY
# ----------------------------------------------
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
            'id': o.id, 'order_number': o.order_number, 'total': o.total,
            'status': o.status, 'paymentMethod': o.payment_method,
            'createdAt': o.created_at.isoformat(),
            'customer': {
                'firstName': o.customer_first_name, 'lastName': o.customer_last_name,
                'email': o.customer_email, 'phone': o.customer_phone
            },
            'shipping': {
                'address': o.shipping_address, 'city': o.shipping_city,
                'postalCode': o.shipping_postal_code, 'country': o.shipping_country
            },
            'items': [{
                'product_id': i.product_id, 'name': i.product_name,
                'price': i.product_price, 'quantity': i.quantity, 'image': i.image
            } for i in items]
        })
    return jsonify(result), 200

# ----------------------------------------------
#  DEALS & NEW ARRIVALS
# ----------------------------------------------
@app.route('/products/deals', methods=['GET'])
def get_deals():
    products = Product.query.filter(Product.discount > 0).order_by(Product.discount.desc()).all()
    return jsonify([product_to_dict(p) for p in products])

@app.route('/products/new-arrivals', methods=['GET'])
def get_new_arrivals():
    products = Product.query.order_by(Product.created_at.desc()).limit(30).all()
    return jsonify([product_to_dict(p) for p in products])

# ----------------------------------------------
#  ADMIN ROUTES
# ----------------------------------------------
@app.route('/admin/stats', methods=['GET'])
@admin_required
def admin_stats():
    total_products = Product.query.count()
    total_orders = Order.query.count()
    total_users = User.query.count()
    revenue = db.session.query(db.func.sum(Order.total)).filter(Order.status == 'delivered').scalar() or 0
    return jsonify({
        'totalProducts': total_products, 'totalOrders': total_orders,
        'totalUsers': total_users, 'revenue': revenue
    })

@app.route('/admin/products', methods=['GET'])
@admin_required
def admin_get_products():
    products = Product.query.all()
    return jsonify([{
        'id': p.id, 'name': p.name, 'description': p.description,
        'color': p.color, 'brand': p.brand,
        'manufacture_date': p.manufacture_date.strftime('%Y-%m-%d') if p.manufacture_date else None,
        'images': p.images.split(',') if p.images else [], 'price': p.price,
        'discount': p.discount, 'category': p.category,
        'stock': p.stock, 'low_stock_threshold': p.low_stock_threshold
    } for p in products])

@app.route('/admin/products', methods=['POST'])
@admin_required
def admin_add_product():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Invalid JSON payload'}), 400
    required = ['name', 'description', 'price', 'category']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'Missing field: {field}'}), 400
    manufacture_date = None
    if data.get('manufacture_date'):
        try:
            manufacture_date = datetime.strptime(data['manufacture_date'], '%Y-%m-%d').date()
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
    product = Product(
        name=data['name'], description=data['description'],
        color=data.get('color'), brand=data.get('brand'),
        manufacture_date=manufacture_date,
        images=','.join(data.get('images', [])),
        price=float(data['price']),
        discount=float(data.get('discount', 0)),
        category=data['category'],
        stock=int(data.get('stock', 0)),
        low_stock_threshold=int(data.get('low_stock_threshold', 5))
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
    product.stock = data.get('stock', product.stock)
    product.low_stock_threshold = data.get('low_stock_threshold', product.low_stock_threshold)
    db.session.commit()
    return jsonify({'message': 'Product updated'})

@app.route('/admin/products/<int:product_id>', methods=['DELETE'])
@admin_required
def admin_delete_product(product_id):
    product = Product.query.get_or_404(product_id)
    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted'})

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
            timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
            filename = f"{name}_{timestamp}{ext}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            filenames.append(filename)
            try:
                webp_filename = f"{name}_{timestamp}.webp"
                webp_path = os.path.join(app.config['UPLOAD_FOLDER'], webp_filename)
                convert_to_webp(filepath, webp_path)
                filenames.append(webp_filename)
            except Exception as e:
                print(f"WebP conversion failed for {filename}: {e}")
    return jsonify({'filenames': filenames}), 200

@app.route('/admin/orders', methods=['GET'])
@admin_required
def admin_get_orders():
    orders = Order.query.order_by(Order.created_at.desc()).all()
    result = []
    for o in orders:
        items = OrderItem.query.filter_by(order_id=o.id).all()
        result.append({
            'id': o.id, 'order_number': o.order_number,
            'customer': {'firstName': o.customer_first_name, 'lastName': o.customer_last_name,
                         'email': o.customer_email, 'phone': o.customer_phone},
            'shipping': {'address': o.shipping_address, 'city': o.shipping_city,
                         'postalCode': o.shipping_postal_code, 'country': o.shipping_country},
            'paymentMethod': o.payment_method, 'total': o.total, 'status': o.status,
            'createdAt': o.created_at.isoformat(),
            'items': [{
                'id': i.id, 'product_id': i.product_id, 'name': i.product_name,
                'price': i.product_price, 'quantity': i.quantity, 'image': i.image
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

@app.route('/admin/users', methods=['GET'])
@admin_required
def admin_get_users():
    users = User.query.all()
    return jsonify([{
        'id': u.id, 'first_name': u.first_name, 'last_name': u.last_name,
        'email': u.email, 'is_admin': u.is_admin, 'created_at': u.created_at.isoformat()
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

@app.route('/admin/settings', methods=['GET'])
@admin_required
def admin_get_settings():
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

@app.route('/admin/coupons', methods=['GET'])
@admin_required
def admin_get_coupons():
    coupons = Coupon.query.all()
    return jsonify([{
        'id': c.id, 'code': c.code, 'discount_type': c.discount_type,
        'discount_value': c.discount_value, 'min_order_amount': c.min_order_amount,
        'max_discount': c.max_discount, 'usage_limit': c.usage_limit,
        'used_count': c.used_count, 'valid_from': c.valid_from.isoformat(),
        'valid_to': c.valid_to.isoformat(), 'is_active': c.is_active
    } for c in coupons])

@app.route('/admin/coupons', methods=['POST'])
@admin_required
def admin_create_coupon():
    data = request.get_json()
    required = ['code', 'discount_type', 'discount_value', 'valid_from', 'valid_to']
    for field in required:
        if not data.get(field):
            return jsonify({'error': f'Missing field: {field}'}), 400
    coupon = Coupon(
        code=data['code'].upper(),
        discount_type=data['discount_type'],
        discount_value=float(data['discount_value']),
        min_order_amount=float(data.get('min_order_amount', 0)),
        max_discount=float(data['max_discount']) if data.get('max_discount') else None,
        usage_limit=int(data['usage_limit']) if data.get('usage_limit') else None,
        valid_from=datetime.fromisoformat(data['valid_from']),
        valid_to=datetime.fromisoformat(data['valid_to']),
        is_active=data.get('is_active', True)
    )
    db.session.add(coupon)
    db.session.commit()
    return jsonify({'message': 'Coupon created', 'id': coupon.id}), 201

@app.route('/admin/coupons/<int:coupon_id>', methods=['PUT'])
@admin_required
def admin_update_coupon(coupon_id):
    coupon = Coupon.query.get_or_404(coupon_id)
    data = request.get_json()
    if 'code' in data:
        coupon.code = data['code'].upper()
    if 'discount_type' in data:
        coupon.discount_type = data['discount_type']
    if 'discount_value' in data:
        coupon.discount_value = float(data['discount_value'])
    if 'min_order_amount' in data:
        coupon.min_order_amount = float(data['min_order_amount'])
    if 'max_discount' in data:
        coupon.max_discount = float(data['max_discount']) if data['max_discount'] else None
    if 'usage_limit' in data:
        coupon.usage_limit = int(data['usage_limit']) if data['usage_limit'] else None
    if 'valid_from' in data:
        coupon.valid_from = datetime.fromisoformat(data['valid_from'])
    if 'valid_to' in data:
        coupon.valid_to = datetime.fromisoformat(data['valid_to'])
    if 'is_active' in data:
        coupon.is_active = data['is_active']
    db.session.commit()
    return jsonify({'message': 'Coupon updated'})

@app.route('/admin/coupons/<int:coupon_id>', methods=['DELETE'])
@admin_required
def admin_delete_coupon(coupon_id):
    coupon = Coupon.query.get_or_404(coupon_id)
    db.session.delete(coupon)
    db.session.commit()
    return jsonify({'message': 'Coupon deleted'})

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Endpoint not found'}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug, port=port, host='0.0.0.0')