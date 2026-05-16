// Renderiza uma mensagem (utilizador ou assistente) com Markdown
// Separa a lógica de apresentação de cada mensagem
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Markdown from 'react-native-markdown-display'
import { ChatMessage } from '../../hooks/useAssistant'

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAssistant]}>
      {!isUser && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>B</Text>
        </View>
      )}

      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        {isUser ? (
          <Text style={styles.textUser}>{message.content}</Text>
        ) : (
          <Markdown style={markdownStyles}>{message.content}</Markdown>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginVertical: 4,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
  },
  rowUser: { justifyContent: 'flex-end' },
  rowAssistant: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',      // avatar alinha ao topo em respostas longas
  },
  avatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#006E61',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 6, marginBottom: 2,
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleUser: {
    maxWidth: '78%',               // utilizador: largura limitada, alinhado à direita
    backgroundColor: '#006E61',
    borderRadius: 14,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleAssistant: {
    flex: 1,                       // ← ocupa todo o espaço restante após o avatar
    backgroundColor: '#F2F2F2',
    borderRadius: 14,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  textUser: { fontSize: 15, lineHeight: 21, color: '#fff' },
})

// estilos aplicados ao markdown renderizado (bolha do assistente)
const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 15,
    lineHeight: 21,
    color: '#1a1a1a',
  },
  strong: {
    fontWeight: '700',
    color: '#1a1a1a',
  },
  em: {
    fontStyle: 'italic',
    color: '#1a1a1a',
  },
  bullet_list: {
    marginTop: 4,
    marginBottom: 4,
  },
  ordered_list: {
    marginTop: 4,
    marginBottom: 4,
  },
  list_item: {
    marginBottom: 2,
    flexDirection: 'row',
  },
  bullet_list_icon: {
    color: '#006E61',
    fontSize: 15,
    marginRight: 6,
    lineHeight: 21,
  },
  code_inline: {
    backgroundColor: '#E8F4F2',
    color: '#006E61',
    borderRadius: 4,
    paddingHorizontal: 4,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  fence: {
    backgroundColor: '#E8F4F2',
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
  },
  code_block: {
    color: '#006E61',
    fontSize: 13,
    fontFamily: 'monospace',
  },
  heading1: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    marginTop: 4,
  },
  heading2: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
    marginTop: 4,
  },
  heading3: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
    marginTop: 4,
  },
  hr: {
    backgroundColor: '#D0E8E4',
    height: 1,
    marginVertical: 8,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 4,
  },
})