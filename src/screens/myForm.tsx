import { useRoute } from '@react-navigation/native'
import { Box, Text, VStack } from 'native-base'
import { useState } from 'react'

interface MovimentosProps {
  route: any
}

const MyForm = ({ route }: MovimentosProps) => {
  route = useRoute()
  const [carteira, setCarteira] = useState(route.params ? route.params : {})

  return (
    <Box p='4' flex={1} bgColor={'#FFF'}>
      <VStack>
        <Box>
          <Text>{carteira.id}</Text>
          <Text>{carteira.fullName}</Text>
          <Text>{carteira.recentText}</Text>
          <Text>{carteira.timeStamp}</Text>
        </Box>
      </VStack>
    </Box>
  )
}

export default MyForm
