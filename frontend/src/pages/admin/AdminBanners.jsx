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
  Image, 
  Plus, 
  Edit, 
  Trash2,
  ArrowLeft,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  ExternalLink
} from 'lucide-react'
import { adminApi, productsApi } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import './Admin.css'

export default function AdminBanners() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    order_position: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadBanners()
  }, [])

  const loadBanners = async () => {
    try {
      setLoading(true)
      const data = await adminApi.getBanners()
      setBanners(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load banners",
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

      const bannerData = {
        ...formData,
        image_url: imageUrl,
        order_position: parseInt(formData.order_position) || 0
      }

      if (editingBanner) {
        await adminApi.updateBanner(editingBanner.id, bannerData)
        toast({
          title: "Success",
          description: "Banner updated successfully"
        })
      } else {
        await adminApi.createBanner(bannerData)
        toast({
          title: "Success", 
          description: "Banner created successfully"
        })
      }

      setIsModalOpen(false)
      resetForm()
      loadBanners()
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save banner",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      image_url: banner.image_url || '',
      link_url: banner.link_url || '',
      order_position: banner.order_position?.toString() || '0'
    })
    setImageFile(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (bannerId) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    
    try {
      await adminApi.deleteBanner(bannerId)
      toast({
        title: "Success",
        description: "Banner deleted successfully"
      })
      loadBanners()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive"
      })
    }
  }

  const toggleBannerStatus = async (banner) => {
    try {
      await adminApi.updateBanner(banner.id, { is_active: !banner.is_active })
      toast({
        title: "Success",
        description: `Banner ${banner.is_active ? 'deactivated' : 'activated'} successfully`
      })
      loadBanners()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner status",
        variant: "destructive"
      })
    }
  }

  const updateBannerOrder = async (bannerId, newPosition) => {
    try {
      await adminApi.updateBanner(bannerId, { order_position: newPosition })
      loadBanners()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner order",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      image_url: '',
      link_url: '',
      order_position: ''
    })
    setImageFile(null)
    setEditingBanner(null)
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

  const sortedBanners = [...banners].sort((a, b) => (a.order_position || 0) - (b.order_position || 0))

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
                <h1 className="text-3xl font-bold text-gray-900">Banners</h1>
                <p className="text-gray-600">Manage homepage banners and promotional content</p>
              </div>
            </div>
            <Button onClick={() => { resetForm(); setIsModalOpen(true) }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Banner
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banners List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading banners...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedBanners.map((banner, index) => (
              <Card key={banner.id} className="overflow-hidden">
                <div className="flex flex-col lg:flex-row">
                  <div className="lg:w-1/3 aspect-video lg:aspect-auto">
                    {banner.image_url ? (
                      <img
                        src={banner.image_url}
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <Image className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="lg:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold">{banner.title || 'Untitled Banner'}</h3>
                          <Badge variant={banner.is_active ? "default" : "secondary"}>
                            {banner.is_active ? "Active" : "Inactive"}
                          </Badge>
                          <Badge variant="outline">
                            Position: {banner.order_position || 0}
                          </Badge>
                        </div>
                        {banner.subtitle && (
                          <p className="text-gray-600 mb-3">{banner.subtitle}</p>
                        )}
                        {banner.link_url && (
                          <div className="flex items-center text-sm text-blue-600 mb-3">
                            <ExternalLink className="h-4 w-4 mr-1" />
                            <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                              {banner.link_url}
                            </a>
                          </div>
                        )}
                        <p className="text-sm text-gray-500">
                          Created: {new Date(banner.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateBannerOrder(banner.id, (banner.order_position || 0) - 1)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateBannerOrder(banner.id, (banner.order_position || 0) + 1)}
                            disabled={index === sortedBanners.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(banner)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleBannerStatus(banner)}
                          >
                            {banner.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(banner.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {banners.length === 0 && !loading && (
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No banners found</p>
            <Button onClick={() => { resetForm(); setIsModalOpen(true) }} className="mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Banner
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Banner Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </DialogTitle>
            <DialogDescription>
              {editingBanner ? 'Update banner information' : 'Create a new homepage banner'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Banner Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Special Diwali Offer"
              />
            </div>

            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Additional text for the banner..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="link_url">Link URL</Label>
              <Input
                id="link_url"
                type="url"
                value={formData.link_url}
                onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                placeholder="https://example.com/offer"
              />
            </div>

            <div>
              <Label htmlFor="order_position">Display Order</Label>
              <Input
                id="order_position"
                type="number"
                min="0"
                value={formData.order_position}
                onChange={(e) => setFormData(prev => ({ ...prev, order_position: e.target.value }))}
                placeholder="0"
              />
              <p className="text-sm text-gray-500 mt-1">
                Lower numbers appear first. Use 0 for highest priority.
              </p>
            </div>

            <div>
              <Label htmlFor="image">Banner Image *</Label>
              <div className="mt-2">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="mb-2"
                  required={!editingBanner}
                />
                <p className="text-sm text-gray-500 mb-2">
                  Recommended size: 1200x400 pixels for best results
                </p>
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
                  editingBanner ? 'Update Banner' : 'Create Banner'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

