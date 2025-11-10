// Aguarda o carregamento total do DOM
document.addEventListener("DOMContentLoaded", function () {

  //limpa antigo localstorage
  localStorage.clear();

  // ------------------------------
  //CAMPO NOME (espelho e contador)
  // ------------------------------
  const nomeInput = document.getElementById("nome");
  const form = document.getElementById("Formulário");

  // Cria dinamicamente o espelho e o contador
  const nomeEspelho = document.createElement("div");
  nomeEspelho.style.marginTop = "4px";
  nomeEspelho.style.fontSize = "0.9rem";
  nomeEspelho.style.color = "#2d180c";

  const contador = document.createElement("div");
  contador.style.fontSize = "0.8rem";
  contador.style.marginTop = "2px";

  nomeInput.insertAdjacentElement("afterend", nomeEspelho);
  nomeEspelho.insertAdjacentElement("afterend", contador);

  nomeInput.addEventListener("input", function () {
  const texto = nomeInput.value;
  const comprimento = texto.length;
  contador.textContent = `Caracteres: ${comprimento}/50`;

  if (comprimento > 50) {
    nomeInput.style.borderColor = "red";
    contador.style.color = "red";
    nomeInput.classList.add("input-error"); // Adiciona a classe
  } else {
    nomeInput.style.borderColor = "#2d180c";
    contador.style.color = "#2d180c";
    nomeInput.classList.remove("input-error"); // Remove a classe
  }
});

  // ------------------------------
  // API DE ESTADOS E CIDADES
  // ------------------------------

// API para carregar estados e cidades do Brasil
    const selectEstado = document.getElementById("estado");
    const selectCidade = document.getElementById("cidade");

    // URL base da API do IBGE para estados
    const apiEstados = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

    async function carregarEstados() {
      try {
        const resp = await fetch(apiEstados);
        const estados = await resp.json();
        // Ordenar por nome, opcional
        estados.sort((a, b) => a.nome.localeCompare(b.nome));
        for (let est of estados) {
          const opt = document.createElement("option");
          opt.value = est.sigla;    // ou est.id se preferir
          opt.textContent = `${est.nome} (${est.sigla})`;
          selectEstado.appendChild(opt);
        }
      } catch (erro) {
        console.error("Erro ao carregar estados:", erro);
      }
    }

    // Quando mudar o estado
    selectEstado.addEventListener("change", async function () {
      const sigla = this.value;
      // Limpar cidades anteriores
      selectCidade.innerHTML = '<option value="">-- Selecione a cidade --</option>';

      if (!sigla) {
        selectCidade.disabled = true;
        return;
      }

      // Ativar o select (antes de buscar, opcional)
      selectCidade.disabled = false;

      const urlCidades = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`;
      try {
        const resp = await fetch(urlCidades);
        const cidades = await resp.json();
        // Ordenar pelo nome da cidade
        cidades.sort((a, b) => a.nome.localeCompare(b.nome));
        for (let cid of cidades) {
          const opt = document.createElement("option");
          opt.value = cid.id;    // ou cid.nome, conforme o que você precisa guardar
          opt.textContent = cid.nome;
          selectCidade.appendChild(opt);
        }
      } catch (erro) {
        console.error("Erro ao carregar cidades:", erro);
      }
    });

    // Inicialmente carregar os estados
    window.addEventListener("DOMContentLoaded", carregarEstados);

  // ------------------------------
  // EMAIL – VALIDAÇÃO E MENSAGEM DE ERRO
  // ------------------------------
     // Efeio blur no campo de email
  const inputEmail = document.getElementById("email");
const msgEmail = document.getElementById("mensagemEmail");

// Função para validar email e exibir mensagem
function validarEmailDinamico() {
  const email = inputEmail.value.trim();
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email === "") {
    msgEmail.textContent = "O e-mail é obrigatório.";
    msgEmail.style.color = "red";
    msgEmail.style.display = "block";   // mostrar
  } else if (!regexEmail.test(email)) {
    msgEmail.textContent = "Por favor, insira um e-mail válido.";
    msgEmail.style.color = "red";
    msgEmail.style.display = "block";   // mostrar
  } else {
    msgEmail.textContent = "E-mail válido.";
    msgEmail.style.color = "green";
    msgEmail.style.display = "block";   // mostrar como mensagem de sucesso
    
  }
}

// Adicionar listener no evento input
inputEmail.addEventListener("input", validarEmailDinamico);

// Você pode manter o listener blur também (para reforçar quando sair do campo)
inputEmail.addEventListener("blur", validarEmailDinamico);


  // ------------------------------
  //  SENHA COM INDICADOR DE FORÇA
  // ------------------------------
  const senhaInput = document.getElementById("senha");
  const senhaForca = document.getElementById("senhaForca");

  senhaInput.addEventListener("input", function () {
    const senha = senhaInput.value;
    let forca = 0;

    if (senha.length >= 6) forca++; // mínimo 6 caracteres
    if (/[A-Z]/.test(senha)) forca++; // letra maiúscula
    if (/[0-9]/.test(senha)) forca++; // número
    if (/[^A-Za-z0-9]/.test(senha)) forca++; // caractere especial

    if (forca <= 1) {
      senhaForca.textContent = "Senha fraca";
      senhaForca.className = "password-strength strength-weak";
    } else if (forca === 2 || forca === 3) {
      senhaForca.textContent = "Senha média";
      senhaForca.className = "password-strength strength-medium";
    } else {
      senhaForca.textContent = "Senha forte";
      senhaForca.className = "password-strength strength-strong";
    }
  });


  /* Refazer a validação completa e envio*/
  // ------------------------------
  //  VALIDAÇÃO COMPLETA E ENVIO
  // ------------------------------
  
const formulario = document.getElementById("Formulario");

  formulario.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o envio padrão


    const Snome = document.getElementById("nome").value;
    const Semail = document.getElementById("email").value;
    const Srg = document.getElementById("rg").value;
    const Sestado = document.getElementById("estado").value;
    const Scidade = document.getElementById("cidade").value;
    const Stelefone = document.getElementById("telefone").value;
    const Ssenha = document.getElementById("senha").value;
    const Stermo = document.getElementById("termo");

    if  ( Snome === "" ||
          Srg === "" ||
          Semail === "" ||
          Sestado === "" ||
          Scidade === "" ||
          Stelefone === "" ||
          Ssenha.value === ""
                ) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return; // Sai da função se algum campo estiver vazio
    }

    
  // --------------------
  // SALVA DADOS NO LOCALSTORAGE
  // --------------------
   const token = "abc123"; // Exemplo de token
  localStorage.setItem("Token", token);
  localStorage.setItem("Usuario", Snome);
  localStorage.setItem("RG", Srg)
  localStorage.setItem("Email", Semail);
  localStorage.setItem("Estado", Sestado);
  localStorage.setItem("Cidade", Scidade);
  localStorage.setItem("Telefone", Stelefone);

    
    
    // Se tudo estiver ok, pode enviar o formulário
    //formulario.submit(); isso ta comentado porque senao nao redireciona mas se der bosta tirem
    
    window.location.href = "../pages/Usuário.html";
    




  });

  
  


});

  

