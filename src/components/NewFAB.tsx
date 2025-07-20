import { useState } from 'react'

import { useNavigation } from '@react-navigation/native'
import { SpeedDial } from '@rneui/themed'

const NewFAB = () => {
  const [open, setOpen] = useState(false)

  const navigation = useNavigation()

  const acao = (aAcao: string) => {
    navigation.navigate('myForm', { acao: aAcao })
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
          acao('Receita')
          setOpen(!open)
        }}
      />
      <SpeedDial.Action
        title='Despesa'
        icon={{ name: 'arrow-downward', color: '#fff' }}
        color='red'
        onPress={() => {
          acao('Despesa')
          setOpen(!open)
        }}
      />
    </SpeedDial>
  )
}

export default NewFAB
