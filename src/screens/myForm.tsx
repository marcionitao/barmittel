import { useRoute } from '@react-navigation/native'
import { Box, Text, VStack } from 'native-base'

// definindo o tipo para evitar erros
type ParamsProps = {
  name: string
}

const MyForm = () => {
  //
  const route = useRoute()
  // const { name } = route.params as ParamsProps

  return (
    <Box p='4' flex={1} bgColor={'#FFF'}>
      <VStack>
        <Box>
          <Text>meu texto aqui</Text>
          <Text>meu texto aqui</Text>
          <Text>meu texto aqui</Text>
          <Text>meu texto aqui</Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default MyForm
