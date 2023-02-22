import { createContext, useState } from 'react'
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
