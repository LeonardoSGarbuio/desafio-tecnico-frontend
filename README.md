# 🐉 Dragon Sanctuary — Plataforma de Gerenciamento de Dragões

Plataforma frontend desenvolvida como solução para o **Desafio Técnico Frontend**, construída com **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **GSAP (GreenSock)** e componentes com estética refinada inspirada no tema *"Ancient Drake"*.

---

## 🌟 Visão Geral do Projeto

A plataforma é um sistema de controle e catalogação de criaturas dracônicas ancestrais, integrado à API REST pública (`mockapi.io`). O projeto contempla:

- 🔐 **Autenticação com Credenciais Fixas**: Login temático editorial com parallax cinematográfico.
- 🛡️ **Proteção de Rotas**: Redirecionamento automático de usuários não-autenticados para `/login` e de usuários autenticados para `/dragons`.
- 📋 **Catálogo Alfabético de Dragões**: Listagem completa ordenada de A a Z diretamente da API, com contadores dinâmicos.
- 🔍 **Busca em Tempo Real**: Filtragem instantânea por nome ou afinidade elemental.
- 📖 **Dossiê Detalhado**: Exibição obrigatória de **Nome**, **Tipo** e **Data de Criação**, além das **Crônicas/Habilidades** (`histories`).
- ✏️ **Cadastro & Edição de Dragões**: Formulário com validação via **Zod** e **React Hook Form**, salvando na API e redirecionando automaticamente.
- 🗑️ **Banimento de Dragão**: Exclusão segura com diálogo de confirmação contextual e feedback via toasts (**Sonner**).
- 🌓 **Tema Dark/Light**: Alternância de modo escuro e claro com preservação de contraste e elegância.
- 🎬 **Animações Fluidas**: Orquestração com **GSAP** (`useGSAP`, timelines e staggers).
- 🐳 **Containerização Total**: Suporte para execução via **Docker** e **Docker Compose**.

---

## 🔑 Credenciais de Acesso Padrão

Conforme solicitado nas instruções do desafio:

| Campo | Valor |
|---|---|
| **E-mail** | `admin@email.com` |
| **Senha** | `123456` |

> 💡 *Dica:* Na tela de login, há um botão de atalho **"Preencher Demo"** para agilizar a validação.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- **Node.js**: versão 18.18+ (recomendado Node 20 ou 22)
- **npm** ou **yarn** ou **pnpm**
- *(Opcional para container)* **Docker** e **Docker Compose**

---

### Opção 1: Executando Localmente (Recomendado para Desenvolvimento)

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

3. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000).

4. **Para gerar a build de produção localmente:**
   ```bash
   npm run build
   npm run start
   ```

---

### Opção 2: Executando com Docker e Docker Compose

O projeto conta com um `Dockerfile` multi-stage otimizado para produção e um `docker-compose.yml`.

1. **Construir a imagem e subir o container:**
   ```bash
   docker-compose up --build -d
   ```

2. **Acessar a aplicação:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

3. **Verificar os logs do container:**
   ```bash
   docker-compose logs -f
   ```

4. **Parar a execução do container:**
   ```bash
   docker-compose down
   ```

---

## 🧩 Componentes Reutilizáveis Criados

O teste solicitava um mínimo de 3 componentes reutilizáveis. Foram desenvolvidos mais de 8 componentes reutilizáveis:

1. **`<DragonCard />`**: Card de exibição do dragão com thumbnail do selo, badge elemental dinâmico, formatação de data, menu de ações rápidas e diálogo de exclusão integrado.
2. **`<DragonForm />`**: Formulário polimórfico reutilizado para **Criação** e **Edição**, com validação de esquema Zod, seleção rápida de elementos e tratamento de erros em tempo real.
3. **`<DragonElementBadge />`**: Badge inteligente que detecta a afinidade do dragão (Fogo, Gelo, Tempestade, Luz, Trevas, etc.) e aplica o ícone e variante cromática correspondentes.
4. **`<DeleteConfirmDialog />`**: Modal de confirmação para ações destrutivas com tratamento de carregamento assíncrono.
5. **`<PageHeader />`**: Cabeçalho de página com navegação hierárquica (breadcrumbs/voltar), título estilizado, contadores e slots de ações.
6. **`<EmptyState />`**: Componente de estado vazio com ilustração customizada, mensagem de contexto e botões de ação ou recarga.
7. **`<DragonSearchFilter />`**: Barra de busca com limpeza instantânea, ícones e indicador numérico de resultados filtrados vs. total.
8. **`<DragonHistoryList />`**: Renderizador de crônicas e habilidades em estilo pergaminho.
9. **`<ThemeToggle />`**: Botão de alternância suave entre os modos claro e escuro.

---

## 🛠️ Tecnologias Utilizadas

- **Next.js 15+** (App Router, Server & Client Components)
- **TypeScript 5+** (Tipagem estrita)
- **Tailwind CSS** (Design system utilitário com variáveis HSL)
- **GSAP & @gsap/react** (Timelines, useGSAP e microinterações de alta performance)
- **TanStack Query v5** (Gerenciamento de cache, mutações e sincronização com a API)
- **React Hook Form & Zod** (Validação type-safe de formulários)
- **Sonner** (Notificações toast elegantes)
- **Lucide React** (Iconografia consistente)
- **Docker & Docker Compose** (Containerização multi-estágio)
