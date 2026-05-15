# SGAA - Sistema de Gestão de Animais e Adoções

## Resumo do projeto

O **SGAA** é uma aplicação web responsiva desenvolvida para a **Associação Abrigo de Animais de Teodoro Sampaio**. O sistema tem como objetivo digitalizar e organizar os registros da ONG, substituindo controles manuais por uma solução integrada com banco de dados MySQL.

A aplicação permite acompanhar a trajetória do animal dentro do abrigo, desde o cadastro e controle de saúde até o processo de adoção responsável. Também centraliza a gestão de adotantes, vacinas, veterinários, procedimentos veterinários, estoque e relatórios.

## Principais diferenciais

- **Unificação de módulos:** as funções principais do abrigo foram integradas em um único sistema, com navegação centralizada pela Home.
- **Padronização visual:** interface construída com React, JavaScript, Bootstrap e CSS customizado, mantendo identidade visual consistente.
- **Controle de acesso:** login com níveis de permissão para administradores, responsáveis técnicos e funcionários.
- **Rastreabilidade:** histórico de informações importantes sobre animais, adoções, vacinas, procedimentos e movimentações de estoque.
- **Tour guiado:** guia interativo com `driver.js` para apresentar as principais telas, formulários e botões de ação do sistema.

## Funcionalidades

- Cadastro, edição, listagem e exclusão de animais.
- Validação de aptidão do animal para adoção.
- Registro de vacinas aplicadas e histórico de saúde.
- Cadastro e gerenciamento de adotantes.
- Registro e acompanhamento de adoções.
- Cadastro de veterinários e controle de status profissional.
- Registro de procedimentos veterinários.
- Controle de estoque de alimentos, medicamentos, itens de higiene e outros insumos.
- Histórico de saídas de estoque.
- Relatórios de animais, saúde e adoções.
- Guia interativo para auxiliar o uso das telas.

## Tecnologias utilizadas

### Frontend

- React
- JavaScript
- CSS
- Bootstrap
- React Bootstrap
- React Router DOM
- Axios
- Lucide React
- React Icons
- Driver.js
- jsPDF e jsPDF AutoTable

### Backend

- Node.js
- Express
- MySQL2
- CORS
- Dotenv
- Nodemailer
- UUID

### Banco de dados

- MySQL

## Estrutura de diretórios

```text
.
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── app.js
│   ├── package.json
│   └── .env
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── database.sql
├── nodemon.json
├── .gitignore
└── README.md
```

## Backend

O backend é responsável pela API, regras de negócio e comunicação com o banco de dados.

Principais pastas:

- `src/config/`: configuração de conexão com o MySQL.
- `src/controllers/`: lógica das funcionalidades e tratamento das requisições.
- `src/models/`: consultas e operações no banco de dados.
- `src/routes/`: definição dos endpoints da API.
- `src/services/`: serviços auxiliares, como envio de email.

Arquivo principal:

- `Backend/app.js`: inicializa o servidor Express e registra as rotas da API.

## Frontend

O frontend é responsável pela interface visual e consumo da API.

Principais pastas:

- `src/components/`: telas e componentes visuais do sistema.
- `src/services/`: camada de comunicação com o backend via Axios.
- `src/App.js`: define as rotas da aplicação.

Principais telas:

- `Login.jsx`: tela de login, cadastro e recuperação de senha.
- `Home.jsx`: central de navegação dos módulos.
- `GerenciadorAbrigoAnimais.jsx`: gestão dos animais.
- `GerenciadorAdocoes.jsx`: registro e acompanhamento de adoções.
- `GerenciarAdotante.jsx`: cadastro e consulta de adotantes.
- `GerenciarVacinas.jsx`: cadastro de vacinas.
- `GerenciarVeterinarios.jsx`: cadastro de veterinários.
- `GerenciarProcedimentosVeterinarios.jsx`: controle de procedimentos veterinários.
- `GerenciarEstoque.jsx`: controle de estoque e saídas.
- `Relatorios.jsx`: acesso aos relatórios do sistema.
- `TourGuia.js`: guia interativo das telas.

## Configuração do banco de dados

1. Crie um banco MySQL.
2. Execute o arquivo `database.sql`.
3. Configure o arquivo `.env` dentro da pasta `Backend/`.

Exemplo de `.env`:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=abrigo_vacinas
PORT=3001
```

## Como executar o projeto

### 1. Instalar dependências do backend

```bash
cd Backend
npm install
```

### 2. Iniciar o backend

```bash
npm start
```

O backend ficará disponível em:

```text
http://localhost:3001
```

### 3. Instalar dependências do frontend

Abra outro terminal:

```bash
cd Frontend
npm install
```

### 4. Iniciar o frontend

```bash
npm start
```

O frontend ficará disponível em:

```text
http://localhost:3000
```

## Rotas principais da API

```text
POST   /api/login
POST   /api/registrar
PUT    /api/resetar-senha

GET    /api/animais
POST   /api/animais
PUT    /api/animais/:id
DELETE /api/animais/:id

GET    /api/adotantes
POST   /api/adotantes
PUT    /api/adotantes/:id
DELETE /api/adotantes/:id

GET    /api/adocoes
POST   /api/adocoes
POST   /api/adocoes/:id/finalizar
DELETE /api/adocoes/:id

GET    /api/vacinas
POST   /api/vacinas
PUT    /api/vacinas/:id
DELETE /api/vacinas/:id

GET    /api/veterinarios
POST   /api/veterinarios
PUT    /api/veterinarios/:id
DELETE /api/veterinarios/:id

GET    /api/procedimentos-veterinarios
POST   /api/procedimentos-veterinarios
PUT    /api/procedimentos-veterinarios/:id
DELETE /api/procedimentos-veterinarios/:id

GET    /api/estoque
POST   /api/estoque
PUT    /api/estoque/:id
DELETE /api/estoque/:id
```

## Observações

- O backend utiliza a porta `3001`.
- O frontend utiliza a porta `3000`.
- A pasta `Frontend/build/` é gerada automaticamente pelo React ao executar o build e não precisa ser versionada.
- O arquivo `.env` não deve ser enviado ao GitHub, pois contém dados de conexão com o banco.

## Status do projeto

Projeto acadêmico em desenvolvimento para apoio à gestão da Associação Abrigo de Animais de Teodoro Sampaio.
