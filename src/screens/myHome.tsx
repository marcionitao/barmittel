import { Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MovementList from '../components/MovimentList'
import NewFAB from '../components/NewFAB'

import { Card } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient'
import { useContext } from 'react'

import budgetContext from '../context/budgetContext'

import numeral from 'numeral'

const MyHome = () => {
  const { saldo, despesa, receita } = useContext(budgetContext)

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
          <Text style={{ textAlign: 'center', fontSize: 35, fontWeight: 'bold' }}>
            {numeral(saldo).format('0,0.00')}€
          </Text>
          <Card.Divider />
          <View
            style={{
              width: '100%',
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
                  source={require('../../images/up.png')}
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
                  source={require('../../images/down.png')}
                />

                <Text
                  style={{ textAlign: 'right', fontSize: 20, fontWeight: 'normal', color: 'red' }}
                >
                  {numeral(despesa).format('0,0.00')}€
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={{ height: '71%' }}>
          <MovementList />
        </View>
      </LinearGradient>
      <NewFAB />
    </SafeAreaView>
  )
}

export default MyHome
