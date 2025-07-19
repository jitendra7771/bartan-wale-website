import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  Gift, 
  Plus, 
  Edit, 
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff,
  Calendar,
  Percent,
  IndianRupee
} from 'lucide-react'
import { adminApi, productsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import './Admin.css'

export default function AdminOffers() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOffer, setEditingOffer] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_percentage: '',
    discount_amount: '',
    min_order_amount: '',
    image_url: '',
    start_date: '',
    end_date: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadOffers()
  }, [])

  const loadOffers = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getOffers()
      setOffers(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load offers",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setUploading(true)
      
      let imageUrl = formData.image_url
      
      // Upload image if file is selected
      if (imageFile) {
        const uploadResult = await productsApi.uploadImage(imageFile)
        imageUrl = uploadResult.url
      }

      const offerData = {
        ...formData,
        discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
        discount_amount: formData.discount_amount ? parseFloat(formData.discount_amount) : null,
        min_order_amount: formData.min_order_amount ? parseFloat(formData.min_order_amount) : null,
        image_url: imageUrl
      }

      if (editingOffer) {
        await adminApi.updateOffer(editingOffer.id, offerData)
        toast({
          title: "Success",
          description: "Offer updated successfully"
        })
      } else {
        await adminApi.createOffer(offerData)
        toast({
          title: "Success", 
          description: "Offer created successfully"
        })
      }

      setIsModalOpen(false)
      resetForm()
      loadOffers()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save offer",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (offer) => {
    setEditingOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description || '',
      discount_percentage: offer.discount_percentage?.toString() || '',
      discount_amount: offer.discount_amount?.toString() || '',
      min_order_amount: offer.min_order_amount?.toString() || '',
      image_url: offer.image_url || '',
      start_date: offer.start_date ? offer.start_date.split('T')[0] : '',
      end_date: offer.end_date ? offer.end_date.split('T')[0] : ''
    })
    setImageFile(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (offerId) => {
    if (!confirm('Are you sure you want to delete this offer?')) return
    
    try {
      await adminApi.deleteOffer(offerId)
      toast({
        title: "Success",
        description: "Offer deleted successfully"
      })
      loadOffers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete offer",
        variant: "destructive"
      })
    }
  }

  const toggleOfferStatus = async (offer) => {
    try {
      await adminApi.updateOffer(offer.id, { is_active: !offer.is_active })
      toast({
        title: "Success",
        description: `Offer ${offer.is_active ? 'deactivated' : 'activated'} successfully`
      })
      loadOffers()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update offer status",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount_percentage: '',
      discount_amount: '',
      min_order_amount: '',
      image_url: '',
      start_date: '',
      end_date: ''
    })
    setImageFile(null)
    setEditingOffer(null)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      // Preview the image
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image_url: e.target.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const isOfferActive = (offer) => {
    if (!offer.is_active) return false
    
    const now = new Date()
    const startDate = offer.start_date ? new Date(offer.start_date) : null
    const endDate = offer.end_date ? new Date(offer.end_date) : null
    
    if (startDate && now < startDate) return false
    if (endDate && now > endDate) return false
    
    return true
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link to="/admin" className="mr-4">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Offers</h1>
                <p className="text-gray-600">Create and manage promotional offers</p>
              </div>
            </div>
            <Button onClick={() => { resetForm(); setIsModalOpen(true) }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Offer
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Offers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading offers...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => (
              <Card key={offer.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  {offer.image_url ? (
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                      <Gift className="h-12 w-12 text-white" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={isOfferActive(offer) ? "default" : "secondary"}>
                      {isOfferActive(offer) ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{offer.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{offer.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    {offer.discount_percentage && (
                      <div className="flex items-center text-sm">
                        <Percent className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-medium text-green-600">
                          {offer.discount_percentage}% OFF
                        </span>
                      </div>
                    )}
                    {offer.discount_amount && (
                      <div className="flex items-center text-sm">
                        <IndianRupee className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-medium text-green-600">
                          ₹{offer.discount_amount} OFF
                        </span>
                      </div>
                    )}
                    {offer.min_order_amount && (
                      <div className="text-sm text-gray-600">
                        Min order: ₹{offer.min_order_amount}
                      </div>
                    )}
                    {(offer.start_date || offer.end_date) && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          {offer.start_date && new Date(offer.start_date).toLocaleDateString()}
                          {offer.start_date && offer.end_date && ' - '}
                          {offer.end_date && new Date(offer.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(offer)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleOfferStatus(offer)}
                    >
                      {offer.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(offer.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {offers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No offers found</p>
            <Button onClick={() => { resetForm(); setIsModalOpen(true) }} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Offer
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Offer Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingOffer ? 'Edit Offer' : 'Add New Offer'}
            </DialogTitle>
            <DialogDescription>
              {editingOffer ? 'Update offer information' : 'Create a new promotional offer'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Offer Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Diwali Special - 20% Off"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your offer..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discount_percentage">Discount Percentage (%)</Label>
                <Input
                  id="discount_percentage"
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.discount_percentage}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_percentage: e.target.value }))}
                  placeholder="e.g., 20"
                />
              </div>
              <div>
                <Label htmlFor="discount_amount">Discount Amount (₹)</Label>
                <Input
                  id="discount_amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discount_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount_amount: e.target.value }))}
                  placeholder="e.g., 500"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="min_order_amount">Minimum Order Amount (₹)</Label>
              <Input
                id="min_order_amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.min_order_amount}
                onChange={(e) => setFormData(prev => ({ ...prev, min_order_amount: e.target.value }))}
                placeholder="e.g., 1000"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="image">Offer Image</Label>
              <div className="mt-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-2"
                />
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  editingOffer ? 'Update Offer' : 'Create Offer'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

