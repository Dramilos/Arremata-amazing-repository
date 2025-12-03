// ------------------------------
// PEGA INFORMAÇÕES DO LOCAL STORAGE
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("Token");
// ------------------------------
// VERIFICA SE ESTA LOGADO
if (!token) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "../pages/login.html";
    return;
  }
});

// ==============================
// VARIÁVEIS GLOBAIS
// ==============================
// Referência ao elemento modal de categorias
const categoriasModal = document.getElementById('categorias-modal');
// Botão para abrir o modal
const openCategoriasBtn = document.getElementById('open-categorias-modal');
// Botão para fechar o modal
const closeCategoriasBtn = document.getElementById('close-categorias-modal');
// Container onde os chips (tags selecionadas) serão exibidos
const chipsContainer = document.getElementById('chips-container');

// Array que armazena as categorias atualmente selecionadas pelo usuário
let categoriasSelecionadas = [];
// Armazena o elemento que teve foco antes do modal abrir (para restaurar depois)
let lastFocusedElement = null;

// ==============================
// FUNÇÃO: ABRIR MODAL
// ==============================
/**
 * Abre o modal de categorias e configura o foco acessível
 * - Guarda qual elemento tinha foco antes de abrir
 * - Mostra o modal removendo o atributo hidden
 * - Adiciona classe ao body para bloquear scroll
 * - Vincula os botões de categoria
 * - Move o foco para o primeiro botão dentro do modal
 */
function openModal() {
    if (!categoriasModal) return; // Sai se o modal não existir
    
    // Guarda elemento com foco anterior
    lastFocusedElement = document.activeElement;
    
    // Remove o atributo hidden para exibir o modal
    categoriasModal.hidden = false;
    
    // Adiciona classe ao body para evitar scroll de fundo
    document.body.classList.add('modal-open');
    
    // Atualiza atributo ARIA para leitores de tela
    categoriasModal.setAttribute('aria-hidden', 'false');
    
    // Vincula os listeners dos botões de categoria
    bindCategoriaButtons();
    
    // Move foco para o primeiro botão de categoria (acessibilidade)
    const firstBtn = categoriasModal.querySelector('.categoria-btn');
    if (firstBtn) firstBtn.focus();
}

// ==============================
// FUNÇÃO: FECHAR MODAL
// ==============================
/**
 * Fecha o modal de categorias e restaura o foco
 * - Esconde o modal adicionando o atributo hidden
 * - Remove classe que bloqueia scroll
 * - Atualiza ARIA para leitores de tela
 * - Restaura foco no elemento que tinha antes
 */
function closeModal() {
    if (!categoriasModal) return; // Sai se o modal não existir
    
    // Adiciona atributo hidden para esconder o modal
    categoriasModal.hidden = true;
    
    // Remove classe que bloqueava scroll do body
    document.body.classList.remove('modal-open');
    
    // Atualiza atributo ARIA para leitores de tela
    categoriasModal.setAttribute('aria-hidden', 'true');
    
    // Restaura foco no elemento anterior
    if (lastFocusedElement) lastFocusedElement.focus();
}

// ==============================
// EVENT LISTENER: BOTÃO ABRIR
// ==============================
// Quando clica no botão "Abrir Categorias"
if (openCategoriasBtn) {
    openCategoriasBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Previne comportamento padrão do link/botão
        openModal(); // Abre o modal
    });
}

// ==============================
// EVENT LISTENER: BOTÃO FECHAR
// ==============================
// Quando clica no botão "Fechar" dentro do modal
if (closeCategoriasBtn) {
    closeCategoriasBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Previne comportamento padrão
        closeModal(); // Fecha o modal
    });
}

// ==============================
// FUNÇÃO: VINCULAR BOTÕES DE CATEGORIA
// ==============================
/**
 * Cria/atualiza listeners para todos os botões de categoria
 * - Remove listeners antigos (clona e substitui elementos)
 * - Adiciona novo listener para cada botão
 * - Quando clicado: adiciona/remove categoria do array
 * - Atualiza visual do modal e chips
 */
function bindCategoriaButtons() {
    // Seleciona todos os botões de categoria dentro do modal
    const categoriaBtns = categoriasModal.querySelectorAll('.categoria-btn');
    
    // Remove listeners antigos clonando e substituindo cada botão
    categoriaBtns.forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    
    // Re-seleciona os botões após clone
    const freshBtns = categoriasModal.querySelectorAll('.categoria-btn');
    
    // Adiciona novo listener para cada botão
    freshBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Recupera o nome da categoria do atributo data
            const categoria = btn.getAttribute('data-categoria');
            
            // Procura a categoria no array
            const idx = categoriasSelecionadas.indexOf(categoria);
            
            // Se não estiver, adiciona; se estiver, remove (toggle)
            if (idx === -1) {
                categoriasSelecionadas.push(categoria);
            } else {
                categoriasSelecionadas.splice(idx, 1);
            }
            
            // Atualiza aparência do modal (muda cor se selecionado)
            atualizarCategoriasModal();
            
            // Atualiza chips mostrados na página
            atualizarChips();
        });
    });
    
    // Atualiza visual inicial dos botões
    atualizarCategoriasModal();
}

// ==============================
// FUNÇÃO: ATUALIZAR VISUAL DO MODAL
// ==============================
/**
 * Atualiza a aparência dos botões de categoria no modal
 * - Botões selecionados: recebem classe laranja
 * - Atributo ARIA: indica se o botão está selecionado (acessibilidade)
 */
function atualizarCategoriasModal() {
    // Seleciona todos os botões de categoria
    const categoriaBtns = categoriasModal.querySelectorAll('.categoria-btn');
    
    categoriaBtns.forEach(btn => {
        // Recupera o nome da categoria do botão
        const categoria = btn.getAttribute('data-categoria');
        
        // Verifica se a categoria está no array de selecionadas
        if (categoriasSelecionadas.includes(categoria)) {
            // Se sim, adiciona classe para indicar seleção (geralmente laranja)
            btn.classList.add('categoria-selecionada');
            // Informa leitores de tela que está pressionado
            btn.setAttribute('aria-pressed', 'true');
        } else {
            // Se não, remove a classe de seleção
            btn.classList.remove('categoria-selecionada');
            // Informa leitores de tela que não está pressionado
            btn.setAttribute('aria-pressed', 'false');
        }
    });
}

// ==============================
// FUNÇÃO: APLICAR FILTRO NOS CARDS
// ==============================
/**
 * Filtra os cards da página com base nas categorias selecionadas
 * - Se nenhuma categoria selecionada: mostra todos os cards
 * - Se houver seleção: mostra apenas cards que contêm aquela categoria
 */
function aplicarFiltro() {
    // Seleciona todos os cards da página
    const cards = document.querySelectorAll('.card');
    
    // Se não há categorias selecionadas, mostra todos os cards
    if (!categoriasSelecionadas || categoriasSelecionadas.length === 0) {
        cards.forEach(card => { card.style.display = ''; });
        return;
    }
    
    // Converte categorias selecionadas para minúsculas (para comparação case-insensitive)
    const selecionadasNorm = categoriasSelecionadas.map(c => c.trim().toLowerCase());
    
    // Itera sobre cada card
    cards.forEach(card => {
        // Seleciona todos os elementos com classe 'category' dentro do card
        const catEls = card.querySelectorAll('.category');
        
        // Extrai o texto de cada categoria do card e converte para minúsculas
        const cardCats = Array.from(catEls).map(el => el.textContent.trim().toLowerCase());
        
        // Verifica se há alguma categoria do card que corresponde às selecionadas
        const match = cardCats.some(cc => selecionadasNorm.includes(cc));
        
        // Se houver correspondência, mostra o card; caso contrário, esconde
        card.style.display = match ? '' : 'none';
    });
}

// ==============================
// FUNÇÃO: ATUALIZAR CHIPS
// ==============================
/**
 * Atualiza os chips (tags) exibidos abaixo da barra de pesquisa
 * - Limpa chips antigos
 * - Cria novo chip para cada categoria selecionada
 * - Cada chip tem um "X" para remover a categoria
 * - Aplica filtro nos cards sempre que chips mudam
 */
function atualizarChips() {
    // Limpa o container de chips
    chipsContainer.innerHTML = '';
    
    // Cria um chip para cada categoria selecionada
    categoriasSelecionadas.forEach(categoria => {
        // Cria elemento button para o chip
        const chip = document.createElement('button');
        chip.className = 'chip chip-dinamico';
        
        // Define o HTML do chip com a categoria e um "X" para remover
        chip.innerHTML = `<span>${categoria}</span> <span class="chip-x" aria-hidden="true">&#10005;</span>`;
        
        // Quando o chip é clicado, remove a categoria
        chip.addEventListener('click', () => {
            // Remove a categoria do array
            categoriasSelecionadas = categoriasSelecionadas.filter(c => c !== categoria);
            
            // Atualiza visual do modal
            atualizarCategoriasModal();
            
            // Atualiza chips (recursivo)
            atualizarChips();
        });
        
        // Adiciona o chip ao container
        chipsContainer.appendChild(chip);
    });
    
    // Aplica o filtro nos cards sempre que os chips mudam
    aplicarFiltro();
}

// ==============================
// EVENT LISTENER: CLICAR FORA DO MODAL
// ==============================
// Fecha o modal ao clicar no fundo (overlay) fora do conteúdo
if (categoriasModal) {
    categoriasModal.addEventListener('click', (e) => {
        // Se o clique foi exatamente no modal (não no conteúdo)
        if (e.target === categoriasModal) {
            closeModal(); // Fecha o modal
        }
    });
}

// ==============================
// EVENT LISTENER: TECLA ESCAPE
// ==============================
// Fecha o modal quando o usuário pressiona ESC (acessibilidade)
document.addEventListener('keydown', (e) => {
    // Se pressionou Escape E o modal está aberto
    if (e.key === 'Escape' && categoriasModal && !categoriasModal.hidden) {
        closeModal(); // Fecha o modal
    }
});

// ==============================
// INICIALIZAÇÃO
// ==============================
// Atualiza chips na carga inicial (caso houver categorias pré-selecionadas)
atualizarChips();
