import { Text, View } from 'react-native'
// import { SafeAreaView } from 'react-native-safe-area-context'
import MovementList from '../components/MovimentList'
import NewFAB from '../components/NewFAB'

import { Card } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient'
import { useContext } from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import budgetContext from '../context/budgetContext'

import numeral from 'numeral'

const MyHome = () => {
  const { saldo, despesa, receita } = useContext(budgetContext)

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={['#F8B600', '#fff']}
      >
        <Card
          containerStyle={{
            // marginTop: '10%',
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
            height: '25%',
          }}
        >
          <Card.Title>Saldo Disponivel</Card.Title>
          <Text style={{ textAlign: 'center', fontSize: 45, fontWeight: 'bold' }}>
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
                padding: 5,
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
                <Icon name='arrow-up-circle' size={32} color='green' />
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
                <Icon name='arrow-down-circle' size={32} color='red' />
                <Text
                  style={{ textAlign: 'center', fontSize: 20, fontWeight: 'normal', color: 'red' }}
                >
                  {numeral(despesa).format('0,0.00')}€
                </Text>
              </View>
            </View>
          </View>
        </Card>

        <View style={{ height: '80%' }}>
          <MovementList />
        </View>
      </LinearGradient>
      <NewFAB />
    </View>
  )
}

export default MyHome
