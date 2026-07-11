import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { Feather } from '@expo/vector-icons'

const version = '1.3.0'

const FEATURES = [
  {
    title: 'Registar Receitas e Despesas',
    description: 'Regista facilmente as tuas transações para saber para onde vai o teu dinheiro.',
    icon: '💰',
  },
  {
    title: 'Ver Saldo',
    description: 'Obtém uma visão clara da tua situação financeira atual.',
    icon: '📊',
  },
  {
    title: 'Histórico de Transações',
    description: 'Consulta a lista dos teus últimos movimentos.',
    icon: '📋',
  },
  {
    title: 'Interface Moderna',
    description: 'Uma interface limpa e intuitiva.',
    icon: '✨',
  },
  {
    title: 'IA Assistente',
    description: 'Um Chat Bot inteligente para ajudar a gerir as tuas finanças.',
    icon: '🤖',
  },
]

const TECHS = [
  'React Native',
  'Expo',
  'TypeScript',
  'Firebase Firestore',
  'React Navigation',
]

interface AboutModalProps {
  visible: boolean
  onClose: () => void
}

export default function AboutModal({ visible, onClose }: AboutModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
        <LinearGradient colors={['#F8B600', '#fff']} style={styles.gradient}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/icon_3.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Barmittel</Text>
            <Text style={styles.subtitle}>
              A tua app de controlo financeiro pessoal
            </Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Funcionalidades Principais</Text>
              {FEATURES.map((feature, index) => (
                <View key={index} style={styles.featureCard}>
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tecnologias</Text>
              <View style={styles.techContainer}>
                {TECHS.map((tech, index) => (
                  <View key={index} style={styles.techBadge}>
                    <Text style={styles.techText}>{tech}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Versão {version}</Text>
              <Text style={styles.footerText}>Desenvolvido by Marcio ❤️</Text>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="#666" />
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 20,
    paddingHorizontal: 24,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#006E61',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#006E61',
    marginBottom: 14,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  techBadge: {
    backgroundColor: '#006E61',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  techText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
})