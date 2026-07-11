import type { Budget } from '../@types/budget'

export const normalizeString = (str: string): string => {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
}

export const searchInMovement = (movement: Budget, query: string): boolean => {
  const normalizedQuery = normalizeString(query)
  const normalizedCategoria = normalizeString(movement.categoria || '')
  const normalizedDescricao = normalizeString(movement.descricao || '')
  
  return (
    normalizedCategoria.includes(normalizedQuery) ||
    normalizedDescricao.includes(normalizedQuery)
  )
}

export const truncateQuery = (query: string, maxLength: number = 50): string => {
  if (query.length <= maxLength) return query
  return query.substring(0, maxLength)
}

export interface SearchCache {
  query: string
  filters: string
  results: Budget[]
  timestamp: number
}

const CACHE_DURATION = 5 * 60 * 1000
const MAX_CACHE_SIZE = 10

const searchCache: SearchCache[] = []

export const getCachedResults = (query: string, filters: string): Budget[] | null => {
  const now = Date.now()
  const cached = searchCache.find(
    (c) => c.query === query && c.filters === filters && now - c.timestamp < CACHE_DURATION
  )
  return cached?.results || null
}

export const setCachedResults = (query: string, filters: string, results: Budget[]): void => {
  const existingIndex = searchCache.findIndex(
    (c) => c.query === query && c.filters === filters
  )
  
  if (existingIndex >= 0) {
    searchCache.splice(existingIndex, 1)
  }
  
  searchCache.unshift({
    query,
    filters,
    results,
    timestamp: Date.now(),
  })
  
  if (searchCache.length > MAX_CACHE_SIZE) {
    searchCache.pop()
  }
}

export const clearSearchCache = (): void => {
  searchCache.length = 0
}

export const formatSearchDuration = (ms: number): string => {
  if (ms < 100) return `${ms}ms`
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export const getPeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    '1month': '1 mês',
    '3months': '3 meses',
    '6months': '6 meses',
    '1year': '1 ano',
    '2years': '2 anos',
    'all': 'Todos',
  }
  return labels[period] || period
}