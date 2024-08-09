const nav = document.querySelector('nav');
const modal = document.createElement('div'); // Create the 'modal' element
const main = document.querySelector('main');
modal.id = 'modal';
const modalContent = document.createElement('div'); // Create the 'modal-content' element

modalContent.classList.add('modal-content');

const h1 = document.createElement('h1'); // Create the 'h1' element

const h2 = document.createElement('h2'); // Create the 'h2' element

modalContent.appendChild(h1); // Append 'h1' to 'modalContent'
modalContent.appendChild(h2); // Append 'h2' to 'modalContent'

modal.appendChild(modalContent); // Append 'modalContent' to 'modal'

main.appendChild(modal); // Append 'modal' to 'main'
modal.style.display = 'none';


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

function showModal(responseJson) {
    const html = document.querySelector('html');
    let color = 'red';
    if (responseJson.status === 'success') {
        color = 'green';
    }
    h1.style.color = color;
    h1.innerHTML = responseJson.status;
    h2.innerHTML = responseJson.message;
    
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 2500);
    
    html.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.style.display = 'block';
}