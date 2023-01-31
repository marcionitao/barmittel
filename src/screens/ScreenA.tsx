import { useNavigation } from '@react-navigation/native'
import { Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const ScreenA = () => {
  const navigation = useNavigation()
  const openScreen = () => {
    // navigation.navigate('screenB');
    navigation.navigate('screenB', { name: 'Marcio' })
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Button title='Go to Screen B' onPress={openScreen} />
    </SafeAreaView>
  )
}

export default ScreenA
