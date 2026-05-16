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

function buildCategoryTrend(history: MonthSnapshot[]): string {
  if (history.length < 2) return 'Histórico insuficiente para tendências.'

  const allCategories = new Set<string>()
  history.forEach((snap) =>
    snap.movements
      .filter((m) => m.acao === 'Despesa')
      .forEach((m) => allCategories.add(m.categoria))
  )

  const lines: string[] = []

  allCategories.forEach((cat) => {
    const vals = history.map((snap) => {
      const total = snap.movements
        .filter((m) => m.acao === 'Despesa' && m.categoria === cat)
        .reduce((acc, m) => acc + m.movimentos, 0)
      return { label: snap.label, total }
    })
    const nonZero = vals.filter((v) => v.total > 0)
    if (nonZero.length > 0) {
      lines.push(
        `  ${cat}: ` + nonZero.map((v) => `${v.label} ${formatEur(v.total)}`).join(' → ')
      )
    }
  })

  return lines.join('\n') || 'Sem dados de tendência.'
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
- Qualquer outro tema: responde "Posso ajudar apenas com informações financeiras da aplicação."
- Usa sempre € para valores. Responde em português europeu, de forma clara e concisa.
- Nunca inventes dados. Usa APENAS os dados abaixo.
- Podes comparar meses, identificar tendências e responder perguntas históricas com os dados do HISTÓRICO.
- Responde de forma MUITO concisa e direta — máximo 3 a 5 linhas.
- Vai direto ao dado. Sem introduções, sem explicações desnecessárias.
- Usa listas curtas quando listares valores (máximo 4 itens).
- Nunca repitas a pergunta do utilizador na resposta.
- Nunca uses frases como "Claro!", "Com base nos dados..." ou "Certamente!".

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

HISTÓRICO DOS ÚLTIMOS 6 MESES:
${buildHistorySummary(history)}

TENDÊNCIA POR CATEGORIA (histórico):
${buildCategoryTrend(history)}
`.trim()
}