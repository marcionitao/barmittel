export type Budget = {
  id: string
  acao: string
  categoria: string
  descricao: string
  movimentos: number
  // data: Date | firebase.firestore.Timestamp
  data: Date | FirebaseFirestoreTypes.Timestamp
}

export type SearchTypeFilter = 'Despesa' | 'Receita' | 'Investimento'

export type SearchPeriodFilter =
  | '1month'
  | '3months'
  | '6months'
  | '1year'
  | '2years'
  | 'all'

export interface SearchFilters {
  type?: SearchTypeFilter
  period?: SearchPeriodFilter
}

export interface SearchResult {
  movements: Budget[]
  totalCount: number
  searchDuration: number
}

export type BudgetContextType = {
  movements: Budget[]
  saldo: number
  receita: number
  despesa: number
  investimento: number
  currentMonth: Date
  keyboardVisible: boolean
  addMovement: (newMovement: Budget) => void
  removeMovement: (movementId: string) => void
  updateMovement: (movementId: string, formData: Budget) => void
  setCurrentMonth: (date: Date) => void
  handlePreviousMonth: () => void
  handleNextMonth: () => void
  handleCurrentMonth: () => void
  movimentosFuturos: Budget[]
  // Novos campos para a Fase 1 - Sistema de Busca
  searchResults: Budget[]
  isSearching: boolean
  searchQuery: string
  searchFilters: SearchFilters
  searchResultsCount: number
  searchDuration: number
  searchError: string | null
  searchMovements: (
    query: string,
    filters?: SearchFilters,
  ) => Promise<void>
  clearSearch: () => void
  setSearchFilters: (filters: SearchFilters) => void
}