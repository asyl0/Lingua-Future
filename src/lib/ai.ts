export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function sendMessageToAI(messages: ChatMessage[]): Promise<string> {
  // Check if API key is available - use window check for client-side
  const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
  
  console.log('🔍 AI Debug Info:')
  console.log('- API Key available:', !!apiKey)
  console.log('- API Key length:', apiKey ? apiKey.length : 0)
  console.log('- API Key starts with:', apiKey ? apiKey.substring(0, 10) + '...' : 'N/A')
  console.log('- Messages count:', messages.length)
  console.log('- Last message:', messages[messages.length - 1]?.content)
  console.log('- Environment check:', typeof window !== 'undefined' ? 'Client' : 'Server')
  
  if (!apiKey || apiKey === 'your_openrouter_api_key_here' || apiKey === 'sk-or-v1-ca9' || apiKey.length < 20) {
    console.log('⚠️ Using mock AI response - API key not configured properly')
    console.log('- API key value:', apiKey)
    return getMockAIResponse(messages[messages.length - 1]?.content || '')
  }

  try {
    console.log('🚀 Sending request to OpenRouter API...')
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000',
        'X-Title': 'Lingua Future',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an English learning assistant focused on "The role of AI in shaping the future of language". 
Your role is to help students understand their assignments, explain English words and grammar in a simple way, and give examples. 
Always answer in clear and easy English, even if the student asks a difficult question.
Connect your answers to how AI is changing language learning and communication.
Keep responses concise but helpful (2-3 sentences max).`
          },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    console.log('📡 Response status:', response.status)
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ API Error Response:', errorText)
      throw new Error(`API Error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('✅ AI Response received:', data)
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from AI API')
    }
    
    return data.choices[0].message.content
  } catch (error) {
    console.error('❌ AI API Error:', error)
    console.log('🔄 Falling back to mock response...')
    // Fallback to mock response
    return getMockAIResponse(messages[messages.length - 1]?.content || '')
  }
}

// Mock AI responses for demo purposes
function getMockAIResponse(userMessage: string): string {
  const message = userMessage.toLowerCase()
  
  // Grammar-related responses
  if (message.includes('grammar') || message.includes('grammatical') || message.includes('tense') || message.includes('verb')) {
    const grammarResponses = [
      "AI can help you understand grammar by providing instant explanations and examples. In the future, AI will be able to explain complex grammar rules in ways that match your learning style perfectly.",
      "Grammar is one of AI's strongest areas! It can instantly identify errors and explain why something is wrong, making grammar learning much more interactive and effective.",
      "With AI, you can get personalized grammar explanations that adapt to your level. This is revolutionizing how we learn English grammar rules and structures."
    ]
    return grammarResponses[Math.floor(Math.random() * grammarResponses.length)]
  }
  
  // Writing and essay responses
  if (message.includes('essay') || message.includes('writing') || message.includes('introduction') || message.includes('paragraph')) {
    const writingResponses = [
      "AI is transforming how we approach writing assignments. It can help you brainstorm ideas, check your work, and provide feedback - making the learning process more interactive and effective.",
      "For essay writing, AI can help you structure your thoughts, suggest better vocabulary, and even check for logical flow. This is just the beginning of AI-assisted writing!",
      "AI writing assistants can analyze your style and suggest improvements in real-time. This personalized feedback is changing how students learn to write effectively."
    ]
    return writingResponses[Math.floor(Math.random() * writingResponses.length)]
  }
  
  // Vocabulary and words responses
  if (message.includes('word') || message.includes('vocabulary') || message.includes('meaning') || message.includes('idiom')) {
    const vocabResponses = [
      "AI can instantly explain word meanings, provide synonyms, and show how words are used in context. This makes vocabulary learning much more efficient and engaging.",
      "With AI, you can learn new words through personalized examples and practice exercises. The future of vocabulary learning is adaptive and interactive!",
      "AI can help you understand idioms, phrasal verbs, and cultural expressions by providing context and real-world examples. This bridges language and culture learning."
    ]
    return vocabResponses[Math.floor(Math.random() * vocabResponses.length)]
  }
  
  // Pronunciation responses
  if (message.includes('pronunciation') || message.includes('speak') || message.includes('accent') || message.includes('sound')) {
    const pronunciationResponses = [
      "AI is revolutionizing pronunciation learning with real-time feedback and speech recognition. Soon, AI will be able to correct your accent and help you sound more natural.",
      "With AI speech technology, you can practice pronunciation anytime, anywhere. The future of language learning includes personalized accent training and instant feedback.",
      "AI can analyze your speech patterns and provide specific tips for improvement. This personalized approach is making pronunciation learning more effective than ever."
    ]
    return pronunciationResponses[Math.floor(Math.random() * pronunciationResponses.length)]
  }
  
  // Future and technology responses
  if (message.includes('future') || message.includes('ai') || message.includes('technology') || message.includes('tomorrow')) {
    const futureResponses = [
      "The future of language learning with AI is incredibly exciting! We'll see more personalized, adaptive learning experiences that respond to each student's unique needs and learning pace.",
      "AI is revolutionizing language learning by providing personalized, instant feedback and creating immersive learning experiences. This is exactly what we're exploring in our project!",
      "With AI, language barriers are becoming less significant. Real-time translation and language assistance are transforming how we communicate globally.",
      "AI-powered language learning tools can identify your strengths and weaknesses, creating a customized learning path that traditional methods cannot match."
    ]
    return futureResponses[Math.floor(Math.random() * futureResponses.length)]
  }
  
  // Assignment and task responses
  if (message.includes('assignment') || message.includes('task') || message.includes('homework') || message.includes('project')) {
    const assignmentResponses = [
      "AI is transforming how we approach assignments. It can help you brainstorm ideas, check your work, and provide feedback - making the learning process more interactive and effective.",
      "With AI assistance, assignments become learning opportunities rather than just tasks. You get instant help and personalized guidance throughout your work.",
      "AI can help you break down complex assignments into manageable steps and provide resources tailored to your learning style. This makes studying more efficient and enjoyable."
    ]
    return assignmentResponses[Math.floor(Math.random() * assignmentResponses.length)]
  }
  
  // General responses
  const generalResponses = [
    "AI is revolutionizing language learning by providing personalized, instant feedback and creating immersive learning experiences. This is exactly what we're exploring in our project!",
    "The future of language learning lies in AI's ability to understand individual learning patterns and adapt content accordingly. This makes learning more effective and engaging.",
    "AI can analyze your writing style and provide suggestions for improvement, helping you become a better English speaker. This is just the beginning of how technology will shape language education.",
    "With AI, language barriers are becoming less significant. Real-time translation and language assistance are transforming how we communicate globally.",
    "AI-powered language learning tools can identify your strengths and weaknesses, creating a customized learning path that traditional methods cannot match.",
    "I'm here to help you with any English learning questions! Whether it's grammar, vocabulary, writing, or speaking, AI makes learning more interactive and personalized than ever before."
  ]
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)]
}
