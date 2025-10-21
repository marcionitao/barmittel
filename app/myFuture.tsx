
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import MovementFuture from '../src/components/MovementFuture'

const MyFuture = () => {

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <LinearGradient
        // Background Linear Gradient
        colors={['#F8B600', '#fff']}
        style={styles.container}
      >
        <View style={styles.listContainer}>
          <MovementFuture />
        </View>
      </LinearGradient>
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

export default MyFuture
