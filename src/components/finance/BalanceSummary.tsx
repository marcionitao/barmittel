import { Skeleton } from '@rneui/themed'
import { Text, View } from 'react-native'
import numeral from 'numeral'
import FinancialStat from './FinancialStat'

type Props = {
  saldo: number
  receita: number
  despesa: number
  investimento: number
  isLoading: boolean
}

// Responsável por: saldo, receita, despesa, investimento
export default function BalanceSummary({
  saldo,
  receita,
  despesa,
  investimento,
  isLoading,
}: Props) {
  return (
    <>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: '#666',
            textTransform: 'uppercase',
          }}
        >
          Saldo Atual
        </Text>

        {isLoading ? (
          <Skeleton width={180} height={45} style={{ marginTop: 5 }} />
        ) : (
          <Text
            style={{
              fontSize: 36,
              fontWeight: 'bold',
              color: '#222',
            }}
          >
            {numeral(saldo).format('0,0.00')}€
          </Text>
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingVertical: 10,
        }}
      >
        <FinancialStat
          label='Receita'
          value={receita}
          color='green'
          icon={require('../../../assets/images/up.png')}
          isLoading={isLoading}
        />

        <View
          style={{
            width: 1,
            height: 30,
            backgroundColor: '#ddd',
          }}
        />

        <FinancialStat
          label='Despesa'
          value={despesa}
          color='red'
          icon={require('../../../assets/images/down.png')}
          isLoading={isLoading}
        />

        <View
          style={{
            width: 1,
            height: 30,
            backgroundColor: '#ddd',
          }}
        />

        <FinancialStat
          label='Investimento'
          value={investimento}
          color='orange'
          icon={require('../../../assets/images/stock.png')}
          isLoading={isLoading}
        />
      </View>
    </>
  )
}
