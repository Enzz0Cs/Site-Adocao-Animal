# Sistema de Adoção Animal - Abrigo Teodoro Sampaio

## Descrição do Grupo

Este projeto foi desenvolvido por um grupo acadêmico com o objetivo de criar uma aplicação web para apoiar a gestão de um abrigo animal. A proposta do grupo é aplicar conhecimentos de desenvolvimento full stack, banco de dados, organização de código, autenticação, controle de cadastros e geração de relatórios em um sistema com utilidade social.

### Integrantes

| Nome do integrante | RA |
| --- | --- |
| Preencher nome do integrante 1 | Preencher RA |
| Preencher nome do integrante 2 | Preencher RA |
| Preencher nome do integrante 3 | Preencher RA |
| Preencher nome do integrante 4 | Preencher RA |

## Descrição do Projeto

O sistema tem como finalidade gerenciar processos internos de um abrigo de animais, centralizando informações sobre animais, adotantes, adoções, estoque, veterinários, procedimentos veterinários, movimentações financeiras e relatórios.

A aplicação permite que usuários façam login, acessem módulos de acordo com o nível de permissão e realizem operações de cadastro, consulta, edição e exclusão. O projeto também possui funcionalidades específicas para validação de aptidão para adoção, confirmação de adoção por link, histórico de vacinação, controle de estoque e relatórios exportáveis em PDF.

## Funcionalidades Principais

- Login e cadastro de usuários.
- Recuperação e redefinição de senha.
- Controle de acesso por nível de usuário.
- Cadastro e gerenciamento de animais.
- Validação de aptidão para adoção.
- Registro e acompanhamento de adoções.
- Confirmação de adoção por link.
- Cadastro e gerenciamento de adotantes.
- Cadastro e gerenciamento de veterinários.
- Cadastro e gerenciamento de procedimentos veterinários.
- Controle de estoque e registro de saídas.
- Controle financeiro.
- Histórico de vacinação.
- Relatórios de animais, saúde e adoções.
- Exportação de relatórios em PDF.

## Tecnologias Utilizadas

### Frontend

- React
- React Router DOM
- React Bootstrap
- Bootstrap
- Axios
- Lucide React
- React Icons
- jsPDF
- jsPDF AutoTable

### Backend

- Node.js
- Express
- MySQL2
- CORS
- Dotenv
- Nodemailer
- UUID

### Banco de Dados

- MySQL

## Organização do Repositório

```text
Site-Adocao-Animal/
├── Backend/
│   ├── app.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── src/
│       ├── config/
│       │   └── database.js
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       └── services/
├── Frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   └── src/
│       ├── components/
│       ├── services/
│       ├── App.js
│       ├── index.js
│       └── index.css
├── database.sql
├── nodemon.json
├── serve-frontend-build.cjs
├── .gitignore
└── README.md
```

## Itens Incluídos no Repositório

### Backend

Contém a API da aplicação, construída com Node.js e Express.

- `Backend/app.js`: arquivo principal do servidor Express.
- `Backend/src/config/database.js`: configuração de conexão com o MySQL.
- `Backend/src/controllers/`: regras de controle das requisições.
- `Backend/src/models/`: consultas e operações no banco de dados.
- `Backend/src/routes/`: definição das rotas da API.
- `Backend/src/services/`: serviços auxiliares, como envio de e-mail.
- `Backend/package.json`: dependências e scripts do backend.

### Frontend

Contém a interface web, construída com React.

- `Frontend/src/App.js`: configuração das rotas da aplicação.
- `Frontend/src/components/`: telas e componentes visuais.
- `Frontend/src/services/`: serviços responsáveis pelas chamadas HTTP para o backend.
- `Frontend/public/`: arquivos públicos da aplicação React.
- `Frontend/package.json`: dependências e scripts do frontend.

### Banco de Dados

- `database.sql`: script de criação do banco `abrigo_vacinas` e suas tabelas.

### Arquivos Auxiliares

- `nodemon.json`: configuração auxiliar para execução com Nodemon.
- `serve-frontend-build.cjs`: servidor estático simples para servir o build do frontend em testes locais.
- `.gitignore`: lista de arquivos e pastas ignorados pelo Git.

## Estrutura dos Módulos do Sistema

### Módulo de Animais

Permite cadastrar, listar, editar, excluir e validar animais. Também permite registrar vacinas e acompanhar o histórico de saúde.

### Módulo de Adoções

Permite registrar processos de adoção, acompanhar status, confirmar adoções e finalizar adoções.

### Módulo de Adotantes

Permite cadastrar e consultar pessoas interessadas em adotar animais.

### Módulo de Veterinários

Permite cadastrar profissionais responsáveis por atendimentos, validações e procedimentos.

### Módulo de Procedimentos Veterinários

Permite registrar atendimentos, procedimentos e situações clínicas dos animais.

### Módulo de Estoque

Permite cadastrar itens, controlar quantidades e registrar saídas de estoque.

### Módulo Financeiro

Permite registrar movimentações financeiras de entrada e saída.

### Módulo de Relatórios

Permite visualizar e exportar relatórios relacionados a animais, saúde e adoções.

## Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

- Node.js
- npm
- MySQL

## Configuração do Banco de Dados

1. Abra o MySQL.
2. Execute o script `database.sql`.
3. Confirme se o banco `abrigo_vacinas` foi criado.
4. Configure o arquivo `Backend/.env` com as credenciais do banco.

Exemplo de configuração:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=abrigo_vacinas
```

## Instalação das Dependências

### Backend

```bash
cd Backend
npm install
```

### Frontend

```bash
cd Frontend
npm install
```

## Como Executar o Projeto em Desenvolvimento

### Iniciar o Backend

Dentro da pasta `Backend`, execute:

```bash
npm start
```

O backend ficará disponível em:

```text
http://localhost:3001
```

As rotas da API usam o prefixo:

```text
http://localhost:3001/api
```

### Iniciar o Frontend

Dentro da pasta `Frontend`, execute:

```bash
npm start
```

O frontend ficará disponível em:

```text
http://localhost:3000
```

## Como Executar o Frontend pelo Build

Caso o servidor de desenvolvimento do React não suba corretamente, é possível gerar o build:

```bash
cd Frontend
npm run build
```

Depois, na raiz do projeto, execute:

```bash
node serve-frontend-build.cjs
```

O build será servido em:

```text
http://localhost:3000
```

## Principais Rotas do Backend

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/api/login` | Realiza login |
| POST | `/api/registrar` | Cadastra usuário |
| PUT | `/api/resetar-senha` | Solicita redefinição de senha |
| POST | `/api/redefinir-senha` | Redefine senha |
| GET | `/api/animais` | Lista animais |
| POST | `/api/animais` | Cadastra animal |
| PUT | `/api/animais/:id` | Atualiza animal |
| DELETE | `/api/animais/:id` | Exclui animal |
| GET | `/api/adotantes` | Lista adotantes |
| POST | `/api/adotantes` | Cadastra adotante |
| GET | `/api/adocoes` | Lista adoções |
| POST | `/api/adocoes` | Registra adoção |
| GET | `/api/veterinarios` | Lista veterinários |
| POST | `/api/veterinarios` | Cadastra veterinário |
| GET | `/api/procedimentos-veterinarios` | Lista procedimentos |
| POST | `/api/procedimentos-veterinarios` | Cadastra procedimento |
| GET | `/api/estoque` | Lista estoque |
| POST | `/api/estoque` | Cadastra item no estoque |
| GET | `/api/financeiro` | Lista movimentações financeiras |
| POST | `/api/financeiro` | Cadastra movimentação financeira |

## Observações de Desenvolvimento

- O frontend se comunica com o backend pela URL `http://localhost:3001/api`.
- O backend depende do MySQL estar ativo.
- O arquivo `.env` do backend deve estar configurado corretamente antes de iniciar o servidor.
- O cadastro de animais utiliza a coluna `status_adocao`; por isso o banco precisa estar atualizado com o script `database.sql`.
- Algumas telas possuem exportação em PDF usando `jsPDF` e `jspdf-autotable`.
- O sistema utiliza rotas protegidas para limitar o acesso conforme o nível do usuário.

## Status do Projeto

Projeto acadêmico em desenvolvimento, com módulos principais implementados para cadastro, gerenciamento, controle e relatórios de um abrigo animal.
