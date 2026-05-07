import { Stack } from 'expo-router'
import { BudgetProvider } from '../src/context/budgetContext'
import { useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'

// Keep the native splash visible until JS is ready to hide it.
// SplashScreen.preventAutoHideAsync().catch(() => { })

export default function RootLayout() {
  // useEffect(() => {
  //   ; (async () => {
  //     try {
  //       await SplashScreen.hideAsync()
  //     } catch (e) {
  //       // ignore
  //     }
  //   })()
  // }, [])

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
