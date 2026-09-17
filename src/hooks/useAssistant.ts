// Gere o estado do chat, histórico de mensagens e chama a API Google Gemini
// Separa toda a lógica de negócio da UI — o modal só renderiza o que este hook expõe
import { useState, useCallback, useContext } from 'react'
import BudgetContext from '../context/budgetContext'
import { buildFinancialContext } from '../utils/buildFinancialContext'
import { useAssistantData } from '../hooks/useAssistantData'

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const MAX_HISTORY = 10

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const context = useContext(BudgetContext)
  const { history, isLoadingHistory } = useAssistantData()

  const sendMessage = useCallback(
    async (userText: string) => {
      if (!userText.trim() || isLoading) return

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: userText.trim(),
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsLoading(true)
      setError(null)

      try {
        const systemPrompt = buildFinancialContext({
          movements: context.movements,
          movimentosFuturos: context.movimentosFuturos,
          saldo: context.saldo,
          receita: context.receita,
          despesa: context.despesa,
          investimento: context.investimento,
          currentMonth: context.currentMonth,
          history,
        })

        const chatHistory = [...messages, userMessage]
          .slice(-MAX_HISTORY)
          .map((m) => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          }))

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: chatHistory,
            systemInstruction: {
              parts: [{ text: systemPrompt }],
            },
            generationConfig: {
              maxOutputTokens: 1024,
              temperature: 0.7,
              thinkingConfig: {
                thinkingBudget: 0,
              },
            },
          }),
        })

        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.error?.message || 'Erro na API do Gemini')
        }

        const data = await response.json()
        const assistantText = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!assistantText) throw new Error('Resposta vazia do Gemini')

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: assistantText,
            timestamp: new Date(),
          },
        ])
      } catch (err) {
        console.error('useAssistant error:', err)
        setError('Não foi possível obter resposta. Tenta novamente.')
      } finally {
        setIsLoading(false)
      }
    },
    [messages, isLoading, context, history],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, isLoading, isLoadingHistory, error, sendMessage, clearMessages }
}