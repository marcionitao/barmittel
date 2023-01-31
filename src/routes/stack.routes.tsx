import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ScreenA from '../screens/ScreenA'
import ScreenB from '../screens/ScreenB'

// const Stack = createNativeStackNavigator();
const { Navigator, Screen } = createNativeStackNavigator()

export function StackRoutes() {
  return (
    <Navigator>
      <Screen
        name='screenA'
        options={{
          title: 'Tela A',
          headerShown: true,
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: 'white' },
        }}
        component={ScreenA}
      />
      <Screen
        name='screenB'
        options={{
          title: 'Tela B',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: 'white' },
        }}
        component={ScreenB}
      />
    </Navigator>
  )
}
