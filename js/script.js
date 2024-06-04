function loadPage(page) {
  const content = document.getElementById('content');
  fetch(`pages/${page}.html`)
      .then(response => response.text())
      .then(data => {
          content.innerHTML = data;
      })
      .catch(error => {
          content.innerHTML = '<p>Erro ao carregar a página.</p>';
          console.error('Erro:', error);
      });
}

// Carregar a página inicial
document.addEventListener('DOMContentLoaded', () => loadPage('home'));
