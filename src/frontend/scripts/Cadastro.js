// Aguarda o carregamento total do DOM
document.addEventListener("DOMContentLoaded", function () {
  // ------------------------------
  // ETAPA 1 – CAMPO NOME (espelho e contador)
  // ------------------------------
  const nomeInput = document.getElementById("nome");
  const form = document.getElementById("cadastroForm");

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
  nomeEspelho.textContent = `Você digitou: ${texto}`;
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

    // Evento de perda de foco (blur)
    inputEmail.addEventListener("blur", function() {
        const email = inputEmail.value.trim(); // Remove espaços em branco
        // Expressão regular simples para validar email
        const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") { // Campo vazio
            msgEmail.textContent = "O e-mail é obrigatório.";
            msgEmail.style.color = "red";
        } else if (!regexEmail.test(email)) { // E-mail inválido
            msgEmail.textContent = "Por favor, insira um e-mail válido.";
            msgEmail.style.color = "red";
        } else { // E-mail válido
            msgEmail.textContent = "E-mail válido.";
            msgEmail.style.color = "green";
        }
    });

  // ------------------------------
  // ETAPA 5 – SENHA COM INDICADOR DE FORÇA
  // ------------------------------
  const senhaInput = document.getElementById("senha");
  const senhaForca = document.getElementById("senhaForca");

  senhaInput.addEventListener("input", function () {
    const senha = senhaInput.value;
    let forca = 0;

    if (senha.length >= 6) forca++;
    if (/[A-Z]/.test(senha)) forca++;
    if (/[0-9]/.test(senha)) forca++;
    if (/[^A-Za-z0-9]/.test(senha)) forca++;

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

  // ------------------------------
  // ETAPA 4 e 5 – VALIDAÇÃO COMPLETA E ENVIO
  // ------------------------------
  const cursoSelect = document.getElementById("curso");
  const termosCheck = document.getElementById("termos");
  const btnEnviar = document.getElementById("btnEnviar");
  const resumoErros = document.getElementById("resumoErros");
  const sucessoEnvio = document.getElementById("sucessoEnvio");

  // Função de validação geral
  function validarFormulario() {
  const erros = [];
  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const curso = cursoSelect.value;
  const termos = termosCheck.checked;

  if (nome.length < 3) erros.push("Nome deve ter pelo menos 3 caracteres.");
  if (nome.length > 50) erros.push("Nome deve ter no máximo 50 caracteres."); // <-- Adicionado
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) erros.push("E-mail inválido.");
  if (!curso) erros.push("Selecione um curso.");
  if (!termos) erros.push("Você deve aceitar os termos.");

  if (erros.length > 0) {
    resumoErros.innerHTML = erros.map(e => `<div>• ${e}</div>`).join("");
    resumoErros.style.display = "block";
    btnEnviar.disabled = true;
    return false;
  } else {
    resumoErros.style.display = "none";
    btnEnviar.disabled = false;
    return true;
  }
}

  // Observa mudanças nos campos
  [nomeInput, emailInput, cursoSelect, termosCheck].forEach(el => {
    el.addEventListener("input", validarFormulario);
    el.addEventListener("change", validarFormulario);
  });

  // Intercepta o envio
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (validarFormulario()) {
      sucessoEnvio.style.display = "block";
      resumoErros.style.display = "none";
      form.reset();
      cidadeSelect.disabled = true;
      btnEnviar.disabled = true;
      senhaForca.textContent = "";
      nomeEspelho.textContent = "";
      contador.textContent = "";
      setTimeout(() => (sucessoEnvio.style.display = "none"), 4000);
    }
  });
});