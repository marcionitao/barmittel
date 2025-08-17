
import { useNavigation, useRoute } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'
import { en, registerTranslation } from 'react-native-paper-dates'
import { SafeAreaView } from 'react-native-safe-area-context'
import MovementFuture from '../components/MovementFuture'

registerTranslation('EN', en)
interface MovimentosProps {
  route: any
  navigation: any
}

const MyFuture = ({ route, navigation }: MovimentosProps) => {
  route = useRoute()
  navigation = useNavigation()
  return (
    <SafeAreaView style={styles.container}>
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
  },
  listContainer: {
    flex: 1,
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
  },
})

export default MyFuture
