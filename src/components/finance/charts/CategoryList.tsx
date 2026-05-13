// Objetivo
// Renderizar: FlatList<CategoryRow />
// - manter performance boa,
// - deixar layout clean,
// - evitar scroll estranho,
// - deixar pronto para crescer

import { FlatList, View } from 'react-native'

import CategoryRow from './CategoryRow'

type Category = {
  nome: string
  valor: number
  transacoes: number
  icon: string
  color: string
}

type Props = {
  categories: Category[]
}

export default function CategoryList({
  categories,
}: Props) {
  return (
    <View
      style={{
        marginTop: 10,
      }}
    >
      <FlatList
        data={categories}
        keyExtractor={(item) => item.nome}
        renderItem={({ item }) => (
          <CategoryRow
            nome={item.nome}
            valor={item.valor}
            transacoes={item.transacoes}
            icon={item.icon}
            color={item.color}
          />
        )}
        scrollEnabled={false}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />
    </View>
  )
}