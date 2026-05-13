// Objetivo do hook
// Centralizar: dados do gráfico, categorias ordenadas, cálculo do valor máximo.
import { useContext, useMemo } from 'react'

import BudgetContext from '../context/budgetContext'

import { categorias as categoriasDefinidas } from '../utils/categoryList'

export default function useChartData() {
  const {
    movements,
    saldo,
    receita,
    despesa,
    investimento,
  } = useContext(BudgetContext)

  const data = useMemo(() => {
    // =========================
    // AGRUPAR POR CATEGORIA
    // =========================

    const somaPorCategoria: Record<string, number> = {}
    const contagemPorCategoria: Record<string, number> = {}

    movements.forEach((item) => {
      // ignorar receitas no resumo categorias
      if (item.acao !== 'Despesa') return

      const chave = item.categoria

      somaPorCategoria[chave] =
        (somaPorCategoria[chave] || 0) + item.movimentos

      contagemPorCategoria[chave] =
        (contagemPorCategoria[chave] || 0) + 1
    })

    // =========================
    // CATEGORIAS ORDENADAS
    // =========================

    const categories = Object.entries(somaPorCategoria)
      .map(([label, valor]) => {
        const categoria = categoriasDefinidas.find(
          (c) => c.value === label,
        )

        return {
          nome: label,
          valor,
          transacoes: contagemPorCategoria[label] || 0,
          icon: categoria?.icon || 'help-outline',
          color: categoria?.color || '#ccc',
        }
      })
      .sort((a, b) => b.valor - a.valor)

    // =========================
    // DADOS DO GRÁFICO
    // =========================

    const chartData = [
      {
        label: 'Receitas',
        value: receita,
        color: '#16a34a',
      },
      {
        label: 'Despesas',
        value: despesa,
        color: '#dc2626',
      },
      {
        label: 'Saldo',
        value: saldo,
        color: '#006E61',
      },
      {
        label: 'Investimentos',
        value: investimento,
        color: '#f59e0b',
      },
    ]

    // =========================
    // MAIOR VALOR
    // =========================

    const maxValue = Math.max(
      ...chartData.map((item) => item.value),
      1,
    )

    return {
      chartData,
      categories,
      maxValue,
    }
  }, [
    movements,
    saldo,
    receita,
    despesa,
    investimento,
  ])

  return data
}