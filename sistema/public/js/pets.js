montarCabecalho('pets.html');

const CAMPOS = ['nome', 'especie', 'raca', 'data_nascimento', 'tutor_id'];

async function carregarTutores() {
  const tutores = await api('GET', '/api/tutores');
  document.getElementById('tutor_id').innerHTML =
    '<option value="">Selecione o tutor...</option>' +
    tutores.map((t) => `<option value="${t.id}">${esc(t.nome)}</option>`).join('');
}

async function carregar() {
  const pets = await api('GET', '/api/pets');
  document.getElementById('lista').innerHTML = pets.map((p) => `
    <tr>
      <td>${esc(p.nome)}</td><td>${esc(p.especie)}</td><td>${esc(p.raca)}</td><td>${esc(p.tutor_nome)}</td>
      <td>
        <button onclick="editar(${p.id})">Editar</button>
        <button class="perigo" onclick="excluir(${p.id})">Excluir</button>
      </td>
    </tr>`).join('');
}

function limpar() {
  document.getElementById('form').reset();
  document.getElementById('id').value = '';
  document.getElementById('titulo').textContent = 'Novo pet';
}

async function editar(id) {
  const p = await api('GET', '/api/pets/' + id);
  for (const c of CAMPOS) document.getElementById(c).value = p[c] ? String(p[c]).slice(0, 10) : '';
  document.getElementById('tutor_id').value = p.tutor_id;
  document.getElementById('id').value = p.id;
  document.getElementById('titulo').textContent = 'Editar pet';
  window.scrollTo(0, 0);
}

async function excluir(id) {
  if (!confirm('Excluir este pet?')) return;
  try { await api('DELETE', '/api/pets/' + id); mostrarMsg('Pet excluído.', 'ok'); carregar(); }
  catch (e) { mostrarMsg(e.message, 'erro'); }
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const dados = {};
  for (const c of CAMPOS) dados[c] = document.getElementById(c).value;
  const id = document.getElementById('id').value;
  try {
    if (id) await api('PUT', '/api/pets/' + id, dados);
    else await api('POST', '/api/pets', dados);
    mostrarMsg('Pet salvo com sucesso.', 'ok');
    limpar();
    carregar();
  } catch (err) { mostrarMsg(err.message, 'erro'); }
});

carregarTutores();
carregar();
