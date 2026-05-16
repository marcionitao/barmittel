// Campo de texto + botão enviar
// Captura o input do utilizador e delega para o hook
import React, { useState } from 'react'
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import { Feather } from '@expo/vector-icons'

interface Props {
  onSend: (text: string) => void
  isLoading: boolean
}

export function ChatInput({ onSend, isLoading }: Props) {
  const [text, setText] = useState('')

  const handleSend = () => {
    if (!text.trim() || isLoading) return
    onSend(text.trim())
    setText('')
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Pergunta sobre as tuas finanças..."
        placeholderTextColor="#999"
        multiline
        maxLength={500}
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[styles.btn, (!text.trim() || isLoading) && styles.btnDisabled]}
        onPress={handleSend}
        disabled={!text.trim() || isLoading}
        activeOpacity={0.7}
      >
        {isLoading
          ? <ActivityIndicator size="small" color="#fff" />
          : <Feather name="send" size={18} color="#fff" />
        }
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'flex-end',
    paddingHorizontal: 12, paddingVertical: 10,
    borderTopWidth: 1, borderTopColor: '#E5E5E5',
    backgroundColor: '#fff', gap: 8,
  },
  input: {
    flex: 1, minHeight: 42, maxHeight: 100,
    backgroundColor: '#F5F5F5', borderRadius: 21,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, color: '#1a1a1a',
  },
  btn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: '#006E61',
    justifyContent: 'center', alignItems: 'center',
  },
  btnDisabled: { backgroundColor: '#B0C4C1' },
})