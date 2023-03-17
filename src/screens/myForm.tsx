import { firebase } from '@react-native-firebase/firestore'
import { Picker } from '@react-native-picker/picker'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Button, Card } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient'
import numeral from 'numeral'
import { useContext, useState } from 'react'
import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import { DatePickerInput, pt, registerTranslation } from 'react-native-paper-dates'
import budgetContext from '../context/budgetContext'
import { categorias } from '../utils/categoryList'

// registerTranslation('EN', en)
registerTranslation('PT', pt)

interface MovimentosProps {
  route: any
  navigation: any
}

const MyForm = ({ route, navigation }: MovimentosProps) => {
  route = useRoute()
  navigation = useNavigation()

  const { addMovement, updateMovement } = useContext(budgetContext)

  const [carteira, setCarteira] = useState(route.params ? route.params : {})
  const [inputDate, setInputDate] = useState(new Date())
  const [selectedAcao, setSelectedAcao] = useState(route.params.acao)
  const [selectedCategoria, setSelectedCategoria] = useState('Selecione a Categoria')

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <LinearGradient colors={['#F8B600', '#fff']}>
        <Card
          containerStyle={{
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
            borderBottomStartRadius: 10,
            borderBottomEndRadius: 10,
            height: 'auto',
            borderColor: '#006e61',
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
                height: 80,
                width: 80,
                resizeMode: 'contain',
              }}
              source={require('../../images/logo-input.png')}
            />
          </View>

          <View style={styles.form}>
            <Text style={{ marginTop: 10, marginBottom: 5 }}>Data</Text>
            <DatePickerInput
              locale='PT'
              value={carteira.id !== undefined ? carteira.data.toDate() : inputDate}
              style={{ backgroundColor: '#f6f6f6' }}
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

            <Text style={{ marginTop: 10, marginBottom: 5 }}>Ação</Text>
            <Picker
              selectedValue={carteira.id !== undefined ? carteira.acao : selectedAcao}
              onValueChange={(acao, itemIndex) => {
                setSelectedAcao(acao)
                setCarteira({ ...carteira, acao })
              }}
              style={{ backgroundColor: '#f6f6f6' }}
              dropdownIconColor={'red'}
            >
              <Picker.Item label='Receita' value='Receita' color='green' style={{ fontSize: 16 }} />
              <Picker.Item label='Despesa' value='Despesa' color='red' style={{ fontSize: 16 }} />
              {/* <Picker.Item
                label='Selecione a Ação'
                value='Selecione a Ação'
                enabled={false}
                color='grey'
              /> */}
            </Picker>

            <Text style={{ marginTop: 10, marginBottom: 5 }}>Categoria</Text>
            <Picker
              selectedValue={carteira.id !== undefined ? carteira.categoria : selectedCategoria}
              onValueChange={(categoria, itemIndex) => {
                setSelectedCategoria(categoria)
                setCarteira({ ...carteira, categoria })
              }}
              style={{ backgroundColor: '#f6f6f6' }}
              dropdownIconColor={'red'}
            >
              {categorias.map((categoria) => (
                <Picker.Item
                  key={categoria.value}
                  label={categoria.label}
                  value={categoria.value}
                  style={{ fontSize: 16 }}
                />
              ))}
              <Picker.Item
                label='Selecione a Categoria'
                value='Selecione a Categoria'
                enabled={false}
                color='grey'
              />
            </Picker>

            <Text style={{ marginTop: 10, marginBottom: 5 }}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={carteira.descricao}
              onChangeText={(descricao) => setCarteira({ ...carteira, descricao })}
              placeholder='Descrição do Movimento'
            />

            <Text style={{ marginTop: 0, marginBottom: 5 }}>Movimento</Text>
            <TextInput
              style={styles.input}
              keyboardType='numeric'
              value={numeral(carteira.movimentos).format('0,0.00')}
              onChangeText={(movimentos: string) =>
                setCarteira({ ...carteira, movimentos: parseFloat(movimentos) })
              }
              placeholder='0.00€'
            />
            <View
              style={{
                width: '100%',
                alignItems: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: 35,
              }}
            >
              <View
                style={{
                  width: '50%',
                  padding: 2,
                }}
              >
                <Button
                  title='Cancel'
                  type='outline'
                  titleStyle={{ color: 'grey' }}
                  style={{ marginTop: 25, marginBottom: 15 }}
                  color='#f6f6f6'
                  onPress={() => {
                    //carteira.id !== undefined ? updateMovement(carteira.id, carteira) : addMovement
                    navigation.goBack()
                  }}
                />
              </View>
              <View
                style={{
                  width: '50%',
                  padding: 2,
                }}
              >
                <Button
                  title='Save'
                  style={{ marginTop: 25, marginBottom: 15 }}
                  color='#006e61'
                  onPress={() => {
                    carteira.id !== undefined ? updateMovement(carteira.id, carteira) : addMovement
                    navigation.goBack()
                  }}
                />
              </View>
            </View>
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
    fontSize: 16,
    borderColor: 'gray',
    backgroundColor: '#f6f6f6',
    borderWidth: 0.5,
    marginBottom: 15,
  },
})

export default MyForm
