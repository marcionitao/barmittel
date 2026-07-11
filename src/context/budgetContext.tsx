import firestore, { firebase } from '@react-native-firebase/firestore'
import { createContext, useEffect, useState, useCallback } from 'react'
import { Budget, BudgetContextType, SearchFilters } from '../@types/budget'
import { Keyboard } from 'react-native'

// create context
export const BudgetContext = createContext<BudgetContextType>({
  movements: [],
  saldo: 0,
  despesa: 0,
  receita: 0,
  investimento: 0,
  keyboardVisible: false,
  currentMonth: new Date(),
  addMovement: () => { },
  removeMovement: () => { },
  updateMovement: () => { },
  setCurrentMonth: () => { },
  handlePreviousMonth: () => { },
  handleNextMonth: () => { },
  handleCurrentMonth: () => { },
  movimentosFuturos: [],
  // Fase 1 - Busca
  searchResults: [],
  isSearching: false,
  searchQuery: '',
  searchFilters: {},
  searchResultsCount: 0,
  searchDuration: 0,
  searchError: null,
  searchMovements: async () => { },
  clearSearch: () => { },
  setSearchFilters: () => { },
})

const getDateFromPeriod = (period?: SearchFilters['period']): Date | null => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (!period || period === 'all') return null

  const daysMap: Record<string, number> = {
    '1month': 30,
    '3months': 90,
    '6months': 180,
    '1year': 365,
    '2years': 730,
  }

  const days = daysMap[period] || 30
  const date = new Date(today)
  date.setDate(date.getDate() - days)
  return date
}

// create provider
export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {
  // state
  const [movements, setMovements] = useState<Budget[]>([])
  const [saldo, setSaldo] = useState(0)
  const [receita, setReceita] = useState(0)
  const [despesa, setDespesa] = useState(0)
  const [investimento, setInvestimento] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  const [movimentosFuturos, setMovimentosFuturos] = useState<Budget[]>([])

  // Fase 1 - Estados de busca
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilters, setSearchFiltersState] = useState<SearchFilters>({})
  const [searchResults, setSearchResults] = useState<Budget[]>([])
  const [searchResultsCount, setSearchResultsCount] = useState(0)
  const [searchDuration, setSearchDuration] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentMonth(prevMonth)
  }

  const handleCurrentMonth = () => {
    const currMonth = new Date()
    currMonth.setMonth(currMonth.getMonth())
    setCurrentMonth(currMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth)
  }

  // trata de ajustar o teclado
  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true)
    })
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
    })

    return () => {
      showListener.remove()
      hideListener.remove()
    }
  }, [])

  // trata da lista iniciaal de movimentos
  useEffect(() => {
    const firstDayCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const firstDayNextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)

    const today = new Date()
    // today.setHours(0, 0, 0, 0) // garante comparação exata  

    const unsubscribe = firestore()
      .collection('orcamento')
      .orderBy('data', 'desc')
      .where('data', '>=', firstDayCurrentMonth)
      .where('data', '<', firstDayNextMonth)
      .onSnapshot((querySnapshot) => {
        let despesa = 0
        let receita = 0
        let investimento = 0

        const allMovements = querySnapshot.docs.map((doc) => {
          const data = doc.data()

          return {
            id: doc.id,
            ...data,
          } as Budget
        })

        // calcula saldo apenas com movimentos cuja data <= hoje
        allMovements.forEach((movement) => {
          const movementDate = movement.data.toDate()
          if (movementDate <= today) {
            if (movement.acao === 'Despesa') {
              despesa += movement.movimentos
            } else if (movement.acao === 'Receita') {
              receita += movement.movimentos
            } else if (movement.acao === 'Investimento') {
              investimento += movement.movimentos
            }
          }
        })

        const saldo = receita - despesa - investimento

        // filtra apenas movimentos até hoje (não futuros) para o estado movements
        const movementsUpToToday = allMovements.filter((movement) => {
          const movementDate = movement.data.toDate()
          return movementDate <= today
        })

        setMovements(movementsUpToToday)
        setReceita(receita)
        setDespesa(despesa)
        setInvestimento(investimento)
        setSaldo(saldo)
      }, (error) => {
        console.log('Erro no listener:', error)
      })

    return () => unsubscribe()
  }, [currentMonth])

  // lida com movimentos futuros
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const unsubscribe = firestore()
      .collection('orcamento')
      .orderBy('data', 'asc')
      .where('data', '>', today) // 🔮 só datas futuras
      .onSnapshot((querySnapshot) => {
        const futuros = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
          } as Budget
        })

        setMovimentosFuturos(futuros) // ⬅️ novo state!
      })

    return () => unsubscribe()
  }, [])

  // =========================================
  // FASE 1: Função de Busca
  // =========================================
  const searchMovements = useCallback(async (
    query: string,
    filters?: SearchFilters
  ) => {
    const startTime = performance.now()
    setIsSearching(true)
    setSearchError(null)

    try {
      const effectiveFilters = filters || searchFilters

      // Construir query base
      let firestoreQuery = firestore().collection('orcamento')

      // Aplicar filtro de período
      const startDate = getDateFromPeriod(effectiveFilters.period)
      if (startDate) {
        firestoreQuery = firestoreQuery.where('data', '>=', startDate)
      }

      // Aplicar filtro de tipo (ação)
      if (effectiveFilters.type) {
        firestoreQuery = firestoreQuery.where('acao', '==', effectiveFilters.type)
      }

      // Ordenar por data descendente
      firestoreQuery = firestoreQuery.orderBy('data', 'desc')

      // Executar query
      const querySnapshot = await firestoreQuery.limit(500).get()

      let results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Budget))

      // Filtrar por texto (categoria e descrição) - client-side
      if (query && query.trim()) {
        const normalizedQuery = query.toLowerCase().trim()
        results = results.filter((movement) => {
          const categoria = (movement.categoria || '').toLowerCase()
          const descricao = (movement.descricao || '').toLowerCase()
          return (
            categoria.includes(normalizedQuery) ||
            descricao.includes(normalizedQuery)
          )
        })
      }

      const endTime = performance.now()

      setSearchResults(results)
      setSearchResultsCount(results.length)
      setSearchDuration(Math.round(endTime - startTime))
      setSearchQuery(query)
      setSearchFiltersState(effectiveFilters)

    } catch (error: any) {
      console.error('Search error:', error)
      setSearchError(error.message || 'Erro ao realizar pesquisa')
      setSearchResults([])
      setSearchResultsCount(0)
    } finally {
      setIsSearching(false)
    }
  }, [searchFilters])

  const clearSearch = useCallback(() => {
    setSearchQuery('')
    setSearchResults([])
    setSearchResultsCount(0)
    setSearchDuration(0)
    setSearchError(null)
    setSearchFiltersState({})
  }, [])

  const setSearchFilters = useCallback((filters: SearchFilters) => {
    setSearchFiltersState(filters)
  }, [])

  // =========================================
  // CRUD Operations
  // =========================================
  const addMovement = async (movement: Budget) => {
    const timestamp = firebase.firestore.Timestamp.now()
    const dateCondition = movement.data === undefined ? timestamp : movement.data

    try {
      await firebase
        .firestore()
        .collection('orcamento')
        .add({
          acao: movement.acao,
          categoria: movement.categoria,
          descricao: movement.descricao,
          movimentos: movement.movimentos,
          data: dateCondition,
        })
        .then(() => console.log('Dados salvos com sucesso!'))
        .catch((error) => console.error(error))

    } catch (error) {
      console.error(error)
    }
    // atualiza o estado local
    handleCurrentMonth()

  }
  // remove movement
  const removeMovement = (documentId: string) => {
    firestore()
      .collection('orcamento')
      .doc(documentId)
      .delete()
      .then(() => {
        setMovements(movements.filter((movement) => movement.id !== documentId))
      })
  }
  // update movement
  const updateMovement = (documentId: string, formData: Budget) => {
    firestore()
      .collection('orcamento')
      .doc(documentId)
      .update(formData)
      .then(() => {
        console.log('Document updated successfully')
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
      })

    setMovements(
      movements.map((movement) => {
        if (movement.id === documentId) {
          return {
            ...movement,
            ...formData,
          }
        }
        return movement
      }),
    )
  }

  return (
    <BudgetContext.Provider
      value={{
        movements,
        saldo,
        receita,
        despesa,
        investimento,
        keyboardVisible,
        currentMonth,
        setCurrentMonth,
        addMovement,
        removeMovement,
        updateMovement,
        handlePreviousMonth,
        handleNextMonth,
        handleCurrentMonth,
        movimentosFuturos,
        // Fase 1 - Busca
        searchResults,
        isSearching,
        searchQuery,
        searchFilters,
        searchResultsCount,
        searchDuration,
        searchError,
        searchMovements,
        clearSearch,
        setSearchFilters,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}
export default BudgetContext