from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.product import Product, Category
import os
from werkzeug.utils import secure_filename

product_bp = Blueprint('product', __name__)

UPLOAD_FOLDER = 'src/static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@product_bp.route('/products', methods=['GET'])
def get_products():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        category = request.args.get('category')
        material = request.args.get('material')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        search = request.args.get('search')
        active_only = request.args.get('active_only', 'true').lower() == 'true'

        query = Product.query
        
        if active_only:
            query = query.filter(Product.is_active == True)
        
        if category:
            query = query.filter(Product.category == category)
        
        if material:
            query = query.filter(Product.material == material)
        
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        
        if search:
            query = query.filter(Product.name.contains(search) | Product.description.contains(search))

        products = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'products': [product.to_dict() for product in products.items],
            'total': products.total,
            'pages': products.pages,
            'current_page': page,
            'per_page': per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify(product.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        
        product = Product(
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            category=data['category'],
            material=data.get('material'),
            image_url=data.get('image_url'),
            stock_quantity=data.get('stock_quantity', 0)
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify(product.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = data.get('price', product.price)
        product.category = data.get('category', product.category)
        product.material = data.get('material', product.material)
        product.image_url = data.get('image_url', product.image_url)
        product.stock_quantity = data.get('stock_quantity', product.stock_quantity)
        product.is_active = data.get('is_active', product.is_active)
        
        db.session.commit()
        
        return jsonify(product.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@product_bp.route('/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@product_bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.filter(Category.is_active == True).all()
        return jsonify([category.to_dict() for category in categories])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@product_bp.route('/categories', methods=['POST'])
def create_category():
    try:
        data = request.get_json()
        
        category = Category(
            name=data['name'],
            description=data.get('description'),
            image_url=data.get('image_url')
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@product_bp.route('/upload', methods=['POST'])
def upload_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file part'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            
            # Create upload directory if it doesn't exist
            upload_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), UPLOAD_FOLDER)
            os.makedirs(upload_path, exist_ok=True)
            
            file_path = os.path.join(upload_path, filename)
            file.save(file_path)
            
            # Return relative URL for the frontend
            file_url = f'/uploads/{filename}'
            return jsonify({'url': file_url})
        
        return jsonify({'error': 'File type not allowed'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

