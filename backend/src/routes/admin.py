from flask import Blueprint, request, jsonify, send_file
from src.models.user import db
from src.models.product import Product, Category
from src.models.order import Customer, Order, OrderItem
from src.models.offer import Offer, Review, Banner
import csv
import io
from datetime import datetime

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard_stats():
    try:
        # Get basic statistics
        total_products = Product.query.count()
        active_products = Product.query.filter(Product.is_active == True).count()
        total_orders = Order.query.count()
        total_customers = Customer.query.count()
        
        # Recent orders
        recent_orders = Order.query.order_by(Order.created_at.desc()).limit(5).all()
        
        # Order status counts
        order_statuses = db.session.query(Order.status, db.func.count(Order.id)).group_by(Order.status).all()
        
        # Monthly sales (last 6 months)
        monthly_sales = db.session.query(
            db.func.strftime('%Y-%m', Order.created_at).label('month'),
            db.func.sum(Order.total_amount).label('total')
        ).filter(Order.payment_status == 'paid').group_by('month').order_by('month').limit(6).all()
        
        return jsonify({
            'stats': {
                'total_products': total_products,
                'active_products': active_products,
                'total_orders': total_orders,
                'total_customers': total_customers
            },
            'recent_orders': [order.to_dict() for order in recent_orders],
            'order_statuses': [{'status': status, 'count': count} for status, count in order_statuses],
            'monthly_sales': [{'month': month, 'total': float(total or 0)} for month, total in monthly_sales]
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/offers', methods=['GET'])
def get_offers():
    try:
        offers = Offer.query.order_by(Offer.created_at.desc()).all()
        return jsonify([offer.to_dict() for offer in offers])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/offers', methods=['POST'])
def create_offer():
    try:
        data = request.get_json()
        
        offer = Offer(
            title=data['title'],
            description=data.get('description'),
            discount_percentage=data.get('discount_percentage'),
            discount_amount=data.get('discount_amount'),
            min_order_amount=data.get('min_order_amount'),
            image_url=data.get('image_url'),
            start_date=datetime.fromisoformat(data['start_date']) if data.get('start_date') else None,
            end_date=datetime.fromisoformat(data['end_date']) if data.get('end_date') else None
        )
        
        db.session.add(offer)
        db.session.commit()
        
        return jsonify(offer.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/offers/<int:offer_id>', methods=['PUT'])
def update_offer(offer_id):
    try:
        offer = Offer.query.get_or_404(offer_id)
        data = request.get_json()
        
        offer.title = data.get('title', offer.title)
        offer.description = data.get('description', offer.description)
        offer.discount_percentage = data.get('discount_percentage', offer.discount_percentage)
        offer.discount_amount = data.get('discount_amount', offer.discount_amount)
        offer.min_order_amount = data.get('min_order_amount', offer.min_order_amount)
        offer.image_url = data.get('image_url', offer.image_url)
        offer.is_active = data.get('is_active', offer.is_active)
        
        if data.get('start_date'):
            offer.start_date = datetime.fromisoformat(data['start_date'])
        if data.get('end_date'):
            offer.end_date = datetime.fromisoformat(data['end_date'])
        
        db.session.commit()
        
        return jsonify(offer.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/offers/<int:offer_id>', methods=['DELETE'])
def delete_offer(offer_id):
    try:
        offer = Offer.query.get_or_404(offer_id)
        db.session.delete(offer)
        db.session.commit()
        
        return jsonify({'message': 'Offer deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/banners', methods=['GET'])
def get_banners():
    try:
        banners = Banner.query.order_by(Banner.order_position).all()
        return jsonify([banner.to_dict() for banner in banners])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/banners', methods=['POST'])
def create_banner():
    try:
        data = request.get_json()
        
        banner = Banner(
            title=data.get('title'),
            subtitle=data.get('subtitle'),
            image_url=data['image_url'],
            link_url=data.get('link_url'),
            order_position=data.get('order_position', 0)
        )
        
        db.session.add(banner)
        db.session.commit()
        
        return jsonify(banner.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/banners/<int:banner_id>', methods=['PUT'])
def update_banner(banner_id):
    try:
        banner = Banner.query.get_or_404(banner_id)
        data = request.get_json()
        
        banner.title = data.get('title', banner.title)
        banner.subtitle = data.get('subtitle', banner.subtitle)
        banner.image_url = data.get('image_url', banner.image_url)
        banner.link_url = data.get('link_url', banner.link_url)
        banner.is_active = data.get('is_active', banner.is_active)
        banner.order_position = data.get('order_position', banner.order_position)
        
        db.session.commit()
        
        return jsonify(banner.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/banners/<int:banner_id>', methods=['DELETE'])
def delete_banner(banner_id):
    try:
        banner = Banner.query.get_or_404(banner_id)
        db.session.delete(banner)
        db.session.commit()
        
        return jsonify({'message': 'Banner deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/reviews', methods=['GET'])
def get_reviews():
    try:
        reviews = Review.query.order_by(Review.created_at.desc()).all()
        return jsonify([review.to_dict() for review in reviews])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/reviews/<int:review_id>/approve', methods=['PUT'])
def approve_review(review_id):
    try:
        review = Review.query.get_or_404(review_id)
        review.is_approved = True
        db.session.commit()
        
        return jsonify(review.to_dict())
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/export/orders', methods=['GET'])
def export_orders():
    try:
        # Get date range from query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = Order.query
        
        if start_date:
            query = query.filter(Order.created_at >= datetime.fromisoformat(start_date))
        if end_date:
            query = query.filter(Order.created_at <= datetime.fromisoformat(end_date))
        
        orders = query.order_by(Order.created_at.desc()).all()
        
        # Create CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Order Number', 'Customer Name', 'Customer Phone', 'Total Amount',
            'Status', 'Payment Method', 'Payment Status', 'Created At'
        ])
        
        # Write data
        for order in orders:
            writer.writerow([
                order.order_number,
                order.customer.name if order.customer else '',
                order.customer.phone if order.customer else '',
                order.total_amount,
                order.status,
                order.payment_method,
                order.payment_status,
                order.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])
        
        # Create file-like object
        output.seek(0)
        file_data = io.BytesIO()
        file_data.write(output.getvalue().encode('utf-8'))
        file_data.seek(0)
        
        return send_file(
            file_data,
            mimetype='text/csv',
            as_attachment=True,
            download_name=f'orders_{datetime.now().strftime("%Y%m%d")}.csv'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

