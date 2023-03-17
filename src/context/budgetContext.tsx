import firestore from '@react-native-firebase/firestore'
import moment from 'moment'
import { createContext, useEffect, useState } from 'react'
import { Budget, BudgetContextType } from '../@types/navigation'

// create context
export const BudgetContext = createContext<BudgetContextType>({
  movements: [],
  saldo: 0,
  despesa: 0,
  receita: 0,
  addMovement: () => {},
  removeMovement: () => {},
  updateMovement: () => {},
})

// create provider
export const BudgetProvider = ({ children }) => {
  // state
  const [movements, setMovements] = useState<Budget[]>([])
  const [saldo, setSaldo] = useState(0)
  const [receita, setReceita] = useState(0)
  const [despesa, setDespesa] = useState(0)

  const currentDate = moment()

  const firstDayCurrentMonth = moment({
    year: currentDate.year(),
    month: currentDate.month(),
    date: 1,
  }).toDate()

  const firstDayNextMonth = moment({
    year: currentDate.year(),
    month: currentDate.month() + 1,
    date: 1,
  }).toDate()

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

            //console.warn(myData)
            setMovements(myData)
          })
        return () => db()
      } catch (error) {
        console.log('Erro lista...', error)
      }
    }
    fetchData().catch((error) => {
      console.log('Erro fetchData:', error)
    })
  }, [])

  useEffect(() => {
    async function getSoma() {
      try {
        const querySnapshot = await firestore()
          .collection('orcamento')
          .where('data', '>=', firstDayCurrentMonth)
          .where('data', '<', firstDayNextMonth)
          .get()

        let despesa = 0
        let receita = 0

        querySnapshot.forEach((doc) => {
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
      } catch (error) {
        console.log('Erro saldos etc....', error)
      }
    }
    getSoma().catch((error) => {
      console.log('Erro getSoma:', error)
    })
  }, [])

  // add movement
  const addMovement = (movement: Budget) => {
    // const timestamp = firebase.firestore.Timestamp.fromDate(inputDate);
    // firebase.firestore().collection('carteira').add({
    //   // ...
    //   data: timestamp,
    // })
    //   .then(() => console.log('Data salva com sucesso!'))
    //   .catch((error) => console.error(error));
    try {
      setMovements([...movements, movement])
    } catch (error) {
      console.error(error)
    }
  }

  // remove movement
  const removeMovement = (id: string) => {
    try {
      setMovements(movements.filter((movement) => movement.id !== id))
    } catch (error) {
      console.error(error)
    }
  }

  // update movement
  const updateMovement = (documentId: string, formData: Budget) => {
    console.warn('id: ', documentId, ' - ', 'Dados do Form: ', formData)
    // const movementRef = firestore().collection('orcamento').doc(documentId)

    // movementRef
    //   .update(formData)
    //   .then(() => {
    //     console.log('Document updated successfully')
    //     setMovements(
    //       movements.map((movement) => {
    //         if (movement.id === documentId) {
    //           return {
    //             ...movement,
    //             ...formData,
    //           }
    //         }
    //         return movement
    //       }),
    //     )
    //   })
    //   .catch((error) => {
    //     console.error('Error updating document: ', error)
    //   })
  }

  return (
    <BudgetContext.Provider
      value={{
        movements,
        saldo,
        receita,
        despesa,
        addMovement,
        removeMovement,
        updateMovement,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}
export default BudgetContext
