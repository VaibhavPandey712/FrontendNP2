import { useState } from 'react'
import api from '../utils/api.js'

export default function AddQuestionModal({ onClose, onAdd }) {
  const [platform, setPlatform] = useState('leetcode')
  const [url, setUrl] = useState('')
  const [rating, setRating] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/api/questions', { platform, URL: url, Rating: rating })
      const data = await response.json()
      onAdd(data.post)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

const ratingOptions = platform === 'leetcode' 
    ? ['Easy', 'Medium', 'Hard']
    : Array.from({length: 10}, (_, i) => {
        const low = 800 + i * 100
        return `${low}`
      })

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Add Question</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <select 
              value={platform} 
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="leetcode">LeetCode</option>
              <option value="codeforces">Codeforces</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Question URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://leetcode.com/problems/..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating {platform === 'leetcode' ? '(Easy/Medium/Hard)' : '(800-1800)'}
            </label>
            <select 
              value={rating} 
              onChange={(e) => setRating(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select rating</option>
              {platform === 'leetcode' 
                ? ['easy', 'medium', 'hard'].map(r => (
                    <option key={r} value={r.charAt(0).toUpperCase() + r.slice(1)}>{r.toUpperCase()}</option>
                  ))
                : Array.from({length: 10}, (_, i) => {
                    const low = 800 + i * 100
                    
                    const label = `${low}`
                    return <option key={label} value={label}>{label}</option>
                  })
              }
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-900 py-3 px-4 rounded-xl font-medium hover:bg-gray-300 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all focus:ring-2 focus:ring-green-500"
            >
              {loading ? 'Adding...' : 'Add Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
