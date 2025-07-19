import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Search,
  Phone,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Calendar,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react'
import { ordersApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { useCart } from '@/contexts/CartContext'

const ORDER_STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: Package },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle }
]

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
}

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams()
  const [orderNumber, setOrderNumber] = useState(searchParams.get('order') || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { toast } = useToast()
  const { getCartItemsCount } = useCart()

  useEffect(() => {
    if (searchParams.get('order')) {
      handleSearch()
    }
  }, [])

  const openWhatsApp = () => {
    const message = encodeURIComponent("Hello! I'm interested in your products from Bartan Wale.")
    window.open(`https://wa.me/917000891873?text=${message}`, '_blank')
  }

  const handleSearch = async () => {
    if (!orderNumber.trim()) {
      toast({
        title: "Error",
        description: "Please enter an order number",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      const orderData = await ordersApi.getByOrderNumber(orderNumber.trim())
      setOrder(orderData)
    } catch (error) {
      toast({
        title: "Order not found",
        description: "Please check your order number and try again",
        variant: "destructive"
      })
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusStepIndex = (status) => {
    return ORDER_STATUS_STEPS.findIndex(step => step.key === status)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
              <Link to="/track-order" className="text-orange-600 font-medium">Track Order</Link>
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
                <Link to="/track-order" className="text-orange-600 font-medium">Track Order</Link>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
          <p className="text-gray-600">Enter your order number to track your delivery status</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter your order number (e.g., BW-2024-001)"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch} disabled={loading} className="bg-orange-600 hover:bg-orange-700">
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Order #{order.order_number}</span>
                  <Badge className={STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Date</h4>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(order.created_at)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Total Amount</h4>
                    <p className="text-2xl font-bold text-orange-600">₹{order.total_amount}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Method</h4>
                    <p className="text-gray-600 capitalize">{order.payment_method}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Status Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {ORDER_STATUS_STEPS.map((step, index) => {
                    const Icon = step.icon
                    const isCompleted = getStatusStepIndex(order.status) >= index
                    const isCurrent = getStatusStepIndex(order.status) === index
                    const isLast = index === ORDER_STATUS_STEPS.length - 1

                    return (
                      <div key={step.key} className="relative flex items-center">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          isCompleted 
                            ? 'bg-orange-600 border-orange-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-400'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className={`font-medium ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <p className="text-sm text-orange-600">Current status</p>
                          )}
                        </div>
                        {!isLast && (
                          <div className={`absolute left-5 top-10 w-0.5 h-8 ${
                            isCompleted ? 'bg-orange-600' : 'bg-gray-300'
                          }`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Customer & Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Customer Details</h4>
                    <div className="space-y-2 text-gray-600">
                      <p><strong>Name:</strong> {order.customer_name}</p>
                      <p><strong>Phone:</strong> {order.customer_phone}</p>
                      {order.customer_email && (
                        <p><strong>Email:</strong> {order.customer_email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                      <div>
                        <p>{order.shipping_address}</p>
                        <p>{order.city} - {order.pincode}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-4 border-b last:border-b-0">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.product_name || 'Product'}</h4>
                          <p className="text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-2">Need Help?</h3>
                  <p className="text-gray-600 mb-4">Contact us for any questions about your order</p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={openWhatsApp} className="bg-green-600 hover:bg-green-700">
                      <Phone className="h-4 w-4 mr-2" />
                      WhatsApp Support
                    </Button>
                    <Button variant="outline">
                      <Phone className="h-4 w-4 mr-2" />
                      Call 7000891873
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Order Found */}
        {!order && !loading && orderNumber && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find an order with number "{orderNumber}". 
                  Please check the order number and try again.
                </p>
                <Button onClick={openWhatsApp} variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back to Shopping */}
        <div className="mt-8 text-center">
          <Link to="/products">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

