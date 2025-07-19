import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Star, 
  Phone, 
  MapPin, 
  Clock,
  Truck,
  Shield,
  Award,
  Search,
  Menu,
  X
} from 'lucide-react'
import { productsApi, adminApi } from '@/lib/api'
import { useCart } from '@/contexts/CartContext'
import steelBartan from '@/assets/steel-bartan.jpg'
import copperBartan from '@/assets/copper-bartan.jpg'
import brassBartan from '@/assets/brass-bartan.jpg'
import nonstickCookware from '@/assets/nonstick-cookware.jpg'
import './HomePage.css'

const CATEGORIES = [
  { name: 'Steel Bartan', image: steelBartan, description: 'Durable stainless steel utensils' },
  { name: 'Copper Bartan', image: copperBartan, description: 'Traditional copper cookware' },
  { name: 'Brass Bartan', image: brassBartan, description: 'Elegant brass utensils' },
  { name: 'Non-stick Cookware', image: nonstickCookware, description: 'Modern non-stick pans' },
  { name: 'Pressure Cookers', image: steelBartan, description: 'High-quality pressure cookers' },
  { name: 'Thali Sets', image: brassBartan, description: 'Complete dining sets' },
  { name: 'Gift Packs', image: copperBartan, description: 'Perfect for gifting' },
  { name: 'Hotel Bulk Items', image: steelBartan, description: 'Bulk orders for hotels' },
  { name: 'Kitchen Tools', image: nonstickCookware, description: 'Essential kitchen tools' },
  { name: 'Plastic / Melamine Bartan', image: steelBartan, description: 'Lightweight plastic utensils' }
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [banners, setBanners] = useState([])
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { addToCart, getCartItemsCount } = useCart()

  useEffect(() => {
    loadHomeData()
  }, [])

  const loadHomeData = async () => {
    try {
      setLoading(true)
      const [productsData, bannersData, offersData] = await Promise.all([
        productsApi.getAll({ per_page: 8 }),
        adminApi.getBanners(),
        adminApi.getOffers()
      ])
      
      setFeaturedProducts(productsData.products || [])
      setBanners(bannersData?.filter(b => b.is_active) || [])
      setOffers(offersData?.filter(o => o.is_active) || [])
    } catch (error) {
      console.error('Failed to load home data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello! I'm interested in your products from Bartan Wale.")
    window.open(`https://wa.me/917000891873?text=${message}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">BW</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Bartan Wale</h1>
                  <p className="text-xs text-gray-600">Vishwa Bank Colony, Bhilai</p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-orange-600 font-medium">Products</Link>
              <Link to="/track-order" className="text-gray-700 hover:text-orange-600 font-medium">Track Order</Link>
              <Button onClick={openWhatsApp} variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                WhatsApp
              </Button>
              <Link to="/cart">
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {getCartItemsCount() > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {getCartItemsCount()}
                    </Badge>
                  )}
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-700 hover:text-orange-600 font-medium">Home</Link>
                <Link to="/products" className="text-gray-700 hover:text-orange-600 font-medium">Products</Link>
                <Link to="/track-order" className="text-gray-700 hover:text-orange-600 font-medium">Track Order</Link>
                <Button onClick={openWhatsApp} variant="outline" size="sm" className="w-fit">
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Link to="/cart" className="w-fit">
                  <Button variant="outline" size="sm" className="relative">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Cart
                    {getCartItemsCount() > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {getCartItemsCount()}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Quality <span className="text-orange-600">Bartan</span> for Every Kitchen
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover our premium collection of steel, copper, brass, and modern cookware. 
              Trusted by families in Bhilai for over a decade.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                  Shop Now
                </Button>
              </Link>
              <Button onClick={openWhatsApp} variant="outline" size="lg">
                <Phone className="h-5 w-5 mr-2" />
                Call 7000891873
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Free Delivery</h3>
              <p className="text-gray-600">Free delivery in Bhilai on orders above ₹500</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Assured</h3>
              <p className="text-gray-600">100% authentic products with quality guarantee</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trusted Brand</h3>
              <p className="text-gray-600">Serving Bhilai families for over 10 years</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">WhatsApp Support</h3>
              <p className="text-gray-600">Quick support via WhatsApp chat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find the perfect utensils for your kitchen needs</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <CardContent className="p-4 text-center">
                    <h3 className="font-semibold text-sm mb-1">{category.name}</h3>
                    <p className="text-xs text-gray-600">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Our most popular and highly-rated products</p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 8).map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square relative">
                    <img
                      src={product.image_url || steelBartan}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        Only {product.stock_quantity} left
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold text-orange-600">₹{product.price}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.5</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/products/${product.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock_quantity === 0}
                        className="bg-orange-600 hover:bg-orange-700"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link to="/products">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Offers */}
      {offers.length > 0 && (
        <section className="py-16 bg-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Special Offers</h2>
              <p className="text-gray-600">Don't miss out on these amazing deals</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.slice(0, 3).map((offer) => (
                <Card key={offer.id} className="overflow-hidden">
                  <div className="aspect-video">
                    <img
                      src={offer.image_url || steelBartan}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{offer.title}</h3>
                    <p className="text-gray-600 mb-4">{offer.description}</p>
                    {offer.discount_percentage && (
                      <Badge className="bg-red-500 text-white mb-4">
                        {offer.discount_percentage}% OFF
                      </Badge>
                    )}
                    <Link to="/products">
                      <Button className="w-full bg-orange-600 hover:bg-orange-700">
                        Shop Now
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Info */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">Visit Our Store</h3>
              <div className="flex items-start justify-center md:justify-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 text-orange-400" />
                <div>
                  <p>Hanuman Complex</p>
                  <p>Vishwa Bank Colony</p>
                  <p>Bhilai, Chhattisgarh</p>
                </div>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-center md:justify-start">
                  <Phone className="h-5 w-5 mr-2 text-orange-400" />
                  <span>7000891873</span>
                </div>
                <Button onClick={openWhatsApp} variant="outline" size="sm" className="mt-4">
                  <Phone className="h-4 w-4 mr-2" />
                  WhatsApp Us
                </Button>
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-4">Store Hours</h3>
              <div className="flex items-start justify-center md:justify-start">
                <Clock className="h-5 w-5 mr-2 mt-1 text-orange-400" />
                <div>
                  <p>Monday - Saturday</p>
                  <p>9:00 AM - 8:00 PM</p>
                  <p>Sunday: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Bartan Wale. All rights reserved. | Serving Bhilai with quality utensils since 2014
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

