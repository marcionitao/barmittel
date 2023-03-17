import { useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import { SpeedDial } from '@rneui/themed'

const NewFAB = () => {
  const [open, setOpen] = useState(false)

  const navigation = useNavigation()

  const despesa = () => {
    navigation.navigate('myForm', { acao: 'Despesa' })
  }
  const receita = () => {
    navigation.navigate('myForm', { acao: 'Receita' })
  }

  return (
    <SpeedDial
      color='#006E61'
      icon={{ name: 'add', color: '#fff' }}
      openIcon={{ name: 'close', color: '#fff' }}
      isOpen={open}
      onOpen={() => {
        setOpen(!open)
      }}
      onClose={() => setOpen(!open)}
    >
      <SpeedDial.Action
        title='Receita'
        icon={{ name: 'arrow-upward', color: '#fff' }}
        color='green'
        onPress={() => {
          receita()
          setOpen(!open)
        }}
      />
      <SpeedDial.Action
        title='Despesa'
        icon={{ name: 'arrow-downward', color: '#fff' }}
        color='red'
        onPress={() => {
          despesa()
          setOpen(!open)
        }}
      />
    </SpeedDial>
  )
}

export default NewFAB
