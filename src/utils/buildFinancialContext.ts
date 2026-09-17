// Converte todos os dados financeiros numa string estruturada (system prompt)
// É a "inteligência" do assistente — quanto melhor o contexto, melhores as respostas do modelo
import { Budget } from '../@types/budget'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'
import { MonthSnapshot } from '../hooks/useAssistantData'

interface FinancialContextInput {
  movements: Budget[]
  movimentosFuturos: Budget[]
  saldo: number
  receita: number
  despesa: number
  investimento: number
  currentMonth: Date
  history: MonthSnapshot[]   // ← novo
}

function formatDate(date: Date | FirebaseFirestoreTypes.Timestamp): string {
  const d = 'toDate' in date ? date.toDate() : date
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatEur(value: number): string {
  return `${value.toFixed(2)}€`
}

function getMonthName(date: Date): string {
  return date.toLocaleDateString('pt-PT', { month: 'long', year: 'numeric' })
}

function buildCategoryBreakdown(movements: Budget[]): string {
  const despesas = movements.filter((m) => m.acao === 'Despesa')
  if (despesas.length === 0) return 'Sem despesas registadas.'

  const map: Record<string, number> = {}
  despesas.forEach((m) => {
    map[m.categoria] = (map[m.categoria] || 0) + m.movimentos
  })

  return Object.entries(map)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, val]) => `  - ${cat}: ${formatEur(val)}`)
    .join('\n')
}

function buildMovementsList(movements: Budget[]): string {
  if (movements.length === 0) return 'Nenhum.'
  return movements
    .slice(0, 30)
    .map((m) => {
      const date = formatDate(m.data)
      const valor = formatEur(m.movimentos)
      const desc = m.descricao ? ` — "${m.descricao}"` : ''
      return `  [${date}] ${m.acao.toUpperCase()} | ${m.categoria} | ${valor}${desc}`
    })
    .join('\n')
}

function buildHistorySummary(history: MonthSnapshot[]): string {
  if (history.length === 0) return 'Sem histórico disponível.'

  return history
    .map((snap) =>
      `  ${snap.label.toUpperCase()}:
    Receita: ${formatEur(snap.receita)} | Despesa: ${formatEur(snap.despesa)} | Investimento: ${formatEur(snap.investimento)} | Saldo: ${formatEur(snap.saldo)}`
    )
    .join('\n')
}

function buildYearlyCategoryBreakdown(history: MonthSnapshot[]): string {
  if (history.length === 0) return 'Sem histórico disponível.'

  const year = new Date().getFullYear()
  const yearMovements = history
    .filter((s) => s.year === year)
    .flatMap((s) => s.movements)

  const despesas = yearMovements.filter((m) => m.acao === 'Despesa')
  if (despesas.length === 0) return 'Sem despesas este ano.'

  const map: Record<string, { count: number; total: number }> = {}
  despesas.forEach((m) => {
    map[m.categoria] = map[m.categoria] || { count: 0, total: 0 }
    map[m.categoria].count++
    map[m.categoria].total += m.movimentos
  })

  return Object.entries(map)
    .sort(([, a], [, b]) => b.total - a.total)
    .map(([cat, v]) => `  - ${cat}: ${v.count} transações, ${formatEur(v.total)}`)
    .join('\n')
}

function buildYearlyMovementsList(history: MonthSnapshot[]): string {
  if (history.length === 0) return 'Sem histórico disponível.'

  const year = new Date().getFullYear()
  const yearMovements = history
    .filter((s) => s.year === year)
    .flatMap((s) => s.movements)

  if (yearMovements.length === 0) return 'Nenhum movimento este ano.'

  return yearMovements
    .slice(0, 200)
    .sort((a, b) => a.data.toDate().getTime() - b.data.toDate().getTime())
    .map((m) => {
      const date = formatDate(m.data)
      const valor = formatEur(m.movimentos)
      const desc = m.descricao ? ` — "${m.descricao}"` : ''
      return `  [${date}] ${m.acao.toUpperCase()} | ${m.categoria} | ${valor}${desc}`
    })
    .join('\n')
}

function buildRecentByCategory(history: MonthSnapshot[]): string {
  if (history.length === 0) return 'Sem histórico disponível.'

  const year = new Date().getFullYear()
  const yearMovements = history
    .filter((s) => s.year === year)
    .flatMap((s) => s.movements)
    .filter((m) => m.acao === 'Despesa')
    .sort((a, b) => b.data.toDate().getTime() - a.data.toDate().getTime())

  if (yearMovements.length === 0) return 'Nenhuma despesa este ano.'

  const byCategory: Record<string, Budget[]> = {}
  yearMovements.forEach((m) => {
    byCategory[m.categoria] = byCategory[m.categoria] || []
    if (byCategory[m.categoria].length < 3) {
      byCategory[m.categoria].push(m)
    }
  })

  return Object.entries(byCategory)
    .map(([cat, movs]) =>
      `  ${cat} (últimos):\n` +
      movs
        .map((m) => {
          const date = formatDate(m.data)
          const valor = formatEur(m.movimentos)
          const desc = m.descricao ? ` — "${m.descricao}"` : ''
          return `    [${date}] ${valor}${desc}`
        })
        .join('\n')
    )
    .join('\n')
}

function buildCategoryTrend(history: MonthSnapshot[]): string {
  if (history.length < 2) return 'Histórico insuficiente.'

  const current = history[history.length - 1]
  const previous = history[history.length - 2]

  const allCategories = new Set<string>([
    ...current.movements.filter((m) => m.acao === 'Despesa').map((m) => m.categoria),
    ...previous.movements.filter((m) => m.acao === 'Despesa').map((m) => m.categoria),
  ])

  const aumentaram: string[] = []
  const diminuiram: string[] = []
  const iguais: string[] = []

  allCategories.forEach((cat) => {
    const valorAtual = current.movements
      .filter((m) => m.acao === 'Despesa' && m.categoria === cat)
      .reduce((acc, m) => acc + m.movimentos, 0)

    const valorAnterior = previous.movements
      .filter((m) => m.acao === 'Despesa' && m.categoria === cat)
      .reduce((acc, m) => acc + m.movimentos, 0)

    const diff = valorAtual - valorAnterior

    if (diff > 0) {
      aumentaram.push(`  - ${cat}: +${formatEur(diff)} (${formatEur(valorAnterior)} → ${formatEur(valorAtual)})`)
    } else if (diff < 0) {
      diminuiram.push(`  - ${cat}: ${formatEur(diff)} (${formatEur(valorAnterior)} → ${formatEur(valorAtual)})`)
    } else if (valorAtual > 0) {
      iguais.push(`  - ${cat}: ${formatEur(valorAtual)} (sem alteração)`)
    }
  })

  return `
CATEGORIAS QUE AUMENTARAM vs mês anterior:
${aumentaram.length > 0 ? aumentaram.join('\n') : '  Nenhuma.'}

CATEGORIAS QUE DIMINUÍRAM vs mês anterior:
${diminuiram.length > 0 ? diminuiram.join('\n') : '  Nenhuma.'}

CATEGORIAS SEM ALTERAÇÃO:
${iguais.length > 0 ? iguais.join('\n') : '  Nenhuma.'}
`.trim()
}

export function buildFinancialContext(data: FinancialContextInput): string {
  const {
    movements,
    movimentosFuturos,
    saldo,
    receita,
    despesa,
    investimento,
    currentMonth,
    history,
  } = data

  return `
És o assistente financeiro da aplicação Barmittel.

REGRAS:
- Responde APENAS sobre finanças pessoais e dados desta aplicação.
- Usa APENAS os dados fornecidos neste contexto. NUNCA inventes, completes ou estimes valores, datas ou transações que não estejam no contexto. Se o dado não existir, diz que não tens essa informação.
- Responde ESTRITAMENTE ao que foi perguntado — nada mais, nada menos.
- Se perguntarem o que aumentou, mostra APENAS o que aumentou. Nunca incluas dados não solicitados.
- Vai direto ao dado. Sem introduções, sem explicações desnecessárias.
- Por defeito usa listas curtas (máximo 4 itens), MAS se o utilizador pedir explicitamente para listar (ex: "Liste as datas e valores"), lista TODOS os itens correspondentes, um por linha.
- Nunca repitas a pergunta do utilizador na resposta.
- Usa sempre € para valores. Responde em português europeu, de forma MUITO concisa — máximo 3 a 5 linhas.
- Qualquer outro tema não financeiro: responde "Posso ajudar apenas com informações financeiras da aplicação." — EXCEPTO saudações.
- Saudações ("Olá", "Bom dia", "Obrigado", "Até logo", etc.): responde de forma simpática, breve e natural. Podes mencionar que estás disponível para ajudar com finanças.

DATA DE HOJE: ${new Date().toLocaleDateString('pt-PT')}
MÊS VISUALIZADO: ${getMonthName(currentMonth)}

RESUMO DO MÊS ATUAL:
- Receitas:      ${formatEur(receita)}
- Despesas:      ${formatEur(despesa)}
- Investimentos: ${formatEur(investimento)}
- Saldo:         ${formatEur(saldo)}

MOVIMENTOS DO MÊS ATUAL (${movements.length}):
${buildMovementsList(movements)}

DESPESAS POR CATEGORIA (MÊS ATUAL):
${buildCategoryBreakdown(movements)}

MOVIMENTOS FUTUROS (${movimentosFuturos.length}):
${buildMovementsList(movimentosFuturos)}

HISTÓRICO DOS ÚLTIMOS 12 MESES:
${buildHistorySummary(history)}

DESPESAS POR CATEGORIA (ANO ATUAL):
${buildYearlyCategoryBreakdown(history)}

MOVIMENTOS DO ANO ATUAL (individuais, para listar valores):
${buildYearlyMovementsList(history)}

ÚLTIMOS GASTOS POR CATEGORIA (mais recentes primeiro — usar para perguntas de "últimos"):
${buildRecentByCategory(history)}

TENDÊNCIA POR CATEGORIA (histórico):
${buildCategoryTrend(history)}
`.trim()
}