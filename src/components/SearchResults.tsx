import { useRouter } from 'expo-router'
import { useCallback, memo } from 'react'
import { Button, ListItem, Text } from '@rneui/base'
import { View, FlatList, StyleSheet } from 'react-native'
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

import type { Budget } from '../@types/budget'

import moment from 'moment'
import numeral from 'numeral'
import colorGenerator from '../utils/colorGenerator'

interface SearchResultsProps {
  results: Budget[]
  onDelete?: (id: string) => void
  totalCount: number
  searchDuration: number
}

interface GroupedResults {
  date: string
  data: string
  items: Budget[]
}

const groupResultsByDate = (results: Budget[]): GroupedResults[] => {
  const grouped: Record<string, Budget[]> = {}

  results.forEach((item) => {
    const date = item.data instanceof Date
      ? item.data
      : (item.data as FirebaseFirestoreTypes.Timestamp).toDate()
    const dateKey = moment(date).format('YYYY-MM-DD')

    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(item)
  })

  return Object.entries(grouped)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, items]) => ({
      date: dateKey,
      data: moment(dateKey).format('DD MMMM YYYY'),
      items,
    }))
}

const SearchResults = memo(function SearchResults({
  results,
  onDelete,
  totalCount,
  searchDuration,
}: SearchResultsProps) {
  const router = useRouter()

  const handleDelete = useCallback((documentId: string) => {
    if (onDelete) {
      onDelete(documentId)
    }
  }, [onDelete])

  const getItemColor = (acao: string): string => {
    if (acao === 'Despesa') return '#e74c3c'
    if (acao === 'Investimento') return '#f39c12'
    return '#27ae60'
  }

  const renderItem = ({ item }: { item: Budget }) => {
    const date = item.data instanceof Date
      ? item.data
      : (item.data as FirebaseFirestoreTypes.Timestamp).toDate()

    const serializedItem = {
      ...item,
      data: item.data instanceof Date
        ? item.data.toISOString()
        : item.data.toDate().toISOString(),
    }

    return (
      <ListItem.Swipeable
        key={item.id}
        animation={{ type: 'timing', duration: 300 }}
        leftWidth={0}
        rightWidth={90}
        bottomDivider
        onPress={() => router.push({ pathname: '/myForm', params: serializedItem })}
        rightContent={(reset) => (
          <Button
            containerStyle={styles.deleteButton}
            type='clear'
            icon={{ name: 'delete-outline', color: 'white' }}
            onPress={() => {
              handleDelete(item.id)
              reset()
            }}
          />
        )}
      >
        <View style={[styles.iconContainer, { backgroundColor: colorGenerator() }]}>
          <Text style={styles.iconText}>
            {item.categoria.charAt(0).toUpperCase()}
          </Text>
        </View>
        <ListItem.Content>
          <ListItem.Title style={styles.itemTitle}>
            {item.categoria}
          </ListItem.Title>
          <ListItem.Subtitle style={styles.itemSubtitle}>
            {item.descricao || moment(date).format('DD MMMM YYYY')}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Title style={[styles.itemValue, { color: getItemColor(item.acao) }]}>
          {numeral(item.movimentos).format('0,0.00')}€
        </ListItem.Title>
      </ListItem.Swipeable>
    )
  }

  const renderSectionHeader = (section: GroupedResults) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{section.data}</Text>
      <Text style={styles.sectionHeaderCount}>{section.items.length}</Text>
    </View>
  )

  if (results.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Nenhum resultado encontrado</Text>
        <Text style={styles.emptySubtitle}>
          Tente ajustar os filtros ou usar outros termos de pesquisa
        </Text>
      </View>
    )
  }

  const groupedResults = groupResultsByDate(results)

  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {totalCount} {totalCount === 1 ? 'resultado' : 'resultados'} em {searchDuration}ms
        </Text>
      </View>

      <FlatList
        data={groupedResults}
        keyExtractor={(item) => item.date}
        renderItem={({ item: section }) => (
          <View>
            {renderSectionHeader(section)}
            {section.items.map((item) => renderItem({ item }))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stats: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f8f8f8',
  },
  statsText: {
    fontSize: 13,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#006e61',
  },
  sectionHeaderCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
})

export default SearchResults