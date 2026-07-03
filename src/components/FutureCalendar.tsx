import { Calendar } from 'react-native-calendars'
import { View, StyleSheet } from 'react-native'
import moment from 'moment'
import type { Budget } from '../@types/budget'
import { convertMovementsToCalendarData } from '../utils/calendarUtils'

interface FutureCalendarProps {
  movimentosFuturos: Budget[]
  onDayPress?: (dayMovements: Budget[], dateStr: string) => void
  selectedDate?: string | null
}

export default function FutureCalendar({ 
  movimentosFuturos, 
  onDayPress,
  selectedDate,
}: FutureCalendarProps) {
  const { markedDates } = convertMovementsToCalendarData(movimentosFuturos)

  const handleDayPress = (day: { dateString: string }) => {
    const dayMovements = movimentosFuturos.filter((mov) => {
      const date = mov.data instanceof Date ? mov.data : mov.data.toDate()
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      return dateStr === day.dateString
    })
    if (onDayPress) {
      onDayPress(dayMovements, day.dateString)
    }
  }

  const getMarkedDates = () => {
    const result: Record<string, any> = { ...markedDates }
    
    if (selectedDate) {
      result[selectedDate] = {
        ...result[selectedDate],
        selected: true,
        selectedColor: '#F8B600',
      }
    }
    
    return result
  }

  const theme = {
    backgroundColor: '#fff',
    calendarBackground: '#fff',
    textSectionTitleColor: '#006e61',
    selectedDayBackgroundColor: '#F8B600',
    selectedDayTextColor: '#000',
    todayTextColor: '#F8B600',
    dayTextColor: '#2c3e50',
    textDisabledColor: '#bdc3c7',
    dotColor: '#F8B600',
    selectedDotColor: '#fff',
    arrowColor: '#006e61',
    monthTextColor: '#006e61',
    textDayFontWeight: '600' as const,
    textMonthFontWeight: 'bold' as const,
    textDayHeaderFontWeight: '600' as const,
  }

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={getMarkedDates()}
        onDayPress={handleDayPress}
        theme={theme}
        markingType={'multi-dot'}
        showWeekNumbers={false}
        hideArrows={false}
        hideExtraDays={true}
        firstDay={1}
        minDate={moment().format('YYYY-MM-DD')}
        style={styles.calendar}
        enableSwipeMonths={true}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  calendar: {
    borderRadius: 16,
  },
})