import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MyForm from '../screens/MyForm'
import MyHome from '../screens/MyHome'
import MySchedule from '../screens/MySchedule'

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
        component={MyHome}
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
        component={MyForm}
      />
      <Screen
        name='mySchedule'
        options={{
          title: 'Movimentos Agendados',
          headerShown: true,
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#F8B600' },
          headerShadowVisible: false,
        }}
        component={MySchedule}
      />
    </Navigator>
  )
}
