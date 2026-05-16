// Modal completo com header, lista de mensagens e sugestões. 
// Orquestra toda a UI do chat, consome useAssistant.ts
import React, { useRef, useEffect } from 'react'
import {
  Modal, View, Text, StyleSheet, FlatList,
  TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Feather } from '@expo/vector-icons'
import { useAssistant } from '../../hooks/useAssistant'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'

const SUGGESTIONS = [
  'Qual o meu saldo atual?',
  'Compara este mês com o mês passado.',
  'Em que categoria gastei mais nos últimos 6 meses?',
  'Tenho despesas futuras este mês?',
]

interface Props {
  visible: boolean
  onClose: () => void
}

export function AssistantModal({ visible, onClose }: Props) {
  // desestrutura isLoadingHistory do hook
  const { messages, isLoading, isLoadingHistory, error, sendMessage, clearMessages } = useAssistant()

  const listRef = useRef<FlatList>(null)

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100)
    }
  }, [messages])

  const handleClose = () => {
    clearMessages()
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={handleClose}>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerIcon}>
              <Text style={styles.headerIconText}>B</Text>
            </View>
            <View>
              <Text style={styles.headerTitle}>Assistente Barmittel</Text>
              <Text style={styles.headerSub}>Especialista em finanças</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="x" size={22} color="#666" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {messages.length === 0 ? (
            isLoadingHistory ? (
              <View style={styles.empty}>
                <ActivityIndicator size="large" color="#006E61" style={{ marginBottom: 12 }} />
                <Text style={styles.emptySub}>A carregar dados financeiros...</Text>
              </View>
            ) : (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>Como posso ajudar?</Text>
                <Text style={styles.emptySub}>
                  Pergunta sobre saldo, despesas, comparações mensais e muito mais.
                </Text>
                <View style={styles.suggestions}>
                  {SUGGESTIONS.map((q) => (
                    <TouchableOpacity key={q} style={styles.chip} onPress={() => sendMessage(q)} activeOpacity={0.7}>
                      <Text style={styles.chipText}>{q}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )
          ) : (
            <FlatList
              ref={listRef}
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ChatBubble message={item} />}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            />
          )}

          {isLoading && (
            <View style={styles.loadingRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>B</Text>
              </View>
              <View style={styles.loadingBubble}>
                <ActivityIndicator size="small" color="#006E61" />
                <Text style={styles.loadingText}>A analisar...</Text>
              </View>
            </View>
          )}

          {error && (
            <View style={styles.errorBanner}>
              <Feather name="alert-circle" size={14} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#006E61', justifyContent: 'center', alignItems: 'center',
  },
  headerIconText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  headerTitle: { fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  headerSub: { fontSize: 12, color: '#999', marginTop: 1 },
  empty: { flex: 1, padding: 24, justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
  emptySub: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 24 },
  suggestions: { gap: 8 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 10,
    backgroundColor: '#F0F8F6', borderRadius: 12,
    borderWidth: 1, borderColor: '#D0E8E4',
  },
  chipText: { fontSize: 14, color: '#006E61', fontWeight: '500' },
  list: { paddingVertical: 12 },
  loadingRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 6, gap: 8,
  },
  avatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#006E61', justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  loadingBubble: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#F2F2F2', paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18, borderBottomLeftRadius: 4,
  },
  loadingText: { fontSize: 13, color: '#666' },
  errorBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    marginHorizontal: 12, marginBottom: 8,
    padding: 10, backgroundColor: '#FEF2F2', borderRadius: 8,
  },
  errorText: { fontSize: 13, color: '#dc2626', flex: 1 },
})