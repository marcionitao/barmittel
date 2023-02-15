import { SafeAreaView, Text } from 'react-native'

import { useRoute } from '@react-navigation/native'

// definindo o tipo para evitar erros
type ParamsProps = {
  name: string
}

const MyForm = () => {
  //
  const route = useRoute()
  const { name } = route.params as ParamsProps

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'blue',
        justifyContent: 'flex-start',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: 30, color: 'white' }}>{name}</Text>
    </SafeAreaView>
  )
}

export default MyForm
