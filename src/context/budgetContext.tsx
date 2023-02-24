import moment from 'moment'
import { createContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore'
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

  // get current date using moment.js
  const currentDate = moment()

  //get first month from current year using moment.js
  const firstMonth = moment().year(currentDate.year()).month(0)

  //get current month from current year using moment.js
  const currentMonth = moment().year(currentDate.year()).month(currentDate.month())

  useEffect(() => {
    // get all movements from firestore
    const db = firestore()
      .collection('orcamento')
      .orderBy('data', 'desc')
      .where('data', '>=', firstMonth)
      .where('data', '<=', currentMonth)
      .onSnapshot((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Budget[]

        setMovements(data)
      })

    return () => db()
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
