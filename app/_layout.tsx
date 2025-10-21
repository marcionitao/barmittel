import { Stack } from 'expo-router'
import { BudgetProvider } from '../src/context/budgetContext'

export default function RootLayout() {
  return (
    <BudgetProvider>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            title: 'BARMITTEL',
            headerShown: true,
            headerTitleAlign: 'left',
            headerStyle: { backgroundColor: '#F8B600' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name='myForm'
          options={{
            title: 'Movimento',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#F8B600' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name='mySchedule'
          options={{
            title: 'Movimentos Agendados',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#F8B600' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="myCharts"
          options={{
            title: 'Gráficos',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#F8B600' },
            headerShadowVisible: false,
          }}
        />
        <Stack.Screen
          name="myFuture"
          options={{
            title: 'Agenda',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#F8B600' },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </BudgetProvider>
  )
}
