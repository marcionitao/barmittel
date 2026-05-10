import { Stack } from 'expo-router'
import { BudgetProvider } from '../src/context/budgetContext'

export default function RootLayout() {
  return (
    <BudgetProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="myForm"
          options={{
            title: 'Movimento',
            headerTitleAlign: 'center',
            headerStyle: { backgroundColor: '#F8B600' },
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </BudgetProvider>
  )
}