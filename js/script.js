function loadPage(page, isComponent = false, header = null, footer = null) {
    const content = document.getElementById('content');
    let path = isComponent === true ? 'components' : 'pages';

    // Carregar a página principal
    fetch(`${path}/${page}.html`)
        .then(response => response.text())
        .then(data => {
            content.innerHTML = data;
        })
        .catch(error => {
            content.innerHTML = '<p>Erro ao carregar a página.</p>';
            console.error('Erro:', error);
        });

    // Carregar e adicionar o cabeçalho
    if (header !== null) {
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
                setBodyStyle();
            })
            .catch(error => {
                const errorElement = document.createElement('p');
                errorElement.textContent = 'Erro ao carregar o cabeçalho.';
                const app = document.getElementById('app');
                app.insertBefore(errorElement, app.firstChild);
                console.error('Erro:', error);
            });
    }

    // Carregar e adicionar o rodapé
    if (footer !== null) {
        fetch(`components/${footer}.html`)
            .then(response => response.text())
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const footerContent = doc.body.childNodes;
                const fragment = document.createDocumentFragment();
                footerContent.forEach(node => fragment.appendChild(node));

                document.getElementById('app').appendChild(fragment);
                setBodyStyle();
            })
            .catch(error => {
                const errorElement = document.createElement('p');
                errorElement.textContent = 'Erro ao carregar o rodapé.';
                document.getElementById('app').appendChild(errorElement);
                console.error('Erro:', error);
            });
    }
}

function initializeApp() {
    //return loadPage('home', isComponent=false, header='header', footer='footer');
    return loadPage('login');
    
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

function setBodyStyle() {
    document.getElementById('content').style.padding = '3rem 5rem';
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

// Carregar a página inicial
document.addEventListener('DOMContentLoaded', initializeApp);
