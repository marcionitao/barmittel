import { Card, Icon, Skeleton } from '@rneui/themed'
import { useContext, useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'

import budgetContext from '../context/budgetContext'

import moment from 'moment'
import numeral from 'numeral'
import MonthPicker from 'react-native-month-year-picker'

export default function BalanceMinimal() {
  const [show, setShow] = useState(false)

  const onChange = (event, newDate) => {
    setShow(false)
    if (event === 'neutralAction') {
      handleCurrentMonth()
    } else if (event === 'dateSetAction') {
      setCurrentMonth(newDate)
    }
  }

  const {
    saldo,
    despesa,
    receita,
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
  const isLoading = saldo === 0 && receita === 0 && despesa === 0


  return (
    <Card
      containerStyle={{
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        borderColor: '#006e61',
      }}
    >
      <View
        style={{
          width: '100%',
          marginTop: 2,
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <View style={{ width: '50%', padding: 1 }}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <Text style={{ fontSize: 15 }}>Saldo Atual</Text>
            {isLoading ? (
              <Skeleton width={100} height={30} style={{ marginLeft: 10 }} animation="wave" />
            ) : (
              <Text style={{ fontSize: 30 }}>
                {numeral(saldo).format('0,0.00')}€
              </Text>
            )}
          </View>
        </View>

        <View style={{ width: '50%', padding: 2 }}>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'flex-end',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {isLoading ? (
              // bloco receita skeleton
              <Skeleton width={120} height={30} animation="wave" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ height: 30, width: 30, resizeMode: 'contain', marginRight: 5 }}
                  source={require('../../assets/images/up.png')}
                />
                <Text style={{ fontSize: 25, color: 'green' }}>
                  {numeral(receita).format('0,0.00')}€
                </Text>
              </View>
            )}

            {isLoading ? (
              // bloco despesa skeleton
              <Skeleton width={120} height={30} animation="wave" />
            ) : (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image
                  style={{ height: 30, width: 30, resizeMode: 'contain', marginRight: 5 }}
                  source={require('../../assets/images/down.png')}
                />
                <Text style={{ fontSize: 25, color: 'red' }}>
                  {numeral(despesa).format('0,0.00')}€
                </Text>
              </View>
            )}
          </View>
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
            <Icon
              name='skip-previous'
              type='MaterialCommunityIcons'
              color='gray'
              size={32}
            />
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
              okButton="OK"
              cancelButton="Cancel"
              neutralButton="Hoje"
            />
          )}
        </View>
        <View style={{ width: '10%', padding: 2 }}>
          <TouchableOpacity
            onPress={() => {
              todayMes <= appDate ? avisoMes() : handleNextMonth()
            }}
          >
            <Icon
              name='skip-next'
              type='MaterialCommunityIcons'
              color='gray'
              size={32}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  )
}
