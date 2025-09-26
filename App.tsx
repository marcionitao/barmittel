import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen'

import { BudgetProvider } from './src/context/budgetContext'
import { Routes } from './src/routes'

import 'intl'
import 'intl/locale-data/jsonp/de'

export default function App() {
  useEffect(() => {
    SplashScreen.hide()
  }, [])

  return (
    <BudgetProvider>
      <StatusBar barStyle='dark-content' backgroundColor='#F8B600' />
      <Routes />
    </BudgetProvider>
  )
}
