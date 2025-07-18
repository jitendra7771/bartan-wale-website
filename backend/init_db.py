#!/usr/bin/env python3
"""
Database initialization script for Bartan Wale
"""
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.main import app, db
from src.models.product import Product
from src.models.offer import Offer
from src.models.banner import Banner

def init_database():
    """Initialize database with sample data"""
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Check if products already exist
        if Product.query.count() > 0:
            print("Database already has data. Skipping initialization.")
            return
        
        # Sample products
        products = [
            {
                'name': 'Stainless Steel Pressure Cooker 5L',
                'description': 'High-quality stainless steel pressure cooker with safety features. Perfect for Indian cooking.',
                'price': 2500.00,
                'category': 'Pressure Cookers',
                'material': 'Stainless Steel',
                'stock_quantity': 25,
                'is_active': True
            },
            {
                'name': 'Copper Water Bottle 1L',
                'description': 'Traditional copper water bottle for health benefits. Handcrafted by local artisans.',
                'price': 850.00,
                'category': 'Copper Bartan',
                'material': 'Copper',
                'stock_quantity': 50,
                'is_active': True
            },
            {
                'name': 'Brass Thali Set (6 pieces)',
                'description': 'Complete brass dining set with thali, bowls, and glasses. Perfect for traditional meals.',
                'price': 1200.00,
                'category': 'Thali Sets',
                'material': 'Brass',
                'stock_quantity': 15,
                'is_active': True
            },
            {
                'name': 'Non-stick Frying Pan 24cm',
                'description': 'Premium non-stick coating frying pan. Easy to clean and perfect for everyday cooking.',
                'price': 650.00,
                'category': 'Non-stick Cookware',
                'material': 'Non-stick',
                'stock_quantity': 40,
                'is_active': True
            },
            {
                'name': 'Steel Kadhai 2L',
                'description': 'Heavy-duty stainless steel kadhai for deep frying and cooking. Durable and long-lasting.',
                'price': 950.00,
                'category': 'Steel Bartan',
                'material': 'Stainless Steel',
                'stock_quantity': 30,
                'is_active': True
            },
            {
                'name': 'Kitchen Tool Set (10 pieces)',
                'description': 'Complete kitchen tool set with spatulas, ladles, and serving spoons.',
                'price': 450.00,
                'category': 'Kitchen Tools',
                'material': 'Stainless Steel',
                'stock_quantity': 60,
                'is_active': True
            }
        ]
        
        for product_data in products:
            product = Product(**product_data)
            db.session.add(product)
        
        # Sample offers
        offers = [
            {
                'title': 'Diwali Special - 20% Off',
                'description': 'Get 20% off on all brass and copper items this Diwali season!',
                'discount_percentage': 20.0,
                'min_order_amount': 1000.0,
                'is_active': True
            },
            {
                'title': 'Free Delivery Offer',
                'description': 'Free delivery on orders above ₹500 in Bhilai area.',
                'discount_amount': 50.0,
                'min_order_amount': 500.0,
                'is_active': True
            }
        ]
        
        for offer_data in offers:
            offer = Offer(**offer_data)
            db.session.add(offer)
        
        # Sample banners
        banners = [
            {
                'title': 'Welcome to Bartan Wale',
                'subtitle': 'Quality utensils for every kitchen in Bhilai',
                'order_position': 1,
                'is_active': True
            },
            {
                'title': 'Special Diwali Collection',
                'subtitle': 'Traditional brass and copper items for festive cooking',
                'order_position': 2,
                'is_active': True
            }
        ]
        
        for banner_data in banners:
            banner = Banner(**banner_data)
            db.session.add(banner)
        
        # Commit all changes
        db.session.commit()
        print("Database initialized successfully with sample data!")
        print(f"Added {len(products)} products, {len(offers)} offers, and {len(banners)} banners.")

if __name__ == '__main__':
    init_database()

