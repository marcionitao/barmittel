import { NativeBaseProvider } from 'native-base'
import { BudgetProvider } from './src/context/budgetContext'
import { Routes } from './src/routes'

export default function App() {
  return (
    <BudgetProvider>
      <NativeBaseProvider>
        <Routes />
      </NativeBaseProvider>
    </BudgetProvider>
  )
}
