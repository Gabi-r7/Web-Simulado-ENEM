const nav = document.querySelector('nav');

nav.innerHTML = `
    <div>
        <div class="logo">
            <a href="/src/tabs/home/index.html" class="nomeLogo">SIMULANDO</a>
        </div>

        <div class="menu">
            <div class="nav-op">
                <a href="/src/tabs/home/index.html">
                    <span class="material-symbols-outlined">
                        home
                    </span>
                    <span class="text-icon">Inicio</span>
                </a>
            </div>
            <div class="nav-op">
                <span class="material-symbols-outlined">
                    quiz
                </span>
                <a class="text-icon" href="/src/tabs/questions/question.html">Questões</a>
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
                <a href="/src/tabs/account/account.html">
                    <span class="material-symbols-outlined">
                        person
                    </span>
                    <span class="text-icon">Perfil</span>
                </a>
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

export function showModal(responseJson) {
    const main = document.querySelector('main');
    let color = 'red';
    if (responseJson.status === 'success') {
        color = 'green';
    }
    main.innerHTML = `
        <div id="modal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h1 style="color: ${color};">${responseJson.status}</h1>
                <h2>${responseJson.message}</h2>
            </div>
        </div>
    `;

    const close = document.querySelector('.close');
    close.onclick = () => {
        modal.style.display = 'none';
    }
    
    modal.style.display = 'block';
}