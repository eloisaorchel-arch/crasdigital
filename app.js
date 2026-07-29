/* ===================================================================
   CONFIGURAÇÃO
   Cole aqui a URL do seu Apps Script publicado (termina em /exec).
   Veja instruções em Code.gs e no README.md
=================================================================== */
const CONFIG = {
  API_URL: 'https://script.google.com/macros/s/AKfycbzT4Z3uo0fNSiLBXqIVQLsKEBaWAqQx0tn5fVN5tc-p4SNKSTPTLHVTqud8X3N-pQ6I',
};

const UNIDADES = [
  'CRAS Alfredo de Castro',
  'CRAS Ana Carla',
  'CRAS Cidade Alta',
  'CRAS Conjunto São José',
  'CRAS Luz D´Yara',
  'CRAS Padre Lothar',
  'CRAS Rio Vermelho',
  'CRAS Sagrada Família',
];

/* ===================================================================
   DEFINIÇÃO DAS TABELAS (espelha as abas da planilha/banco de dados)
   Campos marcados com adminOnly: true não aparecem no formulário público
   de "Registrar Atendimento" (são preenchidos automaticamente pelo
   sistema a partir da sessão do usuário logado), mas continuam visíveis
   e editáveis no painel do administrador.
=================================================================== */
const TABLES = {
  Atendimentos: {
    label: 'Atendimentos',
    fields: [
      { key: 'Data', label: 'Data', type: 'date', required: true },
      { key: 'PerfilFamilia', label: 'Perfil da Família', type: 'text' },
      { key: 'CPF', label: 'CPF', type: 'text', required: true },
      { key: 'Familia', label: 'Família / Responsável', type: 'text', required: true },
      { key: 'Telefone', label: 'Telefone', type: 'text' },
      { key: 'Bairro', label: 'Bairro', type: 'text' },
      { key: 'FormaAcesso', label: 'Forma de Acesso ao CRAS', type: 'select', options: ['Busca ativa', 'Procura espontânea', 'Encaminhamento de outra unidade', 'Encaminhamento da Saúde', 'Encaminhamento da Educação', 'Conselho Tutelar', 'Outros'] },
      { key: 'CondicaoFamilia', label: 'Condição da Família', type: 'text' },
      { key: 'RecebeBeneficio', label: 'Recebe Benefício', type: 'text' },
      { key: 'InteresseCurso', label: 'Interesse em Curso', type: 'text' },
      { key: 'PreferenciaHorario', label: 'Preferência de Horário', type: 'select', options: ['Manhã', 'Tarde', 'Noite'] },
      { key: 'Encaminhamentos', label: 'Encaminhamentos', type: 'textarea' },
      { key: 'TecnicoResponsavel', label: 'Técnico Responsável', type: 'text' },
      { key: 'Observacao', label: 'Observação', type: 'textarea' },
      { key: 'Unidade', label: 'Unidade', type: 'select', options: UNIDADES, required: true, adminOnly: true },
      { key: 'CriadoPor', label: 'Registrado por (e-mail)', type: 'text', adminOnly: true },
    ],
  },
  PAIF: {
    label: 'Famílias no PAIF',
    fields: [
      { key: 'CPF', label: 'CPF', type: 'text', required: true },
      { key: 'Familia', label: 'Família em Acompanhamento', type: 'text', required: true },
      { key: 'Telefone', label: 'Telefone', type: 'text' },
      { key: 'Bairro', label: 'Bairro', type: 'text' },
      { key: 'TipoAtendimento', label: 'Tipo', type: 'select', options: ['Particularizado', 'Coletivo'] },
      { key: 'PublicoPrioritario', label: 'Público Prioritário', type: 'text' },
      { key: 'SCFV', label: 'SCFV', type: 'text' },
      { key: 'DataInclusao', label: 'Data de Inclusão', type: 'date' },
      { key: 'DataDesligamento', label: 'Data de Desligamento', type: 'date' },
      { key: 'MotivoDesligamento', label: 'Motivo do Desligamento', type: 'text' },
    ],
  },
  BeneficiosEventuais: {
    label: 'Benefícios Eventuais',
    fields: [
      { key: 'CPF', label: 'CPF do Solicitante', type: 'text', required: true },
      { key: 'NomeSolicitante', label: 'Nome do Solicitante', type: 'text', required: true },
      { key: 'Telefone', label: 'Telefone', type: 'text' },
      { key: 'Bairro', label: 'Bairro', type: 'text' },
      { key: 'Endereco', label: 'Endereço', type: 'text' },
      { key: 'ParaQuem', label: 'Para Quem', type: 'text' },
      { key: 'TipoBeneficio', label: 'Benefício Eventual', type: 'select', options: ['Auxílio-natalidade', 'Auxílio-funeral', 'Cesta básica do município', 'Cesta básica do estado', 'Emissão de 2ª via de documentos', 'Passagem terrestre', 'Calamidade pública', 'Moradia - aluguel', 'Outros'] },
      { key: 'Quantidade', label: 'Quantidade', type: 'number' },
      { key: 'DataSolicitacao', label: 'Data da Solicitação', type: 'date' },
      { key: 'DataConcessao', label: 'Data da Concessão', type: 'date' },
      { key: 'TecnicoReferencia', label: 'Técnico de Referência', type: 'text' },
      { key: 'Observacao', label: 'Observação', type: 'textarea' },
    ],
  },
  AtendimentosColetivos: {
    label: 'Atendimentos Coletivos',
    fields: [
      { key: 'NomeGrupo', label: 'Nome do Grupo / Atividade', type: 'text', required: true },
      { key: 'Mes', label: 'Mês', type: 'select', options: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'] },
      { key: 'Ano', label: 'Ano', type: 'number' },
      { key: 'Quantidade', label: 'Quantidade de Participantes', type: 'number' },
      { key: 'TipoAtividade', label: 'Tipo de Atividade', type: 'text' },
    ],
  },
  Oficios: {
    label: 'Ofícios',
    fields: [
      { key: 'DataRecebimento', label: 'Data de Recebimento', type: 'date' },
      { key: 'RecebidoPor', label: 'Recebido Por', type: 'text' },
      { key: 'Orgao', label: 'Órgão', type: 'text' },
      { key: 'NumeroOficio', label: 'Nº do Ofício', type: 'text' },
      { key: 'DataOficio', label: 'Data do Ofício', type: 'date' },
      { key: 'ResponsavelFamiliar', label: 'Responsável Familiar', type: 'text' },
      { key: 'Perfil', label: 'Perfil', type: 'text' },
      { key: 'TecnicoResponsavel', label: 'Técnico Responsável', type: 'text' },
      { key: 'DataResposta', label: 'Data da Resposta', type: 'date' },
      { key: 'Observacao', label: 'Observação', type: 'textarea' },
    ],
  },
};

/* Campos do formulário de cadastro (view pública "Criar Cadastro") */
const CADASTRO_FIELDS = [
  { key: 'Nome', label: 'Nome completo', type: 'text', required: true },
  { key: 'Email', label: 'E-mail', type: 'email', required: true },
  { key: 'Senha', label: 'Senha', type: 'password', required: true },
  { key: 'CPF', label: 'CPF', type: 'text', required: true, hint: 'Digite exatamente 11 números (pode usar pontos e traço).' },
  { key: 'Telefone', label: 'Telefone', type: 'text', required: true, hint: 'Com DDD — entre 10 e 11 números.' },
  { key: 'Unidade', label: 'Em qual unidade você trabalha?', type: 'select', required: true, options: UNIDADES },
  { key: 'DataInicioFuncao', label: 'Data de início da função', type: 'date', required: true },
  { key: 'Sexo', label: 'Sexo', type: 'select', required: true, options: ['Masculino', 'Feminino', 'Prefiro não informar'] },
  { key: 'DataNascimento', label: 'Data de nascimento', type: 'date', required: true },
  { key: 'Cargo', label: 'Cargo que ocupa', type: 'text', required: true },
];

/* Campos exibidos no formulário público de "Registrar Atendimento" (sem os adminOnly) */
const publicAtendimentoFields = TABLES.Atendimentos.fields.filter((f) => !f.adminOnly);

let currentAdminTable = 'Atendimentos';
let session = JSON.parse(localStorage.getItem('cras_session') || 'null');

/* ===================================================================
   API HELPERS
=================================================================== */
async function apiList(sheet, extraParams) {
  const params = new URLSearchParams(Object.assign({ action: 'list', sheet: sheet }, extraParams || {}));
  const res = await fetch(`${CONFIG.API_URL}?${params.toString()}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Erro ao carregar dados');
  return json.data;
}

async function apiPost(body) {
  const res = await fetch(CONFIG.API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // evita preflight CORS
    body: JSON.stringify(body),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Erro na operação');
  return json;
}

function apiReady() {
  if (!CONFIG.API_URL || CONFIG.API_URL.includes('COLE_AQUI')) {
    toast('Configure a URL da API em app.js (CONFIG.API_URL) antes de usar o site.', 'error');
    return false;
  }
  return true;
}

/* ===================================================================
   NAVEGAÇÃO
=================================================================== */
function showView(id) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('nav.main-nav button').forEach((b) => b.classList.toggle('active', b.dataset.view === id));
}

/** Views protegidas: exige login aprovado. Caso contrário, abre o modal de login. */
function goProtected(viewId) {
  if (!session) {
    toast('Faça login para acessar esta área.', 'error');
    document.getElementById('loginModal').classList.add('active');
    return;
  }
  showView(viewId);
  if (viewId === 'view-atendimento') {
    const tecInput = document.getElementById('pub_TecnicoResponsavel');
    if (tecInput && !tecInput.value) tecInput.value = session.nome;
  }
  if (viewId === 'view-consulta') loadConsultaUnidade();
}

document.querySelectorAll('nav.main-nav button[data-view]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.protected === 'true') goProtected(btn.dataset.view);
    else showView(btn.dataset.view);
  });
});

document.getElementById('btnGoAtendimento').addEventListener('click', () => goProtected('view-atendimento'));
document.getElementById('btnGoConsulta').addEventListener('click', () => goProtected('view-consulta'));

/* ===================================================================
   TOAST
=================================================================== */
function toast(msg, type = '') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast show ' + type;
  setTimeout(() => el.classList.remove('show'), 3200);
}

/* ===================================================================
   FORM BUILDER (reutilizado em: cadastro, atendimento público e admin)
=================================================================== */
function buildFormFields(container, fields, prefix) {
  container.innerHTML = '';
  fields.forEach((f) => {
    const wrap = document.createElement('div');
    wrap.className = 'field' + (f.type === 'textarea' ? ' full' : '');
    const label = document.createElement('label');
    label.textContent = f.label + (f.required ? ' *' : '');
    wrap.appendChild(label);

    let input;
    if (f.type === 'select') {
      input = document.createElement('select');
      input.innerHTML = '<option value="">Selecione...</option>' + f.options.map((o) => `<option value="${o}">${o}</option>`).join('');
    } else if (f.type === 'textarea') {
      input = document.createElement('textarea');
      input.rows = 3;
    } else {
      input = document.createElement('input');
      input.type = f.type;
    }
    input.id = `${prefix}_${f.key}`;
    input.name = f.key;
    if (f.required) input.required = true;
    wrap.appendChild(input);

    if (f.hint) {
      const hint = document.createElement('div');
      hint.className = 'hint-text';
      hint.textContent = f.hint;
      wrap.appendChild(hint);
    }
    container.appendChild(wrap);
  });
}

buildFormFields(document.getElementById('atendimentoFields'), publicAtendimentoFields, 'pub');
buildFormFields(document.getElementById('cadastroFields'), CADASTRO_FIELDS, 'cad');

/* ===================================================================
   CRIAR CADASTRO
=================================================================== */
document.getElementById('formCadastro').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!apiReady()) return;

  const data = {};
  CADASTRO_FIELDS.forEach((f) => (data[f.key] = document.getElementById(`cad_${f.key}`).value.trim()));

  const cpfDigits = data.CPF.replace(/\D/g, '');
  if (cpfDigits.length !== 11) {
    toast('O CPF deve conter exatamente 11 números.', 'error');
    return;
  }
  const telDigits = data.Telefone.replace(/\D/g, '');
  if (telDigits.length < 10 || telDigits.length > 11) {
    toast('O telefone deve ter entre 10 e 11 números.', 'error');
    return;
  }
  data.CPF = cpfDigits;
  data.Telefone = telDigits;

  try {
    await apiPost({ action: 'register', data });
    toast('Cadastro enviado! Aguarde a aprovação do administrador para acessar o sistema.', 'success');
    e.target.reset();
    showView('view-home');
  } catch (err) {
    toast(err.message, 'error');
  }
});

/* ===================================================================
   FORMULÁRIO - NOVO ATENDIMENTO (restrito, direcionado à unidade do técnico)
=================================================================== */
document.getElementById('formAtendimento').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!session) {
    toast('Faça login para registrar atendimentos.', 'error');
    return;
  }
  if (!apiReady()) return;

  const data = {};
  publicAtendimentoFields.forEach((f) => (data[f.key] = document.getElementById(`pub_${f.key}`).value));
  data.Unidade = session.unidade;
  data.CriadoPor = session.email;

  try {
    await apiPost({ action: 'create', sheet: 'Atendimentos', data });
    toast('Atendimento registrado com sucesso!', 'success');
    e.target.reset();
    document.getElementById('pub_TecnicoResponsavel').value = session.nome;
  } catch (err) {
    toast(err.message, 'error');
  }
});

/* ===================================================================
   CONSULTAR ATENDIMENTOS (restrito à unidade do técnico logado)
=================================================================== */
async function loadConsultaUnidade() {
  if (!session) return;
  document.getElementById('consultaUnidadeTitle').textContent = `Atendimentos da unidade: ${session.unidade}`;
  const box = document.getElementById('consultaResult');
  box.innerHTML = '<p class="empty-state">Carregando...</p>';
  if (!apiReady()) return;
  try {
    const rows = await apiList('Atendimentos', { filterField: 'Unidade', filterValue: session.unidade });
    window._consultaRows = rows;
    renderConsultaTable(rows);
  } catch (err) {
    box.innerHTML = `<p class="empty-state">${err.message}</p>`;
  }
}

function renderConsultaTable(rows) {
  const box = document.getElementById('consultaResult');
  if (!rows.length) {
    box.innerHTML = '<p class="empty-state">Nenhum atendimento registrado ainda nesta unidade.</p>';
    return;
  }
  box.innerHTML = `
    <div class="table-wrap"><table>
      <thead><tr><th>Data</th><th>Família</th><th>CPF</th><th>Bairro</th><th>Técnico</th><th>Observação</th></tr></thead>
      <tbody>${rows.map((r) => `<tr><td>${fmtDate(r.Data)}</td><td>${esc(r.Familia)}</td><td>${esc(r.CPF)}</td><td>${esc(r.Bairro)}</td><td>${esc(r.TecnicoResponsavel)}</td><td>${esc(r.Observacao)}</td></tr>`).join('')}</tbody>
    </table></div>`;
}

document.getElementById('consultaFiltro').addEventListener('input', (e) => {
  const q = e.target.value.toLowerCase().trim();
  const qDigits = q.replace(/\D/g, '');
  const rows = (window._consultaRows || []).filter(
    (r) => String(r.Familia || '').toLowerCase().includes(q) || (qDigits && String(r.CPF || '').includes(qDigits))
  );
  renderConsultaTable(rows);
});

/* ===================================================================
   LOGIN / LOGOUT / CABEÇALHO DINÂMICO
=================================================================== */
const modal = document.getElementById('loginModal');

document.getElementById('formLogin').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!apiReady()) return;
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginSenha').value;
  try {
    const res = await apiPost({ action: 'login', email, senha });
    session = { id: res.id, nome: res.nome, perfil: res.perfil, unidade: res.unidade, email: res.email };
    localStorage.setItem('cras_session', JSON.stringify(session));
    modal.classList.remove('active');
    e.target.reset();
    updateHeaderUI();
    if (session.perfil === 'admin') {
      enterAdmin();
    } else {
      showView('view-home');
      toast(`Bem-vindo(a), ${session.nome}!`, 'success');
    }
  } catch (err) {
    toast(err.message, 'error');
  }
});

document.getElementById('btnCloseModal').addEventListener('click', () => modal.classList.remove('active'));
document.getElementById('linkGoCadastro').addEventListener('click', (e) => {
  e.preventDefault();
  modal.classList.remove('active');
  showView('view-cadastro');
});

function doLogout() {
  session = null;
  localStorage.removeItem('cras_session');
  updateHeaderUI();
  showView('view-home');
}
document.getElementById('btnLogoutSidebar').addEventListener('click', doLogout);

function updateHeaderUI() {
  const authArea = document.getElementById('authArea');
  if (session) {
    authArea.innerHTML = `
      <div class="user-chip">
        <span>${esc(session.nome)}</span>
        ${session.perfil === 'admin' ? '<button class="btn btn-header-ghost btn-sm" id="btnPainelAdmin">Painel Admin</button>' : ''}
        <button class="btn btn-header-ghost btn-sm" id="btnLogoutHeader">Sair</button>
      </div>`;
    if (session.perfil === 'admin') document.getElementById('btnPainelAdmin').addEventListener('click', enterAdmin);
    document.getElementById('btnLogoutHeader').addEventListener('click', doLogout);
  } else {
    authArea.innerHTML = `
      <button class="btn-header-ghost" id="btnCadastroOpen">Criar Cadastro</button>
      <button class="btn-admin-toggle" id="btnEntrar">Entrar</button>`;
    document.getElementById('btnCadastroOpen').addEventListener('click', () => showView('view-cadastro'));
    document.getElementById('btnEntrar').addEventListener('click', () => modal.classList.add('active'));
  }
}

function enterAdmin() {
  showView('view-admin');
  document.getElementById('adminUserName').textContent = session.nome;
  document.getElementById('adminUserRole').textContent = session.perfil;
  loadAdminTable(currentAdminTable);
}

/* ===================================================================
   ADMIN - TABELAS PADRÃO (Atendimentos, PAIF, Benefícios, etc.)
=================================================================== */
const sidebar = document.getElementById('adminSidebarTables');

function setActiveSidebarBtn(btn) {
  document.querySelectorAll('#adminSidebarTables button').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
}

Object.keys(TABLES).forEach((key) => {
  const btn = document.createElement('button');
  btn.textContent = TABLES[key].label;
  btn.dataset.table = key;
  btn.addEventListener('click', () => {
    currentAdminTable = key;
    setActiveSidebarBtn(btn);
    loadAdminTable(key);
  });
  sidebar.appendChild(btn);
});

/* Seções extras de administração de usuários (só o admin vê, pois só ele acessa o painel) */
const btnPending = document.createElement('button');
btnPending.textContent = 'Cadastros Pendentes';
btnPending.addEventListener('click', () => {
  setActiveSidebarBtn(btnPending);
  loadUsersPanel('pendente');
});
sidebar.appendChild(btnPending);

const btnAllUsers = document.createElement('button');
btnAllUsers.textContent = 'Usuários';
btnAllUsers.addEventListener('click', () => {
  setActiveSidebarBtn(btnAllUsers);
  loadUsersPanel(null);
});
sidebar.appendChild(btnAllUsers);

async function loadAdminTable(tableKey) {
  const panel = document.getElementById('adminPanel');
  const def = TABLES[tableKey];
  panel.innerHTML = `
    <div class="panel-head">
      <h2>${def.label}</h2>
      <button class="btn btn-solid btn-sm" id="btnNewRecord">+ Novo registro</button>
    </div>
    <div class="table-wrap"><table>
      <thead><tr>${def.fields.map((f) => `<th>${f.label}</th>`).join('')}<th>Ações</th></tr></thead>
      <tbody id="adminTableBody"><tr><td colspan="${def.fields.length + 1}" class="empty-state">Carregando...</td></tr></tbody>
    </table></div>`;

  document.getElementById('btnNewRecord').addEventListener('click', () => openRecordForm(tableKey, null));

  if (!apiReady()) {
    document.getElementById('adminTableBody').innerHTML = `<tr><td colspan="${def.fields.length + 1}" class="empty-state">Configure a API para carregar os dados.</td></tr>`;
    return;
  }

  try {
    const rows = await apiList(tableKey);
    const tbody = document.getElementById('adminTableBody');
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="${def.fields.length + 1}" class="empty-state">Nenhum registro ainda.</td></tr>`;
      return;
    }
    tbody.innerHTML = rows
      .map(
        (r) => `<tr>
          ${def.fields.map((f) => `<td>${f.type === 'date' ? fmtDate(r[f.key]) : esc(r[f.key])}</td>`).join('')}
          <td class="actions-cell">
            <button class="btn btn-ghost btn-sm" data-edit="${r.ID}">Editar</button>
            <button class="btn btn-danger btn-sm" data-del="${r.ID}">Excluir</button>
          </td>
        </tr>`
      )
      .join('');

    tbody.querySelectorAll('[data-edit]').forEach((b) =>
      b.addEventListener('click', () => {
        const row = rows.find((r) => r.ID === b.dataset.edit);
        openRecordForm(tableKey, row);
      })
    );
    tbody.querySelectorAll('[data-del]').forEach((b) =>
      b.addEventListener('click', async () => {
        if (!confirm('Excluir este registro?')) return;
        try {
          await apiPost({ action: 'delete', sheet: tableKey, id: b.dataset.del });
          toast('Registro excluído.', 'success');
          loadAdminTable(tableKey);
        } catch (err) {
          toast(err.message, 'error');
        }
      })
    );
  } catch (err) {
    document.getElementById('adminTableBody').innerHTML = `<tr><td colspan="${def.fields.length + 1}" class="empty-state">${err.message}</td></tr>`;
  }
}

function openRecordForm(tableKey, row) {
  const def = TABLES[tableKey];
  const overlay = document.getElementById('recordModal');
  const box = document.getElementById('recordModalContent');
  box.innerHTML = `
    <h3>${row ? 'Editar' : 'Novo'} registro — ${def.label}</h3>
    <form id="recordForm">
      <div class="form-grid" id="recordFields"></div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" id="btnCancelRecord">Cancelar</button>
        <button type="submit" class="btn btn-solid">Salvar</button>
      </div>
    </form>`;
  buildFormFields(document.getElementById('recordFields'), def.fields, 'rec');
  if (row) {
    def.fields.forEach((f) => {
      const el = document.getElementById(`rec_${f.key}`);
      if (el) el.value = row[f.key] || '';
    });
  }
  overlay.classList.add('active');
  document.getElementById('btnCancelRecord').addEventListener('click', () => overlay.classList.remove('active'));
  document.getElementById('recordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {};
    def.fields.forEach((f) => (data[f.key] = document.getElementById(`rec_${f.key}`).value));
    try {
      if (row) await apiPost({ action: 'update', sheet: tableKey, id: row.ID, data });
      else await apiPost({ action: 'create', sheet: tableKey, data });
      toast('Registro salvo com sucesso!', 'success');
      overlay.classList.remove('active');
      loadAdminTable(tableKey);
    } catch (err) {
      toast(err.message, 'error');
    }
  });
}

/* ===================================================================
   ADMIN - CADASTROS PENDENTES / USUÁRIOS
=================================================================== */
async function loadUsersPanel(statusFilter) {
  const panel = document.getElementById('adminPanel');
  panel.innerHTML = `
    <div class="panel-head"><h2>${statusFilter === 'pendente' ? 'Cadastros Pendentes' : 'Usuários Cadastrados'}</h2></div>
    <div class="table-wrap"><table>
      <thead><tr><th>Nome</th><th>E-mail</th><th>CPF</th><th>Telefone</th><th>Unidade</th><th>Cargo</th><th>Status</th><th>Ações</th></tr></thead>
      <tbody id="usersTableBody"><tr><td colspan="8" class="empty-state">Carregando...</td></tr></tbody>
    </table></div>`;

  if (!apiReady()) return;

  try {
    let rows = await apiList('Usuarios');
    rows = rows.filter((u) => u.Perfil !== 'admin');
    if (statusFilter) rows = rows.filter((u) => u.Status === statusFilter);

    const tbody = document.getElementById('usersTableBody');
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="8" class="empty-state">Nenhum registro encontrado.</td></tr>`;
      return;
    }
    tbody.innerHTML = rows
      .map(
        (u) => `<tr>
          <td>${esc(u.Nome)}</td><td>${esc(u.Email)}</td><td>${esc(u.CPF)}</td><td>${esc(u.Telefone)}</td>
          <td>${esc(u.Unidade)}</td><td>${esc(u.Cargo)}</td>
          <td><span class="badge status-${esc(u.Status)}">${esc(u.Status)}</span></td>
          <td class="actions-cell">
            ${u.Status !== 'aprovado' ? `<button class="btn btn-solid btn-sm" data-approve="${u.ID}">Aprovar</button>` : ''}
            ${u.Status !== 'rejeitado' ? `<button class="btn btn-ghost btn-sm" data-reject="${u.ID}">Rejeitar</button>` : ''}
            <button class="btn btn-danger btn-sm" data-deluser="${u.ID}">Excluir</button>
          </td>
        </tr>`
      )
      .join('');

    tbody.querySelectorAll('[data-approve]').forEach((b) =>
      b.addEventListener('click', async () => {
        try {
          await apiPost({ action: 'update', sheet: 'Usuarios', id: b.dataset.approve, data: { Status: 'aprovado' } });
          toast('Cadastro aprovado!', 'success');
          loadUsersPanel(statusFilter);
        } catch (err) {
          toast(err.message, 'error');
        }
      })
    );
    tbody.querySelectorAll('[data-reject]').forEach((b) =>
      b.addEventListener('click', async () => {
        if (!confirm('Rejeitar este cadastro?')) return;
        try {
          await apiPost({ action: 'update', sheet: 'Usuarios', id: b.dataset.reject, data: { Status: 'rejeitado' } });
          toast('Cadastro rejeitado.', 'success');
          loadUsersPanel(statusFilter);
        } catch (err) {
          toast(err.message, 'error');
        }
      })
    );
    tbody.querySelectorAll('[data-deluser]').forEach((b) =>
      b.addEventListener('click', async () => {
        if (!confirm('Excluir este usuário definitivamente?')) return;
        try {
          await apiPost({ action: 'delete', sheet: 'Usuarios', id: b.dataset.deluser });
          toast('Usuário excluído.', 'success');
          loadUsersPanel(statusFilter);
        } catch (err) {
          toast(err.message, 'error');
        }
      })
    );
  } catch (err) {
    document.getElementById('usersTableBody').innerHTML = `<tr><td colspan="8" class="empty-state">${err.message}</td></tr>`;
  }
}

/* ===================================================================
   UTIL
=================================================================== */
function esc(v) {
  if (v === undefined || v === null) return '';
  return String(v).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
}
function fmtDate(v) {
  if (!v) return '';
  const d = new Date(v);
  if (isNaN(d.getTime())) return esc(v);
  return d.toLocaleDateString('pt-BR');
}

/* Inicialização */
updateHeaderUI();
showView('view-home');
