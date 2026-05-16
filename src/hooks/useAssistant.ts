// Gere o estado do chat, histórico de mensagens e chama a API Mistral
// Separa toda a lógica de negócio da UI — o modal só renderiza o que este hook expõe
import { useState, useCallback, useContext } from 'react'
import BudgetContext from '../context/budgetContext'
import { buildFinancialContext } from '../utils/buildFinancialContext'
import { useAssistantData } from '../hooks/useAssistantData'

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'
const MISTRAL_API_KEY = process.env.EXPO_PUBLIC_MISTRAL_API_KEY

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
  const { history, isLoadingHistory } = useAssistantData() // ← novo

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
          history, // ← passa o histórico
        })

        const chatHistory = [...messages, userMessage]
          .slice(-MAX_HISTORY)
          .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }))

        const response = await fetch(MISTRAL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${MISTRAL_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'mistral-large-latest',
            messages: [{ role: 'system', content: systemPrompt }, ...chatHistory],
            max_tokens: 400,
          }),
        })

        if (!response.ok) {
          const errData = await response.json()
          throw new Error(errData.message || 'Erro na API do Mistral')
        }

        const data = await response.json()
        const assistantText = data.choices[0]?.message?.content

        if (!assistantText) throw new Error('Resposta vazia do Mistral')

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
