import firestore, { firebase } from '@react-native-firebase/firestore'
import { createContext, useEffect, useState } from 'react'
import { Budget, BudgetContextType } from '../@types/navigation'
import { Keyboard } from 'react-native'

// create context
export const BudgetContext = createContext<BudgetContextType>({
  movements: [],
  saldo: 0,
  despesa: 0,
  receita: 0,
  keyboardVisible: false,
  currentMonth: new Date(),
  addMovement: () => { },
  removeMovement: () => { },
  updateMovement: () => { },
  handlePreviousMonth: () => { },
  handleNextMonth: () => { },
  handleCurrentMonth: () => { },
})

// create provider
export const BudgetProvider = ({ children }) => {
  // state
  const [movements, setMovements] = useState<Budget[]>([])
  const [saldo, setSaldo] = useState(0)
  const [receita, setReceita] = useState(0)
  const [despesa, setDespesa] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentMonth(prevMonth)
  }

  const handleCurrentMonth = () => {
    const currMonth = new Date()
    currMonth.setMonth(currMonth.getMonth())
    setCurrentMonth(currMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth)
  }

  // trata de ajustar o teclado
  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true)
    })
    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false)
    })

    return () => {
      showListener.remove()
      hideListener.remove()
    }
  }, [])

  // trata da lista iniciaal de movimentos
  useEffect(() => {
    const firstDayCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const firstDayNextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)

    const unsubscribe = firestore()
      .collection('orcamento')
      .orderBy('data', 'desc')
      .where('data', '>=', firstDayCurrentMonth)
      .where('data', '<', firstDayNextMonth)
      .onSnapshot((querySnapshot) => {
        let despesa = 0
        let receita = 0

        const myData = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          if (data.acao === 'Despesa') {
            despesa += data.movimentos
          } else if (data.acao === 'Receita') {
            receita += data.movimentos
          }

          return {
            id: doc.id,
            ...data,
          } as Budget
        })

        const saldo = receita - despesa

        setMovements(myData)
        setReceita(receita)
        setDespesa(despesa)
        setSaldo(saldo)
      }, (error) => {
        console.log('Erro no listener:', error)
      })

    return () => unsubscribe()
  }, [currentMonth])

  const addMovement = async (movement: Budget) => {
    const timestamp = firebase.firestore.Timestamp.now()
    const dateCondition = movement.data === undefined ? timestamp : movement.data

    try {
      await firebase
        .firestore()
        .collection('orcamento')
        .add({
          acao: movement.acao,
          categoria: movement.categoria,
          descricao: movement.descricao,
          movimentos: movement.movimentos,
          data: dateCondition,
        })
        .then(() => console.log('Dados salvos com sucesso!'))
        .catch((error) => console.error(error))
      // setMovements([newMovement, ...movements])
    } catch (error) {
      console.error(error)
    }
  }

  const removeMovement = (documentId: string) => {
    firestore()
      .collection('orcamento')
      .doc(documentId)
      .delete()
      .then(() => {
        setMovements(movements.filter((movement) => movement.id !== documentId))
      })
  }

  const updateMovement = (documentId: string, formData: Budget) => {
    firestore()
      .collection('orcamento')
      .doc(documentId)
      .update(formData)
      .then(() => {
        console.log('Document updated successfully')
      })
      .catch((error) => {
        console.error('Error updating document: ', error)
      })

    setMovements(
      movements.map((movement) => {
        if (movement.id === documentId) {
          return {
            ...movement,
            ...formData,
          }
        }
        return movement
      }),
    )
  }

  return (
    <BudgetContext.Provider
      value={{
        movements,
        saldo,
        receita,
        despesa,
        keyboardVisible,
        currentMonth,
        addMovement,
        removeMovement,
        updateMovement,
        handlePreviousMonth,
        handleNextMonth,
        handleCurrentMonth,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}
export default BudgetContext
