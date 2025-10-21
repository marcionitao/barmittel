import { firebase } from '@react-native-firebase/firestore'
import { Picker } from '@react-native-picker/picker'
// import { useNavigation, useRoute } from '@react-navigation/native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Button, Card } from '@rneui/themed'
import { LinearGradient } from 'expo-linear-gradient'
import { useContext, useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import CurrencyInput from 'react-native-currency-input'
import { DatePickerInput, en, de, registerTranslation } from 'react-native-paper-dates'
import { SafeAreaView } from 'react-native-safe-area-context'
import budgetContext from '../src/context/budgetContext'
import { categorias } from '../src/utils/categoryList'
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore'

import type { Budget } from '../src/@types/budget'

// Register both English and German translations
registerTranslation('en', en)
registerTranslation('de', de)

const MyForm = () => {
  const router = useRouter()
  const params = useLocalSearchParams() as Record<string, string>

  const { addMovement, updateMovement, keyboardVisible } = useContext(budgetContext)

  // Convert params back to the correct format
  const initialData = params ? {
    id: params.id as string,
    acao: params.acao as string,
    categoria: params.categoria as string,
    descricao: params.descricao as string,
    movimentos: Number(params.movimentos),
    data: params.data ? firebase.firestore.Timestamp.fromDate(new Date(params.data as string)) : null
  } : {}

  const [carteira, setCarteira] = useState<Partial<Budget>>(initialData)
  const [inputDate, setInputDate] = useState(params.data ? new Date(params.data as string) : new Date())
  const [selectedAcao, setSelectedAcao] = useState(params.acao as string || '')
  const [selectedCategoria, setSelectedCategoria] = useState(params.categoria as string || 'Selecione a Categoria')
  const [value, setValue] = useState(Number(params.movimentos) || 0)

  const handleSave = () => {
    // Create a new movement object with all required fields
    const movimento: Budget = {
      id: carteira.id || '', // Firebase will generate if new
      acao: carteira.acao || selectedAcao,
      categoria: carteira.categoria || selectedCategoria,
      descricao: carteira.descricao || '',
      movimentos: carteira.movimentos || value,
      data: carteira.data || firestore.Timestamp.fromDate(inputDate)
    }

    if (carteira.id) {
      updateMovement(movimento.id, movimento)
    } else {
      addMovement(movimento)
    }
    router.back()
  }

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <LinearGradient colors={['#F8B600', '#fff']} style={{ flex: 1 }}>
        <Card
          containerStyle={{
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
            borderBottomStartRadius: 10,
            borderBottomEndRadius: 10,
            borderColor: '#006e61',
          }}
        >
          <View style={styles.form}>
            <Text style={{ marginBottom: 2 }}>Data</Text>
            <DatePickerInput
              locale='de'
              value={
                carteira.id !== undefined
                  ? carteira.data instanceof Date
                    ? carteira.data
                    : (carteira.data as FirebaseFirestoreTypes.Timestamp).toDate()
                  : inputDate
              }
              style={{ backgroundColor: '#f6f6f6' }}
              onChange={(value) => {
                if (!value) return
                setInputDate(value)
                setCarteira({
                  ...carteira,
                  data: firestore.Timestamp.fromDate(value),
                })
              }}
              inputMode='start'
            />

            <Text style={{ marginTop: 5, marginBottom: 2 }}>Movimento</Text>
            <CurrencyInput
              value={carteira.id !== undefined ? Number(carteira.movimentos) : value}
              onChangeValue={(movimentos) => {
                setValue(movimentos)
                setCarteira({ ...carteira, movimentos })
              }}
              style={[
                styles.inputCurrency,
                { color: carteira.acao === 'Receita' ? 'green' : 'red', textAlign: 'center' },
              ]}
              suffix='€'
              autoFocus={carteira.id !== undefined ? false : true}
              separator='.'
              precision={2}
              minValue={0}
            // onChangeText={(movimentos) => {
            //   console.log(movimentos)
            // }}
            />

            <Text style={{ marginTop: 0, marginBottom: 2 }}>Ação</Text>
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
              selectedValue={
                typeof carteira.categoria === 'string'
                  ? carteira.categoria
                  : selectedCategoria
              }
              onValueChange={(categoria) => {
                setSelectedCategoria(categoria)
                setCarteira({ ...carteira, categoria })
              }}
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
              value={typeof carteira.descricao === 'string' ? carteira.descricao : ''}
              onChangeText={(descricao) => setCarteira({ ...carteira, descricao })}
              placeholder='Descrição do Movimento'
            />

            {keyboardVisible ? null : (
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
                      router.back()
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
                    onPress={handleSave}
                  />
                </View>
              </View>
            )}
          </View>
        </Card>
      </LinearGradient>
    </SafeAreaView>
  )
}
// define styles for input
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8B600',
  },
  form: {
    padding: 3,
    marginTop: 10,
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
  inputCurrency: {
    height: 55,
    padding: 10,
    fontSize: 28,
    fontWeight: 'bold',
    borderColor: '#006e61',
    backgroundColor: '#f6f6f6',
    borderWidth: 0.5,
    marginBottom: 5,
  },
})

export default MyForm
