from flask import Blueprint, request, jsonify
from src.models.user import db
from src.models.order import Customer, Order, OrderItem
from src.models.product import Product
import uuid
from datetime import datetime

order_bp = Blueprint('order', __name__)

@order_bp.route('/customers', methods=['GET'])
def get_customers():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search')

        query = Customer.query
        
        if search:
            query = query.filter(Customer.name.contains(search) | Customer.phone.contains(search))

        customers = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'customers': [customer.to_dict() for customer in customers.items],
            'total': customers.total,
            'pages': customers.pages,
            'current_page': page,
            'per_page': per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/customers', methods=['POST'])
def create_customer():
    try:
        data = request.get_json()
        
        customer = Customer(
            name=data['name'],
            phone=data['phone'],
            email=data.get('email'),
            address=data.get('address'),
            city=data.get('city'),
            pincode=data.get('pincode')
        )
        
        db.session.add(customer)
        db.session.commit()
        
        return jsonify(customer.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        status = request.args.get('status')
        customer_id = request.args.get('customer_id', type=int)

        query = Order.query
        
        if status:
            query = query.filter(Order.status == status)
        
        if customer_id:
            query = query.filter(Order.customer_id == customer_id)

        orders = query.order_by(Order.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'orders': [order.to_dict() for order in orders.items],
            'total': orders.total,
            'pages': orders.pages,
            'current_page': page,
            'per_page': per_page
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/orders/<int:order_id>', methods=['GET'])
def get_order(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        return jsonify(order.to_dict())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/orders', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        
        # Create or get customer
        customer_data = data['customer']
        customer = Customer.query.filter_by(phone=customer_data['phone']).first()
        
        if not customer:
            customer = Customer(
                name=customer_data['name'],
                phone=customer_data['phone'],
                email=customer_data.get('email'),
                address=customer_data.get('address'),
                city=customer_data.get('city'),
                pincode=customer_data.get('pincode')
            )
            db.session.add(customer)
            db.session.flush()  # Get customer ID
        
        # Generate order number
        order_number = f"BW{datetime.now().strftime('%Y%m%d')}{str(uuid.uuid4())[:8].upper()}"
        
        # Create order
        order = Order(
            order_number=order_number,
            customer_id=customer.id,
            total_amount=data['total_amount'],
            payment_method=data.get('payment_method'),
            delivery_address=data.get('delivery_address'),
            notes=data.get('notes')
        )
        
        db.session.add(order)
        db.session.flush()  # Get order ID
        
        # Create order items
        for item_data in data['items']:
            product = Product.query.get(item_data['product_id'])
            if not product:
                raise ValueError(f"Product with ID {item_data['product_id']} not found")
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_data['product_id'],
                quantity=item_data['quantity'],
                price=item_data.get('price', product.price)
            )
            db.session.add(order_item)
        
        db.session.commit()
        
        return jsonify(order.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/orders/<int:order_id>', methods=['PUT'])
def update_order(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        data = request.get_json()
        
        order.status = data.get('status', order.status)
        order.payment_status = data.get('payment_status', order.payment_status)
        order.notes = data.get('notes', order.notes)
        
        db.session.commit()
        
        return jsonify(order.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@order_bp.route('/orders/<int:order_id>/track', methods=['GET'])
def track_order(order_id):
    try:
        order = Order.query.get_or_404(order_id)
        
        # Create tracking timeline
        timeline = [
            {'status': 'pending', 'label': 'Order Placed', 'completed': True, 'date': order.created_at.isoformat()},
            {'status': 'confirmed', 'label': 'Order Confirmed', 'completed': order.status in ['confirmed', 'shipped', 'delivered'], 'date': None},
            {'status': 'shipped', 'label': 'Shipped', 'completed': order.status in ['shipped', 'delivered'], 'date': None},
            {'status': 'delivered', 'label': 'Delivered', 'completed': order.status == 'delivered', 'date': None}
        ]
        
        return jsonify({
            'order': order.to_dict(),
            'timeline': timeline
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@order_bp.route('/orders/search', methods=['GET'])
def search_order():
    try:
        order_number = request.args.get('order_number')
        phone = request.args.get('phone')
        
        if not order_number and not phone:
            return jsonify({'error': 'Order number or phone number required'}), 400
        
        query = Order.query
        
        if order_number:
            query = query.filter(Order.order_number == order_number)
        
        if phone:
            query = query.join(Customer).filter(Customer.phone == phone)
        
        orders = query.all()
        
        return jsonify([order.to_dict() for order in orders])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

