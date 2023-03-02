import firestore from '@react-native-firebase/firestore'
import moment from 'moment'
import { createContext, useEffect, useState } from 'react'
import { Budget, BudgetContextType } from '../@types/navigation'

// create context
export const BudgetContext = createContext<BudgetContextType>({
  movements: [],
  addMovement: () => {},
  removeMovement: () => {},
  updateMovement: () => {},
})

// create provider
export const BudgetProvider = ({ children }) => {
  // state
  const [movements, setMovements] = useState<Budget[]>([])

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

  // const date = new Date()
  // const x = new Date(date.getFullYear(), date.getMonth(), 1) // 1º dia do mes atual
  // const y = new Date(date.getFullYear(), date.getMonth() + 1, 1) // 1º dia do mes seguinte

  useEffect(() => {
    // get all movements from firestore
    ;(async () => {
      const db = await firestore()
        .collection('orcamento')
        .orderBy('data', 'desc')
        .where('data', '>=', firstDayCurrentMonth)
        .where('data', '<', firstDayNextMonth)
        .onSnapshot(
          (querySnapshot) => {
            const myData = querySnapshot.docs.map((doc) => {
              return {
                id: doc.id,
                ...doc.data(),
              }
            }) as Budget[]

            //console.warn(myData)
            setMovements(myData)
          },
          (error) => {
            console.error(error)
          },
        )
      return () => db()
    })()
  }, [])

  // add movement
  const addMovement = (movement: Budget) => {
    setMovements([...movements, movement])
  }

  // remove movement
  const removeMovement = (id: string) => {
    setMovements(movements.filter((movement) => movement.id !== id))
  }

  // update movement
  const updateMovement = (id: string) => {
    setMovements(
      movements.map((movement) => {
        if (movement.id === id) {
          return movement
        }
        return movement
      }),
    )
  }

  return (
    <BudgetContext.Provider
      value={{
        movements,
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
