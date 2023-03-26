import firestore, { firebase } from '@react-native-firebase/firestore'
import { createContext, useEffect, useState } from 'react'
import { Budget, BudgetContextType } from '../@types/navigation'

// create context
export const BudgetContext = createContext<BudgetContextType>({
  movements: [],
  saldo: 0,
  despesa: 0,
  receita: 0,
  currentMonth: new Date(),
  addMovement: () => {},
  removeMovement: () => {},
  updateMovement: () => {},
  handlePreviousMonth: () => {},
  handleNextMonth: () => {},
})

// create provider
export const BudgetProvider = ({ children }) => {
  // state
  const [movements, setMovements] = useState<Budget[]>([])
  const [saldo, setSaldo] = useState(0)
  const [receita, setReceita] = useState(0)
  const [despesa, setDespesa] = useState(0)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const handlePreviousMonth = () => {
    const prevMonth = new Date(currentMonth)
    prevMonth.setMonth(prevMonth.getMonth() - 1)
    setCurrentMonth(prevMonth)
    console.log(prevMonth)
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth)
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    setCurrentMonth(nextMonth)
    console.log(nextMonth)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = await firestore()
          .collection('orcamento')
          .orderBy('data', 'desc')
          .where('data', '>=', firstDayCurrentMonth)
          .where('data', '<', firstDayNextMonth)
          .onSnapshot((querySnapshot) => {
            const myData = querySnapshot.docs.map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
              }
            }) as Budget[]

            setMovements(myData)
          })
        return () => db()
      } catch (error) {
        console.log('Erro lista...', error)
      }
    }
    const firstDayCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const firstDayNextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)

    fetchData().catch((error) => {
      console.log('Erro fetchData:', error)
    })
  }, [currentMonth])

  useEffect(() => {
    async function getSoma() {
      try {
        const querySnapshot = await firestore()
          .collection('orcamento')
          .where('data', '>=', firstDayCurrentMonth)
          .where('data', '<', firstDayNextMonth)
          .onSnapshot((querySnapshot) => {
            let despesa = 0
            let receita = 0

            querySnapshot.docs.map((doc) => {
              if (doc.data().acao === 'Despesa') {
                despesa += doc.data().movimentos
              } else if (doc.data().acao === 'Receita') {
                receita += doc.data().movimentos
              }
            })
            const diff = receita - despesa

            setReceita(receita)
            setDespesa(despesa)
            setSaldo(diff)
          })
        return () => querySnapshot()
      } catch (error) {
        console.log('Erro saldos etc....', error)
      }
    }
    const firstDayCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const firstDayNextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)

    getSoma().catch((error) => {
      console.log('Erro fetchData:', error)
    })
  }, [currentMonth])

  const addMovement = async (movement: Budget) => {
    const timestamp = firebase.firestore.Timestamp.now()
    const dateCondition = movement.data === undefined ? timestamp : movement.data

    const newMovement = {
      id: '',
      acao: movement.acao,
      categoria: movement.categoria,
      descricao: movement.descricao,
      movimentos: movement.movimentos,
      data: dateCondition,
    } as Budget

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
      setMovements([newMovement, ...movements])
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
        currentMonth,
        addMovement,
        removeMovement,
        updateMovement,
        handlePreviousMonth,
        handleNextMonth,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}
export default BudgetContext
