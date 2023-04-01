import { useEffect } from 'react'
import { Platform } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { BudgetProvider } from './src/context/budgetContext'
import { Routes } from './src/routes'

import 'intl'
import 'intl/locale-data/jsonp/de'

if (Platform.OS === 'android') {
  if (typeof (Intl as any).__disableRegExpRestore === 'function') {
    ;(Intl as any).__disableRegExpRestore()
  }
}

export default function App() {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <BudgetProvider>
      <Routes />
    </BudgetProvider>
  )
}
