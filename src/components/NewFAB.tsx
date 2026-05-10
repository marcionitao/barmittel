import { useState } from 'react'
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function NewFAB() {
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const navigateToForm = (acao: string) => {
    setOpen(false)

    router.push({
      pathname: '/myForm',
      params: { acao },
    })
  }

  return (
    <View pointerEvents="box-none" style={styles.container}>
      {open && (
        <View style={styles.menuContainer}>
          <MenuButton
            label="Receita"
            icon="arrow-upward"
            color="green"
            onPress={() => navigateToForm('Receita')}
          />

          <MenuButton
            label="Despesa"
            icon="arrow-downward"
            color="red"
            onPress={() => navigateToForm('Despesa')}
          />

          <MenuButton
            label="Investimento"
            icon="trending-up"
            color="orange"
            onPress={() => navigateToForm('Investimento')}
          />
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.fab}
        onPress={() => setOpen(!open)}
      >
        <MaterialIcons
          name={open ? 'close' : 'add'}
          size={30}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  )
}

type MenuButtonProps = {
  label: string
  icon: keyof typeof MaterialIcons.glyphMap
  color: string
  onPress: () => void
}

function MenuButton({
  label,
  icon,
  color,
  onPress,
}: MenuButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.menuButton}
      onPress={onPress}
    >
      <View
        style={[
          styles.menuIcon,
          {
            backgroundColor: color,
          },
        ]}
      >
        <MaterialIcons name={icon} size={18} color="#fff" />
      </View>

      <Text style={styles.menuText}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 22,
    alignSelf: 'center',
    alignItems: 'center',
  },

  fab: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#006E61',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 6,
  },

  menuContainer: {
    marginBottom: 14,
    gap: 10,
    alignItems: 'center',
  },

  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: '#fff',

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 24,

    elevation: 3,
  },

  menuIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 10,
  },

  menuText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
  },
})