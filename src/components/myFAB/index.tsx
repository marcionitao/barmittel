import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { Box, HStack, Icon, IconButton, Stagger, useDisclose, VStack } from 'native-base'
import React from 'react'

const MyFAB = () => {
  const navigation = useNavigation()
  const openScreen = () => {
    // navigation.navigate('screenB');
    navigation.navigate('myForm', { name: 'Marcio' })
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
        right: 30,
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
            bg='indigo.500'
            colorScheme='indigo'
            borderRadius='full'
            onPress={() => {
              openScreen()
              onToggle()
            }}
            icon={
              <Icon
                as={MaterialIcons}
                size='6'
                name='location-pin'
                _dark={{
                  color: 'warmGray.50',
                }}
                color='warmGray.50'
              />
            }
          />
          <IconButton
            mb='4'
            variant='solid'
            bg='yellow.400'
            colorScheme='yellow'
            borderRadius='full'
            onPress={() => {
              openScreen()
              onToggle()
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                _dark={{
                  color: 'warmGray.50',
                }}
                size='6'
                name='microphone'
                color='warmGray.50'
              />
            }
          />
          <IconButton
            mb='4'
            variant='solid'
            bg='teal.400'
            colorScheme='teal'
            borderRadius='full'
            onPress={() => {
              openScreen()
              onToggle()
            }}
            icon={
              <Icon
                as={MaterialCommunityIcons}
                _dark={{
                  color: 'warmGray.50',
                }}
                size='6'
                name='video'
                color='warmGray.50'
              />
            }
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
            icon={
              <Icon
                as={MaterialIcons}
                size='6'
                name='photo-library'
                _dark={{
                  color: 'warmGray.50',
                }}
                color='warmGray.50'
              />
            }
          />
        </Stagger>
      </Box>
      <HStack>
        <IconButton
          variant='solid'
          borderRadius='full'
          size='lg'
          onPress={onToggle}
          bg='green.600'
          icon={
            <Icon
              as={MaterialCommunityIcons}
              size='6'
              name='plus'
              color='warmGray.50'
              _dark={{
                color: 'warmGray.50',
              }}
            />
          }
        />
      </HStack>
    </VStack>
  )
}

export default MyFAB
