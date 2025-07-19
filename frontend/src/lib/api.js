const API_BASE_URL = '/api'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new ApiError(error.error || 'Something went wrong', response.status)
  }
  return response.json()
}

// Products API
export const productsApi = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams(params)
    const response = await fetch(`${API_BASE_URL}/products?${searchParams}`)
    return handleResponse(response)
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    return handleResponse(response)
  },
  
  create: async (product) => {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    return handleResponse(response)
  },
  
  update: async (id, product) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    })
    return handleResponse(response)
  },
  
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE'
    })
    return handleResponse(response)
  },
  
  uploadImage: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      body: formData
    })
    return handleResponse(response)
  }
}

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`)
    return handleResponse(response)
  },
  
  create: async (category) => {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category)
    })
    return handleResponse(response)
  }
}

// Orders API
export const ordersApi = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams(params)
    const response = await fetch(`${API_BASE_URL}/orders?${searchParams}`)
    return handleResponse(response)
  },
  
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`)
    return handleResponse(response)
  },
  
  create: async (order) => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
    return handleResponse(response)
  },
  
  update: async (id, order) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })
    return handleResponse(response)
  },
  
  track: async (id) => {
    const response = await fetch(`${API_BASE_URL}/orders/${id}/track`)
    return handleResponse(response)
  },
  
  search: async (params) => {
    const searchParams = new URLSearchParams(params)
    const response = await fetch(`${API_BASE_URL}/orders/search?${searchParams}`)
    return handleResponse(response)
  }
}

// Customers API
export const customersApi = {
  getAll: async (params = {}) => {
    const searchParams = new URLSearchParams(params)
    const response = await fetch(`${API_BASE_URL}/customers?${searchParams}`)
    return handleResponse(response)
  },
  
  create: async (customer) => {
    const response = await fetch(`${API_BASE_URL}/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    })
    return handleResponse(response)
  }
}

// Admin API
export const adminApi = {
  getDashboard: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard`)
    return handleResponse(response)
  },
  
  getOffers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/offers`)
    return handleResponse(response)
  },
  
  createOffer: async (offer) => {
    const response = await fetch(`${API_BASE_URL}/admin/offers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer)
    })
    return handleResponse(response)
  },
  
  updateOffer: async (id, offer) => {
    const response = await fetch(`${API_BASE_URL}/admin/offers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(offer)
    })
    return handleResponse(response)
  },
  
  deleteOffer: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/offers/${id}`, {
      method: 'DELETE'
    })
    return handleResponse(response)
  },
  
  getBanners: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/banners`)
    return handleResponse(response)
  },
  
  createBanner: async (banner) => {
    const response = await fetch(`${API_BASE_URL}/admin/banners`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(banner)
    })
    return handleResponse(response)
  },
  
  updateBanner: async (id, banner) => {
    const response = await fetch(`${API_BASE_URL}/admin/banners/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(banner)
    })
    return handleResponse(response)
  },
  
  deleteBanner: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/banners/${id}`, {
      method: 'DELETE'
    })
    return handleResponse(response)
  },
  
  getReviews: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/reviews`)
    return handleResponse(response)
  },
  
  approveReview: async (id) => {
    const response = await fetch(`${API_BASE_URL}/admin/reviews/${id}/approve`, {
      method: 'PUT'
    })
    return handleResponse(response)
  },
  
  exportOrders: async (params = {}) => {
    const searchParams = new URLSearchParams(params)
    const response = await fetch(`${API_BASE_URL}/admin/export/orders?${searchParams}`)
    if (!response.ok) {
      throw new Error('Export failed')
    }
    return response.blob()
  }
}

