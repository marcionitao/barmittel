import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MovementList from '../src/components/MovimentList'
import NewFAB from '../src/components/NewFAB'
import { useRouter } from 'expo-router'

import { LinearGradient } from 'expo-linear-gradient'

import BalanceMinimal from '../src/components/BalanceMinimal'

const Index = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#F8B600', '#fff']}
        style={styles.container}
      >
        <BalanceMinimal />

        <View style={styles.listContainer}>
          <MovementList />
        </View>
      </LinearGradient>
      <NewFAB />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8B600',
  },
  listContainer: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
})

export default Index
