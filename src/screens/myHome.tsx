import { Alert, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MovementList from '../components/MovimentList'
import NewFAB from '../components/NewFAB'

import { Card, Icon } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient'
import { useContext } from 'react'

import budgetContext from '../context/budgetContext'

import moment from 'moment'
import numeral from 'numeral'

const MyHome = () => {
  const { saldo, despesa, receita, currentMonth, handlePreviousMonth, handleNextMonth } =
    useContext(budgetContext)

  const today = new Date(Date.now())
  const todayMes = today.getMonth() + 1

  const mesApp = moment(currentMonth).format('M')

  const avisoMes = () => {
    return Alert.alert('Sorry!', "There aren't datas from next month!", [
      { text: 'Cancel', style: 'cancel' },
    ])
  }

  return (
    <SafeAreaView>
      <LinearGradient
        // Background Linear Gradient
        colors={['#F8B600', '#fff']}
      >
        <Card
          containerStyle={{
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
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

                <Text
                  style={{ textAlign: 'right', fontSize: 20, fontWeight: 'normal', color: 'red' }}
                >
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
                //alignItems: 'flex-start',
                alignContent: 'flex-start',
              }}
            >
              <Icon
                name='skip-previous'
                type='MaterialCommunityIcons'
                color='gray'
                size={32}
                onPress={() => handlePreviousMonth()}
              />
            </View>
            <View
              style={{
                width: '80%',
                padding: 5,
                alignContent: 'center',
              }}
            >
              <Text style={{ textAlign: 'center', fontSize: 15, fontWeight: 'bold' }}>
                {moment(currentMonth).format('MMMM/YYYY')}
              </Text>
            </View>
            <View
              style={{
                width: '10%',
                padding: 2,
                alignContent: 'flex-end',
              }}
            >
              <Icon
                name='skip-next'
                type='MaterialCommunityIcons'
                color='gray'
                size={32}
                onPress={() => {
                  todayMes <= parseInt(mesApp) ? avisoMes() : handleNextMonth()
                }}
              />
            </View>
          </View>
        </Card>

        <View style={{ height: '68%' }}>
          <MovementList />
        </View>
      </LinearGradient>
      <NewFAB />
    </SafeAreaView>
  )
}

export default MyHome
