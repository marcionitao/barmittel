import { useRouter } from 'expo-router'
import { Button, Icon, ListItem } from '@rneui/base'
import { Card } from '@rneui/themed'
import { useContext } from 'react'
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native'

import budgetContext from '../context/budgetContext'
import type { Budget } from '../@types/budget'

import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

import moment from 'moment'
import numeral from 'numeral'
import colorGenerator from '../utils/colorGenerator'

interface MovementFutureProps {
  movements?: Budget[]
  selectedDate?: Date | null
  onDelete?: (id: string) => void
}

export default function MovementFuture({ 
  movements, 
  selectedDate,
  onDelete 
}: MovementFutureProps) {
  const router = useRouter()
  const { removeMovement, movimentosFuturos } = useContext(budgetContext)

  const sourceMovements = movements ?? movimentosFuturos ?? []
  const deleteAction = onDelete ?? removeMovement

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const isFiltered = selectedDate !== null

  const filteredMovements = sourceMovements.filter((m) => {
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
    
    if (selectedDate) {
      const selDate = new Date(selectedDate)
      selDate.setHours(0, 0, 0, 0)
      return data.getTime() === selDate.getTime()
    }
    return data > hoje
  })

  const confirmDelete = (documentId: string) => {
    Alert.alert('Eliminar', 'Tem a certeza que pretende eliminar este movimento?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        onPress: () => deleteAction(documentId),
      },
    ])
  }

  const getItems = ({ item }: { item: Budget }) => {
    const data = item.data instanceof Date
      ? item.data
      : (item.data as FirebaseFirestoreTypes.Timestamp).toDate()

    const isFuture = data > new Date()

    const serializedItem = {
      ...item,
      data: item.data instanceof Date ? item.data.toISOString() : item.data.toDate().toISOString(),
    }

    const iconColor = colorGenerator()

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
            containerStyle={styles.deleteButton}
            type='clear'
            icon={{ name: 'delete-outline', color: 'white' }}
            onPress={() => {
              confirmDelete(item.id)
              reset()
            }}
          />
        )}
      >
        <View style={[styles.iconContainer, { backgroundColor: iconColor }]}>
          {isFuture ? (
            <Icon name='schedule' type='material' color='white' size={28} />
          ) : item.categoria && item.categoria.length > 0 ? (
            <Text style={styles.iconText}>{item.categoria[0]}</Text>
          ) : (
            <Icon name='help-outline' type='ionicon' color='white' size={28} />
          )}
        </View>
        <ListItem.Content>
          <ListItem.Title style={styles.itemTitle}>
            {item.categoria}
          </ListItem.Title>
          <ListItem.Subtitle style={styles.itemSubtitle}>
            {moment(item.data.toDate()).format('DD MMMM YYYY')}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Title style={[
          styles.itemValue,
          { color: item.acao === 'Despesa' ? 'red' : 'green' }
        ]}>
          {numeral(item.movimentos).format('0,0.00')}€
        </ListItem.Title>
      </ListItem.Swipeable>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        renderItem={getItems}
        style={styles.flatList}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isFiltered 
                ? 'Nenhum movimento neste dia'
                : 'Nenhum Movimento Futuro'
              }
            </Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  itemValue: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'red',
  },
})