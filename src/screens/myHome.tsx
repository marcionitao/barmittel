import { Badge, Box, HStack, Text, VStack } from 'native-base'
import MyFAB from '../components/myFAB'
import MySelector from '../components/mySelector'

const MyHome = () => {
  return (
    <Box p='2' flex={1} bgColor={'#FFF'}>
      {/* this is collumn */}
      <VStack bgColor={'#FFF'}>
        {/* this is rows */}
        <HStack>
          <Badge
            mt={2}
            p={19}
            w='1/2'
            colorScheme='success'
            _text={{
              fontSize: 18,
            }}
          >
            2456,86€
          </Badge>
          <Badge
            mt={2}
            p={19}
            w='1/2'
            colorScheme='danger'
            _text={{
              fontSize: 18,
            }}
          >
            785,25€
          </Badge>
        </HStack>

        <Box alignItems='center'>
          <Badge
            mt={2}
            p={19}
            w='100%'
            backgroundColor={'#FFF'}
            colorScheme='success'
            variant={'outline'}
            _text={{
              fontWeight: 'bold',
              fontSize: 40,
            }}
          >
            1671,61€
          </Badge>
        </Box>
        {/* my selector of months */}
        <MySelector label={'JANEIRO'} value={'1'} />
        <Box>
          <Text>meu texto aqui</Text>
          <Text>meu texto aqui</Text>
          <Text>meu texto aqui</Text>
          <Text>meu texto aqui</Text>
        </Box>
      </VStack>
      {/* my FAB button */}
      <MyFAB />
    </Box>
  )
}

export default MyHome
