import { useRouter } from 'expo-router'
import { Button, Icon, ListItem } from '@rneui/base'
import { Card } from '@rneui/themed'
import { useContext } from 'react'
import { Alert, FlatList, Text, View } from 'react-native'

import budgetContext from '../context/budgetContext'
import type { Budget } from '../@types/budget'

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

import moment from 'moment'
import numeral from 'numeral'
import colorGenerator from '../utils/colorGenerator'

export default function MovementFuture() {

  const router = useRouter()

  const { removeMovement, movimentosFuturos } = useContext(budgetContext)

  // 🔧 Filtra apenas os movimentos com data futura
  const hoje = new Date()
  // hoje.setHours(0, 0, 0, 0)

  const futurosMovimentos = movimentosFuturos.filter((m) => {
    let data

    if (m.data instanceof Date) {
      data = m.data
    } else if (typeof m.data?.toDate === 'function') {
      data = m.data.toDate()
    } else if (m.data?.seconds) {
      data = new Date(m.data.seconds * 1000)
    } else {
      return false
    }

    data.setHours(0, 0, 0, 0)
    return data > hoje
  })


  const confirmDelete = (documentId: string) => {
    return Alert.alert('Delete', `Are you sure you want to delete this Movement?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'OK',
        onPress: () => {
          removeMovement(documentId)
        },
      },
    ])
  }

  const getItems = ({ item }: { item: Budget }) => {
    // 🔧 converte Timestamp para Date se necessário(é usada para a data futura)
    const data =
      item.data instanceof Date
        ? item.data
        : (item.data as FirebaseFirestoreTypes.Timestamp).toDate()

    // 🔧 verifica se a data é futura
    const isFuture = data > new Date()

    // Convert data to handle serialization(resolve passagem de parametros)
    const serializedItem = {
      ...item,
      data: item.data instanceof Date
        ? item.data.toISOString()
        : item.data.toDate().toISOString(),
    }

    return (
      <ListItem.Swipeable
        key={item.id}
        animation={{ type: 'timing', duration: 500 }}
        leftWidth={80}
        rightWidth={90}
        bottomDivider
        onPress={() => router.push({ pathname: '/myForm', params: serializedItem })}
        rightContent={(reset) => (
          <Button
            containerStyle={{
              flex: 1,
              justifyContent: 'center',
              backgroundColor: 'red',
            }}
            type='clear'
            icon={{ name: 'delete-outline', color: 'white' }}
            onPress={() => {
              confirmDelete(item.id)
              reset()
            }}
          />
        )}
      >
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: colorGenerator(),
            opacity: isFuture ? 0.5 : 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isFuture ? (
            <Icon name="schedule" type="material" color="white" size={32} />
          ) : item.categoria && item.categoria.length > 0 ? (
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>{item.categoria[0]}</Text>
          ) : (
            <Icon name="help-outline" type="ionicon" color="white" size={32} />
          )}
        </View>
        <ListItem.Content>
          <ListItem.Title
            style={{
              color: isFuture ? 'gray' : 'black',
              fontWeight: 'normal',
              fontSize: 17,
              alignSelf: 'flex-start',
              opacity: isFuture ? 0.5 : 1, // 🔧 valor também acinzentado se futuro
            }}>
            {item.categoria}
          </ListItem.Title>
          <ListItem.Subtitle style={{
            color: isFuture ? 'gray' : 'black',
            fontWeight: 'normal',
            fontSize: 16,
            alignSelf: 'flex-start',
            opacity: isFuture ? 0.5 : 1, // 🔧 valor também acinzentado se futuro
          }}>
            {moment(item.data.toDate()).format('DD MMMM YYYY')}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Title
          style={{
            color: isFuture
              ? '#6c757d' // 🔧 Cor especial para valores futuros
              : item.acao === 'Despesa'
                ? 'red'
                : 'green',
            fontWeight: 'bold',
            fontSize: 17,
            alignSelf: 'flex-start',
            opacity: isFuture ? 0.5 : 1, // 🔧 valor também acinzentado se futuro
          }}
        >
          {numeral(item.movimentos).format('0,0.00')}€
        </ListItem.Title>
      </ListItem.Swipeable>
    )
  }
  return (
    <View >

      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Card.Title style={{ fontSize: 22, fontWeight: 'bold', color: '#006e61' }}>
          Itens Futuros: {futurosMovimentos.length}
        </Card.Title>
      </View>

      <Card containerStyle={{
        paddingHorizontal: 0,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        borderColor: '#006e61',
      }}>

        <FlatList data={futurosMovimentos} keyExtractor={(item) => item.id} renderItem={getItems} />
        {futurosMovimentos.length === 0 && (
          <Card>
            <Card.Title>Nenhum Movimento Futuro</Card.Title>
          </Card>
        )}
      </Card>
    </View>
  )
}
