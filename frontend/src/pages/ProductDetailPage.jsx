import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Star, 
  ArrowLeft,
  Phone,
  Plus,
  Minus,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Menu,
  X
} from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/hooks/use-toast'
import steelBartan from '@/assets/steel-bartan.jpg'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { addToCart, getCartItemsCount } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const productData = await productsApi.getById(id)
      setProduct(productData)
      
      // Load related products from same category
      if (productData.category) {
        const relatedData = await productsApi.getAll({ 
          category: productData.category, 
          per_page: 4 
        })
        setRelatedProducts(relatedData.products?.filter(p => p.id !== productData.id) || [])
      }
    } catch (error) {
      console.error('Failed to load product:', error)
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to cart`
      })
    }
  }

  const openWhatsApp = () => {
    const message = encodeURIComponent(`Hello! I'm interested in ${product?.name} from Bartan Wale. Price: ₹${product?.price}`)
    window.open(`https://wa.me/917000891873?text=${message}`, '_blank')
  }

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out ${product?.name} at Bartan Wale`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const images = product.image_url ? [product.image_url] : [steelBartan]

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-orange-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-orange-600">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-orange-600">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square mb-4">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg border"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded border-2 overflow-hidden ${
                      selectedImage === index ? 'border-orange-600' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(4.5) 24 reviews</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={shareProduct}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-orange-600">₹{product.price}</span>
                {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                  <Badge className="bg-red-500">Only {product.stock_quantity} left</Badge>
                )}
                {product.stock_quantity === 0 && (
                  <Badge variant="destructive">Out of Stock</Badge>
                )}
              </div>
              
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <span>Category: <strong>{product.category}</strong></span>
                {product.material && (
                  <span>Material: <strong>{product.material}</strong></span>
                )}
              </div>
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                  size="lg"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button onClick={openWhatsApp} variant="outline" size="lg">
                  <Phone className="h-5 w-5 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center text-sm text-gray-600">
                <Truck className="h-5 w-5 mr-2 text-orange-600" />
                <span>Free delivery in Bhilai</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Shield className="h-5 w-5 mr-2 text-orange-600" />
                <span>Quality guaranteed</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <RotateCcw className="h-5 w-5 mr-2 text-orange-600" />
                <span>Easy returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card key={relatedProduct.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square">
                    <img
                      src={relatedProduct.image_url || steelBartan}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-orange-600">₹{relatedProduct.price}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">4.5</span>
                      </div>
                    </div>
                    <Link to={`/products/${relatedProduct.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

