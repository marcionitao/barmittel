import { Tabs } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import CreateMovementModal from '../../src/components/CreateMovementModal'
import { AssistantFAB } from '../../src/components/assistant/AssistantFAB'
import { AssistantModal } from '../../src/components/assistant/AssistantModal'

export default function TabsLayout() {

  const [modalVisible, setModalVisible] = useState(false)
  const [assistantVisible, setAssistantVisible] = useState(false)

  return (
    <>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: '#F8B600',
          },

          headerShadowVisible: false,

          tabBarActiveTintColor: '#006E61',
          tabBarInactiveTintColor: '#999',

          tabBarStyle: {
            height: 70,
            paddingBottom: 10,
            paddingTop: 10,
            borderTopWidth: 0,
            elevation: 10,
          },
        }}
      >
        {/* HOME */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',

            headerTitle: 'BARMITTEL',

            tabBarIcon: ({ color, size }) => (
              <Feather name="home" size={size} color={color} />
            ),
          }}
        />

        {/* CHARTS */}
        <Tabs.Screen
          name="myCharts"
          options={{
            title: 'Charts',

            headerTitle: 'Gráfico',

            tabBarIcon: ({ color, size }) => (
              <Feather name="bar-chart-2" size={size} color={color} />
            ),
          }}
        />

        {/* PLUS */}
        <Tabs.Screen
          name="plus"
          options={{

            title: '',

            tabBarIcon: () => null,

            tabBarButton: () => (
              <View
                style={{
                  top: -6,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  activeOpacity={0.7}
                  style={{
                    width: 58,
                    height: 58,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Feather
                    name="plus"
                    size={32}
                    color="#006E61"
                  />
                </TouchableOpacity>
              </View>
            ),
          }}
        />

        {/* FUTURE */}
        <Tabs.Screen
          name="myFuture"
          options={{
            title: 'Agenda',

            headerTitle: 'Agenda',

            tabBarIcon: ({ color, size }) => (
              <Feather name="calendar" size={size} color={color} />
            ),
          }}
        />

        {/* SEARCH */}
        <Tabs.Screen
          name="mySearch"
          options={{
            title: 'Pesquisar',

            headerTitle: 'Pesquisar',

            tabBarIcon: ({ color, size }) => (
              <Feather name="search" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
      <CreateMovementModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
      <AssistantFAB onPress={() => setAssistantVisible(true)} />
      <AssistantModal
        visible={assistantVisible}
        onClose={() => setAssistantVisible(false)}
      />
    </>
  )
}