# 📜 Relatório de Criação e Decisões Técnicas
## Projeto: Dragon Sanctuary — Plataforma de Gerenciamento de Dragões

---

## 1. Introdução e Contexto

O objetivo deste projeto foi conceber e implementar a interface web completa para a **Plataforma de Gerenciamento de Dragões**, consumindo a API REST disponibilizada no endereço `http://5c4b2a47aa8ee500142b4887.mockapi.io/api/v1/dragon`.

Buscando superar os requisitos básicos de um CRUD convencional, a aplicação foi projetada sob uma estética temática e imersiva intitulada **"Ancient Drake"** (inspirada na união de tons de verde esmeralda profundo, bronze dracônico, texturas de rocha e composições fotográficas no estilo de grandes produções de cinema e natureza).

---

## 2. Tecnologias Escolhidas e Justificativas

| Tecnologia | Função no Projeto | Racional da Escolha |
|---|---|---|
| **Next.js 15+ (App Router)** | Framework Frontend Principal | Escolhido conforme exigência do desafio. A arquitetura com App Router permite divisão limpa de layouts, rotas dinâmicas (`/dragons/[id]`, `/dragons/[id]/edit`), roteamento aninhado e performance otimizada de carregamento. |
| **TypeScript** | Linguagem de Desenvolvimento | Garante segurança de tipos de ponta a ponta, autocompletion preciso para as respostas da API e prevenção de bugs em tempo de compilação. |
| **Tailwind CSS** | Estilização & Design System | Permite criar uma interface sob medida utilizando variáveis semânticas de cores (`--background`, `--card`, `--primary`, `--secondary`), viabilizando tanto o modo escuro quanto o claro de forma elegante. |
| **GSAP & @gsap/react** | Engine de Animação | Adotado para criar uma experiência sensorial de alto padrão. O hook oficial `useGSAP` garante limpeza automática de memória e animações como o efeito de parallax no hero de login e as entradas sequenciais (*stagger*) dos cards. |
| **TanStack React Query v5** | Estado Assíncrono & Cache | Elimina a necessidade de controle manual de requisições com `useEffect`. Trata automaticamente estados de carregamento (`isLoading`), falhas de rede (`isError`), mutações (criação, edição, remoção) e invalidação de cache para manter a lista sempre atualizada. |
| **React Hook Form + Zod** | Gestão e Validação de Formulários | Validação declarativa e fortemente tipada. Impede envios de dados inválidos para a API com feedback imediato aos campos do usuário. |
| **Sonner** | Notificações (Toasts) | Fornece feedback visual claro ao usuário após ações críticas como autenticação, cadastros, alterações e banimento de dragões. |
| **Docker & Docker Compose** | Empacotamento em Container | Construção multi-estágio (`node:20-alpine`) que separa a instalação de dependências e a compilação de produção, gerando uma imagem leve e segura para implantação. |

---

## 3. Estrutura de Pastas e Organização da Arquitetura

Optou-se pelo padrão **Feature-Based** (baseado em funcionalidades/domínios), reconhecido no ecossistema profissional por facilitar a escalabilidade, manutenção e separação de responsabilidades:

```text
src/
├── app/                                 # Estrutura de rotas do Next.js (App Router)
│   ├── (auth)/                          # Route group para fluxos públicos de autenticação
│   │   ├── login/page.tsx               # Página de Login com Hero Editorial e Parallax
│   │   └── layout.tsx                   # Layout sem barra de navegação interna
│   ├── (dashboard)/                     # Route group para rotas autenticadas
│   │   ├── dragons/
│   │   │   ├── page.tsx                 # Listagem de dragões em ordem alfabética
│   │   │   ├── new/page.tsx             # Cadastro de novo dragão
│   │   │   └── [id]/
│   │   │       ├── page.tsx             # Detalhes de um dragão (nome, tipo, data, histórias)
│   │   │       └── edit/page.tsx        # Edição de dados do dragão
│   │   └── layout.tsx                   # Layout autenticado com AppHeader, AppFooter e textura
│   ├── globals.css                      # Configurações de tema, fontes e gradientes
│   ├── layout.tsx                       # Root layout com importação de fontes do Google e Providers
│   ├── not-found.tsx                    # Página 404 temática e estilizada
│   └── page.tsx                         # Rota raiz com redirecionador inteligente de sessão
├── components/
│   ├── ui/                              # Primitivos de interface (botões, inputs, modais, badges)
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── skeleton.tsx
│   └── shared/                          # Componentes de alto nível compartilhados
│       ├── app-footer.tsx
│       ├── app-header.tsx
│       ├── delete-confirm-dialog.tsx
│       ├── empty-state.tsx
│       ├── page-header.tsx
│       └── theme-toggle.tsx
├── features/                            # Módulos de domínio da aplicação
│   ├── auth/                            # Domínio de autenticação
│   │   ├── components/hero-login-form.tsx
│   │   ├── context/auth-context.tsx
│   │   ├── hooks/use-auth.ts
│   │   ├── schemas/auth-schema.ts
│   │   └── types/auth-types.ts
│   └── dragons/                         # Domínio principal de gerenciamento dos dragões
│       ├── api/dragon-api.ts            # Cliente HTTP com ordenação alfabética e normalização
│       ├── components/
│       │   ├── dragon-card.tsx          # Card da lista com ações rápidas
│       │   ├── dragon-element-badge.tsx # Identificador dinâmico de afinidade elemental
│       │   ├── dragon-form.tsx          # Formulário compartilhado (Create / Edit)
│       │   ├── dragon-history-list.tsx  # Apresentador de crônicas e habilidades
│       │   └── dragon-search-filter.tsx # Barra de busca e estatísticas
│       ├── hooks/use-dragons.ts         # Queries e Mutations do TanStack Query
│       ├── schemas/dragon-schema.ts     # Esquema Zod do formulário do dragão
│       └── types/dragon-types.ts        # Interfaces e definições de tipo do dragão
├── lib/                                 # Utilitários compartilhados
│   ├── gsap.ts                          # Registro centralizado de plugins do GSAP
│   ├── query-client.ts                  # Configuração singleton do TanStack Query
│   └── utils.ts                         # Helpers de classes Tailwind e formatação de datas
├── providers/                           # Provedores de contexto (Theme, Query, Auth, Toaster)
│   └── app-providers.tsx
└── public/
    └── images/                          # Ativos e fotografias ultrarrealistas geradas
```

---

## 4. Componentes Criados e Reutilização

Para atender e superar a exigência do teste (mínimo de 3 componentes reutilizáveis), os seguintes componentes centrais foram construídos:

1. **`<DragonForm />`**:
   - *Finalidade:* Utilizado tanto na página de cadastro (`/dragons/new`) quanto na de edição (`/dragons/[id]/edit`).
   - *Comportamento:* Adapta dinamicamente seus textos, botões e valores iniciais dependendo da presença da propriedade `initialData`. Valida campos obrigatórios (`name` e `type`) e trata o campo de histórico opcional.
2. **`<DragonCard />`**:
   - *Finalidade:* Exibido na listagem em grade responsiva.
   - *Comportamento:* Apresenta o nome, emblema do dragão, elemento cromático, data formatada em português brasileiro, contador de crônicas e aciona a exclusão ou navegação para edição e detalhes.
3. **`<DragonElementBadge />`**:
   - *Finalidade:* Utilizado no card, na página de detalhes e nas sugestões do formulário.
   - *Comportamento:* Analisa semanticamente a string do tipo/elemento (ex: "Fogo", "Fire", "Gelo", "Luz", "Tempestade") e injeta automaticamente o ícone correspondente (chama, floco de neve, raio, etc.) e o gradiente cromático correto.
4. **`<DeleteConfirmDialog />`**:
   - *Finalidade:* Modal de confirmação reutilizado na listagem e na página de detalhes para prevenir deleções acidentais.
5. **`<PageHeader />`**:
   - *Finalidade:* Padroniza o cabeçalho de todas as páginas internas com título em fonte Cinzel, subtítulo explicativo, botão de voltar contextual e área de ações.
6. **`<EmptyState />`**:
   - *Finalidade:* Renderizado tanto em buscas sem resultado quanto em caso de base vazia, exibindo uma fotografia conceitual e opções para cadastrar ou limpar filtros.
7. **`<DragonSearchFilter />`**:
   - *Finalidade:* Componente reutilizável de busca textual com contadores estatísticos em tempo real.
8. **`<ThemeToggle />`**:
   - *Finalidade:* Controle universal de modo escuro e claro integrado com `next-themes`.

---

## 5. Dificuldades Encontradas e Soluções Adotadas

### 1. Inconsistência na Estrutura do Campo `histories` da API MockAPI
- **Problema:** Ao inspecionar os dados reais retornados pela API pública, observou-se que diferentes registros continham formatos discrepantes para o campo `histories`: alguns eram arrays de strings (`["Atinge velocidades..."]`), outros eram strings vazias (`""`), outros arrays vazios (`[]`) e outros campos inexistentes.
- **Solução:** Desenvolveu-se a função utilitária `normalizeHistories(histories)` no módulo `dragon-api.ts`, que trata com segurança todos esses cenários, permitindo que a aplicação renderize o conteúdo sem quebrar o layout.

### 2. Ordenação Alfabética Rigorosa
- **Problema:** A API retorna os registros na ordem de inserção cronológica, enquanto o desafio solicitava estritamente *"Buscar os dragões da API e exibir em ordem alfabética"*.
- **Solução:** A ordenação foi centralizada diretamente na camada de serviço `dragonApi.getDragons()`, utilizando `localeCompare("pt-BR")` com normalização de maiúsculas/minúsculas e espaços em branco, garantindo que qualquer consumidor da API já receba a lista perfeitamente ordenada de A a Z.

### 3. Integração do GSAP com Next.js 15 e React 19
- **Problema:** Animações com manipulação direta de DOM podem apresentar inconsistências de hidratação ou memory leaks em ambientes modernos com Strict Mode ativo.
- **Solução:** Utilizou-se o pacote `@gsap/react` com o hook `useGSAP`, passando sempre um `scope` referenciado por `useRef`. Isso assegura que qualquer tween ou timeline seja descartado automaticamente no ciclo de desmontagem do componente.

### 4. Resolução da Estética Editorial sem Perda de Acessibilidade
- **Problema:** Um design fotográfico em tela cheia com tipografia grandiosa sobre a imagem corre o risco de comprometer a legibilidade dos textos e dos inputs do formulário de login.
- **Solução:** Aplicou-se uma sobreposição com três camadas sutis: gradientes verticais escuros, vinheta radial e efeito de vidro fosco (*backdrop blur*), assegurando contraste total sem encobrir a riqueza fotográfica da paisagem.

---

## 6. Conclusão

A solução desenvolvida atende a **100% dos requisitos obrigatórios** do teste e incorpora todos os **diferenciais opcionais**:
- Layout plenamente responsivo (mobile, tablet e desktop);
- Commits semânticos e estruturados;
- Configuração completa e funcional para execução local e em container Docker.
