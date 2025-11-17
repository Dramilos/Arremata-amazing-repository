
// ------------------------------
// PEGA INFORMAÇÕES DO LOCAL STORAGE
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const telefone = localStorage.getItem("Telefone");
  const email = localStorage.getItem("Email");
  const token = localStorage.getItem("Token");
  const estado = localStorage.getItem("Estado");
  const cidade = localStorage.getItem("Cidade");
// ------------------------------
// VERIFICA SE ESTA LOGADO
if (!token) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "../pages/Cadastro.html";
    return;
  }

// ------------------------------
// EXIBE INFORMAÇÕES NA PÁGINA

document.getElementById("Telefone").textContent = telefone || "";
document.getElementById("Email").textContent = email || "";
document.getElementById("Estado").textContent = estado || "";
document.getElementById("Cidade").textContent = cidade || "";
});
// ==============================
// SISTEMA DE TAGS DINÂMICO
// ==============================

// Seleciona os elementos do HTML
const tagInput = document.getElementById('tag-input');
const tagsContainer = document.getElementById('tags');
let tags = [];

// Função que desenha as tags na tela
function renderTags() {
  tagsContainer.innerHTML = ''; // limpa o conteúdo anterior

  tags.forEach((tag, index) => {
    const tagEl = document.createElement('div');
    tagEl.classList.add('tag');
    tagEl.innerHTML = `
      <span>${tag}</span>
      <button type="button" class="remove-tag" data-index="${index}">x</button>
    `;
    tagsContainer.appendChild(tagEl);
  });

  // Adiciona evento para remover cada tag ao clicar no "x"
  document.querySelectorAll('.remove-tag').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = btn.getAttribute('data-index');
      tags.splice(i, 1);
      renderTags();
    });
  });
}

// Adiciona uma nova tag ao pressionar Enter
tagInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && tagInput.value.trim() !== '') {
    e.preventDefault();
    const novaTag = tagInput.value.trim();

    // Evita tags duplicadas
    if (!tags.includes(novaTag)) {
      tags.push(novaTag);
      renderTags();
    }

    tagInput.value = ''; // limpa o campo
  }
});

// ==============================
// ENVIO DO FORMULÁRIO
// ==============================

document.querySelector('.formulario').addEventListener('submit', (e) => {
  e.preventDefault();

  // Exemplo: mostra as tags no alerta (pode enviar para backend futuramente)
  alert(`Serviço publicado com as tags: ${tags.join(', ')}`);
});
