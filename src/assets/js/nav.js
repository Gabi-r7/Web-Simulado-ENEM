document.addEventListener('DOMContentLoaded', loginVerify);
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

let larguraJanela = window.innerWidth;
let larguraMaximaJanela = screen.availWidth;

if(larguraJanela < 430) {
    nav.classList.add('hidden');

    let divShowNav = document.createElement('div');
    body.appendChild(divShowNav);
    divShowNav.classList.add('showNav');

    let divShowNavContent = document.createElement('div');
    divShowNav.appendChild(divShowNavContent);
    divShowNavContent.classList.add('showNavContent');
    divShowNavContent.classList.add('main-div');

    let btShowNav = document.createElement('button');
    divShowNavContent.appendChild(btShowNav);

    btShowNav.innerHTML = "menu";

    btShowNav.addEventListener('click', () => {
        nav.classList.toggle('hidden');
    });
}

nav.innerHTML = `
    <div>
        <div class="logo">
            <a href="/src/tabs/home/index.html" class="nomeLogo">SIMULANDO</a>
        </div>

        <div class="menu">
            <a class="nav-op" href="/src/tabs/home/index.html">
                <span class="material-symbols-outlined">
                    home
                </span>
                <span class="text-icon">Inicio</span>
            </a>
            <a class="nav-op" href="/src/tabs/questions/question.html">
                <span class="material-symbols-outlined">
                    quiz
                </span>
                <div class="text-icon" >Questões</div>
            </a>
            <a class="nav-op" href="/src/tabs/ranking/ranking.html">
                <span class="material-symbols-outlined">
                    trophy
                </span>
                <div class="text-icon">Ranking</div>
            </a>
            <a class="nav-op">
                <span class="material-symbols-outlined">
                    live_help
                </span>
                <span class="text-icon">Suporte</span>
            </a>
        </div>
        
        <div class="user">
            <div class="nav-op">
                Não logado
            </div>
            <a class="nav-op" href="/src/tabs/login/login.html">
                <span class="material-symbols-outlined">
                    person
                </span>
                <span class="text-icon">Login</span>
            </a>
            <a class="nav-op" href="/src/tabs/signUp/cadastro.html">    
                <span class="material-symbols-outlined">
                    person_add
                </span>
                <span class="text-icon">Sign Up</span>
            </a>
        </div>
    </div>`
    
// Função para verificar o tamanho da janela e comparar com o tamanho do nav
function verificarTamanhoJanelaENav() {
    // Obter a largura da janela
    let larguraJanela = window.innerWidth;

    // Obter a largura máxima da janela
    let larguraMaximaJanela = screen.availWidth;

    // Obter o elemento <nav>
    const navElement = document.querySelector('nav');
    const nomeLogo = document.querySelector('.nomeLogo');
    const textIcons = document.querySelectorAll('.text-icon');

    const mainElement = document.querySelector('main');
    const larguraNav = navElement.getBoundingClientRect().width;

    // Verificar se o elemento <nav> existe
    if (navElement) {
        if(larguraJanela > 430) {
            // Obter a largura do elemento <nav>

            // Comparar as larguras
            if (larguraJanela < larguraMaximaJanela * 0.7) {
                console.log('A largura da janela é menor que a largura maxima.');
                navElement.classList.add('hidden');
                nomeLogo.innerHTML = 'S';

                textIcons.forEach((textIcon) => {
                    textIcon.style.display = 'none';
                });

                mainElement.classList.add('maisEspaco');

            } else {
                navElement.classList.remove('hidden');
                nomeLogo.innerHTML = 'SIMULANDO';

                textIcons.forEach((textIcon) => {
                    textIcon.style.display = 'block';
                });

                mainElement.classList.remove('maisEspaco');
            }
        }
    } else {
        console.log('Elemento <nav> não encontrado.');
    }
}

async function loginVerify() {
    const response = await fetch('/loginVerify', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    const responseJson = await response.json();
    if (response.status == 200) {
        const user = responseJson.data + responseJson.message;
        const userElement = document.querySelector('.user');
        
        userElement.innerHTML = `
        <div class="nav-op">
            ${user}
        </div>
            <a class="nav-op" href="/src/tabs/account/account.html">
                <span class="material-symbols-outlined">
                    person
                </span>
                <span class="text-icon">Perfil</span>
            </div>
            
            <a class="nav-op">
                <button onclick="logout()" class="nav-op">
                    <span class="material-symbols-outlined">
                        logout
                    </span>
                    <span class="text-icon">Log Out</span>
                </button>
            </a>`

        // document.getElementById('login').innerText = user.login;
        // document.getElementById('email').innerText = user.email;
        // document.getElementById('profileImg').src = user.profileImage;
    } else {
        const userElement = document.querySelector('.user');
        userElement.innerHTML = `
            <div class="nav-op">
                Não logado
            </div>
            <a class="nav-op" href="/src/tabs/login/login.html">
                <span class="material-symbols-outlined">
                    person
                </span>
                <span class="text-icon">Login</span>
            </a>
            <a class="nav-op" href="/src/tabs/signUp/cadastro.html">    
                <span class="material-symbols-outlined">
                    person_add
                </span>
                <span class="text-icon">Sign Up</span>
            </a>`
    }
};

verificarTamanhoJanelaENav();

async function logout() {
    const response = await fetch('/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    })

    const responseJson = await response.json();
    if (response.status == 200) {
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/home/index.html'; 
        }, 700);
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

// Chamar a função para verificar o tamanho da janela e do nav
verificarTamanhoJanelaENav();

// Adicionar um event listener para verificar o tamanho da janela ao redimensionar
window.addEventListener('resize', verificarTamanhoJanelaENav);