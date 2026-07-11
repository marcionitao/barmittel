import { memo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SearchFilters as SearchFiltersType, SearchPeriodFilter } from '../@types/budget'

interface SearchFiltersProps {
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
}

const periodOptions: { value: SearchPeriodFilter; label: string }[] = [
  { value: '1month', label: '1 Mês' },
  { value: '3months', label: '3 Meses' },
  { value: '6months', label: '6 Meses' },
  { value: '1year', label: '1 Ano' },
  { value: '2years', label: '2 Anos' },
  { value: 'all', label: 'Todos' },
]

const SearchFilters = memo(function SearchFilters({ filters, onFiltersChange }: SearchFiltersProps) {
  const handlePeriodChange = (period: SearchPeriodFilter) => {
    onFiltersChange({ ...filters, period: filters.period === period ? undefined : period })
  }

  const hasActiveFilters = filters.period

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Período</Text>
        <View style={styles.periodContainer}>
          {periodOptions.map((option) => {
            const isActive = filters.period === option.value
            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.periodButton,
                  isActive && styles.periodButtonActive,
                ]}
                onPress={() => handlePeriodChange(option.value)}
              >
                <Text
                  style={[
                    styles.periodButtonText,
                    isActive && styles.periodButtonTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {hasActiveFilters && (
        <TouchableOpacity
          style={styles.clearFilters}
          onPress={() => onFiltersChange({})}
        >
          <Text style={styles.clearFiltersText}>Limpar filtros</Text>
        </TouchableOpacity>
      )}
    </View>
  )
})

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  periodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  periodButtonActive: {
    backgroundColor: '#006e61',
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  periodButtonTextActive: {
    color: '#fff',
  },
  clearFilters: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
})

export default SearchFilters