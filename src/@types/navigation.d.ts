export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      screenA: undefined
      // screenB: undefined;
      // passando parametros entre telas
      screenB: {
        name: string
      }
    }
  }
}
