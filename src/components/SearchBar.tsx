import { useState, useEffect, useCallback, memo } from 'react'
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native'

interface SearchBarProps {
  onSearch: (query: string) => void
  onClear: () => void
  isLoading?: boolean
  placeholder?: string
  initialValue?: string
}

const MAX_QUERY_LENGTH = 50

const SearchBar = memo(function SearchBar({
  onSearch,
  onClear,
  isLoading = false,
  placeholder = 'Pesquisar movimentos...',
  initialValue = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (query.trim()) {
        onSearch(query.trim())
      } else {
        onClear()
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, onSearch, onClear])

  const handleClear = useCallback(() => {
    setQuery('')
    onClear()
  }, [onClear])

  const handleChangeText = useCallback((text: string) => {
    if (text.length <= MAX_QUERY_LENGTH) {
      setQuery(text)
    }
  }, [])

  const showCharCount = query.length >= MAX_QUERY_LENGTH * 0.8

  return (
    <View style={styles.container}>
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isLoading ? (
          <ActivityIndicator size="small" color="#006e61" style={styles.loader} />
        ) : query.length > 0 ? (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {showCharCount && (
        <Text style={styles.charCount}>
          {query.length}/{MAX_QUERY_LENGTH}
        </Text>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  inputContainerFocused: {
    borderColor: '#006e61',
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  loader: {
    marginLeft: 8,
  },
  clearButton: {
    marginLeft: 8,
    padding: 4,
  },
  clearText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
    paddingRight: 16,
  },
})

export default SearchBar