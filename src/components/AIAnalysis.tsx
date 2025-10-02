'use client'

import { useState } from 'react'
import { Bot, FileText, CheckCircle, Lightbulb } from 'lucide-react'

interface AIAnalysisProps {
  text: string
  onClose: () => void
}

export default function AIAnalysis({ onClose }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<{
    grammar: { score: number; issues: { type: string; text: string; position: number }[] }
    style: { score: number; suggestions: string[] }
    vocabulary: { score: number; suggestions: string[] }
    overall: { score: number; feedback: string }
  } | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeText = async () => {
    setLoading(true)
    
    // Mock AI analysis for demo
    setTimeout(() => {
      const mockAnalysis = {
        grammar: {
          score: 85,
          issues: [
            { type: 'grammar', text: 'Consider using "their" instead of "there"', position: 45 },
            { type: 'grammar', text: 'Add a comma after "however"', position: 120 }
          ]
        },
        style: {
          score: 78,
          suggestions: [
            'Use more varied sentence structures',
            'Consider adding transitional phrases',
            'Try to be more specific in your examples'
          ]
        },
        vocabulary: {
          score: 92,
          suggestions: [
            'Great use of advanced vocabulary!',
            'Consider using "utilize" instead of "use" for formal writing'
          ]
        },
        overall: {
          score: 85,
          feedback: "This is a well-written piece with good structure and clear ideas. The main areas for improvement are grammar accuracy and sentence variety. Keep up the great work!"
        }
      }
      setAnalysis(mockAnalysis)
      setLoading(false)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">AI Writing Analysis</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {!analysis ? (
            <div className="text-center py-8">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to analyze your text?</h3>
              <p className="text-gray-600 mb-6">
                Our AI will analyze your writing for grammar, style, vocabulary, and provide suggestions for improvement.
              </p>
              <button
                onClick={analyzeText}
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Overall Score */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Overall Score</h3>
                    <p className="text-blue-100 text-sm mt-1">{analysis.overall.feedback}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{analysis.overall.score}</div>
                    <div className="text-blue-100 text-sm">out of 100</div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Grammar */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Grammar</h4>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{analysis.grammar.score}/100</div>
                  <div className="space-y-2">
                    {analysis.grammar.issues.map((issue: { text: string }, index: number) => (
                      <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                        {issue.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Style */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Lightbulb className="h-5 w-5 text-yellow-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Style</h4>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{analysis.style.score}/100</div>
                  <div className="space-y-2">
                    {analysis.style.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vocabulary */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FileText className="h-5 w-5 text-purple-600 mr-2" />
                    <h4 className="font-semibold text-gray-900">Vocabulary</h4>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">{analysis.vocabulary.score}/100</div>
                  <div className="space-y-2">
                    {analysis.vocabulary.suggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="text-sm text-purple-700 bg-purple-50 p-2 rounded">
                        {suggestion}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start">
                  <Bot className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">AI Insights</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Based on the theme &ldquo;The role of AI in shaping the future of language&rdquo;, 
                      your writing demonstrates good understanding of modern communication. 
                      AI tools like this one are revolutionizing how we learn and improve our language skills, 
                      providing instant feedback that was impossible just a few years ago.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
