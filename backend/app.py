from flask import Flask, jsonify, request, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import datetime, timedelta
from models import db, User, Product
from utils import generate_token, verify_token
import os
from werkzeug.utils import secure_filename


app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(os.getcwd(), 'uploads')
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg' ,'webp'}
db.init_app(app)

# Ensure upload directory exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])

with app.app_context():
        # db.drop_all()
        db.create_all() 

# Register Route
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

# Login Route
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and bcrypt.check_password_hash(user.password, data['password']):
        token = generate_token(user.id)
        return jsonify({"message": "Login successful", "token": token}), 200
    return jsonify({"message": "Invalid credentials"}), 401

#getting the user information
@app.route('/user', methods=['GET'])
def get_user():
    user_id = request.args.get('user_id')
    user = User.query.get(user_id)
    if user:
        return jsonify({
            'id': user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }), 200
    return jsonify({"message": "User not found"}), 404

# Delete account (soft delete with recovery option)
@app.route('/delete_account', methods=['POST'])
def delete_account():
    data = request.get_json()
    user = User.query.get(data['user_id'])
    user.is_active = False
    user.deletion_requested_at = datetime.utcnow()
    db.session.commit()
    return jsonify({"message": "Account deletion requested. Recover within 7 days."}), 200

# Recover account
@app.route('/recover_account', methods=['POST'])
def recover_account():
    data = request.get_json()
    user = User.query.get(data['user_id'])
    if user and not user.is_active:
        # Check if the deletion request is within the recovery window
        if datetime.utcnow() - user.deletion_requested_at < timedelta(days=7):
            user.is_active = True
            user.deletion_requested_at = None
            db.session.commit()
            return jsonify({"message": "Account successfully recovered"}), 200
        else:
            return jsonify({"message": "Account recovery period expired"}), 403
    return jsonify({"message": "Account not found or already active"}), 404

# Add product
@app.route('/products', methods=['POST'])
def add_product():
    try:
        data = request.form
        images = request.files.getlist('images')
        
        # Validate required fields
        required_fields = ['name', 'description', 'price', 'category']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400

        # Save uploaded images
        image_paths = []
        for image in images:
            if image.filename == '':
                continue  # Skip empty file uploads
            filename = secure_filename(image.filename)  # Sanitize the filename
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image.save(image_path)
            image_paths.append(filename)  # Save only the sanitized filename

        # Parse and validate manufacture_date
        manufacture_date = None
        if 'manufactureDate' in data and data['manufactureDate']:
            try:
                manufacture_date = datetime.strptime(data['manufactureDate'], '%Y-%m-%d').date()
            except ValueError:
                return jsonify({'error': 'Invalid date format for manufactureDate. Use YYYY-MM-DD.'}), 400

        # Create and save the product
        product = Product(
            name=data['name'],
            description=data['description'],
            color=data.get('color'),
            manufacture_date=manufacture_date,
            images=','.join(image_paths),  # Store sanitized filenames as a comma-separated string
            price=float(data['price']),
            category=data['category']
        )
        db.session.add(product)
        db.session.commit()

        return jsonify({'message': 'Product added successfully'}), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


# get product
@app.route('/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    product_list = [
        {
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'color': product.color,
            'manufacture_date': product.manufacture_date.strftime('%Y-%m-%d'),
            'images': product.images.split(','),  # Split comma-separated filenames into a list
            'price': product.price,
            'category': product.category
        }
        for product in products
    ]
    return jsonify(product_list)

@app.route('/uploads/<filename>')
def serve_image(filename):
    try:
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except FileNotFoundError:
        return jsonify({'error': 'File not found'}), 404

@app.route('/api/search', methods=['GET'])
def search_products():
    query = request.args.get('q', '')  # Get search query
    if query:
        # Search for products with similar name or description
        results = Product.query.filter(
            (Product.name.ilike(f"%{query}%")) | 
            (Product.description.ilike(f"%{query}%"))
        ).all()
        
        # Serialize results
        products = [
            {"id": product.id, "name": product.name, "description": product.description, 
             "price": product.price, "category": product.category}
            for product in results
        ]
        return jsonify(products), 200
    return jsonify([]), 200

# Run the application
if __name__ == '__main__':
    app.run(debug=True, port=5000)