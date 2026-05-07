# Instruções para o Pi ou Opencode(AGENTS.md) - Projeto Barmittel

## Stack do projeto

- **React Native** + **Expo** (bare workflow – pastas android/ e ios/ presentes)
- **Expo Router** (roteamento baseado em arquivos na pasta `app/`)
- **TypeScript** (com `tsconfig.json` e strict mode)
- **Firebase / Firestore** (banco de dados em tempo real para transações, saldo, etc.)
- **Context API** (gerenciamento de estado em `src/context/`)
- **ESLint** + **Prettier** (lint e formatação automática)
- **Assets**: imagens em `assets/images/`

## Estrutura de pastas (obrigatória)

- `app/` → rotas do Expo Router (`_layout.tsx`, `index.tsx`, `myCharts.tsx`, `myForm.tsx`, etc.)
- `src/` → código principal:
  - `src/components/` → componentes reutilizáveis
  - `src/context/` → Context API (autenticação, transações, Firestore)
  - `src/utils/` → funções auxiliares
  - `src/@types/` → declarações de tipos
  - `src/fakeData/` → dados mock (usar só em dev)
- Nunca altere pastas nativas (`android/`, `ios/`) manualmente

## Regras obrigatórias de código

- Sempre use **TypeScript** com type hints completos
- Componentes funcionais com hooks (nunca classes)
- Use `async/await` para chamadas ao Firestore
- Nunca commite dados sensíveis do Firebase (chaves, config) – use `.env` ou Expo secrets
- Mantenha o código limpo: remova `console.log` antes de commit
- Sempre rode `npm run lint` e `npm run format` antes de commit
- Siga o padrão de rotas do Expo Router (pastas e arquivos definem as telas)
- Use Context para estado global (transações, usuário, saldo)
- Tratamento de erro: sempre mostre feedback amigável ao usuário

## Comandos úteis (npm scripts)

- `npm start` ou `expo start` → inicia o Metro bundler + QR Code
- `npm run android` → roda no emulador/dispositivo Android
- `npm run ios` → roda no simulador/dispositivo iOS
- `npm run web` → roda no navegador
- `npm run lint` → executa ESLint
- `npm run format` → formata com Prettier

## Fluxo de trabalho recomendado

1. Crie branch: `feature/nome-da-feature` ou `fix/nome-do-bug`
2. Faça as alterações
3. Rode `npm run lint` e `npm run format`
4. Teste no emulador (`npm run android` ou `npm run ios`)
5. Commit claro e faça PR

## Estilo de respostas do agente

- Seja direto, técnico e conciso
- **Sempre mostre o diff** das alterações que vai fazer (arquivos e linhas)
- Prefira usar os comandos `npm run ...` em vez de comandos crus
- Pergunte **SEMPRE** antes de alterar configurações do Firebase ou arquivos nativos
- Ao criar novas telas: use o padrão do Expo Router (`app/nova-tela.tsx`)
- Ao trabalhar com Firestore: lembre-se de usar queries eficientes e regras de segurança
- Mantenha o UI moderno e intuitivo (conforme descrito no README)

## Dicas extras

- Consulte `README.md` para features (rastreamento de receitas/despesas, saldo, histórico)
- Use `src/fakeData/` apenas para testes rápidos
- Para produção: configure Firebase corretamente no `app.json` ou via Expo config
