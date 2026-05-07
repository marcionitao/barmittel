import { Card, Icon, Skeleton } from '@rneui/themed'
import { useContext, useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'

import budgetContext from '../context/budgetContext'

import moment from 'moment'
import numeral from 'numeral'
import MonthPicker from 'react-native-month-year-picker'

export default function BalanceMinimal() {
  const [show, setShow] = useState(false)

  const onChange = (event: string, newDate?: Date) => {
    setShow(false)
    if (event === 'neutralAction') {
      handleCurrentMonth()
    } else if (event === 'dateSetAction' && newDate) {
      setCurrentMonth(newDate)
    }
  }

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

  const today = new Date()
  const primeiroDiaDoMes = new Date(today.getFullYear(), today.getMonth(), 1)
  const todayMes = primeiroDiaDoMes.getTime()
  const appDate = currentMonth.getTime()

  const avisoMes = () => {
    return Alert.alert('Sorry!', "There aren't datas from next month!", [
      { text: 'Cancel', style: 'cancel' },
    ])
  }
  // 👇 se ainda não tem dados, exibe skeleton
  const isLoading = saldo === 0 && receita === 0 && despesa === 0 && investimento === 0

  return (
    <Card
      containerStyle={{
        borderRadius: 15,
        borderColor: '#006e61',
        padding: 15,
        elevation: 3,
      }}
    >
      {/* --- Seção Saldo Atual (Destaque) --- */}
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <Text style={{ fontSize: 14, color: '#666', textTransform: 'uppercase', letterSpacing: 1 }}>
          Saldo Atual
        </Text>
        {isLoading ? (
          <Skeleton width={180} height={45} style={{ marginTop: 5 }} animation='wave' />
        ) : (
          <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#222' }}>
            {numeral(saldo).format('0,0.00')}€
          </Text>
        )}
      </View>

      {/* --- Seção Detalhes (Receita | Despesa | Investimento) --- */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          borderTopWidth: 0.5,
          borderColor: '#eee',
        }}
      >
        {/* Receita */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <Image
              style={{ height: 14, width: 14, marginRight: 4 }}
              source={require('../../assets/images/up.png')}
            />
            <Text style={{ fontSize: 11, color: '#666' }}>Receita</Text>
          </View>
          {isLoading ? (
            <Skeleton width={70} height={20} />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '600', color: 'green' }}>
              {numeral(receita).format('0,0.00')}€
            </Text>
          )}
        </View>

        <View style={{ width: 1, height: 30, backgroundColor: '#ddd' }} />

        {/* Despesa */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <Image
              style={{ height: 14, width: 14, marginRight: 4 }}
              source={require('../../assets/images/down.png')}
            />
            <Text style={{ fontSize: 11, color: '#666' }}>Despesa</Text>
          </View>
          {isLoading ? (
            <Skeleton width={70} height={20} />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '600', color: 'red' }}>
              {numeral(despesa).format('0,0.00')}€
            </Text>
          )}
        </View>

        <View style={{ width: 1, height: 30, backgroundColor: '#ddd' }} />

        {/* Investimento */}
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
            <Image
              style={{ height: 14, width: 14, marginRight: 4 }}
              source={require('../../assets/images/stock.png')}
            />
            <Text style={{ fontSize: 11, color: '#666' }}>Investimento</Text>
          </View>
          {isLoading ? (
            <Skeleton width={70} height={20} />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '600', color: 'orange' }}>
              {numeral(investimento).format('0,0.00')}€
            </Text>
          )}
        </View>
      </View>

      {/* --- Navegação de meses --- */}
      <View
        style={{
          width: '100%',
          marginTop: 5,
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <View style={{ width: '10%', padding: 2 }}>
          <TouchableOpacity onPress={handlePreviousMonth}>
            <Icon name='skip-previous' type='MaterialCommunityIcons' color='gray' size={32} />
          </TouchableOpacity>
        </View>
        <View style={{ width: '80%', padding: 5 }}>
          <TouchableOpacity onPress={() => setShow(true)}>
            <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>
              {moment(currentMonth).format('MMMM YYYY')}
            </Text>
          </TouchableOpacity>
          {show && (
            <MonthPicker
              onChange={onChange}
              value={currentMonth}
              minimumDate={new Date(2019, 0, 1)}
              maximumDate={new Date()}
              locale='en'
              okButton='OK'
              cancelButton='Cancel'
              neutralButton='Hoje'
            />
          )}
        </View>
        <View style={{ width: '10%', padding: 2 }}>
          <TouchableOpacity
            onPress={() => {
              todayMes <= appDate ? avisoMes() : handleNextMonth()
            }}
          >
            <Icon name='skip-next' type='MaterialCommunityIcons' color='gray' size={32} />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  )
}
