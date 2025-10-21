import { useRouter } from 'expo-router'
import { Button, Icon, ListItem } from '@rneui/base'
import { Card } from '@rneui/themed'
import { useContext } from 'react'
import { Alert, FlatList, View } from 'react-native'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

import budgetContext from '../context/budgetContext'
import type { Budget } from '../@types/budget'

import moment from 'moment'
import numeral from 'numeral'
import { categorias } from '../utils/categoryList'
import colorGenerator from '../utils/colorGenerator'

export default function MovementList() {
  const router = useRouter()

  const { movements, removeMovement } = useContext(budgetContext)

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

    // 🔧 encontra a categoria correspondente no array de categorias
    const categoriaInfo = categorias.find((cat) => cat.value === item.categoria)

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
            backgroundColor: !isFuture && categoriaInfo ? categoriaInfo.color : colorGenerator(),
            opacity: isFuture ? 0.5 : 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {isFuture ? (
            <Icon name="schedule" type="material" color="white" size={32} />
          ) : (
            <Icon
              name={categoriaInfo ? categoriaInfo.icon : 'help-outline'}
              type="ionicon"
              color="white"
              size={32}
            />
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
          <ListItem.Subtitle
            style={{
              color: isFuture ? 'gray' : 'black',
              fontWeight: 'normal',
              fontSize: 16,
              alignSelf: 'flex-start',
              opacity: isFuture ? 0.5 : 1, // 🔧 valor também acinzentado se futuro
            }}
          >
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
    <Card
      containerStyle={{
        paddingHorizontal: 0,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        borderColor: '#006e61',
      }}
    >
      <FlatList<Budget>
        data={movements}
        keyExtractor={(item) => item.id}
        renderItem={getItems}
      />
    </Card>
  )
}
