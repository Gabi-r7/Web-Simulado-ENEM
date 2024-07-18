
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
async function logout() {
    const response = await fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const responseJson = await response.json();
    if (responseJson.ok) {
        alert(responseJson.message);
        window.location.href = '/src/tabs/home/index.html';
    }
    else {
        alert(responseJson.message);
    }
}