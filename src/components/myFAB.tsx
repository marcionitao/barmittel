import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Box, HStack, Icon, IconButton, Stagger, useDisclose, VStack } from 'native-base'
import React from 'react'

const MyFAB = () => {
  const navigation = useNavigation()
  const openScreen = () => {
    // navigation.navigate('screenB');
    navigation.navigate('myForm')
  }

  const { isOpen, onToggle } = useDisclose()

  return (
    <VStack
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        position: 'absolute',
        bottom: 50,
        right: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    >
      <Box>
        <Stagger
          visible={isOpen}
          initial={{
            opacity: 0,
            scale: 0,
            translateY: 34,
          }}
          animate={{
            translateY: 0,
            scale: 1,
            opacity: 1,
            transition: {
              type: 'spring',
              mass: 0.8,
              stagger: {
                offset: 30,
                reverse: true,
              },
            },
          }}
          exit={{
            translateY: 34,
            scale: 0.5,
            opacity: 0,
            transition: {
              duration: 100,
              stagger: {
                offset: 30,
                reverse: true,
              },
            },
          }}
        >
          <IconButton
            mb='4'
            variant='solid'
            bg='green.500'
            colorScheme='green'
            borderRadius='full'
            onPress={() => {
              openScreen()
              onToggle()
            }}
            icon={<Icon as={MaterialIcons} size='6' name='arrow-circle-up' color='warmGray.50' />}
          />
          <IconButton
            mb='4'
            variant='solid'
            bg='red.500'
            colorScheme='red'
            borderRadius='full'
            onPress={() => {
              openScreen()
              onToggle()
            }}
            icon={<Icon as={MaterialIcons} size='6' name='arrow-circle-down' color='warmGray.50' />}
          />
        </Stagger>
      </Box>
      <HStack>
        <IconButton
          variant='solid'
          borderRadius='full'
          size='lg'
          onPress={onToggle}
          bg='#006E61'
          icon={<Icon as={MaterialIcons} size='6' name='add' color='warmGray.50' />}
        />
      </HStack>
    </VStack>
  )
}

export default MyFAB
