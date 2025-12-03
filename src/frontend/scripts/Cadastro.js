// ==============================
// INICIALIZAÇÃO: AGUARDA CARREGAMENTO DO DOM
// ==============================
/**
 * Executa apenas após o carregamento completo do DOM
 * - Garante que todos os elementos HTML estejam disponíveis
 * - Inicializa todos os sistemas de validação e formatação
 */
document.addEventListener("DOMContentLoaded", function () {

  // =============================
  // LIMPAR LOCALSTORAGE ANTERIOR
  // =============================
  /**
   * Remove dados antigos do localStorage
   * - Útil para garantir que não há dados de cadastros anteriores
   * - Começa com "tela limpa" para novo cadastro
   */
  localStorage.clear();

  // =============================
  // CAMPO NOME: ESPELHO E CONTADOR
  // =============================
  /**
   * Sistema de visualização em tempo real do nome
   * - Exibe quantos caracteres foram digitados
   * - Máximo: 50 caracteres
   * - Se exceder: coloca borda vermelha e alerta
   */

  // Seleciona o input de nome
  const nomeInput = document.getElementById("nome");
  // Seleciona o formulário (será usado depois para submissão)
  const form = document.getElementById("Formulário");

  // Cria elemento para exibir o nome em tempo real (espelho)
  const nomeEspelho = document.createElement("div");
  nomeEspelho.style.marginTop = "4px";
  nomeEspelho.style.fontSize = "0.9rem";
  nomeEspelho.style.color = "#2d180c";

  // Cria elemento para exibir o contador de caracteres
  const contador = document.createElement("div");
  contador.style.fontSize = "0.8rem";
  contador.style.marginTop = "2px";

  // Insere os elementos criados após o input de nome
  nomeInput.insertAdjacentElement("afterend", nomeEspelho);
  nomeEspelho.insertAdjacentElement("afterend", contador);

  // =============================
  // EVENT LISTENER: DIGITAÇÃO NO NOME
  // =============================
  /**
   * Atualiza o contador conforme o usuário digita
   * - Conta caracteres digitados
   * - Alerta se ultrapassar 50 caracteres
   * - Muda cor da borda para vermelho se inválido
   */
  nomeInput.addEventListener("input", function () {
    // Recupera o texto digitado
    const texto = nomeInput.value;
    // Conta quantos caracteres foram digitados
    const comprimento = texto.length;
    // Atualiza o contador na tela
    contador.textContent = `Caracteres: ${comprimento}/50`;

    // Verifica se ultrapassou 50 caracteres
    if (comprimento > 50) {
      // Muda borda para vermelho
      nomeInput.style.borderColor = "red";
      // Muda texto do contador para vermelho
      contador.style.color = "red";
      // Adiciona classe CSS para estilização adicional
      nomeInput.classList.add("input-error");
    } else {
      // Se estiver dentro do limite, volta ao normal
      nomeInput.style.borderColor = "#2d180c";
      contador.style.color = "#2d180c";
      // Remove classe de erro
      nomeInput.classList.remove("input-error");
    }
  });

  // =============================
  // API DE ESTADOS E CIDADES (IBGE)
  // =============================
  /**
   * Sistema de carregamento dinâmico de estados e cidades
   * - Usa API pública do IBGE (Instituto Brasileiro de Geografia e Estatística)
   * - Quando usuário seleciona estado, carrega as cidades daquele estado
   * - Lista está ordenada alfabeticamente para melhor usabilidade
   */

  // Seleciona o dropdown de estados
  const selectEstado = document.getElementById("estado");
  // Seleciona o dropdown de cidades
  const selectCidade = document.getElementById("cidade");

  // URL da API do IBGE para buscar todos os estados
  const apiEstados = "https://servicodados.ibge.gov.br/api/v1/localidades/estados";

  // =============================
  // FUNÇÃO ASSÍNCRONA: CARREGAR ESTADOS
  // =============================
  /**
   * Busca todos os estados brasileiros na API do IBGE
   * - Faz requisição HTTP para a API
   * - Ordena estados alfabeticamente por nome
   * - Cria um option para cada estado
   * - Se houver erro na conexão, exibe no console
   */
  async function carregarEstados() {
    try {
      // Faz requisição GET para a API de estados
      const resp = await fetch(apiEstados);
      // Converte a resposta de JSON para objeto JavaScript
      const estados = await resp.json();
      
      // Ordena os estados por nome (alfabeticamente)
      estados.sort((a, b) => a.nome.localeCompare(b.nome));
      
      // Itera sobre cada estado
      for (let est of estados) {
        // Cria um novo elemento option
        const opt = document.createElement("option");
        // Define o valor como a sigla do estado (ex: SP, RJ, MG)
        opt.value = est.sigla;
        // Define o texto exibido (nome completo + sigla)
        opt.textContent = `${est.nome} (${est.sigla})`;
        // Adiciona a opção ao dropdown de estados
        selectEstado.appendChild(opt);
      }
    } catch (erro) {
      // Se houver erro, exibe no console para debug
      console.error("Erro ao carregar estados:", erro);
    }
  }

  // =============================
  // EVENT LISTENER: MUDANÇA DE ESTADO
  // =============================
  /**
   * Quando o usuário seleciona um estado
   * - Limpa as cidades anteriores
   * - Desabilita o campo de cidades até uma nova seleção
   * - Busca cidades do estado selecionado
   * - Exibe as cidades em ordem alfabética
   */
  selectEstado.addEventListener("change", async function () {
    // Recupera a sigla do estado selecionado
    const sigla = this.value;
    
    // Limpa as opções de cidades anteriores
    selectCidade.innerHTML = '<option value="">-- Selecione a cidade --</option>';

    // Se nenhum estado foi selecionado
    if (!sigla) {
      // Desabilita o dropdown de cidades
      selectCidade.disabled = true;
      return;
    }

    // Ativa o dropdown de cidades (para aguardar carga)
    selectCidade.disabled = false;

    // Constrói a URL da API para buscar cidades do estado
    const urlCidades = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${sigla}/municipios`;
    
    try {
      // Faz requisição GET para a API de cidades
      const resp = await fetch(urlCidades);
      // Converte resposta para objeto JavaScript
      const cidades = await resp.json();
      
      // Ordena as cidades por nome (alfabeticamente)
      cidades.sort((a, b) => a.nome.localeCompare(b.nome));
      
      // Itera sobre cada cidade
      for (let cid of cidades) {
        // Cria um novo elemento option
        const opt = document.createElement("option");
        // Define o valor como ID da cidade
        opt.value = cid.id;
        // Define o texto exibido (nome da cidade)
        opt.textContent = cid.nome;
        // Adiciona a opção ao dropdown de cidades
        selectCidade.appendChild(opt);
      }
    } catch (erro) {
      // Se houver erro, exibe no console para debug
      console.error("Erro ao carregar cidades:", erro);
    }
  });

  // Carrega os estados quando a página termina de carregar
  window.addEventListener("DOMContentLoaded", carregarEstados);

  // =============================
  // VALIDAÇÃO DE EMAIL EM TEMPO REAL
  // =============================
  /**
   * Valida o email enquanto o usuário digita
   * - Verifica se está vazio (obrigatório)
   * - Valida formato de email com regex
   * - Exibe mensagem de erro ou sucesso
   */

  // Seleciona o input de email
  const inputEmail = document.getElementById("email");
  // Seleciona o elemento para exibir mensagem de erro/sucesso
  const msgEmail = document.getElementById("mensagemEmail");

  // =============================
  // FUNÇÃO: VALIDAR EMAIL
  // =============================
  /**
   * Valida o email e exibe mensagem apropriada
   * - Email vazio: mensagem de obrigatório (vermelho)
   * - Email inválido: mensagem de formato (vermelho)
   * - Email válido: mensagem de sucesso (verde)
   */
  function validarEmailDinamico() {
    // Recupera o email e remove espaços em branco
    const email = inputEmail.value.trim();
    // Regex para validar formato de email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Se o campo estiver vazio
    if (email === "") {
      msgEmail.textContent = "O e-mail é obrigatório.";
      msgEmail.style.color = "red";
      msgEmail.style.display = "block";
    }
    // Se o email não corresponder ao padrão
    else if (!regexEmail.test(email)) {
      msgEmail.textContent = "Por favor, insira um e-mail válido.";
      msgEmail.style.color = "red";
      msgEmail.style.display = "block";
    }
    // Se o email for válido
    else {
      msgEmail.textContent = "E-mail válido.";
      msgEmail.style.color = "green";
      msgEmail.style.display = "block";
    }
  }

  // Valida email a cada digitação (evento input)
  inputEmail.addEventListener("input", validarEmailDinamico);
  // Valida email quando o usuário sai do campo (evento blur)
  inputEmail.addEventListener("blur", validarEmailDinamico);

  // =============================
  // INDICADOR DE FORÇA DA SENHA
  // =============================
  /**
   * Avalia a força da senha em tempo real
   * - Fraca: menos de 6 caracteres ou apenas um tipo
   * - Média: 2-3 critérios atendidos
   * - Forte: todos os 4 critérios atendidos
   * 
   * Critérios:
   * 1. Mínimo 6 caracteres
   * 2. Pelo menos uma letra maiúscula
   * 3. Pelo menos um número
   * 4. Pelo menos um caractere especial
   */

  // Seleciona o input de senha
  const senhaInput = document.getElementById("senha");
  // Seleciona o elemento que exibe a força da senha
  const senhaForca = document.getElementById("senhaForca");

  // =============================
  // EVENT LISTENER: DIGITAÇÃO DA SENHA
  // =============================
  /**
   * Atualiza o indicador de força conforme o usuário digita
   * - Calcula pontos baseado em critérios
   * - Exibe texto e classe CSS apropriados
   */
  senhaInput.addEventListener("input", function () {
    // Recupera a senha digitada
    const senha = senhaInput.value;
    // Inicia contador de critérios atendidos
    let forca = 0;

    // Critério 1: Mínimo 6 caracteres
    if (senha.length >= 6) forca++;
    // Critério 2: Contém letra maiúscula
    if (/[A-Z]/.test(senha)) forca++;
    // Critério 3: Contém número
    if (/[0-9]/.test(senha)) forca++;
    // Critério 4: Contém caractere especial
    if (/[^A-Za-z0-9]/.test(senha)) forca++;

    // Determina força baseado no número de critérios atendidos
    if (forca <= 1) {
      // Fraca (0-1 critérios)
      senhaForca.textContent = "Senha fraca";
      senhaForca.className = "password-strength strength-weak";
    } else if (forca === 2 || forca === 3) {
      // Média (2-3 critérios)
      senhaForca.textContent = "Senha média";
      senhaForca.className = "password-strength strength-medium";
    } else {
      // Forte (4 critérios)
      senhaForca.textContent = "Senha forte";
      senhaForca.className = "password-strength strength-strong";
    }
  });

  // =============================
  // VALIDAÇÃO COMPLETA E ENVIO DO FORMULÁRIO
  // =============================
  /**
   * Quando o usuário clica em "Cadastrar"
   * - Previne envio padrão do formulário
   * - Recupera valores de todos os campos
   * - Valida se estão preenchidos
   * - Se válido: salva dados no localStorage e redireciona
   * - Se inválido: exibe alerta pedindo preenchimento
   */

  // Seleciona o formulário
  const formulario = document.getElementById("Formulario");

  // =============================
  // EVENT LISTENER: SUBMIT DO FORMULÁRIO
  // =============================
  formulario.addEventListener("submit", function (event) {
    // Previne o comportamento padrão (recarregar página)
    event.preventDefault();

    // =============================
    // COLETA DOS DADOS
    // =============================
    // Recupera o nome do campo
    const Snome = document.getElementById("nome").value;
    // Recupera o email do campo
    const Semail = document.getElementById("email").value;
    // Recupera o RG do campo (já formatado)
    const Srg = document.getElementById("rg").value;
    // Recupera o estado selecionado
    const Sestado = document.getElementById("estado").value;
    // Recupera a cidade selecionada
    const Scidade = document.getElementById("cidade").value;
    // Recupera o telefone do campo (já formatado)
    const Stelefone = document.getElementById("telefone").value;
    // Recupera a senha do campo
    const Ssenha = document.getElementById("senha").value;
    // Recupera o checkbox de termos
    const Stermo = document.getElementById("termo");

    // =============================
    // VALIDAÇÃO DE CAMPOS
    // =============================
    /**
     * Verifica se algum campo obrigatório está vazio
     * - Nome, RG, Email, Estado, Cidade, Telefone, Senha são obrigatórios
     * - Se algum faltar, exibe alerta e não permite envio
     */
    if (Snome === "" ||
        Srg === "" ||
        Semail === "" ||
        Sestado === "" ||
        Scidade === "" ||
        Stelefone === "" ||
        Ssenha === "") {
      // Se algum campo estiver vazio, exibe alerta
      alert("Por favor, preencha todos os campos obrigatórios.");
      // Sai da função sem prosseguir
      return;
    }

    // =============================
    // ARMAZENAMENTO NO LOCALSTORAGE
    // =============================
    /**
     * Se todos os campos forem válidos, salva no localStorage
     * - Token: identificador único da sessão
     * - Usuario: nome do usuário cadastrado
     * - Dados pessoais e de contato
     * Esses dados serão usados em outras páginas do sistema
     */

    // Cria um token de exemplo (em produção, viria do servidor)
    const token = "abc123";
    
    // Salva o token no localStorage
    localStorage.setItem("Token", token);
    // Salva o nome do usuário
    localStorage.setItem("Usuario", Snome);
    // Salva o RG formatado
    localStorage.setItem("RG", Srg);
    // Salva o email
    localStorage.setItem("Email", Semail);
    // Salva o estado selecionado
    localStorage.setItem("Estado", Sestado);
    // Salva a cidade selecionada
    localStorage.setItem("Cidade", Scidade);
    // Salva o telefone formatado
    localStorage.setItem("Telefone", Stelefone);

    // =============================
    // REDIRECIONAMENTO
    // =============================
    /**
     * Se tudo foi salvo com sucesso, redireciona o usuário
     * para a página de perfil de usuário
     */
    window.location.href = "../pages/Usuário.html";
  });

  // =============================
  // FORMATAÇÃO DE RG EM TEMPO REAL
  // =============================
  /**
   * Formata o RG conforme o usuário digita
   * - Remove caracteres que não são números
   * - Aplica máscara: xx.xxx.xxx-x
   * - Impede que o usuário digite caracteres inválidos
   * 
   * Exemplo: 123456789 → 12.345.678-9
   */

  // Seleciona o input de RG
  const rgInput = document.getElementById("rg");

  // =============================
  // EVENT LISTENER: DIGITAÇÃO DO RG
  // =============================
  rgInput.addEventListener("input", function (e) {
    // Remove tudo que não é número
    let valor = e.target.value.replace(/\D/g, "");

    // Aplica formatação progressiva conforme o usuário digita
    if (valor.length > 0) {
      // Se tem 1-2 dígitos: "12"
      if (valor.length <= 2) {
        valor = valor;
      }
      // Se tem 3-5 dígitos: "12.345"
      else if (valor.length <= 5) {
        valor = valor.slice(0, 2) + "." + valor.slice(2);
      }
      // Se tem 6-8 dígitos: "12.345.678"
      else if (valor.length <= 8) {
        valor = valor.slice(0, 2) + "." + valor.slice(2, 5) + "." + valor.slice(5);
      }
      // Se tem 9+ dígitos: "12.345.678-9"
      else {
        valor = valor.slice(0, 2) + "." + valor.slice(2, 5) + "." + valor.slice(5, 8) + "-" + valor.slice(8, 9);
      }
    }

    // Atualiza o valor do campo com a formatação
    e.target.value = valor;
  });

  // =============================
  // FORMATAÇÃO DE TELEFONE EM TEMPO REAL
  // =============================
  /**
   * Formata o telefone conforme o usuário digita
   * - Remove caracteres que não são números
   * - Aplica máscara: (xx) xxxxx-xxxx
   * - Impede que o usuário digite caracteres inválidos
   * 
   * Exemplo: 11987654321 → (11) 98765-4321
   */

  // Seleciona o input de telefone
  const telefoneInput = document.getElementById("telefone");

  // =============================
  // EVENT LISTENER: DIGITAÇÃO DO TELEFONE
  // =============================
  telefoneInput.addEventListener("input", function (e) {
    // Remove tudo que não é número
    let valor = e.target.value.replace(/\D/g, "");

    // Aplica formatação progressiva conforme o usuário digita
    if (valor.length > 0) {
      // Se tem 1-2 dígitos: "(11"
      if (valor.length <= 2) {
        valor = "(" + valor;
      }
      // Se tem 3-7 dígitos: "(11) 98765"
      else if (valor.length <= 7) {
        valor = "(" + valor.slice(0, 2) + ") " + valor.slice(2);
      }
      // Se tem 8+ dígitos: "(11) 98765-4321"
      else {
        valor = "(" + valor.slice(0, 2) + ") " + valor.slice(2, 7) + "-" + valor.slice(7, 11);
      }
    }

    // Atualiza o valor do campo com a formatação
    e.target.value = valor;
  });

});



