import { Card } from '@rneui/themed'
import { useContext } from 'react'

import budgetContext from '../../context/budgetContext'

import BalanceSummary from './BalanceSummary'
import MonthNavigator from './MonthNavigator'

export default function BalanceMinimal() {
  const {
    saldo,
    despesa,
    receita,
    investimento,
    currentMonth,
    setCurrentMonth,
    handlePreviousMonth,
    handleNextMonth,
    handleCurrentMonth,
  } = useContext(budgetContext)

  const isLoading =
    saldo === 0 &&
    receita === 0 &&
    despesa === 0 &&
    investimento === 0

  return (
    <Card
      containerStyle={{
        borderRadius: 15,
        borderColor: '#006e61',
        padding: 15,
        elevation: 3,
      }}
    >
      <BalanceSummary
        saldo={saldo}
        receita={receita}
        despesa={despesa}
        investimento={investimento}
        isLoading={isLoading}
      />

      <MonthNavigator
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
        handlePreviousMonth={handlePreviousMonth}
        handleNextMonth={handleNextMonth}
        handleCurrentMonth={handleCurrentMonth}
      />
    </Card>
  )
}