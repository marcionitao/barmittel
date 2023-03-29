import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MovementList from '../components/MovimentList'
import NewFAB from '../components/NewFAB'

import { LinearGradient } from 'expo-linear-gradient'

import Balance from '../components/Balance'

const MyHome = () => {
  return (
    <SafeAreaView>
      <LinearGradient
        // Background Linear Gradient
        colors={['#F8B600', '#fff']}
      >
        <Balance />

        <View style={{ height: '68%' }}>
          <MovementList />
        </View>
      </LinearGradient>
      <NewFAB />
    </SafeAreaView>
  )
}

export default MyHome
