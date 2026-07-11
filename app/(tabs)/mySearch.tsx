import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useContext, useEffect, useCallback } from 'react'

import SearchBar from '../../src/components/SearchBar'
import SearchFilters from '../../src/components/SearchFilters'
import SearchResults from '../../src/components/SearchResults'
import budgetContext from '../../src/context/budgetContext'
import { SearchFilters as SearchFiltersType } from '../../src/@types/budget'

const MySearch = () => {
  const {
    searchMovements,
    clearSearch,
    searchResults,
    searchResultsCount,
    searchDuration,
    searchError,
    isSearching,
    searchQuery,
    searchFilters,
    setSearchFilters,
    removeMovement,
  } = useContext(budgetContext)

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      searchMovements(query, searchFilters)
    }
  }, [searchMovements, searchFilters])

  const handleClear = useCallback(() => {
    clearSearch()
  }, [clearSearch])

  const handleFiltersChange = useCallback((filters: SearchFiltersType) => {
    setSearchFilters(filters)
    if (searchQuery.trim()) {
      searchMovements(searchQuery, filters)
    }
  }, [setSearchFilters, searchMovements, searchQuery])

  const handleDelete = useCallback((id: string) => {
    removeMovement(id)
    if (searchQuery.trim()) {
      searchMovements(searchQuery, searchFilters)
    }
  }, [removeMovement, searchMovements, searchQuery, searchFilters])

  useEffect(() => {
    if (searchQuery.trim()) {
      searchMovements(searchQuery, searchFilters)
    }
  }, [])

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <LinearGradient
        colors={['#F8B600', '#fff']}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Pesquisar</Text>
          <Text style={styles.subtitle}>
            Busca por categoria e descrição
          </Text>
        </View>

        <SearchBar
          onSearch={handleSearch}
          onClear={handleClear}
          isLoading={isSearching}
          initialValue={searchQuery}
        />

        <SearchFilters
          filters={searchFilters}
          onFiltersChange={handleFiltersChange}
        />

        <View style={styles.resultsContainer}>
          {isSearching ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>A pesquisar...</Text>
            </View>
          ) : searchError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Erro: {searchError}</Text>
              <Text style={styles.errorHint}>
                Verifique a sua ligação à internet
              </Text>
            </View>
          ) : (
            <SearchResults
              results={searchResults}
              onDelete={handleDelete}
              totalCount={searchResultsCount}
              searchDuration={searchDuration}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#006e61',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  resultsContainer: {
    flex: 1,
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
})

export default MySearch