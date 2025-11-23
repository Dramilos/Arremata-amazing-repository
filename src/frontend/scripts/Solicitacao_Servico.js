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
        window.location.href = "../pages/login.html";
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

// ===================================
// PRÉ-VISUALIZAÇÃO DE FOTO
// ===================================

const uploadFotoInput = document.getElementById('uploadFotoInput');
const fotoPreview = document.getElementById('fotoPreview');
const fotoBox = document.getElementById('foto-box');

// Função de reset para a caixa de FOTO
function resetFotoPreview() {
    fotoPreview.src = '';
    fotoPreview.style.display = 'none';
    fotoBox.classList.remove('has-media');
}

// Quando o usuário escolhe uma foto
uploadFotoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            // 1. Atualiza a fonte da imagem
            fotoPreview.src = e.target.result;
            // 2. Torna a imagem visível
            fotoPreview.style.display = 'block';
            // 3. Adiciona uma classe ao container para ocultar o 'ADD MEDIA'
            fotoBox.classList.add('has-media');
        };

        // Lê o arquivo como Data URL para pré-visualização no navegador
        reader.readAsDataURL(file);
    } else {
        // Caso o usuário cancele a seleção
        resetFotoPreview();
    }
});

// ===================================
// PRÉ-VISUALIZAÇÃO DE VÍDEO/FOTO (ITEM ABAIXO)
// ===================================

const uploadVideoFotoInput = document.getElementById('uploadVideoFotoInput');
const videoPreview = document.getElementById('videoPreview');
const imagemPreview = document.getElementById('imagemPreview');
const videoBox = document.getElementById('video-box');

// Função para ocultar todas as pré-visualizações na caixa de vídeo/foto
function resetMediaPreview() {
    videoPreview.style.display = 'none';
    imagemPreview.style.display = 'none';
    videoBox.classList.remove('has-media');
    videoPreview.removeAttribute('src');
    imagemPreview.removeAttribute('src');
}

uploadVideoFotoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    // 1. Limpa o estado anterior
    resetMediaPreview();

    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const dataUrl = e.target.result;

            if (file.type.startsWith('video/')) {
                // Se for VÍDEO:
                videoPreview.src = dataUrl;
                videoPreview.style.display = 'block';
            } else if (file.type.startsWith('image/')) {
                // Se for IMAGEM:
                imagemPreview.src = dataUrl;
                imagemPreview.style.display = 'block';
            }

            // Oculta o ADD MEDIA em ambos os casos
            videoBox.classList.add('has-media');
        };

        reader.readAsDataURL(file);
    }
});

// ===================================
// FUNÇÃO GLOBAL DE RESET
// ===================================

function resetFormulario(formElement) {
    // 1. Resetar campos (input, textarea)
    formElement.reset();

    // 2. Resetar tags dinâmicas
    tags = [];
    renderTags();

    // 3. Resetar pré-visualização de FOTO
    resetFotoPreview();

    // 4. Resetar pré-visualização de VÍDEO/FOTO
    resetMediaPreview();
}

// ==============================
// ENVIO DO FORMULÁRIO (E RESET)
// ==============================

document.querySelector('.formulario').addEventListener('submit', (e) => {
    e.preventDefault();

    // Lógica que deve ocorrer após o clique (ex: enviar para o servidor)
    alert(`Serviço publicado com as tags: ${tags.join(', ')}`);

    // Reseta todas as informações após o "envio" (alerta)
    resetFormulario(document.querySelector('.formulario'));
});