import { useNavigation } from '@react-navigation/native'
import { Avatar, Button, ListItem } from '@rneui/base'
import { Card } from '@rneui/themed'
import { useContext } from 'react'
import { Alert, FlatList } from 'react-native'

import budgetContext from '../context/budgetContext'

//import { fakeData } from '../fakeData/data'
import moment from 'moment'
import numeral from 'numeral'
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
          containerStyle={{ backgroundColor: colorGenerator() }}
          size={48}
          title={item.categoria[0]}
          titleStyle={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}
        />
        <ListItem.Content>
          <ListItem.Title>{item.categoria}</ListItem.Title>
          <ListItem.Subtitle>{moment(item.data.toDate()).format('DD/MM/YYYY')}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Title
          style={{
            color: item.acao === 'Despesa' ? 'red' : 'green',
            fontWeight: 'bold',
            fontSize: 18,
            alignSelf: 'flex-start',
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
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        borderColor: '#006e61',
      }}
    >
      <FlatList data={movements} keyExtractor={(item) => item.id} renderItem={getItems} />
    </Card>
  )
}
