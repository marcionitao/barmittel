import { useNavigation } from '@react-navigation/native'
import { Avatar, Button, ListItem } from '@rneui/base'
import { Card } from '@rneui/themed'
import { useContext } from 'react'
import { Alert, FlatList, View } from 'react-native'

import budgetContext from '../context/budgetContext'

import moment from 'moment'
import numeral from 'numeral'
import colorGenerator from '../utils/colorGenerator'

interface MovementFutureProps {
  navigation?: any
}

export default function MovementFuture({ navigation }: MovementFutureProps) {
  navigation = useNavigation()

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

  const getItems = ({ item }) => {
    // 🔧 converte Timestamp para Date se necessário
    const data = item.data.toDate()

    // 🔧 verifica se a data é futura
    const isFuture = data > new Date()

    return (
      <ListItem.Swipeable
        key={item.id}
        animation={{ type: 'timing', duration: 500 }}
        leftWidth={80}
        rightWidth={90}
        bottomDivider
        onPress={() => navigation.navigate('myForm', item)}
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
        <Avatar
          rounded
          containerStyle={{
            backgroundColor: colorGenerator(),
            opacity: isFuture ? 0.5 : 1, // 🔧 efeito visual para futuros
          }}
          size={48}
          // 🔧 Se for futuro, mostra ícone de relógio. Caso contrário, mostra a primeira letra.
          {...(isFuture
            ? {
              icon: {
                name: 'schedule', // ícone de relógio
                type: 'material', // biblioteca de ícones
                color: 'white',
                size: 48,
              },
            }
            : {
              title: item.categoria[0],
              titleStyle: { color: 'white', fontSize: 20, fontWeight: 'bold' },
            })}
        />
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

      {/* {futurosMovimentos.length === 0 && (
        <Card>
          <Card.Title>Nenhum Movimento Futuro</Card.Title>
        </Card>
      )} */}
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
