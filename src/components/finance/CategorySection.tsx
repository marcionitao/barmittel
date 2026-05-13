import { View } from 'react-native'
import { Card } from '@rneui/themed'

import useChartData from '../../hooks/useChartData'
import CategoryList from './charts/CategoryList'

export default function CategorySection() {
  const { categories } = useChartData()

  return (
    <Card
      containerStyle={{
        borderRadius: 18,
        borderWidth: 0,
        padding: 0,
        marginBottom: 20,
        elevation: 1,
      }}
    >
      <View style={{ padding: 18 }}>
        <CategoryList categories={categories} />
      </View>
    </Card>
  )
}