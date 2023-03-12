import { firebase } from '@react-native-firebase/firestore'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Card } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient'
import numeral from 'numeral'
import { useState } from 'react'
import { Button, Image, StyleSheet, Text, TextInput, View } from 'react-native'
import { DatePickerInput, pt, registerTranslation } from 'react-native-paper-dates'

// registerTranslation('EN', en)
registerTranslation('PT', pt)

interface MovimentosProps {
  route: any
  acao: string
  navigation: any
}

const MyForm = ({ route, navigation }: MovimentosProps) => {
  route = useRoute()
  navigation = useNavigation()

  const [carteira, setCarteira] = useState(route.params ? route.params : {})
  const [inputDate, setInputDate] = useState(new Date())

  //console.warn(newDate)
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        // Background Linear Gradient
        colors={['#F8B600', '#fff']}
      >
        <Card
          containerStyle={{
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
            borderBottomStartRadius: 10,
            borderBottomEndRadius: 10,
            height: 'auto',
          }}
        >
          <View
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Image
              style={{
                height: 100,
                width: 100,
                resizeMode: 'contain',
              }}
              source={require('../../images/logo-input.png')}
            />
          </View>

          <View style={styles.form}>
            <Text>Data</Text>
            <DatePickerInput
              locale='PT'
              value={inputDate}
              onChange={(value) => {
                setInputDate(value)
                //console.warn(value.toLocaleDateString())
                setCarteira({
                  ...carteira,
                  data: firebase.firestore.Timestamp.fromDate(value),
                })
              }}
              inputMode='start'
            />

            <TextInput
              style={styles.input}
              value={carteira.acao || 'Receita' || 'Despesa'}
              // onChangeText={(name) => setCarteira({ ...user, name })}
              // placeholder='Enter name'
            />
            <Text>Categoria</Text>
            <TextInput
              style={styles.input}
              value={carteira.categoria}
              // onChangeText={(email) => setCarteira({ ...user, email })}
              //placeholder='Enter email'
            />
            <Text>Descrição</Text>
            <TextInput
              style={styles.input}
              value={carteira.descricao}
              //onChangeText={(avatarUrl) => setCarteira({ ...user, avatarUrl })}
              placeholder='Descrição do Movimento'
            />
            <Text>Movimento</Text>
            <TextInput
              style={styles.input}
              value={numeral(carteira.movimentos).format('0,0.00')}
              //onChangeText={(avatarUrl) => setCarteira({ ...user, avatarUrl })}
              placeholder='0.00€'
            />
            <Button
              title='Save'
              onPress={() => {
                // dispatch({
                //   type: user.id ? 'updateUser' : 'createUser',
                //   payload: user,
                // }),
                navigation.goBack()
              }}
            />
          </View>
        </Card>
      </LinearGradient>
    </View>
  )
}
// define styles for input
const styles = StyleSheet.create({
  form: {
    padding: 4,
    marginTop: 20,
  },
  input: {
    height: 45,
    padding: 10,
    borderColor: 'gray',
    borderWidth: 0.5,
    marginBottom: 15,
  },
})

export default MyForm
