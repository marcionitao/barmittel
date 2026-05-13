import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { useContext } from 'react'
import BudgetContext from '../../src/context/budgetContext'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'

import MonthNavigator from '../../src/components/finance/MonthNavigator'
import Grafico from '../../src/components/Grafico'
import CategorySection from '../../src/components/finance/CategorySection'

const MyCharts = () => {

  const {
    currentMonth,
    setCurrentMonth,
    handlePreviousMonth,
    handleNextMonth,
    handleCurrentMonth,
  } = useContext(BudgetContext)

  return (

    <LinearGradient colors={['#F8B600', '#fff']} style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* FIXO */}
        <View style={styles.header}>
          <MonthNavigator
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            handlePreviousMonth={handlePreviousMonth}
            handleNextMonth={handleNextMonth}
            handleCurrentMonth={handleCurrentMonth}
          />
        </View>

        {/* SCROLL */}
        <ScrollView contentContainerStyle={styles.content}>

          <Text style={styles.sectionTitle}>
            Resumo financeiro
          </Text>

          <Grafico />

          <Text style={styles.sectionTitle}>
            Categorias de despesas
          </Text>

          <CategorySection />

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingHorizontal: 10,
    paddingTop: 2,
    paddingBottom: 8,
  },

  content: {
    paddingBottom: 40,
    paddingTop: 0,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 0,
    paddingHorizontal: 16,
    letterSpacing: 0.5,
  },
})

export default MyCharts