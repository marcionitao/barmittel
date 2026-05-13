import { Text, View } from 'react-native'
import { Card } from '@rneui/themed'

import useChartData from '../hooks/useChartData'
import FinancialBarChart from './finance/charts/FinancialBarChart'

export default function Grafico() {
  const { chartData, maxValue } = useChartData()

  const hasData = chartData.some((i) => i.value > 0)

  return (
    <Card
      containerStyle={{
        borderRadius: 18,
        borderWidth: 0,
        padding: 18,
        marginBottom: 10,
        elevation: 1,
      }}
    >
      {!hasData ? (
        <View style={{ paddingVertical: 30, alignItems: 'center' }}>
          <Text style={{ fontSize: 15, color: '#777' }}>
            Sem dados para este mês
          </Text>
        </View>
      ) : (
        <FinancialBarChart
          chartData={chartData}
          maxValue={maxValue}
        />
      )}
    </Card>
  )
}