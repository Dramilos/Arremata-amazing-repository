
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


// ------------------------------
// PEGA INFORMAÇÕES DO LOCAL STORAGE
// ------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const nome = localStorage.getItem("Usuario");
  const rg = localStorage.getItem("RG");
  const telefone = localStorage.getItem("Telefone");
  const token = localStorage.getItem("Token");
// ------------------------------
// VERIFICA SE ESTA LOGADO
if (!token) {
    alert("Você precisa estar logado para acessar esta página.");
    window.location.href = "../pages/login.html";
    return;
  }

// ------------------------------
// EXIBE INFORMAÇÕES NA PÁGINA
  document.getElementById("Nome").textContent = nome || "";
  document.getElementById("RG").textContent = rg || "";
  document.getElementById("Telefone").textContent = telefone || "";
});

// ------------------------------
// LOGOUT E LIMPA LOCALSTORAGE
// ------------------------------
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  localStorage.clear(); // Limpa todos os dados do localStorage
  window.location.href = "../pages/Cadastro.html"; // Redireciona para a página de login
});