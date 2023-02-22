import { Entypo, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Avatar, Badge, Box, HStack, Icon, Pressable, Spacer, Text, VStack } from 'native-base'
import { SwipeListView } from 'react-native-swipe-list-view'
import MyFAB from '../components/myFAB'
import MySelector from '../components/mySelector'
import { fakeData } from '../fakeData/data'

interface MovimentosProps {
  navigation: any
}

const MyHome = ({ navigation }: MovimentosProps) => {
  navigation = useNavigation()
  //
  const getMovimentItem = ({ item, index }) => {
    return (
      <Box mt={1}>
        <Pressable
          onPress={() => {
            navigation.navigate('myForm', item)
          }}
          _light={{
            bg: 'white',
          }}
        >
          <Box pl='4' pr='5' py='3' borderTopWidth={0.3} borderColor='grey.50'>
            <HStack space={[4, 5]} justifyContent='space-between'>
              <Avatar
                size='48px'
                source={{
                  uri: item.avatarUrl,
                }}
              />
              <VStack>
                <Text color='coolGray.800' bold>
                  {item.fullName}
                </Text>
                <Text color='coolGray.600'>{item.recentText}</Text>
              </VStack>
              <Spacer />
              <Text fontSize='xs' color='coolGray.800' alignSelf='flex-start'>
                {item.timeStamp}
              </Text>
            </HStack>
          </Box>
        </Pressable>
      </Box>
    )
  }

  const renderHiddenItem = (data, rowMap) => (
    <HStack flex='1' pl='2' mt={1} borderTopWidth={0.3} borderColor='grey.500'>
      <Pressable
        w='70'
        ml='auto'
        bg='coolGray.200'
        justifyContent='center'
        onPress={() => {}}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems='center' space={2}>
          <Icon as={<Entypo name='dots-three-horizontal' />} size='xs' color='coolGray.800' />
          <Text fontSize='xs' fontWeight='medium' color='coolGray.800'>
            More
          </Text>
        </VStack>
      </Pressable>
      <Pressable
        w='70'
        bg='red.500'
        justifyContent='center'
        onPress={() => {}}
        _pressed={{
          opacity: 0.5,
        }}
      >
        <VStack alignItems='center' space={2}>
          <Icon as={<MaterialIcons name='delete' />} color='white' size='xs' />
          <Text color='white' fontSize='xs' fontWeight='medium'>
            Delete
          </Text>
        </VStack>
      </Pressable>
    </HStack>
  )

  return (
    <Box p='2' flex={1} bgColor={'#FFF'}>
      {/* this is collumn */}
      <VStack bgColor={'#FFF'}>
        {/* this is rows */}
        <HStack>
          <Badge
            mt={1}
            p={19}
            w='1/2'
            colorScheme='success'
            _text={{
              fontSize: 15,
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
              fontSize: 15,
            }}
          >
            785,25€
          </Badge>
        </HStack>

        <Box alignItems='center'>
          <Badge
            mt={2}
            p={17}
            w='100%'
            backgroundColor={'#FFF'}
            colorScheme='success'
            variant={'outline'}
            _text={{
              fontWeight: 'bold',
              fontSize: 30,
            }}
          >
            1671,61€
          </Badge>
        </Box>
        {/* my selector of months */}
        <MySelector label={'JANEIRO'} value={'1'} />

        <SwipeListView
          data={fakeData}
          renderItem={getMovimentItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-140}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
        />
      </VStack>
      {/* my FAB button */}
      <MyFAB />
    </Box>
  )
}

export default MyHome
