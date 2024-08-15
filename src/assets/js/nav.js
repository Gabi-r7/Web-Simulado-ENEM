const nav = document.querySelector('nav');
const main = document.querySelector('main');
const body = document.querySelector('body');

const modal = document.createElement('div'); // Create the 'modal' element
body.appendChild(modal); // Append 'modal' to 'main'
modal.id = 'modal';
modal.style.display = 'none';

const modalModal = document.createElement('div'); // Create the 'modal-modal' element
modal.appendChild(modalModal); // Append 'modalModal' to 'modal'
modalModal.classList.add('modal-modal');

const modalContent = document.createElement('div'); // Create the 'modal-content' element
modalModal.appendChild(modalContent); // Append 'modalContent' to 'modalModal'
modalContent.classList.add('modal-content');
modalContent.classList.add('main-div')


const divH1 = document.createElement('div'); // Create the 'divH1' element
const divH2 = document.createElement('div'); // Create the 'divH2' element
modalContent.appendChild(divH1); // Append 'divH1' to 'modalContent'
modalContent.appendChild(divH2); // Append 'divH2' to 'modalContent'

const h1 = document.createElement('h1'); // Create the 'h1' element
const h2 = document.createElement('h2'); // Create the 'h2' element
divH1.appendChild(h1); // Append 'h1' to 'modalContent'
divH2.appendChild(h2); // Append 'h2' to 'modalContent'

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
                <a class="text-icon" href="/src/tabs/ranking/ranking.html">Ranking</a>
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
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/home/index.html';
        }, 1000);
    }
    else {
        showModal(responseJson);
    }
}

function showModal(responseJson, message) {
    const html = document.querySelector('html');
    let color = 'red';
    if (message !== undefined) {
        h2.innerHTML = message;
    }
    else {
        if (responseJson.status === 'success') {
            color = 'rgb(7, 255, 20)';
        }
        h1.style.color = color;
        h1.innerHTML = responseJson.status;
        h2.innerHTML = responseJson.message;
    }
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 2500);
    
    html.addEventListener('click', (event) => {
        if (event.target.tagName !== 'BUTTON') {
            modal.style.display = 'none';
        }
    });
    
    modal.style.display = 'block';
}