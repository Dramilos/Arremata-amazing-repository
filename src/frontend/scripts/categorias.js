// ------------------------------
// PEGA INFORMAÇÕES DO LOCAL STORAGE
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("Token");
// ------------------------------
// VERIFICA SE ESTA LOGADO
if (!token) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "../pages/Cadastro.html";
    return;
  }
});

// categorias.js
// Controla o modal de categorias, seleção de tags e chips dinâmicos

const categoriasModal = document.getElementById('categorias-modal');
const openCategoriasBtn = document.getElementById('open-categorias-modal');
const closeCategoriasBtn = document.getElementById('close-categorias-modal');
const chipsContainer = document.getElementById('chips-container');

let categoriasSelecionadas = [];
let lastFocusedElement = null;

function openModal() {
    if (!categoriasModal) return;
    lastFocusedElement = document.activeElement;
    categoriasModal.hidden = false;
    document.body.classList.add('modal-open');
    categoriasModal.setAttribute('aria-hidden', 'false');
    // attach handlers and bind buttons
    bindCategoriaButtons();
    // focus first category button
    const firstBtn = categoriasModal.querySelector('.categoria-btn');
    if (firstBtn) firstBtn.focus();
}

function closeModal() {
    if (!categoriasModal) return;
    categoriasModal.hidden = true;
    document.body.classList.remove('modal-open');
    categoriasModal.setAttribute('aria-hidden', 'true');
    if (lastFocusedElement) lastFocusedElement.focus();
}

// Abrir modal
if (openCategoriasBtn) {
    openCategoriasBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
}

// Fechar modal
if (closeCategoriasBtn) {
    closeCategoriasBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeModal();
    });
}

// Cria/atualiza listeners para os botões de categoria (rebind quando abrir)
function bindCategoriaButtons() {
    const categoriaBtns = categoriasModal.querySelectorAll('.categoria-btn');
    categoriaBtns.forEach(btn => {
        // remove listeners to avoid duplicates
        btn.replaceWith(btn.cloneNode(true));
    });
    // re-query after clone
    const freshBtns = categoriasModal.querySelectorAll('.categoria-btn');
    freshBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const categoria = btn.getAttribute('data-categoria');
            const idx = categoriasSelecionadas.indexOf(categoria);
            if (idx === -1) {
                categoriasSelecionadas.push(categoria);
            } else {
                categoriasSelecionadas.splice(idx, 1);
            }
            atualizarCategoriasModal();
            atualizarChips();
        });
    });
    atualizarCategoriasModal();
}

// Atualiza visual do modal (selecionado = laranja)
function atualizarCategoriasModal() {
    const categoriaBtns = categoriasModal.querySelectorAll('.categoria-btn');
    categoriaBtns.forEach(btn => {
        const categoria = btn.getAttribute('data-categoria');
        if (categoriasSelecionadas.includes(categoria)) {
            btn.classList.add('categoria-selecionada');
            btn.setAttribute('aria-pressed', 'true');
        } else {
            btn.classList.remove('categoria-selecionada');
            btn.setAttribute('aria-pressed', 'false');
        }
    });
}

// Aplica o filtro nos cards com base nas categorias selecionadas
function aplicarFiltro() {
    const cards = document.querySelectorAll('.card');
    // se não houver categorias selecionadas, mostra todos
    if (!categoriasSelecionadas || categoriasSelecionadas.length === 0) {
        cards.forEach(card => { card.style.display = ''; });
        return;
    }
    const selecionadasNorm = categoriasSelecionadas.map(c => c.trim().toLowerCase());
    cards.forEach(card => {
        const catEls = card.querySelectorAll('.category');
        const cardCats = Array.from(catEls).map(el => el.textContent.trim().toLowerCase());
        // mostrar se houver interseção
        const match = cardCats.some(cc => selecionadasNorm.includes(cc));
        card.style.display = match ? '' : 'none';
    });
}

// Atualiza chips abaixo da barra de pesquisa
function atualizarChips() {
    chipsContainer.innerHTML = '';
    categoriasSelecionadas.forEach(categoria => {
        const chip = document.createElement('button');
        chip.className = 'chip chip-dinamico';
        chip.innerHTML = `<span>${categoria}</span> <span class="chip-x" aria-hidden="true">&#10005;</span>`;
        chip.addEventListener('click', () => {
            // Remover categoria ao clicar no chip
            categoriasSelecionadas = categoriasSelecionadas.filter(c => c !== categoria);
            atualizarCategoriasModal();
            atualizarChips();
        });
        chipsContainer.appendChild(chip);
    });
    // aplicar filtro sempre que chips mudam
    aplicarFiltro();
}

// Fecha modal ao clicar fora do conteúdo
if (categoriasModal) {
    categoriasModal.addEventListener('click', (e) => {
        if (e.target === categoriasModal) {
            closeModal();
        }
    });
}

// Fecha com Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && categoriasModal && !categoriasModal.hidden) {
        closeModal();
    }
});

// Inicializa chips se houver categorias pré-selecionadas
atualizarChips();
