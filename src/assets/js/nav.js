
const nav = document.querySelector('nav');

nav.innerHTML = `
    <div>
        <div class="logo">
            <a href="/src/tabs/home/index.html" class="nomeLogo">SIMULANDO</a>
        </div>

        <div class="menu">
            <div class="nav-op">
                <span class="material-symbols-outlined">
                    home
                </span>
                <span class="text-icon">Inicio</span>
            </div>
            <div class="nav-op">
                <span class="material-symbols-outlined">
                    quiz
                </span>
                <span class="text-icon">Questões</span>
            </div>
            <div class="nav-op">
                <span class="material-symbols-outlined">
                    trophy
                </span>
                <span class="text-icon">Ranking</span>
            </div>
            <div class="nav-op">
                <span class="material-symbols-outlined">
                    live_help
                </span>
                <span class="text-icon">Suporte</span>
            </div>
        </div>
        
        <div class="user">
            <div class="nav-op">
                <span class="material-symbols-outlined">
                    person
                </span>
                <span class="text-icon">Perfil</span>
            </div>
            <div class="nav-op">    
                <a href="/src/tabs/signUp/cadastro.html">
                    <span class="material-symbols-outlined">
                        person_add
                    </span>
                    <span class="text-icon">SingUp</span>
                </a>
            </div>
            <div class="nav-op">
                <button onclick="logout()">
                    <span class="material-symbols-outlined">
                        logout
                    </span>
                    <span class="text-icon">LogOut</span>
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