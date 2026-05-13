// Objetivo
// Representar UMA barra financeira.

import { Text, View } from 'react-native'

import numeral from 'numeral'

type Props = {
  label: string
  value: number
  color: string
  maxValue: number
}

export default function FinancialBar({
  label,
  value,
  color,
  maxValue,
}: Props) {
  // evita divisão por zero
  const percentage =
    maxValue > 0
      ? Math.max((value / maxValue) * 100, 4)
      : 4

  return (
    <View
      style={{
        marginBottom: 26,
      }}
    >
      {/* LABEL + VALOR */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: '#222',
          }}
        >
          {label}
        </Text>

        <Text
          style={{
            fontSize: 15,
            fontWeight: '800',
            color: '#222',
          }}
        >
          {numeral(value).format('0,0.00')}€
        </Text>
      </View>

      {/* BACKGROUND BAR */}
      <View
        style={{
          width: '100%',
          height: 10,
          backgroundColor: '#f1f3f5',
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        {/* FILL */}
        <View
          style={{
            width: `${percentage}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: 999,
          }}
        />
      </View>
    </View>
  )
}