# 🐉 Relatório Técnico — Desafio Técnico Frontend (Dragon Sanctuary)

## 📌 1. Visão Geral
Este documento sintetiza as decisões de arquitetura, padrões de engenharia de software e soluções técnicas adotadas no desenvolvimento do **Dragon Sanctuary**, uma aplicação de gestão de dragões concebida como resposta ao desafio técnico frontend.

A solução foi construída visando aliar **rigor nos requisitos do desafio**, **estabilidade em produção** e uma **experiência de usuário cinematográfica** baseada em Clean Frosted Glassmorphism.

---

## 🛠️ 2. Arquitetura e Stack Tecnológica

| Camada | Tecnologia | Motivação Técnica |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Renderização híbrida otimizada, roteamento moderno e suporte nativo ao React 19. |
| **Linguagem** | TypeScript 5 (Strict Mode) | Prevenção de regressões em tempo de compilação e tipagem forte em contratos de API. |
| **Estilização** | Tailwind CSS v3 | Design system utilitário de alta performance com classes personalizadas de vidro fosco (*frosted glass*). |
| **Motion & Scroll** | GSAP 3 + ScrollTrigger | Animações determinísticas e sincronizadas ao scroll (pinned showcase) sem re-renderizações desnecessárias. |
| **Persistência Local** | IndexedDB / LocalStorage | Cache e persistência local de imagens customizadas em alta resolução sem sobrecarregar a API remota. |
| **Testes** | Node.js Test Runner Nativo | Execução ultra-rápida de testes de regras de negócio sem dependências pesadas externas. |
| **Containerização** | Docker & Docker Compose | Multi-stage build otimizado com standalone output do Next.js. |

---

## 🎯 3. Atendimento aos Requisitos do Desafio

| Requisito | Status | Implementação |
|---|---|---|
| **1. Autenticação com rota protegida** | ✅ Concluído | Rota `/` com login (`admin@email.com` / `123456`). Guards de rota protegem `/dragons`, `/dragons/new`, `/dragons/[id]` e `/dragons/[id]/edit`. |
| **2. Listagem em ordem alfabética** | ✅ Concluído | Ordenação `localeCompare("pt-BR")` garantindo ordenação correta mesmo com caracteres acentuados. |
| **3. Detalhes com data/hora formatada e histórico** | ✅ Concluído | Página `/dragons/[id]` com exibição de tipo, crônicas (`histories`), banner visual e data formatada no padrão brasileiro (`dd/MM/yyyy HH:mm`). |
| **4. Criação de novos dragões** | ✅ Concluído | Formulário em `/dragons/new` com validação de obrigatoriedade, upload de imagem e feedback via toast. |
| **5. Edição de dragões** | ✅ Concluído | Formulário pré-populado em `/dragons/[id]/edit` com atualização assíncrona via método `PUT`. |
| **6. Exclusão de dragões** | ✅ Concluído | Confirmação em duas etapas via Toast interativo com ação de remoção segura na MockAPI. |
| **7. Docker / Docker Compose** | ✅ Concluído | Arquivos `Dockerfile` (multi-stage) e `docker-compose.yml` prontos para execução com `docker compose up --build`. |

---

## 💡 4. Decisões de Engenharia e Diferenciais

### 4.1. Resiliência de Dados da MockAPI (Higienização)
A MockAPI pública fornecida continha registros inconsistentes decorrentes de testes públicos (nomes de 1 caractere, entradas vazias e múltiplos registros duplicados).
- Foi criada a função `cleanDragonList`:
  1. Filtra registros espúrios (comprimento < 3 caracteres).
  2. Deduplica registros idênticos mantendo apenas uma entrada por espécie.
  3. Aplica a ordenação alfabética estrita exigida pelo desafio.

### 4.2. Contorno do Erro HTTP 413 (Payload Too Large da MockAPI)
Ao enviar imagens em base64 diretamente pelo endpoint da MockAPI, o servidor rejeitava requisições com código `413 Request Entity Too Large` (limite de ~80KB).
- **Solução Arquitetural**:
  - A API remota recebe apenas os dados textuais (`name`, `type`).
  - Imagens customizadas em alta resolução anexadas pelo usuário são armazenadas de forma persistente no **IndexedDB** do navegador através do módulo [`src/lib/image-storage.ts`](file:///c:/Users/Roberto/Desktop/Desafio%20tecnico/src/lib/image-storage.ts).
  - Um resolver inteligente ([`src/lib/dragon-images.ts`](file:///c:/Users/Roberto/Desktop/Desafio%20tecnico/src/lib/dragon-images.ts)) vincula dinamicamente as artes locais oficiais de cada dragão presente no catálogo.

### 4.3. Integração Estável com React 19 e GSAP ScrollTrigger
O uso de pinning tradicional do GSAP (`pin: true`) causa reparenting de nós no DOM (`.pin-spacer`), gerando conflitos com o algoritmo de reconciliação do React 19 durante transições de rota.
- **Solução**:
  - Utilizou-se CSS nativo com `position: sticky; top: 0; height: 100vh;` para fixação da viewport.
  - O GSAP ScrollTrigger foi encarregado unicamente de calcular o progresso contínuo (`self.progress`) para controle do dragão ativo e transição das fotografias em crossfade.

---

## 🧪 5. Testes Automatizados

Os testes automatizados cobrem as regras essenciais de negócio:
- **Execução**:
  ```bash
  npm test
  ```
- **Suíte testada**:
  1. Ordenação alfabética estrita (A-Z) considerando caracteres acentuados da língua portuguesa.
  2. Higienização e descarte de entradas inválidas da API pública.
  3. Deduplicação de registros com nomes repetidos.
  4. Formatação de data em padrão nacional brasileiro (`dd/MM/yyyy`).
