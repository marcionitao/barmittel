export type Budget = {
  id: string
  acao: string
  categoria: string
  descricao: string
  movimentos: number
  data: Date
}

export type BudgetContextType = {
  movements: Budget[]
  saldo: number
  receita: number
  despesa: number
  //setMovement: (movements: Budget[]) => void
  addMovement: (newMovement: Budget) => void
  removeMovement: (movementId: string) => void
  updateMovement: (movementId: string, formData: Budget) => void
}

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      myHome: undefined
      myForm: { acao?: string }
    }
  }
}
