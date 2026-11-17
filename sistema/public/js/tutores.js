montarCabecalho('tutores.html');

async function carregar() {
  const tutores = await api('GET', '/api/tutores');
  document.getElementById('lista').innerHTML = tutores.map((t) => `
    <tr>
      <td>${esc(t.nome)}</td><td>${esc(t.cpf)}</td><td>${esc(t.telefone)}</td><td>${esc(t.email)}</td>
      <td>
        <button onclick="editar(${t.id})">Editar</button>
        <button class="perigo" onclick="excluir(${t.id})">Excluir</button>
      </td>
    </tr>`).join('');
}

function limpar() {
  document.getElementById('form').reset();
  document.getElementById('id').value = '';
  document.getElementById('titulo').textContent = 'Novo tutor';
}

async function editar(id) {
  const t = await api('GET', '/api/tutores/' + id);
  for (const campo of ['nome', 'cpf', 'telefone', 'email', 'endereco']) document.getElementById(campo).value = t[campo] || '';
  document.getElementById('id').value = t.id;
  document.getElementById('titulo').textContent = 'Editar tutor';
  window.scrollTo(0, 0);
}

async function excluir(id) {
  if (!confirm('Excluir este tutor?')) return;
  try { await api('DELETE', '/api/tutores/' + id); mostrarMsg('Tutor excluído.', 'ok'); carregar(); }
  catch (e) { mostrarMsg(e.message, 'erro'); }
}

document.getElementById('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const dados = {};
  for (const campo of ['nome', 'cpf', 'telefone', 'email', 'endereco']) dados[campo] = document.getElementById(campo).value;
  const id = document.getElementById('id').value;
  try {
    if (id) await api('PUT', '/api/tutores/' + id, dados);
    else await api('POST', '/api/tutores', dados);
    mostrarMsg('Tutor salvo com sucesso.', 'ok');
    limpar();
    carregar();
  } catch (err) { mostrarMsg(err.message, 'erro'); }
});

carregar();
