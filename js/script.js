let lastPage = null;
function loadPage(page, isComponent = false, header = null, footer = null) {
    const content = document.getElementById('content');
    let path = isComponent === true ? 'components' : 'pages';
    let promises = [];

    lastPage = page;

    // Carregar a página principal
    promises.push(
        fetch(`${path}/${page}.html`)
            .then(response => response.text())
            .then(data => {
                content.innerHTML = data;
            })
            .catch(error => {
                content.innerHTML = '<p>Erro ao carregar a página.</p>';
                console.error('Erro:', error);
            })
    );

    // Carregar e adicionar o cabeçalho
    if (header !== null) {
        promises.push(
            fetch(`components/${header}.html`)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const headerContent = doc.body.childNodes;
                    const fragment = document.createDocumentFragment();
                    headerContent.forEach(node => fragment.appendChild(node));

                    const app = document.getElementById('app');
                    app.insertBefore(fragment, app.firstChild);
                })
                .catch(error => {
                    const errorElement = document.createElement('p');
                    errorElement.textContent = 'Erro ao carregar o cabeçalho.';
                    const app = document.getElementById('app');
                    app.insertBefore(errorElement, app.firstChild);
                    console.error('Erro:', error);
                })
        );
    }

    // Carregar e adicionar o rodapé
    if (footer !== null) {
        promises.push(
            fetch(`components/${footer}.html`)
                .then(response => response.text())
                .then(data => {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data, 'text/html');
                    const footerContent = doc.body.childNodes;
                    const fragment = document.createDocumentFragment();
                    footerContent.forEach(node => fragment.appendChild(node));

                    document.getElementById('app').appendChild(fragment);
                })
                .catch(error => {
                    const errorElement = document.createElement('p');
                    errorElement.textContent = 'Erro ao carregar o rodapé.';
                    document.getElementById('app').appendChild(errorElement);
                    console.error('Erro:', error);
                })
        );
    }

    // Executar runPageFunctions após todas as promessas serem resolvidas
    Promise.all(promises).then(() => runPageFunctions(page));
}


function switchProfileVisibility(bool) {
    let div = document.getElementById('profile-div');
    let div2 = document.getElementById('profile-out-click-detector');

    if (bool === false) {
        div.classList.add('hidden-pro');
        div2.classList.add('hidden-pro');
        return;
    }

    div.classList.toggle('hidden-pro');
    div2.classList.toggle('hidden-pro');
}

function changeNavMenu(expand) {
    const open = document.getElementById('nav-menu-open');
    const close = document.getElementById('nav-menu-close');
    const detector = document.getElementById('nav-out-click-detector');
    const spanList = document.getElementsByClassName('hidden-nav-menu');

    const spanArray = Array.from(spanList);

    switch (expand) {
      case true:
        open.style.display = 'none';
        close.style.display = 'block';
        detector.style.display = 'block';
        spanArray.forEach(element => {
            element.classList.remove('hidden');
        });
        break;

      case false:
        open.style.display = 'block';
        close.style.display = 'none';
        detector.style.display = 'none';
        spanArray.forEach(element => {
            element.classList.add('hidden');
        });
        break;

      case null:
        open.style.display = 'block';
        close.style.display = 'none';
        detector.style.display = 'none';
        spanArray.forEach(element => {
            element.classList.add('hidden');
        });
        break;
    
      default:        
        open.style.display = 'block';
        close.style.display = 'none';
        detector.style.display = 'none';
        spanArray.forEach(element => {
            element.classList.add('hidden');
        });
        console.log('Um estado anormal foi detectador. Voltando para o padrão!');
        break;
    }
}

function changePasswordVisibility(id) {
    let input = document.getElementById(id);

    switch (input.type) {
        case 'text':
            input.type = 'password';
            break;

        case 'password':
            input.type = 'text';
            break;
    
        default:
            break;
    }
}

function capitalizeFirstLetter(string, first=false) {
    let text = string.charAt(0).toUpperCase() + string.slice(1);
    
    if (first === false) {
        return text;
    } else {
        return text.split(' ')[0];
    }
}


function runPageFunctions(page) {
    switch (page) {
        case 'login':
            if (iAmLogged()) {loadPage('home', isComponent=false, header='header', footer='footer')}
            break;

        case 'home':
            document.getElementById('nome-usuario-header').textContent = capitalizeFirstLetter(especificValue('user'), true);

            document.getElementById('name').value = especificValue('user');
            document.getElementById('email').value = especificValue('email');
            document.getElementById('old-password').value = especificValue('password');
            break;

        case 'profile':
            document.getElementById('nome-usuario-header').textContent = capitalizeFirstLetter(especificValue('user'), true);

            document.getElementById('name').value = especificValue('user');
            document.getElementById('email').value = especificValue('email');
            document.getElementById('old-password').value = especificValue('password');
            break;

        case 'modules':
            document.getElementById('nome-usuario-header').textContent = capitalizeFirstLetter(especificValue('user'), true);

            let container = document.getElementById('td-container');            
            let modules = especificValue('other.modules');
            modules.forEach((element, index) => {
                container.innerHTML += `
                <tr>
                    <td>${element['local']}</td>
                    <td class="fixed-width">${(element['status'] === true ? '🟢' : '🟠')}</td>
                    <td>${element['model']}</td>
                    <td class="fixed-width"><img src="../DormirPRO/assets/editar.png" onerror="this.onerror=null;this.src='../assets/editar.png'" alt="Editar" onclick="editModule(${index}); renderModules();"></td>
                    <td class="fixed-width"><img src="../DormirPRO/assets/lixo.png" onerror="this.onerror=null;this.src='../assets/lixo.png'" alt="Excluir" onclick="removeModule(${index}); renderModules();"></td>
                </tr>
                `;
            });

            break;
    
        default:
            break;
    }
}

function initializeApp() {
    //return loadPage('modules', isComponent=false, header='header', footer='footer');
    //return loadPage('login');
    
    loadPage('start');

    setTimeout(() => {
        const startContent = document.getElementById('start-content');
        const startContainer = document.getElementById('start-container');
        startContent.classList.remove('animate__fadeIn');
        startContent.classList.add('animate__fadeOut');
        startContainer.classList.add('animate__fadeOut');
    }, 3.3 * 1000);

    setTimeout(() => {
        loadPage('login');
    }, 4 * 1000);
}

//console.log = () => {}

// Carregar a página inicial
document.addEventListener('DOMContentLoaded', initializeApp);
