# 🐉 Dragon Sanctuary — Plataforma de Gestão de Dragões Ancestrais

> Desafio Técnico Frontend — Aplicação de alta fidelidade desenvolvida com **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **GSAP (ScrollTrigger)** e **Docker**.

---

## 📖 Sobre o Projeto

O **Dragon Sanctuary** é uma plataforma concebida para a catalogação, observação e gerenciamento de espécimes ancestrais de dragões. O projeto combina rigor técnico, código limpo e uma experiência de usuário cinematográfica com estética **Clean Glassmorphism**, integrando uma API RESTful remota.

---

## ✨ Funcionalidades Principais

1. **Autenticação & Controle de Acesso**:
   - Página de login pública e protegida.
   - Validação com credenciais fixas (`admin@email.com` / `123456`).
   - Bloqueio automático de rotas internas para usuários não autenticados.
   - Redirecionamento automático caso já esteja logado.
   - Botão de atalho para preenchimento de teste ("Preencher demo").

2. **Catálogo Cinematográfico com GSAP ScrollTrigger (`/dragons`)**:
   - **Pinned Showcase**: A tela fixa-se no viewport e o scroll do usuário navega suavemente entre os espécimes.
   - **Sidebar Dinâmica**: Nome em destaque, metadados e menu vertical com marcadores que se iluminam conforme o dragão ativo.
   - **Crossfade de Imagens**: Transição fluida entre as fotografias dos dragões no container visual arredondado.
   - **Higienização de Dados**:
     - Ordenação alfabética estrita (conforme exigido pelo desafio).
     - Filtro contra entradas de teste/lixo da API (nomes com menos de 3 caracteres como "a", "b", "dd").
     - Deduplicação automática de registros repetidos (ex: múltiplos "Fafnir").
   - **Responsividade**: Modo split-screen pinado para desktop/tablets e lista fluida de cards de vidro para dispositivos móveis.

3. **Detalhes do Dragão (`/dragons/[id]`)**:
   - Visualização completa: Nome, tipo/elemento, data e hora de criação formatada em PT-BR.
   - Painel de crônicas e histórico (`histories`).
   - Ações diretas de edição e exclusão com modal de confirmação.

4. **Cadastro de Novo Dragão (`/dragons/new`)**:
   - Formulário com campos de nome e tipo (validação de obrigatoriedade).
   - Feedback via toasts interativos (*Sonner*).
   - Redirecionamento imediato para a lista após o salvamento.

5. **Edição de Dragão (`/dragons/[id]/edit`)**:
   - Carregamento assíncrono dos dados existentes.
   - Edição de nome e tipo com persistência via `PUT` na MockAPI.
   - Redirecionamento com notificação de sucesso.

6. **Exclusão Segura**:
   - Confirmação em 2 etapas via Toast interativo para evitar exclusões acidentais.
   - Remoção em tempo real na MockAPI e sincronização do estado local.

---

## 🛠️ Tecnologias Utilizadas

- **Core**: [Next.js 15](https://nextjs.org/) (App Router, Turbopack ready, standalone output)
- **Linguagem**: [TypeScript 5](https://www.typescriptlang.org/) (Strict mode habilitado)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/) com paleta escura e efeitos de vidro fosco (*frosted glass*)
- **Animações & Motion**: [GSAP 3](https://gsap.com/) + `@gsap/react` + `ScrollTrigger`
- **Ícones**: [Lucide React](https://lucide.dev/)
- **Notificações**: [Sonner](https://sonner.emilkowal.ski/)
- **Containerização**: [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) (Multi-stage build otimizado)

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js 18+ e npm **OU** Docker / Docker Desktop

---

### Opção 1: Executar com Docker (Recomendado)

1. Clone o repositório e acesse a pasta:
   ```bash
   git clone <url-do-repositorio>
   cd "Desafio tecnico"
   ```

2. Suba o container com o Docker Compose:
   ```bash
   docker compose up --build
   ```

3. Acesse a aplicação no seu navegador:
   👉 **http://localhost:3000**

---

### Opção 2: Executar Localmente com Node.js

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Ou execute a build de produção:
   ```bash
   npm run build
   npm start
   ```

4. Acesse:
   👉 **http://localhost:3000**

---

## 🔐 Credenciais de Acesso

| Campo | Valor |
|---|---|
| **E-mail** | `admin@email.com` |
| **Senha** | `123456` |

---

## 📁 Estrutura de Diretórios

```
├── public/
│   └── images/              # Ativos visuais e fotografias de paisagens e dragões
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Layout raiz (fontes, meta tags, Toaster)
│   │   ├── globals.css      # Estilos globais e utilitários de vidro
│   │   ├── page.tsx         # Página de Login (Glassmorphism clean com Parallax)
│   │   └── dragons/
│   │       ├── page.tsx     # Catálogo Pinned com GSAP ScrollTrigger
│   │       ├── new/         # Página de criação de dragão
│   │       └── [id]/        # Página de detalhes
│   │           └── edit/    # Página de edição
│   ├── lib/
│   │   ├── gsap.ts          # Inicialização e registro de plugins do GSAP
│   │   └── utils.ts         # Utilitários de classes Tailwind (clsx + twMerge)
│   ├── services/
│   │   └── dragon-api.ts    # Camada de comunicação com a MockAPI
│   └── types/
│       └── dragon.ts        # Interfaces TypeScript da entidade Dragon
├── Dockerfile               # Multi-stage build otimizado para produção
├── docker-compose.yml       # Orquestração do container Docker
└── next.config.ts           # Configurações do Next.js (output standalone)
```

---

## 🏛️ Decisões de Design e Arquitetura

1. **Clean Frosted Glass (Vidro Fosco)**:
   - Utilização de cartões em vidro translúcido com gradientes de opacidade fina (`rgba(255, 255, 255, 0.15)` a `0.05`), desfoque intenso de fundo (*backdrop-blur-2xl*) e bordas de 1px com reflexo especular.
   - Ausência de poluição de tags, mantendo a interface limpa, moderna e com foco no conteúdo.

2. **Pinned ScrollTrigger (Scroll Cinematográfico)**:
   - Inspirado em apresentações editoriais de cinema, o usuário fixa a tela e navega pela lista de dragões com uma barra lateral sincronizada, enquanto a moldura fotográfica central realiza crossfade das imagens.

3. **Resiliência de Dados da API**:
   - A MockAPI pública continha diversos testes com caracteres avulsos ("a", "b", "dd") e dragões repetidos. Implementou-se uma camada de higienização que deduplica por nome e filtra ruídos, entregando sempre uma listagem alfabética coerente e limpa.
