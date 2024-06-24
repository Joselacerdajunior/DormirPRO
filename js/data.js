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
          {local: 'Quarto João', status: true, model: 'Gadgets Smart Cots', uuid: 'A216RT4'},
          {local: 'Quarto Maria', status: false, model: 'Baby Band', uuid: 'B54CQ9'},
        ],
        reports: [],
      }
    },
  ],
  connectedUserEmail: null,
};

var editModuleStatus = false;
var editModuleIndex = null;

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
    {
      user: `${user}`, 
      email: `${email}`, 
      password: `${password}`, 
      other: {
        configuration: [],
        modules: [],
        reports: [],
      }},
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
  if (keys.length === 1) {
    return data[item];
  }
  return keys.reduce((acc, key) => acc && acc[key], data);
}

/*function updateUser(email, updatedData) {
  /*const userIndex = JSONConfig.users.findIndex(user => user.email === email);
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
  }*/

  /*const userIndex = JSONConfig.users.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    const existingUser = JSONConfig.users[userIndex];
    
    // Combine existing modules with new modules
    const updatedModules = updatedData.other && updatedData.other.modules 
      ? [...existingUser.other.modules, ...updatedData.other.modules] 
      : existingUser.other.modules;

    // Update the user data, ensuring modules are properly combined
    JSONConfig.users[userIndex] = { 
      ...existingUser, 
      ...updatedData,
      other: {
        ...existingUser.other,
        ...updatedData.other,
        modules: updatedModules // Use combined modules
      }
    };

    saveConfig(); // Save the updated configuration to localStorage
    console.log("Usuário atualizado:", JSONConfig.users[userIndex]);
  } else {
    console.log("Usuário não encontrado");
  }
}*/

function updateUser(email, updatedData, moduleIndex = null) {
  const userIndex = JSONConfig.users.findIndex(user => user.email === email);
  if (userIndex !== -1) {
    const existingUser = JSONConfig.users[userIndex];
    
    if (moduleIndex !== null && moduleIndex !== undefined) {
      // Atualizar um módulo existente
      const updatedModules = existingUser.other.modules.map((module, index) => {
        if (index === moduleIndex) {
          // Atualize este módulo específico
          return {
            ...module,
            ...updatedData.other.modules[0]
          };
        }
        return module;
      });

      // Atualize os dados do usuário
      JSONConfig.users[userIndex] = { 
        ...existingUser, 
        other: {
          ...existingUser.other,
          ...updatedData.other,
          modules: updatedModules // Use os módulos atualizados
        }
      };
    } else {
      // Adicionar um novo módulo
      const updatedModules = updatedData.other && updatedData.other.modules 
        ? [...existingUser.other.modules, ...updatedData.other.modules] 
        : existingUser.other.modules;

      // Atualize os dados do usuário, garantindo que os módulos sejam combinados corretamente
      JSONConfig.users[userIndex] = { 
        ...existingUser, 
        ...updatedData,
        other: {
          ...existingUser.other,
          ...updatedData.other,
          modules: updatedModules // Use os módulos combinados
        }
      };
    }

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
  let module = getLoggedData(iAmLogged()).other.modules[index];
  console.log('Editando módulo:', module);

  switchModule(true);
  document.getElementById('local').value = module['local'] == undefined ? '' : module['local'];
  document.getElementById('uuid').value = module['uuid'] == undefined ? '' : module['uuid'];
  
  
  let ativo = document.querySelectorAll('#ativo');
  ativo.forEach(element => {
    element.querySelectorAll('option').forEach(option => {
      if (option.value == (module['status'] ? 'Sim' : 'Não')) {
        option.selected = true;
      }
    });
  });

  let modelo = document.querySelectorAll('#modelo');
  modelo.forEach(element => {
    element.querySelectorAll('option').forEach(option => {
      if (option.value == module['model']) {
        option.selected = true;
      }
    });
  });

  editModuleStatus = true;
  editModuleIndex = index;
}

function updateModule() {
  let module = getLoggedData(iAmLogged()).other.modules[editModuleIndex] || {};
  console.log(module);

  let local = document.getElementById('local').value;
  let ativo = document.getElementById('ativo').value;
  let modelo = document.getElementById('modelo').value;
  let uuid = document.getElementById('uuid').value;

  if (local == "" || ativo == "" || modelo == "" || uuid == "") {
    alert("Todos os campos devem ser preenchidos");
    return;
  }

  const updatedModule = {
    local: local, 
    status: ativo == "Sim" ? true : false, 
    model: modelo,
    uuid: uuid,
  };

  const newModules = {
    other: {
      modules: [updatedModule]
    }
  };

  updateUser(iAmLogged(), newModules, editModuleIndex);
  switchModule(false);
  loadPage('modules');
}


// Função para remover o módulo
function removeModule(index) {  
  if (confirm("Deseja excluir este módulo?") != true) {
    return;
  }
  let modules = especificValue('other.modules');
  modules.splice(index, 1);
  console.log('Módulo removido:', index);
  // Atualize a exibição da tabela após a remoção
  saveConfig();
  loadPage('modules');
}

function addModule() {
  if (editModuleStatus === true) {
    editModuleStatus = false;
    return updateModule();
  }

  let local = document.getElementById('local').value;
  let ativo = document.getElementById('ativo').value;
  let modelo = document.getElementById('modelo').value;
  let uuid = document.getElementById('uuid').value;

  if (local == "" || ativo == "" || modelo == "" || uuid == "") {
    alert("Todos os campos devem ser preenchidos");
    return;
  }

  const newModules = {
    other: {
      modules: [
        {
          local: local, 
          status: ativo == "Sim" ? true : false, 
          model: modelo,
          uuid: uuid,
        }
      ]
    }
  };

  updateUser(iAmLogged(), newModules);
  switchModule(false);
  loadPage('modules');
}

function insertModule() {
  document.getElementById('insert-module').style.display = 'block';
  let local = document.getElementById('local').value = "";
  let ativo = document.getElementById('ativo').value = "";
  let modelo = document.getElementById('modelo').value = "";
  let uuid = document.getElementById('uuid').value = "";
}

function switchModule(show) {
  if (show == false) {
    document.getElementById('insert-module').style.display = 'none';
    return;
  }
  document.getElementById('insert-module').style.display = 'block';
  return;
}

function viewModule(index) {
  let module = getLoggedData(iAmLogged()).other.modules[index];

  console.log(module);


  switch (module.model) {
    case "Baby Band":
      loadPage('graph1');
      break;
    
    case "Gadgets Smart Cots":
      loadPage('graph2');
      break;

    case "Gadgets Smart Cots Premium":
      loadPage('graph3');
      break;
  
    default:
      break;
  }
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