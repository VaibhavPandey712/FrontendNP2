const API_BASE = import.meta.env.VITE_API_URL || 'https://backendnp2.onrender.com'

const api = {
  get: async (url, options = {}) => {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      credentials: 'include'
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    return response
  },
  post: async (url, body, options = {}) => {
    const response = await fetch(`${API_BASE}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      credentials: 'include',
      ...options
    })
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `HTTP ${response.status}`)
    }
    return response
  }
}

export default api
