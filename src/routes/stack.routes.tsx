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
          title: 'home',
          headerShown: false,
          headerTitleAlign: 'left',
          headerStyle: { backgroundColor: 'white' },
        }}
        component={myHome}
      />
      <Screen
        name='myForm'
        options={{
          title: 'form',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: 'white' },
        }}
        component={myForm}
      />
    </Navigator>
  )
}
