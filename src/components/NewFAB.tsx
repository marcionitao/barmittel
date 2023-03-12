import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const NewFAB = () => {
  const [open, setOpen] = useState(false)

  const navigation = useNavigation()
  const despesa = () => {
    navigation.navigate('myForm', { acao: 'Despesa' })
  }
  const receita = () => {
    navigation.navigate('myForm', { acao: 'Receita' })
  }

  const toggleOpen = () => {
    setOpen(!open)
  }

  return (
    <View style={styles.container}>
      {open && (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              receita()
              toggleOpen()
            }}
          >
            <Icon name='arrow-up-bold-circle' size={45} color='green' />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              despesa()
              toggleOpen()
            }}
          >
            <Icon name='arrow-down-bold-circle' size={45} color='red' />
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.fab} onPress={toggleOpen}>
        <Icon name={open ? 'close' : 'plus'} size={24} color='#fff' />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 16,
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#006E61',
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 50,
    right: 16,
    zIndex: 1,
  },
  buttonGroup: {
    position: 'absolute',
    bottom: 110,
    right: 12,

    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    zIndex: 1,
  },
  button: {
    marginBottom: 10,
    width: 48,
    height: 48,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
})

export default NewFAB
