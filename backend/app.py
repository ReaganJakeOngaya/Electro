from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from datetime import timedelta
from models import db, User
from utils import generate_token, verify_token

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
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

# Run the application
if __name__ == '__main__':
    app.run(debug=True, port=5000)