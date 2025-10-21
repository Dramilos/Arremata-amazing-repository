// ===== Habilitar edição de campos =====
const editables = document.querySelectorAll('.editable');
let editing = false;

// ===== Sistema de estrelas =====
const rating = document.getElementById('rating');
rating.addEventListener('click', (e) => {
  const rect = rating.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const starWidth = rect.width / 5;
  const selected = Math.ceil(clickX / starWidth);
  rating.textContent = "★★★★★".slice(0, selected) + "☆☆☆☆☆".slice(selected, 5);
});

// ===== Upload e troca de imagem de perfil =====
const profileImg = document.getElementById('profileImg');
const uploadImg = document.getElementById('uploadImg');
const editBtn = document.getElementById('editBtn');

// Ao clicar no botão de editar, abre o seletor de imagem
editBtn.addEventListener('click', () => {
  uploadImg.click();
});

// Quando o usuário escolhe uma imagem
uploadImg.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImg.src = e.target.result; // atualiza a imagem exibida
    };
    reader.readAsDataURL(file);
  }
});
