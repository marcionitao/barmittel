import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

type Props = {
  visible: boolean
  onClose: () => void
}

export default function CreateMovementModal({
  visible,
  onClose,
}: Props) {
  const router = useRouter()

  const navigateToForm = (acao: string) => {
    onClose()

    router.push({
      pathname: '/myForm',
      params: {
        acao,
      },
    })
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.3)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            padding: 24,
            paddingBottom: 40,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 24,
              textAlign: 'center',
            }}
          >
            Novo Movimento
          </Text>

          {/* RECEITA */}
          <TouchableOpacity
            onPress={() => navigateToForm('Receita')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
            }}
          >
            <MaterialIcons
              name="arrow-upward"
              size={26}
              color="green"
            />

            <Text
              style={{
                marginLeft: 16,
                fontSize: 18,
              }}
            >
              Receita
            </Text>
          </TouchableOpacity>

          {/* DESPESA */}
          <TouchableOpacity
            onPress={() => navigateToForm('Despesa')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
            }}
          >
            <MaterialIcons
              name="arrow-downward"
              size={26}
              color="red"
            />

            <Text
              style={{
                marginLeft: 16,
                fontSize: 18,
              }}
            >
              Despesa
            </Text>
          </TouchableOpacity>

          {/* INVESTIMENTO */}
          <TouchableOpacity
            onPress={() => navigateToForm('Investimento')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 16,
            }}
          >
            <MaterialIcons
              name="currency-exchange"
              size={26}
              color="orange"
            />

            <Text
              style={{
                marginLeft: 16,
                fontSize: 18,
              }}
            >
              Investimento
            </Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  )
}