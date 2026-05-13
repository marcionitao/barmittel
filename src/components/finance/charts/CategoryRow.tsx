// Objetivo lista de categorias
// Representar:
// 🍔 Supermercado                  420€
// 12 transações

import { Text, View } from 'react-native'

import { Icon } from '@rneui/themed'
import numeral from 'numeral'

type Props = {
  nome: string
  valor: number
  transacoes: number
  icon: string
  color: string
}

export default function CategoryRow({
  nome,
  valor,
  transacoes,
  icon,
  color,
}: Props) {
  return (
    <View
      style={{
        paddingVertical: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f5f5f5',
      }}
    >
      {/* PRIMEIRA LINHA */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* ÍCONE + NOME */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            marginRight: 10,
          }}
        >
          <Icon
            name={icon}
            type="ionicon"
            size={18}
            color={color}
          />

          <Text
            numberOfLines={1}
            style={{
              marginLeft: 10,
              fontSize: 15,
              fontWeight: '500',
              color: '#222',
              flexShrink: 1,
              textTransform: 'capitalize'
            }}
          >
            {nome}
          </Text>
        </View>

        {/* VALOR */}
        <Text
          style={{
            fontSize: 15,
            fontWeight: '800',
            color: '#222',
          }}
        >
          {numeral(valor).format('0,0.00')}€
        </Text>
      </View>

      {/* SEGUNDA LINHA */}
      <Text
        style={{
          marginLeft: 28,
          marginTop: 4,
          fontSize: 11,
          color: '#8c8c8c',
        }}
      >
        {transacoes}{' '}
        {transacoes === 1
          ? 'transação'
          : 'transações'}
      </Text>
    </View>
  )
}