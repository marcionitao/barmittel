# Session State: Sistema de Busca de Movimentos

> **MANDATÓRIO**: Após cada fase implementada, este ficheiro **DEVE** ser atualizado.
> **AGUARDAR CONFIRMAÇÃO** antes de implementar qualquer código.

---

## 📊 Análise do Sistema de Busca

### Requisitos do Utilizador
1. **Fonte de dados**: `movements` do `budgetContext.tsx`
2. **Tipo de busca**: Texto livre (filtro por categoria e descrição)
3. **Localização**: Substituir aba "About" por nova aba "Pesquisar"
4. **Análise de impacto**: Pesquisa de 1-2 anos de dados

---

## 🏗️ Estrutura Atual da App

### Abas Existentes (`app/(tabs)/_layout.tsx`)
| Aba | Ficheiro | Função |
|-----|----------|--------|
| Home | `index.tsx` | Saldo + lista de movimentos |
| Charts | `myCharts.tsx` | Gráficos |
| Plus | `plus.tsx` | Modal para criar movimento |
| Agenda | `myFuture.tsx` | Calendário + movimentos futuros |
| About | `myAbout.tsx` | Info estática da app |

### Dados Disponíveis em `budgetContext.tsx`
```typescript
// Estado movements: movimentos do mês com data <= hoje
movements: Budget[]

// Estado movimentosFuturos: movimentos com data > hoje
movimentosFuturos: Budget[]

// Tipo Budget:
{
  id: string
  acao: string          // 'Despesa' | 'Receita' | 'Investimento'
  categoria: string     // ex: "Alimentação", "Transportes"
  descricao: string     // texto livre
  movimentos: number    // valor monetário
  data: Date | Timestamp
}
```

### Query Firestore Atual
```typescript
// movements: mês atual + data <= hoje
.where('data', '>=', firstDayCurrentMonth)
.where('data', '<', firstDayNextMonth)

// movimentosFuturos: data > hoje
.where('data', '>', today)
```

---

## ⚠️ Análise de Impacto: Pesquisa de 1-2 Anos

### Problema Atual
A query Firestore é **mensal** - só carrega dados do mês atual. Para pesquisar 1-2 anos de dados, precisamos de **mudar a query**.

### Opções Disponíveis

| Opção | Descrição | Prós | Contras |
|-------|-----------|------|---------|
| **A. Query ampla Firestore** | Buscar todos os dados de 1-2 anos | Dados completos | Muitos dados, lento |
| **B. Paginação Firestore** | Carregar em lotes (ex: 50 por vez) | Boa performance | Complexo de implementar |
| **C. Client-side (atual)** | Filtrar só o que já está em memória | Simples | Só pesquisa dados do mês |
| **D. Firestore full-text** | Usar Algolia ou Typesense | Busca avançada | Exige serviço externo |
| **E. Firestore text search** | Usar prefixos + `\uf8ff` | Funciona nativo | Busca limitada |

### Recomendação: Opção E (Firestore text search)

**Porquê:**
- Não depende de serviços externos
- Funciona com o Firestore nativo
- Suporta buscas por prefixo (ex: "Alim" → "Alimentação")
- Performance aceitável para 1-2 anos de dados pessoais

**Como funciona:**
```typescript
// Busca por categoria (prefixo)
.where('categoria', '>=', query)
.where('categoria', '<=', query + '\uf8ff')

// Busca por descrição (prefixo)
.where('descricao', '>=', query)
.where('descricao', '<=', query + '\uf8ff')
```

**Limitações:**
- Só busca por prefixo (não por palavra no meio)
- Precisa de criar index composto no Firestore
- Para 1-2 anos: ~100-500 documentos (aceitável)

### Análise de Performance

| Período | Movimentos Estimados | Tempo Resposta Firestore |
|---------|---------------------|--------------------------|
| 1 mês | 20-50 | < 100ms |
| 6 meses | 120-300 | ~100-200ms |
| 1 ano | 240-600 | ~200-400ms |
| 2 anos | 480-1200 | ~400-800ms |

**Conclusão:** Para uso pessoal (até 2 anos), o Firestore consegue lidar sem problemas. O principal gargalo será a **renderização** da lista, não a query.

---

## 📋 Plano de Implementação

### Fase 1: Preparação e Configuração Firestore
**Objetivo:** Configurar query de busca no Firestore

**Tarefas:**
- [ ] Criar index composto no Firestore: `orcamento` collection
  - `categoria` ASC + `data` DESC
  - `descricao` ASC + `data` DESC
  - `acao` ASC + `data` DESC
- [ ] Criar função `searchMovements(query, filters)` no `budgetContext.tsx`
- [ ] Criar tipo `SearchFilters` para filtros avançados
- [ ] Adicionar estados: `searchResults`, `isSearching`, `searchQuery` no context

**Dependências Firestore:**
- Indexes compostos (criar no Firebase Console)
- Query limitada a 1000 documentos (padrão Firestore)

**Validação:** Query retorna dados sem erro no console

---

### Fase 2: Criar Componente de Busca
**Objetivo:** UI da barra de busca e filtros

**Tarefas:**
- [ ] Criar `src/components/SearchBar.tsx`:
  - `TextInput` com ícone de busca
  - Debounce 300ms para evitar queries excessivas
  - Botão limpar (X)
  - Indicador de loading
- [ ] Criar `src/components/SearchFilters.tsx`:
  - Filtro por tipo (Despesa/Receita/Investimento)
  - Filtro por período (1 mês, 6 meses, 1 ano, 2 anos, Personalizado)
  - Botões toggle para cada filtro
- [ ] Criar `src/components/SearchResults.tsx`:
  - Lista de resultados com `FlatList`
  - Reutilizar padrão de `ListItem.Swipeable` do `MovimentList.tsx`
  - Empty state quando não há resultados

**Dependências:** Nenhuma (só React Native)

**Validação:** Componentes renderizam sem erros

---

### Fase 3: Criar Ecrã de Busca
**Objetivo:** Tela principal da funcionalidade de busca

**Tarefas:**
- [ ] Criar `app/(tabs)/mySearch.tsx`:
  - Header com título "Pesquisar"
  - `SearchBar` no topo
  - `SearchFilters` abaixo da barra
  - `SearchResults` com scroll
  - Resultados agrupados por data (seção)
- [ ] Integrar com `budgetContext`:
  - Chamar `searchMovements()` ao submeter busca
  - Mostrar loading durante pesquisa
  - Tratar erros (sem resultados, erro de rede)
- [ ] Adicionar contadores:
  - "X resultados encontrados"
  - "Pesquisando em 2 anos de dados..."

**Dependências:** Fases 1 e 2

**Validação:** Busca retorna resultados corretos

---

### Fase 4: Substituir Aba About
**Objetivo:** Trocar "About" por "Pesquisar" na tab bar

**Tarefas:**
- [ ] Atualizar `app/(tabs)/_layout.tsx`:
  - Mudar nome da aba de `myAbout` para `mySearch`
  - Mudar título de "About" para "Pesquisar"
  - Mudar ícone de `info` para `search`
- [ ] Renomear ou remover `myAbout.tsx`:
  - Opção A: Renomear para `myAbout_old.tsx` (backup)
  - Opção B: Remover completamente
- [ ] Criar `app/(tabs)/mySearch.tsx` (da Fase 3)
- [ ] Mover conteúdo estático do About:
  - Criar `src/components/AboutInfo.tsx` com conteúdo
  - Ou mover para modal/opção de menu

**Dependências:** Fase 3

**Validação:** Aba "Pesquisar" aparece e funciona

---

### Fase 5: Otimização e Polimento
**Objetivo:** Performance, UX e edge cases

**Tarefas:**
- [ ] **Performance:**
  - Memoizar componente de lista (`React.memo`)
  - Limitar resultados a 500 itens
  - Cache de queries recentes (localStorage)
  - Cancelar query anterior se nova busca inicia
- [ ] **UX:**
  - Animações de entrada/saída
  - Skeleton loading durante busca
  - Feedback visual de filtros ativos
  - Swipe para deletar (reutilizar padrão existente)
- [ ] **Edge cases:**
  - Busca vazia → mostrar todos os movimentos recentes
  - Caracteres especiais (acentos, cedilha)
  - Busca muito longa (> 50 caracteres)
  - Sem resultados → mensagem amigável
- [ ] **Testes:**
  - Testar buscas: "Alim" → Alimentação
  - Testar filtros: só Despesas, período 6 meses
  - Testar performance: 1000+ movimentos
  - Testar offline/erro de rede

**Dependências:** Fases 1-4

**Validação:** Tudo funciona sem erros, performance aceitável

---

## 🎯 Fluxo de Utilização

```
1. Utilizador toca na aba "Pesquisar" (substitui "About")
2. Vê barra de busca + filtros + área de resultados
3. Digita "Supermercado" na barra de busca
4. App pesquisa em 2 anos de dados no Firestore
5. Mostra: "12 resultados encontrados"
6. Lista mostra movimentos com "Supermercado" na descrição
7. Utilizador pode:
   - Filtrar por tipo (só Despesas)
   - Filtrar por período (último mês)
   - Limpar busca
   - Tocar num resultado → navegar para edição
   - Swipe para eliminar
```

---

## 🔧 Desafios Técnicos Identificados

### 1. Firestore Text Search Limitado
- **Problema:** Firestore não suporta full-text search nativo
- **Solução:** Usar busca por prefixo com `\uf8ff`
- **Impacto:** Busca "Super" encontra "Supermercado", mas "mercado" não

### 2. Indexes Compostos
- **Problema:** Queries compostas precisam de indexes específicos
- **Solução:** Criar indexes no Firebase Console
- **Impacto:** Precisa de acesso ao Firebase, pode demorar a propagar

### 3. Performance com Muitos Dados
- **Problema:** 1000+ movimentos podem causar lag na renderização
- **Solução:** Paginação, virtualização, limitar resultados
- **Impacto:** Complexidade adicional, mas necessário

### 4. Sincronização com Estado Atual
- **Problemo:** `movements` do context só tem dados do mês
- **Solução:** Query separada para busca (não afeta estado global)
- **Impacto:** Dados duplicados em memória (aceitável)

---

## 📁 Ficheiros a Criar/Modificar

| Ficheiro | Ação | Descrição |
|----------|------|-----------|
| `src/context/budgetContext.tsx` | Modificar | Adicionar `searchMovements()` |
| `src/components/SearchBar.tsx` | Criar | Barra de busca com debounce |
| `src/components/SearchFilters.tsx` | Criar | Filtros por tipo e período |
| `src/components/SearchResults.tsx` | Criar | Lista de resultados |
| `app/(tabs)/mySearch.tsx` | Criar | Ecrã principal de busca |
| `app/(tabs)/_layout.tsx` | Modificar | Trocar About por Pesquisar |
| `app/(tabs)/myAbout.tsx` | Remover/Backup | Conteúdo movido ou descartado |

---

## 📊 Métricas de Sucesso

| Métrica | Target |
|---------|--------|
| Tempo de busca (< 500 movimentos) | < 300ms |
| Tempo de busca (1000+ movimentos) | < 800ms |
| Taxa de acerto (prefixo correto) | 100% |
| UX: utilizador encontra movimento em < 10s | Sim |

---

## 📋 Fases e Status

| Fase | Status | Descrição |
|------|--------|-----------|
| 1 | ⏳ Pendente | Configuração Firestore + query de busca |
| 2 | ⏳ Pendente | Componentes UI (SearchBar, Filters, Results) |
| 3 | ⏳ Pendente | Ecrã de busca completo |
| 4 | ⏳ Pendente | Substituir aba About por Pesquisar |
| 5 | ⏳ Pendente | Otimização, polimento e testes |

---

## ✅ Pré-requisitos

- [ ] Acesso ao Firebase Console para criar indexes
- [ ] Verificar se Firestore já tem indexes existentes
- [ ] Decidir se mantemos About em outro local (modal, footer, etc.)

---

## ⏳ Próximos Passos

1. **Aguardar confirmação** do utilizador para prosseguir
2. **Criar indexes** no Firebase Console (Fase 1)
3. **Implementar Fase 1** - query de busca no budgetContext

---

*Última atualização: 2026-07-03 - Plano de implementação criado, aguardando confirmação*