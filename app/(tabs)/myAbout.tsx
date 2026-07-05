import { View, Text, StyleSheet, ScrollView, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'


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

export default function MyAbout() {
  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <LinearGradient colors={['#F8B600', '#fff']} style={styles.gradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#006E61',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#006E61',
    marginBottom: 16,
  },
  featureCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  techContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  techBadge: {
    backgroundColor: '#006E61',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  techText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
})