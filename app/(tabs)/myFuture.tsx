import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useState, useContext } from 'react'
import MovementFuture from '../../src/components/MovementFuture'
import FutureCalendar from '../../src/components/FutureCalendar'
import budgetContext from '../../src/context/budgetContext'
import moment from 'moment'

const MyFuture = () => {
  const { movimentosFuturos } = useContext(budgetContext)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const handleDayPress = (dayMovements: any[], dateStr: string) => {
    if (selectedDate === dateStr) {
      setSelectedDate(null)
    } else {
      setSelectedDate(dateStr)
    }
  }

  const clearFilter = () => {
    setSelectedDate(null)
  }

  const filteredCount = selectedDate
    ? movimentosFuturos.filter((m) => {
        const d = m.data instanceof Date ? m.data : m.data.toDate()
        return moment(d).format('YYYY-MM-DD') === selectedDate
      }).length
    : movimentosFuturos.length

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <LinearGradient colors={['#F8B600', '#fff']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {selectedDate 
              ? `Movimentos de ${moment(selectedDate).format('DD MMM')}`
              : 'Movimentos Futuros'
            }
          </Text>
          <Text style={styles.subtitle}>
            {filteredCount} {filteredCount === 1 ? 'item' : 'itens'}
            {selectedDate && ' encontrados'}
          </Text>
        </View>

        <View style={styles.calendarContainer}>
          <FutureCalendar
            movimentosFuturos={movimentosFuturos}
            onDayPress={handleDayPress}
            selectedDate={selectedDate}
          />
        </View>

        {selectedDate && (
          <TouchableOpacity style={styles.clearButton} onPress={clearFilter}>
            <Text style={styles.clearButtonText}>✕ Limpar filtro</Text>
          </TouchableOpacity>
        )}

        <View style={styles.listContainer}>
          <MovementFuture 
            selectedDate={selectedDate ? new Date(selectedDate + 'T00:00:00') : null} 
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#006e61',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    height: 320,
  },
  clearButton: {
    alignSelf: 'center',
    backgroundColor: '#006e61',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  listContainer: {
    flex: 1,
    marginTop: 12,
    marginBottom: 10,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
})

export default MyFuture