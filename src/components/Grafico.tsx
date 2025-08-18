import React, { useContext, useMemo } from 'react'
import { Dimensions, Text, View, FlatList } from 'react-native'
import PieChart from 'react-native-pie-chart'
import BudgetContext from '../context/budgetContext'
import numeral from 'numeral'
import { categorias as categoriasDefinidas } from '../utils/categoryList'
import { Card, Icon } from '@rneui/base'

const screenWidth = Dimensions.get('window').width

const Grafico = () => {
  const { movements, currentMonth } = useContext(BudgetContext)

  const { series, sliceColors, categoriasOrdenadas } = useMemo(() => {
    const dadosFiltrados = movements.filter((movement) => {
      const movementDate =
        movement.data instanceof Date
          ? movement.data
          : typeof movement.data.toDate === 'function'
            ? movement.data.toDate()
            : new Date(movement.data.seconds * 1000)

      // apenas despesas do mês corrente e que não sejam futuras
      return (
        movement.acao === 'Despesa' &&
        movementDate.getMonth() === currentMonth.getMonth() &&
        movementDate.getFullYear() === currentMonth.getFullYear() &&
        movementDate <= new Date()
      )
    })

    const somaPorCategoria: Record<string, number> = {}
    const contagemPorCategoria: Record<string, number> = {}

    dadosFiltrados.forEach((item) => {
      const chave = item.categoria
      somaPorCategoria[chave] = (somaPorCategoria[chave] || 0) + item.movimentos
      contagemPorCategoria[chave] = (contagemPorCategoria[chave] || 0) + 1
    })

    const categoriasOrdenadas = Object.entries(somaPorCategoria)
      .map(([label, valor]) => {
        const cat = categoriasDefinidas.find(c => c.value === label)
        return {
          nome: label,
          valor,
          cor: cat?.color || '#ccc',
          icon: cat?.icon || 'help-outline',
          transacoes: contagemPorCategoria[label] || 0,
        }
      })
      .sort((a, b) => b.valor - a.valor)

    return {
      series: categoriasOrdenadas.map(c => c.valor),
      sliceColors: categoriasOrdenadas.map(c => c.cor),
      categoriasOrdenadas,
    }
  }, [movements, currentMonth])

  const chartWidth = screenWidth * 0.5

  return (
    <Card
      containerStyle={{
        paddingHorizontal: 0,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        borderColor: '#006e61',
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: 'bold', marginLeft: 10 }}>Sumário Despesas</Text>
      <View style={{ alignItems: 'center', padding: 5 }}>
        {series.length === 0 ? (
          <Text>Sem dados para este mês</Text>
        ) : (
          <>
            {/* Gráfico */}
            <PieChart
              widthAndHeight={chartWidth}
              series={series}
              sliceColor={sliceColors}
              coverRadius={0.45}
              coverFill={'#fff'}
            />

            {/* Lista inline (sem scroll) */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 15 }}>
              {categoriasOrdenadas.map((item, index) => (
                <View
                  key={index}
                  style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 8 }}
                >
                  {/* Quadradinho com a cor da categoria */}
                  <View
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: item.cor,
                      borderRadius: 3,
                      marginRight: 6,
                    }}
                  />
                  <Text style={{ fontSize: 10 }}>
                    {item.nome}
                  </Text>
                </View>
              ))}
            </View>


            {/* Scroll List com transações */}
            <FlatList
              data={categoriasOrdenadas}
              keyExtractor={(item, index) => index.toString()}
              style={{ marginTop: 15, maxHeight: 250, width: '100%' }}
              renderItem={({ item }) => (
                <View style={{
                  flexDirection: 'column',
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderBottomWidth: 0.5,
                  borderColor: '#ddd'
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name={item.icon} type="ionicon" size={20} color={item.cor} />
                    <Text style={{ marginLeft: 10, fontSize: 14, flex: 1 }}>
                      {item.nome}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '600' }}>
                      {numeral(item.valor).format('0,0.00')}€
                    </Text>
                  </View>
                  <Text style={{ marginLeft: 30, fontSize: 12, color: '#555' }}>
                    {item.transacoes} {item.transacoes === 1 ? 'transação' : 'transações'}
                  </Text>
                </View>
              )}
            />
          </>
        )}
      </View>
    </Card>
  )
}

export default Grafico
