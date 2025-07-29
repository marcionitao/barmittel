import firestore, { firebase } from '@react-native-firebase/firestore'
import { createContext, useEffect, useState } from 'react'
import { Budget, BudgetContextType } from '../@types/budget'
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
  setCurrentMonth: () => { },
  handlePreviousMonth: () => { },
  handleNextMonth: () => { },
  handleCurrentMonth: () => { },
  movimentosFuturos: [],
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

  const [movimentosFuturos, setMovimentosFuturos] = useState<Budget[]>([])


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

    const today = new Date()
    // today.setHours(0, 0, 0, 0) // garante comparação exata  

    const unsubscribe = firestore()
      .collection('orcamento')
      .orderBy('data', 'desc')
      .where('data', '>=', firstDayCurrentMonth)
      .where('data', '<', firstDayNextMonth)
      .onSnapshot((querySnapshot) => {
        let despesa = 0
        let receita = 0

        const allMovements = querySnapshot.docs.map((doc) => {
          const data = doc.data()

          return {
            id: doc.id,
            ...data,
          } as Budget
        })

        // calcula saldo apenas com movimentos cuja data <= hoje
        allMovements.forEach((movement) => {
          const movementDate = movement.data.toDate()
          if (movementDate <= today) {
            if (movement.acao === 'Despesa') {
              despesa += movement.movimentos
            } else if (movement.acao === 'Receita') {
              receita += movement.movimentos
            }
          }
        })

        const saldo = receita - despesa

        setMovements(allMovements)
        setReceita(receita)
        setDespesa(despesa)
        setSaldo(saldo)
      }, (error) => {
        console.log('Erro no listener:', error)
      })

    return () => unsubscribe()
  }, [currentMonth])

  // lida com movimentos futuros
  useEffect(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const unsubscribe = firestore()
      .collection('orcamento')
      .orderBy('data', 'asc')
      .where('data', '>', today) // 🔮 só datas futuras
      .onSnapshot((querySnapshot) => {
        const futuros = querySnapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
          } as Budget
        })

        setMovimentosFuturos(futuros) // ⬅️ novo state!
      })

    return () => unsubscribe()
  }, [])

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

    } catch (error) {
      console.error(error)
    }
    // atualiza o estado local
    handleCurrentMonth()

  }
  // remove movement
  const removeMovement = (documentId: string) => {
    firestore()
      .collection('orcamento')
      .doc(documentId)
      .delete()
      .then(() => {
        setMovements(movements.filter((movement) => movement.id !== documentId))
      })
  }
  // update movement
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
        setCurrentMonth,
        addMovement,
        removeMovement,
        updateMovement,
        handlePreviousMonth,
        handleNextMonth,
        handleCurrentMonth,
        movimentosFuturos,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}
export default BudgetContext
