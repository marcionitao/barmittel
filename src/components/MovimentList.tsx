import { useNavigation } from '@react-navigation/native'
import { Avatar, Button, ListItem } from '@rneui/base'
import { Card } from '@rneui/themed'
import { useContext } from 'react'
import { Alert, FlatList } from 'react-native'

import budgetContext from '../context/budgetContext'

//import { fakeData } from '../fakeData/data'
import moment from 'moment'
import numeral from 'numeral'
import { categorias } from '../utils/categoryList'
import colorGenerator from '../utils/colorGenerator'

interface MovimentosProps {
  navigation?: any
}

export default function MovementList({ navigation }: MovimentosProps) {
  navigation = useNavigation()

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

  const getItems = ({ item }) => {
    // 🔧 converte Timestamp para Date se necessário
    const data = item.data.toDate()

    // 🔧 verifica se a data é futura
    const isFuture = data > new Date()

    // 🔧 encontra a categoria correspondente no array de categorias
    const categoriaInfo = categorias.find((cat) => cat.value === item.categoria)

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
            backgroundColor: !isFuture && categoriaInfo ? categoriaInfo.color : colorGenerator(),
            opacity: isFuture ? 0.5 : 1, // 🔧 efeito visual para futuros
          }}
          size={48}
          // 🔧 Se for futuro, mostra ícone de relógio. Caso contrário, mostra o ícone da categoria.
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
              icon: {
                name: categoriaInfo ? categoriaInfo.icon : 'help-outline',
                type: 'ionicon',
                color: 'white',
                size: 32,
              },
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
      <FlatList data={movements} keyExtractor={(item) => item.id} renderItem={getItems} />
    </Card>
  )
}
