import api from '../utils/api.js'

export default function QuestionList({ questions, platform, onRefresh }) {
  const copyURL = (url) => {
    navigator.clipboard.writeText(url)
    // Visual feedback could be added here
  }

    const deleteQuestion = async (id) => {
      if (!confirm('Delete this question?')) return
      try {
        const response = await api.post(`/api/questions`, { 
          _method: 'DELETE',
          id: id
        })
        if (!response.ok) throw new Error('Delete failed')
        onRefresh()
      } catch (err) {
        alert('Delete failed: ' + err.message)
      }
    }

  return (
    <div className="space-y-3">
      {questions.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No questions saved yet</p>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {questions.map((q) => (
            <div key={q._id} className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-lg mb-1 truncate">{platform === 'leetcode' ? 'LC #' : 'CF #'} {q.title}</div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="mr-4">{q.Rating}</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {platform.toUpperCase()}
                    </span>
                  </div>
                  <a 
                    href={q.URL} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium truncate block"
                  >
                    {q.URL}
                  </a>
                </div>
                <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                  <button
                    onClick={() => copyURL(q.URL)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => deleteQuestion(q._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
