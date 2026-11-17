montarCabecalho('agendamentos.html');

const CAMPOS = ['pet_id', 'data_hora', 'motivo', 'status'];

async function carregarPets() {
  const pets = await api('GET', '/api/pets');
  document.getElementById('pet_id').innerHTML =
    '<option value="">Selecione o pet...</option>' +
    pets.map((p) => `<option value="${p.id}">${esc(p.nome)} (${esc(p.tutor_nome)})</option>`).join('');
}

async function carregar() {
  const ags = await api('GET', '/api/agendamentos');
  document.getElementById('lista').innerHTML = ags.map((a) => `
    <tr>
      <td>${esc(a.data_hora.slice(0, 16).replace('T', ' '))}</td><td>${esc(a.pet_nome)}</td>
      <td>${esc(a.tutor_nome)}</td><td>${esc(a.motivo)}</td><td>${esc(a.status)}</td>
      <td>
        <button onclick="editar(${a.id})">Editar</button>
        <button class="perigo" onclick="excluir(${a.id})">Excluir</button>
      </td>
    </tr>`).join('');
}

function limpar() {
  document.getElementById('form').reset();
  document.getElementById('id').value = '';
  document.getElementById('titulo').textContent = 'Novo agendamento';
}

async function editar(id) {
  const a = await api('GET', '/api/agendamentos/' + id);
  document.getElementById('pet_id').value = a.pet_id;
  document.getElementById('data_hora').value = a.data_hora.slice(0, 16).replace(' ', 'T');
  document.getElementById('motivo').value = a.motivo;
  document.getElementById('status').value = a.status;
  document.getElementById('id').value = a.id;
  document.getElementById('titulo').textContent = 'Editar agendamento';
  window.scrollTo(0, 0);
}

async function excluir(id) {
  if (!confirm('Excluir este agendamento?')) return;
  try { await api('DELETE', '/api/agendamentos/' + id); mostrarMsg('Agendamento excluído.', 'ok'); carregar(); }
  catch (e) { mostrarMsg(e.message, 'erro'); }
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const dados = {};
  for (const c of CAMPOS) dados[c] = document.getElementById(c).value;
  const id = document.getElementById('id').value;
  try {
    if (id) await api('PUT', '/api/agendamentos/' + id, dados);
    else await api('POST', '/api/agendamentos', dados);
    mostrarMsg('Agendamento salvo com sucesso.', 'ok');
    limpar();
    carregar();
  } catch (err) { mostrarMsg(err.message, 'erro'); }
});

carregarPets();
carregar();
