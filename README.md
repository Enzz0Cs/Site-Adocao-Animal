SGAA - Sistema de Gestão de Animais e Adoções
📝 Resumo do Projeto

O SGAA é uma aplicação web responsiva desenvolvida para a Associação Abrigo de Animais de Teodoro Sampaio. O projeto tem como objetivo principal digitalizar e organizar os registros da ONG, substituindo controles manuais por uma base de dados segura em MySQL. O sistema garante a rastreabilidade completa do animal, desde o resgate até a adoção responsável, integrando o controle de saúde e a gestão de insumos.
Principais Diferenciais:

    Unificação de Módulos: Todas as funções básicas (Resgate, Adoção, Estoque e Saúde) foram integradas em um site único com navegação centralizada pela Home.

    Padronização Visual: Interface desenvolvida com JavaScript e CSS customizado, garantindo identidade visual e usabilidade em dispositivos desktop e móveis.

    Controle de Acesso: Sistema de login com níveis de permissão diferenciados para Administradores, Técnicos e Funcionários.

📁 Estrutura Completa de Diretórios

O projeto utiliza uma arquitetura organizada para separar as responsabilidades de servidor (Backend) e interface (Frontend):
1. Backend (/Backend)

Responsável pela API, regras de negócio e persistência de dados.

    src/: Pasta raiz do código do servidor.

        config/: Configurações globais, como o arquivo database.js para conexão com o MySQL.

        controllers/: Lógica de execução das funcionalidades:

            AuthController.js: Gere o acesso e permissões de usuários.

            AnimalController.js & AdotanteController.js: Gerenciam os cadastros principais.

            Vacinacontroller.js & HistoricoController.js: Controlam o prontuário de vacinas e histórico de saúde.

            EstoqueController.js: Gerencia o inventário de remédios e alimentos.

        models/: Definições das entidades do banco de dados (ex: AnimalModel.js, UsuarioModel.js, VacinaModel.js).

        routes/: Mapeamento dos endpoints da API (ex: animalRoutes.js, authRoutes.js, vacinasRoutes.js).

    app.js: Arquivo de inicialização do servidor Node.js.

2. Frontend (/Frontend)

Interface do usuário focada em padronização e consumo da API.

    src/: Código-fonte da aplicação visual.

        components/: Páginas e elementos visuais unificados:

            Home.jsx: Central de navegação do sistema.

            Login.jsx: Portal de acesso seguro.

            GerenciadorAbrigoAnimais.jsx: Gestão do plantel de animais.

            GerenciarVacinas.jsx: Módulo de histórico de vacinação (RF_F1).

            GerenciarEstoque.jsx: Controle de remédios (medicamentos) e alimentos (rações).

            EstilosAbrigo.css: Padronização visual via CSS de todos os componentes.

        services/: Camada de comunicação com o Backend (ex: ApiService.js, VacinaService.js, HistoricoService.js).

    App.js: Componente raiz que integra todas as rotas do sistema.

🛠️ Tecnologias

    Frontend: JavaScript / CSS.

    Backend: Node.js.

    Banco de Dados: MySQL.
