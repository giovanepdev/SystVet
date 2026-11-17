// Funcoes compartilhadas por todas as paginas

function sair() {
  localStorage.removeItem('token');
  localStorage.removeItem('nome');
  location.href = 'login.html';
}

// Chama a API enviando o token. Se a sessão expirou (401), volta para o login.
async function api(metodo, url, corpo) {
  const token = localStorage.getItem('token');
  if (!token) return sair();
  const resp = await fetch(url, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: corpo ? JSON.stringify(corpo) : undefined,
  });
  if (resp.status === 401) { alert('Sessão expirada. Faça login novamente.'); return sair(); }
  const dados = await resp.json();
  if (!resp.ok) throw new Error(dados.erro || 'Erro na requisição.');
  return dados;
}

function mostrarMsg(texto, tipo) {
  const el = document.getElementById('msg');
  el.className = 'msg ' + tipo;
  el.textContent = texto;
}

// Cabecalho com menu (so aparece em paginas protegidas)
function montarCabecalho(ativa) {
  if (!localStorage.getItem('token')) return sair();
  const itens = [['index.html', 'Início'], ['tutores.html', 'Tutores'], ['pets.html', 'Pets'], ['agendamentos.html', 'Agendamentos']];
  document.getElementById('cabecalho').innerHTML =
    '<h1>Clínica Veterinária</h1>' +
    itens.map(([href, nome]) => `<a href="${href}" class="${href === ativa ? 'ativo' : ''}">${nome}</a>`).join('') +
    `<span>${localStorage.getItem('nome') || ''}</span><a href="#" onclick="sair()">Sair</a>`;
}

// Evita injecao de HTML ao exibir texto vindo do banco
function esc(t) {
  return String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
