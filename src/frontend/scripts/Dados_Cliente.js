// Função "Voltar"
document.getElementById('btnVoltar').addEventListener('click', () => {
  window.history.back();
});

// Validação simples de campos
document.getElementById('formCadastro').addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = document.getElementById('nome').value.trim();
  const rg = document.getElementById('rg').value.trim();
  const email = document.getElementById('email').value.trim();
  const telefone = document.getElementById('telefone').value.trim();

  if (!nome || !rg || !email || !telefone) {
    alert('Por favor, preencha todos os campos antes de prosseguir.');
    return;
  }

  alert(`Cadastro realizado com sucesso!\nBem-vindo(a), ${nome}.`);
  // Aqui você pode redirecionar para outra página:
  // window.location.href = 'proxima_pagina.html';
});
