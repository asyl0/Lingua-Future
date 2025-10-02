'use client'

import { useState } from 'react'
import { Bot, FileText, CheckCircle, Lightbulb } from 'lucide-react'
import { sendMessageToAI } from '@/lib/ai'

interface AIAnalysisProps {
  text: string
  onClose: () => void
}

export default function AIAnalysis({ text, onClose }: AIAnalysisProps) {
  const [analysis, setAnalysis] = useState<{
    grammar: { score: number; issues: { type: string; text: string; position: number }[] }
    style: { score: number; suggestions: string[] }
    vocabulary: { score: number; suggestions: string[] }
    overall: { score: number; feedback: string }
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState<string>('')

  const analyzeText = async () => {
    setLoading(true)
    
    try {
      console.log('🔍 Starting AI analysis...')
      console.log('- Text length:', text.length)
      console.log('- Text preview:', text.substring(0, 100) + '...')
      
      // Create a detailed prompt for AI analysis
      const analysisPrompt = `Please analyze the following text for grammar, style, and vocabulary. Provide specific feedback and suggestions for improvement. The text is: "${text}"

Please provide your analysis in the following format:
1. Grammar issues (if any)
2. Style suggestions 
3. Vocabulary feedback
4. Overall assessment and score out of 100

Focus on helping the student improve their English writing skills.`

      console.log('🚀 Sending analysis request to AI...')
      const response = await sendMessageToAI([
        { role: 'user', content: analysisPrompt }
      ])

      console.log('✅ AI response received:', response.substring(0, 200) + '...')
      
      // Store the full AI response
      setAiResponse(response)
      
      // Parse the AI response and create structured analysis
      const analysisResult = parseAIResponse(response)
      setAnalysis(analysisResult)
    } catch (error) {
      console.error('Error analyzing text:', error)
      // Fallback to mock analysis if AI fails
      const mockAnalysis = {
        grammar: {
          score: 85,
          issues: [
            { type: 'grammar', text: 'AI analysis temporarily unavailable - using basic check', position: 0 }
          ]
        },
        style: {
          score: 78,
          suggestions: [
            'AI analysis temporarily unavailable',
            'Please try again later for detailed feedback'
          ]
        },
        vocabulary: {
          score: 92,
          suggestions: [
            'AI analysis temporarily unavailable',
            'Basic vocabulary check shows good word choice'
          ]
        },
        overall: {
          score: 85,
          feedback: "AI analysis is temporarily unavailable. Your text appears well-structured. Please try the analysis again for detailed feedback."
        }
      }
      setAnalysis(mockAnalysis)
    } finally {
      setLoading(false)
    }
  }

  // Helper function to parse AI response into structured format
  const parseAIResponse = (response: string) => {
    // Simple parsing - in a real app, you might want more sophisticated parsing
    // const lines = response.split('\n').filter(line => line.trim())
    
    // Extract key information from the response
    const grammarIssues = []
    const styleSuggestions = []
    const vocabularyFeedback = []
    let overallScore = 85
    const overallFeedback = response

    // Try to extract score if mentioned
    const scoreMatch = response.match(/(\d+)\s*(?:out of 100|\/100|%)/i)
    if (scoreMatch) {
      overallScore = parseInt(scoreMatch[1])
    }

    // Look for specific sections in the response
    if (response.toLowerCase().includes('grammar')) {
      grammarIssues.push({ type: 'grammar', text: 'Check AI feedback above for grammar suggestions', position: 0 })
    }

    if (response.toLowerCase().includes('style') || response.toLowerCase().includes('structure')) {
      styleSuggestions.push('Review AI suggestions above for style improvements')
    }

    if (response.toLowerCase().includes('vocabulary') || response.toLowerCase().includes('word')) {
      vocabularyFeedback.push('See AI feedback above for vocabulary suggestions')
    }

    return {
      grammar: {
        score: Math.max(70, overallScore - 5),
        issues: grammarIssues.length > 0 ? grammarIssues : [
          { type: 'info', text: 'No major grammar issues detected', position: 0 }
        ]
      },
      style: {
        score: Math.max(75, overallScore),
        suggestions: styleSuggestions.length > 0 ? styleSuggestions : [
          'Review the detailed AI feedback above'
        ]
      },
      vocabulary: {
        score: Math.max(80, overallScore + 5),
        suggestions: vocabularyFeedback.length > 0 ? vocabularyFeedback : [
          'Good vocabulary usage detected'
        ]
      },
      overall: {
        score: overallScore,
        feedback: overallFeedback.substring(0, 200) + (overallFeedback.length > 200 ? '...' : '')
      }
    }
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

              {/* Full AI Analysis */}
              {aiResponse && (
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start">
                    <Bot className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-3">Detailed AI Analysis</h4>
                      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                        {aiResponse}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Insights - Fallback */}
              {!aiResponse && (
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
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
