import { createNativeStackNavigator } from '@react-navigation/native-stack'
import myForm from '../screens/myForm'
import myHome from '../screens/myHome'

// const Stack = createNativeStackNavigator();
const { Navigator, Screen } = createNativeStackNavigator()

export function StackRoutes() {
  return (
    <Navigator>
      <Screen
        name='myHome'
        options={{
          title: 'BARMITTEL',
          headerShown: true,
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: '#F8B600' },
          headerShadowVisible: false,
        }}
        component={myHome}
      />
      <Screen
        name='myForm'
        options={{
          title: 'Movimento',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#F8B600' },
          headerShadowVisible: false,
        }}
        component={myForm}
      />
    </Navigator>
  )
}
