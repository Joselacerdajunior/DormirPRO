// Valores padrão de fábrica
const JSONConfigDefault = {
  users: [
    {
      user: 'admin', 
      email: 'admin@dormirpro.com', 
      password: 'admin',

      other: {
        configuration: [],
        modules: [
          {local: 'Quarto João', status: true, model: 'Berço com balanço'},
          {local: 'Quarto Maria', status: false, model: 'Berço com balanço e câmera térmica'},
        ],
        reports: [],
      }
    },
  ],
  connectedUserEmail: null,
};

function loadConfig() {
  const savedConfig = localStorage.getItem('JSONConfig');
  if (savedConfig) {
    try {
      return JSON.parse(savedConfig);
    } catch (e) {
      console.error("Erro ao analisar o JSON salvo:", e);
      return JSONConfigDefault;
    }
  } else {
    return JSONConfigDefault;
  }
}

var JSONConfig = loadConfig();

function saveConfig() {
  localStorage.setItem('JSONConfig', JSON.stringify(JSONConfig));
}

if (localStorage.getItem('JSONConfig') === null) {
  saveConfig();
}

function atualizarJSONNavegador() {
  localStorage.setItem('JSONConfig', JSON.stringify(JSONConfig));
}






function editarUsuario(email, newUserData) {
  const userIndex = JSONConfig.users.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    JSONConfig.users[userIndex] = { ...JSONConfig.users[userIndex], ...newUserData };
    console.log(JSONConfig);
  } else {
    console.log("Usuário não encontrado");
  }
  //editarUsuario('jane.doe@example.com', { user: 'jane_doe', password: 'new_password' });
  atualizarJSONNavegador();
}

function adicionarUsuario() {
  let user = document.getElementById('login').value;
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;
  let password2 = document.getElementById('password2').value;

  if (password !== password2) {
    alert("As senhas devem ser iguais!");
    JSONConfig.connectedUserEmail = null;
    return;
  }

  if (password === '') {
    alert("As senhas devem ser preenchidas!");
    JSONConfig.connectedUserEmail = null;
    return;
  }

  JSONConfig.users.push(
    {user: `${user}`, email: `${email}`, password: `${password}`},
  );

  JSONConfig.connectedUserEmail = email;

  atualizarJSONNavegador();

  return true;
}

function logarUsuario() {
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;

  const user = JSONConfig.users.find(user => user.email === email && user.password === password);

  if (!user) {
    alert("Email ou senha incorretos!");
    JSONConfig.connectedUserEmail = null;
    return false;
  }

  JSONConfig.connectedUserEmail = email;

  atualizarJSONNavegador();
  
  return true;
}

function disconnectUser() {
    JSONConfig.connectedUserEmail = null;
    
    atualizarJSONNavegador();

    location.reload();
}

function iAmLogged() {
  if (JSONConfig.connectedUserEmail !== null) {
    return JSONConfig.connectedUserEmail;
  }
  return false;
}

function getLoggedData(email) {
  const user = JSONConfig.users.find(user => user.email === email);
  if (user) {
    return user;
  } else {
    return null; // Retorna null se o usuário não for encontrado
  }
}

function especificValue(item) {
  let data = getLoggedData(iAmLogged());

  if (data === null) { return; }

  const keys = item.split('.'); // Divide o caminho do item em partes
  return keys.reduce((acc, key) => acc && acc[key], data);
}

function updateUser(email, updatedData) {
  const userIndex = JSONConfig.users.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    const existingUser = JSONConfig.users[userIndex];
    JSONConfig.users[userIndex] = { 
      ...existingUser, 
      ...updatedData,
      other: {
        ...existingUser.other,
        ...updatedData.other
      }
    };
    saveConfig(); // Salvar as atualizações no localStorage
    console.log("Usuário atualizado:", JSONConfig.users[userIndex]);
  } else {
    console.log("Usuário não encontrado");
  }
}


function updateProfile() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let oldPassword = document.getElementById('old-password').value;
  let newPassword = document.getElementById('new-password').value;
  let newPassword2 = document.getElementById('new-password2').value;

  if (newPassword !== newPassword2) {
    alert("Preencha as senhas corretamente!");
    return;
  }

  updateUser(iAmLogged(), { user: `${name}`, email: `${email}` });

  if (newPassword !== '') {
    updateUser(iAmLogged(), { password: `${newPassword}` });
  }

  loadPage(lastPage);
}

// Função para editar o módulo
function editModule(index) {
  let module = modules[index];
  console.log('Editando módulo:', module);
  // Adicione aqui o código para editar o módulo
}

// Função para remover o módulo
function removeModule(index) {  
  let modules = especificValue('other.modules');
  modules.splice(index, 1);
  console.log('Módulo removido:', index);
  // Atualize a exibição da tabela após a remoção
  saveConfig();
  renderModules();
}

// Função para renderizar os módulos novamente
function renderModules() {
  let container = document.getElementById('td-container');
  let modules = especificValue('other.modules');
  container.innerHTML = '';
  modules.forEach((element, index) => {
      container.innerHTML += `
      <tr>
          <td>${element['local']}</td>
          <td class="fixed-width">${(element['status'] === true ? '✔' : '❌')}</td>
          <td>${element['model']}</td>
          <td class="fixed-width"><img src="../DormirPRO/assets/editar.png" onerror="this.onerror=null;this.src='../assets/editar.png'" alt="Editar" onclick="editModule(${index})"></td>
          <td class="fixed-width"><img src="../DormirPRO/assets/lixo.png" onerror="this.onerror=null;this.src='../assets/lixo.png'" alt="Excluir" onclick="removeModule(${index})"></td>
      </tr>
      `;
  });
}






function redirecionarRegistro() {
  if (adicionarUsuario() === true) {
    loadPage('home', isComponent=false, header='header', footer='footer');
  }  
}

function redirecionarLogin() {
  if (logarUsuario() === true) {
    loadPage('home', isComponent=false, header='header', footer='footer');
  }  
}