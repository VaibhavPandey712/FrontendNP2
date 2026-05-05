import { useState, useEffect } from 'react'
import api from '../utils/api.js'
import AddQuestionModal from './AddQuestionModal.jsx'
import QuestionList from './QuestionList.jsx'

export default function Dashboard({ logout, user }) {
  const [showModal, setShowModal] = useState(false)
  const [leetcodeQuestions, setLeetCodeQuestions] = useState([])
  const [codeforcesQuestions, setCodeforcesQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCard, setActiveCard] = useState(null)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
const [lcRes, cfRes] = await Promise.all([
          api.get('/api/questions/leetcode').then(r => r.ok ? r.json() : []),
          api.get('/api/questions/codeforces').then(r => r.ok ? r.json() : [])
        ])
      setLeetCodeQuestions(lcRes.sort((a, b) => a.title - b.title))
      setCodeforcesQuestions(cfRes.sort((a, b) => a.title - b.title))
    } catch (err) {
      console.error('Fetch questions error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddQuestion = (newQuestion) => {
    if (newQuestion.platform === 'leetcode') {
      setLeetCodeQuestions(prev => [newQuestion, ...prev])
    } else {
      setCodeforcesQuestions(prev => [newQuestion, ...prev])
    }
    setShowModal(false)
  }

  const refreshList = (platform) => {
    fetchQuestions()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Hi, {user?.username || 'User'}
            </h1>
            <p className="text-gray-600 mt-2">Save and organize your questions</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition-colors font-medium"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card
            title="LeetCode"
            icon="💻"
            count={leetcodeQuestions.length}
            questions={leetcodeQuestions}
            platform="leetcode"
            active={activeCard === 'leetcode'}
            onClick={() => setActiveCard(activeCard === 'leetcode' ? null : 'leetcode')}
            onRefresh={() => refreshList('leetcode')}
          />
          <Card
            title="Codeforces"
            icon="⚡"
            count={codeforcesQuestions.length}
            questions={codeforcesQuestions}
            platform="codeforces"
            active={activeCard === 'codeforces'}
            onClick={() => setActiveCard(activeCard === 'codeforces' ? null : 'codeforces')}
            onRefresh={() => refreshList('codeforces')}
          />
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all shadow-2xl"
          >
            + Add New Question
          </button>
        </div>
      </div>

      {showModal && (
        <AddQuestionModal
          onClose={() => setShowModal(false)}
          onAdd={handleAddQuestion}
        />
      )}
    </div>
  )
}

function Card({ title, icon, count, questions, platform, active, onClick, onRefresh }) {
  return (
    <div 
      className={`group cursor-pointer p-8 rounded-3xl shadow-lg border-4 transition-all duration-300 hover:shadow-2xl ${
        active 
          ? 'border-blue-500 bg-blue-50 scale-105' 
          : 'border-gray-200 hover:border-gray-400 hover:scale-[1.02]'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{icon}</div>
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>
        <span className="bg-white px-4 py-2 rounded-full text-sm font-bold text-gray-700 shadow-md">
          {count} questions
        </span>
      </div>
      {active ? (
        <div className="mt-4">
          <QuestionList 
            questions={questions} 
            platform={platform}
            onRefresh={onRefresh}
          />
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl group-hover:from-blue-50 group-hover:to-indigo-100 transition-colors">
          <p className="text-gray-500 font-medium text-lg">
            Click to view questions
          </p>
        </div>
      )}
    </div>
  )
}
