import React, { useContext, useMemo } from 'react'
import { Dimensions, Text, View } from 'react-native'
import PieChart from 'react-native-pie-chart'
import BudgetContext from '../context/budgetContext'
import numeral from 'numeral'

import { categorias as categoriasDefinidas } from '../utils/categoryList'
import { Card } from '@rneui/base'

const screenWidth = Dimensions.get('window').width

const Grafico = () => {
  const { movements, currentMonth } = useContext(BudgetContext)

  const { series, sliceColors, categorias } = useMemo(() => {

    const today = new Date()

    const dadosFiltrados = movements.filter((movement) => {
      const movementDate =
        movement.data instanceof Date
          ? movement.data
          : typeof movement.data.toDate === 'function'
            ? movement.data.toDate()
            : new Date(movement.data.seconds * 1000)

      // 🔧 verifica se a data é futura      
      const isFuture = movementDate > today
      return (
        movement.acao === 'Despesa' && !isFuture &&
        movementDate.getMonth() === currentMonth.getMonth() &&
        movementDate.getFullYear() === currentMonth.getFullYear()
      )
    })

    const somaPorCategoria: Record<string, number> = {}
    dadosFiltrados.forEach((item) => {
      const chave = item.categoria
      somaPorCategoria[chave] = (somaPorCategoria[chave] || 0) + item.movimentos
    })

    const categorias = Object.entries(somaPorCategoria)

    return {
      series: categorias.map(([_, valor]) => valor),
      sliceColors: categorias.map(([label]) => {
        const cat = categoriasDefinidas.find(c => c.value === label)
        return cat?.color || '#ccc'
      }),
      categorias: categorias.map(([label, valor]) => {
        const cat = categoriasDefinidas.find(c => c.value === label)
        return {
          nome: label,
          valor,
          cor: cat?.color || '#ccc',
        }
      }),
    }
  }, [movements, currentMonth])

  const chartWidth = screenWidth * 0.9

  return (
    <Card
      containerStyle={{
        paddingHorizontal: 0,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        borderColor: '#006e61',
      }}
    >
      <View style={{ alignItems: 'center', padding: 10 }}>
        {series.length === 0 ? (
          <Text>Sem dados para este mês</Text>
        ) : (
          <>
            {/* 🎯 Gráfico de Pizza mantido */}
            <PieChart
              widthAndHeight={chartWidth}
              series={series}
              sliceColor={sliceColors}
              coverRadius={0.25}
              coverFill={'#fff'}
            />

            {/* 🎯 Legenda ordenada e inline */}
            <View style={{ marginTop: 25, width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {categorias
                .sort((a, b) => b.valor - a.valor)
                .map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginRight: 12,
                      marginBottom: 3,
                    }}
                  >
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor: item.cor,
                        marginRight: 5,
                        borderRadius: 3,
                      }}
                    />
                    <Text style={{ fontSize: 12 }}>
                      {item.nome} : {numeral(item.valor).format('0,0.00')} €
                    </Text>
                  </View>
                ))}
            </View>
          </>
        )}
      </View>
    </Card>
  )
}

export default Grafico