import { useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const passo = (element, title, description, side = 'bottom', align = 'center') => ({
  element,
  popover: { title, description, side, align }
});

const passosCrud = (titulo, descricaoTela, descricaoFormulario, descricaoBusca, descricaoListagem, descricaoAcoes) => [
  passo('[data-tour="page-header"]', titulo, descricaoTela),
  passo('[data-tour="formulario"]', 'Formulário de cadastro', descricaoFormulario),
  passo('[data-tour="salvar"]', 'Botão salvar', 'Grava um novo registro ou atualiza o cadastro quando você estiver editando.', 'top'),
  passo('[data-tour="busca"]', 'Pesquisa', descricaoBusca),
  passo('[data-tour="listagem"]', 'Lista de registros', descricaoListagem, 'top'),
  passo('[data-tour="acoes"]', 'Botões de ação', descricaoAcoes, 'left')
];

const passosPorRota = {
  '/home': [
    passo('[data-tour="cabecalho"]', 'Tela inicial', 'Aqui ficam o nome do sistema, o usuário logado e a saída segura.'),
    passo('[data-tour="usuario"]', 'Perfil de acesso', 'Mostra quem está usando o sistema e qual nível de permissão libera os módulos.', 'bottom', 'end'),
    passo('[data-tour="modulos"]', 'Módulos do sistema', 'Cada cartão abre uma área de trabalho: animais, adoções, saúde, estoque e relatórios.', 'top'),
    passo('[data-tour="relatorios"]', 'Relatórios', 'Acesse os relatórios para consultar e exportar informações consolidadas do abrigo.', 'left')
  ],
  '/animais': [
    passo('[data-tour="page-header"]', 'Animais', 'Esta tela controla o cadastro e acompanhamento dos animais do abrigo.'),
    passo('[data-tour="abrir-formulario"]', 'Cadastrar animal', 'Abre o formulário com nome, data de registro, sexo, raça, porte e faixa etária.', 'left'),
    passo('[data-tour="busca"]', 'Busca de animais', 'Filtra os cards por nome, raça ou status de aptidão. A busca atualiza a lista automaticamente.'),
    passo('[data-tour="listagem"]', 'Cards dos animais', 'Cada card mostra os dados principais e o status de aptidão para adoção.', 'top'),
    passo('[data-tour="acoes"]', 'Ações do animal', 'Use os botões para registrar vacina, validar aptidão, editar dados ou excluir o animal.', 'left')
  ],
  '/adocoes': [
    passo('[data-tour="page-header"]', 'Adoções', 'Aqui você registra e acompanha o processo de adoção.'),
    passo('[data-tour="abrir-formulario"]', 'Nova adoção', 'Abre o formulário para escolher um animal apto, adotante e data da adoção.', 'left'),
    passo('[data-tour="busca"]', 'Busca de adoções', 'Filtra por nome do animal ou nome do adotante.'),
    passo('[data-tour="listagem"]', 'Processos de adoção', 'Os cards mostram o animal, adotante, status, documento e assinatura quando houver.', 'top'),
    passo('[data-tour="acoes"]', 'Ações da adoção', 'Remove um processo de adoção. Quando o status permitir, também aparece o botão de finalizar.', 'left')
  ],
  '/adotantes': passosCrud(
    'Adotantes',
    'Cadastre e mantenha os dados das pessoas interessadas em adotar.',
    'Preencha nome, CPF, e-mail, telefone e endereço. CPF e e-mail ajudam a identificar o adotante e evitar duplicidade.',
    'Filtra por nome, CPF ou e-mail para localizar rapidamente um cadastro.',
    'A tabela mostra os dados principais os adotantes cadastrados.',
    'O lápis carrega o cadastro no formulário para editar. A lixeira exclui o adotante quando ele não possui vínculos.'
  ),
  '/veterinarios': passosCrud(
    'Veterinários',
    'Cadastre os profissionais que poderão ser vinculados a procedimentos veterinários.',
    'Informe nome, CPF, CRMV, telefone, e-mail, especialidade e status. Apenas veterinários ativos aparecem na tela de procedimentos.',
    'Filtra por nome, CPF, CRMV ou e-mail.',
    'A tabela mostra CRMV, especialidade, contato e se o profissional está ativo.',
    'O lápis edita o cadastro. A lixeira remove o profissional quando não houver registros dependentes.'
  ),
  '/estoque': [
    ...passosCrud(
      'Estoque e Vacinas',
      'Controle alimentos, medicamentos, vacinas, itens de higiene e outros insumos.',
      'Preencha nome, categoria, vacinas têm campo de código, quantidade atual, unidade, mínimo e validade. O mínimo ajuda a destacar itens com estoque baixo.',
      'Nesta tela, a consulta principal é visual pela lista de inventário.',
      'O inventário mostra a quantidade atual e o mínimo. Linhas destacadas indicam atenção no estoque.',
      'O botão de saída registra a baixa do item. O lápis edita. A lixeira exclui.'
    ).filter((item) => item.element !== '[data-tour="busca"]'),
    passo('[data-tour="historico"]', 'Histórico de saídas', 'Mostra as baixas realizadas, quantidade retirada, destino e responsável.', 'left')
  ],
  '/procedimentos-veterinarios': [
    ...passosCrud(
      'Procedimentos veterinários',
      'Registre consultas, exames, cirurgias e tratamentos vinculados aos animais.',
      'Escolha o animal, informe o tipo, data, veterinário, situação e uma descrição clínica do atendimento.',
      'A listagem completa fica logo abaixo; use os dados da tabela para conferir registros existentes.',
      'A tabela mostra o animal, tipo, data, descrição, veterinário e situação.',
      'Editar carrega o procedimento no formulário. Excluir remove o registro após confirmação.'
    ).filter((item) => item.element !== '[data-tour="busca"]')
  ]
};

function montarPassos(pathname) {
  return (passosPorRota[pathname] || passosPorRota['/home']).filter((item) => (
    !item.element || document.querySelector(item.element)
  ));
}

function criarDriver(passos) {
  return driver({
    steps: passos,
    animate: true,
    smoothScroll: true,
    showProgress: true,
    allowClose: true,
    overlayOpacity: 0.55,
    stagePadding: 8,
    stageRadius: 8,
    nextBtnText: 'Próximo',
    prevBtnText: 'Voltar',
    doneBtnText: 'Concluir',
    progressText: '{{current}} de {{total}}'
  });
}

function TourGuia() {
  const location = useLocation();
  const chaveTour = useMemo(() => `tour-guia-visto:${location.pathname}`, [location.pathname]);

  const iniciarTour = useCallback(() => {
    const passos = montarPassos(location.pathname);

    if (passos.length === 0) {
      return;
    }

    criarDriver(passos).drive();
    localStorage.setItem(chaveTour, 'true');
  }, [chaveTour, location.pathname]);

  useEffect(() => {
    const usuario = localStorage.getItem('usuario');
    const jaVisto = localStorage.getItem(chaveTour);

    if (!usuario || jaVisto || location.pathname === '/') {
      return;
    }

    const timeoutId = window.setTimeout(iniciarTour, 500);
    return () => window.clearTimeout(timeoutId);
  }, [chaveTour, iniciarTour, location.pathname]);

  if (location.pathname === '/' || !localStorage.getItem('usuario')) {
    return null;
  }

  return (
    <button
      type="button"
      className="btn btn-dark shadow"
      onClick={iniciarTour}
      style={{
        position: 'fixed',
        right: '1rem',
        bottom: '1rem',
        zIndex: 1050,
        border: '1px solid #FF69B4'
      }}
    >
      Guia
    </button>
  );
}

export default TourGuia;