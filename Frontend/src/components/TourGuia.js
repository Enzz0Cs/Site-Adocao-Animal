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
  passo('[data-tour="formulario"]', 'Formulario de cadastro', descricaoFormulario),
  passo('[data-tour="salvar"]', 'Botao salvar', 'Grava um novo registro ou atualiza o cadastro quando voce estiver editando.', 'top'),
  passo('[data-tour="busca"]', 'Pesquisa', descricaoBusca),
  passo('[data-tour="listagem"]', 'Lista de registros', descricaoListagem, 'top'),
  passo('[data-tour="acoes"]', 'Botoes de acao', descricaoAcoes, 'left')
];

const passosPorRota = {
  '/home': [
    passo('[data-tour="cabecalho"]', 'Tela inicial', 'Aqui ficam o nome do sistema, o usuario logado e a saida segura.'),
    passo('[data-tour="usuario"]', 'Perfil de acesso', 'Mostra quem esta usando o sistema e qual nivel de permissao libera os modulos.', 'bottom', 'end'),
    passo('[data-tour="modulos"]', 'Modulos do sistema', 'Cada cartao abre uma area de trabalho: animais, adocoes, saude, estoque e relatorios.', 'top'),
    passo('[data-tour="relatorios"]', 'Relatorios', 'Acesse os relatorios para consultar e exportar informacoes consolidadas do abrigo.', 'left')
  ],
  '/animais': [
    passo('[data-tour="page-header"]', 'Animais', 'Esta tela controla o cadastro e acompanhamento dos animais do abrigo.'),
    passo('[data-tour="abrir-formulario"]', 'Cadastrar animal', 'Abre o formulario com nome, data de registro, sexo, raca, porte e faixa etaria.', 'left'),
    passo('[data-tour="busca"]', 'Busca de animais', 'Filtra os cards por nome, raca ou status de aptidao. A busca atualiza a lista automaticamente.'),
    passo('[data-tour="listagem"]', 'Cards dos animais', 'Cada card mostra os dados principais e o status de aptidao para adocao.', 'top'),
    passo('[data-tour="acoes"]', 'Acoes do animal', 'Use os botoes para registrar vacina, validar aptidao, editar dados ou excluir o animal.', 'left')
  ],
  '/adocoes': [
    passo('[data-tour="page-header"]', 'Adocoes', 'Aqui voce registra e acompanha o processo de adocao.'),
    passo('[data-tour="abrir-formulario"]', 'Nova adocao', 'Abre o formulario para escolher animal apto, adotante e data da adocao.', 'left'),
    passo('[data-tour="busca"]', 'Busca de adocoes', 'Filtra por nome do animal ou nome do adotante.'),
    passo('[data-tour="listagem"]', 'Processos de adocao', 'Os cards mostram animal, adotante, status, documento e assinatura quando houver.', 'top'),
    passo('[data-tour="acoes"]', 'Acoes da adocao', 'Remove um processo de adocao. Quando o status permitir, tambem aparece o botao de finalizar.', 'left')
  ],
  '/adotantes': passosCrud(
    'Adotantes',
    'Cadastre e mantenha os dados das pessoas interessadas em adotar.',
    'Preencha nome, CPF, email, telefone e endereco. CPF e email ajudam a identificar o adotante e evitar duplicidade.',
    'Filtra por nome, CPF ou email para localizar rapidamente um cadastro.',
    'A tabela mostra os dados principais dos adotantes cadastrados.',
    'O lapis carrega o cadastro no formulario para editar. A lixeira exclui o adotante, quando ele nao possui vinculos.'
  ),
  '/veterinarios': passosCrud(
    'Veterinarios',
    'Cadastre os profissionais que poderao ser vinculados a procedimentos veterinarios.',
    'Informe nome, CPF, CRMV, telefone, email, especialidade e status. Apenas veterinarios ativos aparecem na tela de procedimentos.',
    'Filtra por nome, CPF, CRMV ou email.',
    'A tabela mostra CRMV, especialidade, contato e se o profissional esta ativo.',
    'O lapis edita o cadastro. A lixeira remove o profissional quando nao houver registros dependentes.'
  ),
  '/vacinas': passosCrud(
    'Vacinas',
    'Controle os tipos de vacina disponiveis para registro no historico dos animais.',
    'Cadastre um codigo curto e o nome da vacina, por exemplo V01 e Antirrabica.',
    'Filtra por nome ou codigo da vacina.',
    'A tabela mostra as vacinas cadastradas para uso nos registros dos animais.',
    'Use editar para corrigir codigo ou nome. Use excluir para remover uma vacina que nao deve mais aparecer.'
  ),
  '/estoque': [
    ...passosCrud(
      'Estoque',
      'Controle alimentos, medicamentos, itens de higiene e outros insumos.',
      'Preencha nome, categoria, quantidade atual, unidade, minimo e validade. O minimo ajuda a destacar itens com estoque baixo.',
      'Nesta tela a consulta principal e visual pela lista de inventario.',
      'O inventario mostra quantidade atual e minimo. Linhas destacadas indicam atencao no estoque.',
      'O botao de saida registra baixa de item. O lapis edita. A lixeira exclui.'
    ).filter((item) => item.element !== '[data-tour="busca"]'),
    passo('[data-tour="historico"]', 'Historico de saidas', 'Mostra baixas realizadas, quantidade retirada, destino e responsavel.', 'left')
  ],
  '/procedimentos-veterinarios': [
    ...passosCrud(
      'Procedimentos veterinarios',
      'Registre consultas, exames, cirurgias e tratamentos vinculados aos animais.',
      'Escolha o animal, informe tipo, data, veterinario, situacao e uma descricao clinica do atendimento.',
      'A listagem completa fica logo abaixo; use os dados da tabela para conferir registros existentes.',
      'A tabela mostra animal, tipo, data, descricao, veterinario e situacao.',
      'Editar carrega o procedimento no formulario. Excluir remove o registro apos confirmacao.'
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
    nextBtnText: 'Proximo',
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
