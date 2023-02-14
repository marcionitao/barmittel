import { Badge, Box, Heading } from 'native-base'
import MyFAB from '../components/myFAB'

const MyHome = () => {
  return (
    <Box p='4' safeArea flex={1}>
      <Heading fontSize='xl' p='2' pb='2'>
        My Task List
      </Heading>
      <Box alignItems='center'>
        <Badge
          mt={2}
          p={19}
          w='100%'
          colorScheme='success'
          variant={'outline'}
          _text={{
            fontSize: 25,
          }}
        >
          NEW FEATURE
        </Badge>
      </Box>

      <MyFAB />
    </Box>
  )
}

export default MyHome
