import { firebase } from '@react-native-firebase/firestore'
import { Picker } from '@react-native-picker/picker'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Button, Card } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient'
import { useContext, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import CurrencyInput from 'react-native-currency-input'
import { DatePickerInput, en, registerTranslation } from 'react-native-paper-dates'
import { SafeAreaView } from 'react-native-safe-area-context'
import budgetContext from '../context/budgetContext'
import { categorias } from '../utils/categoryList'

registerTranslation('EN', en)
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
  const [value, setValue] = useState(0)

  return (
    <SafeAreaView
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
          <View style={styles.form}>
            <Text style={{ marginBottom: 2 }}>Data</Text>
            <DatePickerInput
              locale='EN'
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

            <Text style={{ marginTop: 5, marginBottom: 2 }}>Ação</Text>
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
            </Picker>

            <Text style={{ marginTop: 5, marginBottom: 2 }}>Categoria</Text>
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

            <Text style={{ marginTop: 5, marginBottom: 2 }}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={carteira.descricao}
              onChangeText={(descricao) => setCarteira({ ...carteira, descricao })}
              placeholder='Descrição do Movimento'
            />

            <Text style={{ marginTop: 0, marginBottom: 2 }}>Movimento</Text>
            <CurrencyInput
              value={carteira.id !== undefined ? carteira.movimentos : value}
              onChangeValue={(movimentos) => {
                setValue
                setCarteira({ ...carteira, movimentos })
              }}
              style={styles.input}
              suffix='€'
              separator='.'
              precision={2}
              minValue={0}
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
    </SafeAreaView>
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
    fontWeight: 'bold',
    borderColor: '#006e61',
    backgroundColor: '#f6f6f6',
    borderWidth: 0.5,
    marginBottom: 15,
  },
})

export default MyForm
