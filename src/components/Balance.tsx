import { Card, Icon } from '@rneui/themed'
import { useContext, useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'

import budgetContext from '../context/budgetContext'

import moment from 'moment'
import numeral from 'numeral'
import MonthPicker from 'react-native-month-year-picker'

export default function Balance() {
  // inicio: bloco data escolher mes/ano
  const [show, setShow] = useState(false);

  const onChange = (event, newDate) => {
    setShow(false);
    console.log(event)
    if (event === 'neutralAction') {
      console.log('Novo mês:', newDate.getMonth() + 1, 'Ano:', newDate.getFullYear());
      handleCurrentMonth(); // volta para o mês atual do sistema
    } else if (event === 'dateSetAction') {
      setCurrentMonth(newDate);
      console.log('Novo mês:', newDate.getMonth() + 1, 'Ano:', newDate.getFullYear());
    }
  };

  // fim: bloco data escolher mes/ano

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
  const primeiroDiaDoMes = new Date(today.getFullYear(), today.getMonth(), 1) // cria uma nova instância de Date com o primeiro dia do mês atual
  const todayMes = primeiroDiaDoMes.getTime() // obtém os milissegundos correspondentes ao primeiro dia do mês atual

  // obtém os milissegundos correspondentes ao mes alterado pela app
  const appDate = currentMonth.getTime()

  const avisoMes = () => {
    return Alert.alert('Sorry!', "There aren't datas from next month!", [
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  return (
    <Card
      containerStyle={{
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        borderColor: '#006e61',
      }}
    >
      <Card.Title>Saldo Disponivel</Card.Title>
      <Text style={{ textAlign: 'center', fontSize: 30, fontWeight: 'bold' }}>
        {numeral(saldo).format('0,0.00')}€
      </Text>

      <View
        style={{
          width: '100%',
          marginTop: 5,
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <View
          style={{
            width: '50%',
            padding: 2,
          }}
        >
          <Card.Title>Receitas</Card.Title>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <Image
              style={{
                height: 32,
                width: 32,
                marginRight: 5,
                resizeMode: 'contain',
              }}
              source={require('../../assets/images/up.png')}
            />

            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                fontWeight: 'normal',
                color: 'green',
              }}
            >
              {numeral(receita).format('0,0.00')}€
            </Text>
          </View>
        </View>
        <View
          style={{
            width: '50%',
            padding: 5,
          }}
        >
          <Card.Title>Despesas</Card.Title>
          <View
            style={{
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            <Image
              style={{
                height: 32,
                width: 32,
                resizeMode: 'contain',
                marginRight: 5,
              }}
              source={require('../../assets/images/down.png')}
            />

            <Text style={{ textAlign: 'right', fontSize: 20, fontWeight: 'normal', color: 'red' }}>
              {numeral(despesa).format('0,0.00')}€
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          width: '100%',
          marginTop: 5,
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        <View
          style={{
            width: '10%',
            padding: 2,
            alignContent: 'flex-start',
          }}
        >
          <TouchableOpacity onPress={() => handlePreviousMonth()}>
            <Icon
              name='skip-previous'
              type='MaterialCommunityIcons'
              color='gray'
              size={32}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '80%',
            padding: 5,
            alignContent: 'center',
          }}
        >
          <TouchableOpacity onPress={() => setShow(true)}>
            <Text style={{ textAlign: 'center', fontSize: 17, fontWeight: 'bold' }}>
              {moment(currentMonth).format('MMMM/YYYY')}
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
        <View
          style={{
            width: '10%',
            padding: 2,
            alignContent: 'flex-end',
          }}
        >
          <TouchableOpacity onPress={() => {
            todayMes <= appDate ? avisoMes() : handleNextMonth()
          }}>
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
