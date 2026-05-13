import { Skeleton } from '@rneui/themed'
import { Image, Text, View } from 'react-native'
import numeral from 'numeral'

type Props = {
  label: string
  value: number
  color: string
  icon: any
  isLoading: boolean
}

// Responsável por: bloco individual: label, valor, cor, ícone
export default function FinancialStat({ label, value, color, icon, isLoading }: Props) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 5,
        }}
      >
        <Image style={{ height: 14, width: 14, marginRight: 4 }} source={icon} />

        <Text style={{ fontSize: 11, color: '#666' }}>{label}</Text>
      </View>

      {isLoading ? (
        <Skeleton width={70} height={20} />
      ) : (
        <Text
          style={{
            fontSize: 16,
            fontWeight: '600',
            color,
          }}
        >
          {numeral(value).format('0,0.00')}€
        </Text>
      )}
    </View>
  )
}
