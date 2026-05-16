// Botão flutuante verde com ícone de chat. Ponto de entrada do assistente — abre o modal

import React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Feather } from '@expo/vector-icons'

export function AssistantFAB({ onPress }: { onPress: () => void }) {
  return (
    <View style={styles.container} pointerEvents="box-none">
      <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.85}>
        <Feather name="message-circle" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 88,
    right: 20,
    zIndex: 999,
  },
  fab: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: '#006E61',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6,
    elevation: 8,
  },
})