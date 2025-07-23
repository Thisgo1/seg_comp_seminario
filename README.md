# API RESTful Segura com Assinaturas Digitais 🎓

> Este projeto demonstra a implementação de uma API RESTful segura, focando na autenticação de mensagens via assinaturas digitais da carga (payload), simulação de um Key Management System (KMS) e incorporação de diversas barreiras de segurança para fortalecer sua postura defensiva.

**Disciplina:** Segurança Computacional | **Semestre:** 2025.1

**Professor:** Lorena de Souza Bezerra Borges  | **Equipe:** Thiago Silva Ribeiro e  João Victor Morais 

## 📚 Objetivos do Projeto

- Garantir a integridade e autenticidade das requisições sensíveis através de assinaturas digitais.
    
- Simular um Key Management System (KMS) para proteger chaves privadas no backend, sem expô-las ao cliente.
    
- Incorporar diversas barreiras de segurança em camadas para fortalecer a postura defensiva da API.
    
- Demonstrar práticas de segurança computacional em um contexto prático de transações digitais.
    

## 🧩 Estrutura do Projeto

```
seg_comp_seminario/
├── servidor/       # Backend (Node.js, Express, Prisma, PostgreSQL)
│   ├── src/        # Código fonte do backend
│   ├── certs/      # Certificados SSL/TLS (key.pem, cert.pem)
│   ├── prisma/     # Esquema do banco de dados e migrações
│   └── .env        # Variáveis de ambiente
├── frontend-segura/ # Frontend (React.js, Tailwind CSS, shadcn/ui)
│   ├── src/        # Código fonte do frontend
│   ├── public/     # Arquivos estáticos
│   ├── data/       # Dados mockados de produtos
│   ├── components/ # Componentes reutilizáveis de UI
│   ├── context/    # Contextos React para gerenciamento de estado global
│   ├── pages/      # Páginas principais da aplicação
│   ├── services/   # Funções para interagir com a API
│   └── vite.config.ts # Configuração do Vite
└── README.md
```

## ✨ Features

- **Autenticação de Usuários**: Sistema de registro e login com senhas hashadas (`bcrypt`) e JSON Web Tokens (JWTs) para gerenciamento de sessão.
    
- **Assinaturas Digitais de Payload**: Geração de assinaturas digitais no backend (usando a chave privada do usuário) e verificação no backend (usando a chave pública) para garantir a autenticidade e integridade das transações.
    
- **Simulação de KMS/HSM**: A chave privada do usuário é gerada e criptografada no backend (com uma chave derivada da senha do usuário), sendo descriptografada temporariamente em memória apenas para a operação de assinatura e imediatamente descartada.
    
- **Múltiplas Camadas de Segurança**:
    
    - **TLS/HTTPS**: Comunicação criptografada entre frontend e backend.
        
    - **Rate Limiting**: Limitação de taxa de requisições para prevenir ataques de força bruta e DoS.
        
    - **CORS**: Configuração segura para controlar acesso cross-origin à API.
        
    - **Validação de Entrada (`Joi`)**: Validação rigorosa dos dados de entrada para prevenir injeções e dados malformados.
        
    - **Helmet.js**: Coleção de middlewares para definir cabeçalhos HTTP de segurança.
        
    - **Auditoria de Segurança**: Registro de eventos críticos para monitoramento e investigação.
        
- **Fluxo de Compra Interativo**: Frontend em React.js com `shadcn/ui` para uma interface moderna, permitindo seleção de produtos mockados e confirmação de compra com senha.
    

## 🛠️ Como Usar

Para configurar e executar o projeto, siga os passos abaixo para o backend e o frontend:

### Backend

1. **Clone o repositório:**
    
    ```
    git clone https://github.com/seu-user/seg_comp_seminario.git
    cd seg_comp_seminario/servidor
    ```
    
2. **Instale as dependências:**
    
    ```
    npm install
    ```
    
3. **Configure o ambiente:**
    
    - Crie um arquivo `.env` na raiz da pasta `servidor` com as seguintes variáveis (ajuste conforme necessário):
        
        ```
        DATABASE_URL="postgresql://user:password@localhost:5432/your_database_name?schema=public"
        JWT_SECRET="sua_chave_secreta_jwt_muito_longa_e_complexa"
        PORT=3000
        HTTPS_PORT=3443
        ```
        
    - Crie uma pasta `certs` dentro de `servidor/`.
        
    - **Gere os certificados SSL/TLS** (requer OpenSSL instalado):
        
        ```
        cd certs
        openssl genrsa -out key.pem 2048
        openssl req -new -key key.pem -out csr.pem # Pressione Enter para as perguntas, deixe a senha de desafio em branco
        openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out cert.pem
        cd .. # Volte para a pasta servidor
        ```
        
4. **Execute as migrações do Prisma:**
    
    ```
    npx prisma migrate dev --name init
    ```
    
5. **Execute o servidor:**
    
    ```
    npm run dev
    # Ou npx ts-node-dev src/server.ts
    ```
    
    - **Importante:** Ao acessar o frontend pela primeira vez, seu navegador pode exibir um aviso de certificado inválido para `https://localhost:3443`. Você precisará aceitar o risco e prosseguir para que a comunicação HTTPS funcione.
        

### Frontend

1. **Navegue para a pasta do frontend:**
    
    ```
    cd ../frontend-segura
    ```
    
2. **Instale as dependências:**
    
    ```
    npm install
    ```
    
3. **Inicialize e adicione componentes `shadcn/ui` (se ainda não o fez):**
    
    ```
    npx shadcn-ui@latest init
    npx shadcn-ui@latest add button input label card alert utils
    npm install @radix-ui/react-icons # Instale os ícones
    ```
    
4. **Execute a aplicação frontend:**
    
    ```
    npm run dev
    ```
    
    A aplicação será aberta em `http://localhost:5173/` (ou outra porta disponível).
    

## 🧠 Aprendizados

- **Criptografia Assimétrica e Assinaturas Digitais**: Compreensão aprofundada da aplicação de chaves pública/privada para garantir autenticidade, integridade e não-repúdio em transações digitais.
    
- **Defesa em Profundidade**: A importância de implementar múltiplas camadas de segurança (TLS, JWT, Rate Limiting, Validação de Entrada, etc.) para criar uma postura defensiva robusta contra diversas ameaças.
    
- **Simulação de KMS/HSM**: Os desafios e trade-offs de proteger e gerenciar chaves privadas em um ambiente de software, e a importância de manter segredos sensíveis fora do alcance do cliente.
    
- **Vulnerabilidades e Mitigações**: Análise de ataques comuns (força bruta, replay, XSS, injeção) e como as barreiras de segurança implementadas (e as sugestões de aprimoramento) atuam para mitigar esses riscos.
    
- **Desenvolvimento Full-Stack Seguro**: Integração de práticas de segurança no frontend (gerenciamento de sessão, uso de componentes seguros) e backend (autenticação, autorização, validação, auditoria).