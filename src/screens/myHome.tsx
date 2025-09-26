import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MovementList from '../components/MovimentList'
import NewFAB from '../components/NewFAB'
import { useNavigation } from '@react-navigation/native'

import { LinearGradient } from 'expo-linear-gradient'

import BalanceMinimal from '../components/BalanceMinimal'

const MyHome = () => {
  const navigation = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
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
  },
  listContainer: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
})

export default MyHome
