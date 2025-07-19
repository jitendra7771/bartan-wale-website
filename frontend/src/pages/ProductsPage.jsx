import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  Star, 
  Search,
  Filter,
  Grid,
  List,
  ArrowLeft,
  Phone,
  Menu,
  X
} from 'lucide-react'
import { productsApi } from '@/lib/api'
import { useCart } from '@/contexts/CartContext'
import steelBartan from '@/assets/steel-bartan.jpg'

const CATEGORIES = [
  'Steel Bartan',
  'Copper Bartan', 
  'Brass Bartan',
  'Non-stick Cookware',
  'Pressure Cookers',
  'Thali Sets',
  'Gift Packs',
  'Hotel Bulk Items',
  'Kitchen Tools',
  'Plastic / Melamine Bartan'
]

const MATERIALS = [
  'Stainless Steel',
  'Copper',
  'Brass',
  'Non-stick',
  'Aluminum',
  'Plastic',
  'Melamine',
  'Glass'
]

const SORT_OPTIONS = [
  { value: 'name_asc', label: 'Name (A-Z)' },
  { value: 'name_desc', label: 'Name (Z-A)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' }
]

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [selectedMaterial, setSelectedMaterial] = useState('')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [sortBy, setSortBy] = useState('name_asc')
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { addToCart, getCartItemsCount } = useCart()

  useEffect(() => {
    loadProducts()
  }, [searchTerm, selectedCategory, selectedMaterial, priceRange, sortBy])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const params = {
        search: searchTerm,
        category: selectedCategory,
        material: selectedMaterial,
        min_price: priceRange.min,
        max_price: priceRange.max,
        per_page: 50
      }
      
      // Remove empty params
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key]
      })
      
      const data = await productsApi.getAll(params)
      let sortedProducts = data.products || []
      
      // Sort products
      switch (sortBy) {
        case 'name_asc':
          sortedProducts.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'name_desc':
          sortedProducts.sort((a, b) => b.name.localeCompare(a.name))
          break
        case 'price_asc':
          sortedProducts.sort((a, b) => a.price - b.price)
          break
        case 'price_desc':
          sortedProducts.sort((a, b) => b.price - a.price)
          break
      }
      
      setProducts(sortedProducts)
    } catch (error) {
      console.error('Failed to load products:', error)
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

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedMaterial('')
    setPriceRange({ min: '', max: '' })
    setSearchParams({})
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
              <Link to="/products" className="text-orange-600 font-medium">Products</Link>
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
                <Link to="/products" className="text-orange-600 font-medium">Products</Link>
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Material */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Material</label>
                  <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Materials" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Materials</SelectItem>
                      {MATERIALS.map(material => (
                        <SelectItem key={material} value={material}>{material}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">{products.length} products found</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }>
                {products.map((product) => (
                  <Card key={product.id} className={`overflow-hidden hover:shadow-lg transition-shadow ${
                    viewMode === 'list' ? 'flex flex-row' : ''
                  }`}>
                    <div className={viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}>
                      <img
                        src={product.image_url || steelBartan}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1 flex flex-col justify-between' : ''}`}>
                      <div>
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xl font-bold text-orange-600">₹{product.price}</span>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">4.5</span>
                          </div>
                        </div>
                        {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                          <Badge className="bg-red-500 text-white mb-3">
                            Only {product.stock_quantity} left
                          </Badge>
                        )}
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
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

