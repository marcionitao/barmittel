import moment from 'moment'
import type { Budget } from '../@types/budget'

export interface CalendarMarking {
  marked: boolean
  dots: CalendarDot[]
  selected?: boolean
  selectedDotColor?: string
}

export interface CalendarDot {
  key: string
  color: string
  selectedDotColor?: string
}

export interface DayMovements {
  date: string // YYYY-MM-DD
  movements: Budget[]
}

export interface CalendarData {
  markedDates: Record<string, CalendarMarking>
  dayMovements: DayMovements[]
}

/**
 * Converte movimentos futuros para formato compatível com react-native-calendars
 */
export const convertMovementsToCalendarData = (movements: Budget[]): CalendarData => {
  const markedDates: Record<string, CalendarMarking> = {}
  const dayMovementsMap: Record<string, Budget[]> = {}

  movements.forEach((movement) => {
    const date = movement.data instanceof Date 
      ? movement.data 
      : movement.data.toDate()
    
    const dateStr = moment(date).format('YYYY-MM-DD')
    
    // Agrupar movimentos por dia
    if (!dayMovementsMap[dateStr]) {
      dayMovementsMap[dateStr] = []
    }
    dayMovementsMap[dateStr].push(movement)

    // Cor por tipo de ação
    const color = movement.acao === 'Despesa' ? '#e74c3c' : 
                  movement.acao === 'Receita' ? '#27ae60' : '#3498db'

    if (!markedDates[dateStr]) {
      markedDates[dateStr] = {
        marked: true,
        dots: [],
        selectedDotColor: color
      }
    }
    
    markedDates[dateStr].dots.push({
      key: movement.id,
      color,
      selectedDotColor: color
    })
  })

  const dayMovements: DayMovements[] = Object.entries(dayMovementsMap).map(([date, movements]) => ({
    date,
    movements
  }))

  return { markedDates, dayMovements }
}

/**
 * Filtra movimentos por data específica
 */
export const filterMovementsByDate = (movements: Budget[], targetDate: string): Budget[] => {
  return movements.filter((movement) => {
    const date = movement.data instanceof Date 
      ? movement.data 
      : movement.data.toDate()
    return moment(date).format('YYYY-MM-DD') === targetDate
  })
}

/**
 * Obtém cor para tipo de ação
 */
export const getActionColor = (acao: string): string => {
  switch (acao) {
    case 'Despesa': return '#e74c3c'
    case 'Receita': return '#27ae60'
    case 'Investimento': return '#3498db'
    default: return '#95a5a6'
  }
}

/**
 * Formata data para exibição
 */
export const formatDateForDisplay = (date: Date | FirebaseFirestoreTypes.Timestamp): string => {
  const d = date instanceof Date ? date : date.toDate()
  return moment(d).format('DD MMMM YYYY')
}