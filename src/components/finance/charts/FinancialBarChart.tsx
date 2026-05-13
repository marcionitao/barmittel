// Objetivo:
// Compor as 4 barras visuais para: Receita, Despesa, Saldo, Investimento

import { View } from 'react-native'

import FinancialBar from './FinancialBar'

type ChartItem = {
  label: string
  value: number
  color: string
}

type Props = {
  chartData: ChartItem[]
  maxValue: number
}

export default function FinancialBarChart({
  chartData,
  maxValue,
}: Props) {
  return (
    <View
      style={{
        marginTop: 10,
        marginBottom: 10,
      }}
    >
      {chartData.map((item) => (
        <FinancialBar
          key={item.label}
          label={item.label}
          value={item.value}
          color={item.color}
          maxValue={maxValue}
        />
      ))}
    </View>
  )
}