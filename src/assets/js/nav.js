
const nav = document.querySelector('nav');

nav.innerHTML = `
    <div>
        <div class="logo">
            <a href="/src/tabs/home/index.html" class="nomeLogo">SIMULANDO</a>
        </div>
        <div class="menu">
            <div class="ranking">
                <span class="material-symbols-outlined">
                    trophy
                </span>
            </div>
            <div class="perfil">
                <span class="material-symbols-outlined">
                    person
                </span>
            </div>
            <div class="cadastrar">    
                <a href="/src/tabs/signUp/cadastro.html">
                    <span class="material-symbols-outlined">
                        person_add
                    </span>
                </a>
            </div>
            <div class="logout">
                <button onclick="logout()">
                    <span class="material-symbols-outlined">
                        exit_to_app
                    </span>
                </button>
            </div>
        </div>
    </div>`

// const ranking = document.querySelector('.ranking');
// const perfil = document.querySelector('.perfil');
function logout() {
    fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            // Logout bem-sucedido
            console.log('Logout realizado com sucesso');
            window.location.href = '/src/tabs/home/index.html'; 
        } else {
            console.error('Erro ao fazer logout');
        }
    })
    .catch(error => {
        console.error('Erro na rede ao fazer logout:', error);
    });
}
