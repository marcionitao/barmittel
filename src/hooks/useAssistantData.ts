// Faz query ao Firestore dos últimos 6 meses quando o assistente abre
// O BudgetContext só tem o mês atual — este hook fornece o histórico necessário para comparações
import { useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
import { Budget } from '../@types/budget'

export interface MonthSnapshot {
  label: string        // "abril 2025"
  year: number
  month: number        // 0-indexed
  receita: number
  despesa: number
  investimento: number
  saldo: number
  movements: Budget[]
}

const MONTHS_TO_FETCH = 6

export function useAssistantData() {
  const [history, setHistory] = useState<MonthSnapshot[]>([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  useEffect(() => {
    async function fetchHistory() {
      setIsLoadingHistory(true)

      const today = new Date()
      const snapshots: MonthSnapshot[] = []

      const queries = Array.from({ length: MONTHS_TO_FETCH }, (_, i) => {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        const start = new Date(d.getFullYear(), d.getMonth(), 1)
        const end = new Date(d.getFullYear(), d.getMonth() + 1, 1)
        return { start, end, year: d.getFullYear(), month: d.getMonth() }
      })

      try {
        await Promise.all(
          queries.map(async ({ start, end, year, month }) => {
            const snapshot = await firestore()
              .collection('orcamento')
              .where('data', '>=', start)
              .where('data', '<', end)
              .get()

            const movements = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Budget[]

            let receita = 0
            let despesa = 0
            let investimento = 0

            movements.forEach((m) => {
              if (m.acao === 'Receita') receita += m.movimentos
              else if (m.acao === 'Despesa') despesa += m.movimentos
              else if (m.acao === 'Investimento') investimento += m.movimentos
            })

            const label = new Date(year, month, 1).toLocaleDateString('pt-PT', {
              month: 'long',
              year: 'numeric',
            })

            snapshots.push({
              label,
              year,
              month,
              receita,
              despesa,
              investimento,
              saldo: receita - despesa - investimento,
              movements,
            })
          }),
        )

        // ordem cronológica: mais antigo → mais recente
        snapshots.sort((a, b) => {
          if (a.year !== b.year) return a.year - b.year
          return a.month - b.month
        })

        setHistory(snapshots)
      } catch (err) {
        console.error('useAssistantData error:', err)
      } finally {
        setIsLoadingHistory(false)
      }
    }

    fetchHistory()
  }, [])

  return { history, isLoadingHistory }
}