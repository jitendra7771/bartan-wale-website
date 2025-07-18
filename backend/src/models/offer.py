from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from src.models.user import db

class Offer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    discount_percentage = db.Column(db.Float)
    discount_amount = db.Column(db.Float)
    min_order_amount = db.Column(db.Float)
    image_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Offer {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'discount_percentage': self.discount_percentage,
            'discount_amount': self.discount_amount,
            'min_order_amount': self.min_order_amount,
            'image_url': self.image_url,
            'is_active': self.is_active,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 stars
    comment = db.Column(db.Text)
    is_approved = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship('Product', backref='reviews')
    customer = db.relationship('Customer', backref='reviews')

    def __repr__(self):
        return f'<Review {self.rating} stars for {self.product.name if self.product else "Unknown"}>'

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'customer_id': self.customer_id,
            'customer_name': self.customer.name if self.customer else None,
            'rating': self.rating,
            'comment': self.comment,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Banner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200))
    subtitle = db.Column(db.String(500))
    image_url = db.Column(db.String(500), nullable=False)
    link_url = db.Column(db.String(500))
    is_active = db.Column(db.Boolean, default=True)
    order_position = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f'<Banner {self.title}>'

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'subtitle': self.subtitle,
            'image_url': self.image_url,
            'link_url': self.link_url,
            'is_active': self.is_active,
            'order_position': self.order_position,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

