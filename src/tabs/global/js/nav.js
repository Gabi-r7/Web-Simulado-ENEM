import { response } from 'express';
import { loginVerify, loginStatus} from './main.js';
import { create } from 'domain';

const nav = document.querySelector('nav');
const main = document.querySelector('main');
const body = document.querySelector('body');

let larguraJanela = window.innerWidth;
let larguraMaximaJanela = screen.availWidth;

async function checkLogin() {
    await loginVerify(); // Verifica o login
    console.log(loginStatus); // Usa o resultado da verificação de login
    if (loginStatus && loginStatus.status === 'success') {
        console.log('Usuário está logado');
        // Faça algo se o usuário estiver logado
    } else {
        console.log('Usuário não está logado');
        // Redirecione para a página de login ou mostre uma mensagem
    }
    createNav(loginStatus);
}

checkLogin();

function createNav(loginStatus) {
    // Create the logo section
    const logoDiv = document.createElement('div');
    logoDiv.className = 'logo';
    const logoLink = document.createElement('a');
    logoLink.href = '/src/tabs/home/index.html';
    logoLink.className = 'nomeLogo';
    logoLink.textContent = 'SIMULANDO';
    logoDiv.appendChild(logoLink);
    nav.appendChild(logoDiv);

    // Create the menu section
    const menuDiv = document.createElement('div');
    menuDiv.className = 'menu';

    const menuItems = [
        { href: '/src/tabs/home/index.html', icon: 'home', text: 'Inicio' },
        { href: '/src/tabs/questions/question.html', icon: 'quiz', text: 'Questões' },
        { href: '/src/tabs/ranking/ranking.html', icon: 'trophy', text: 'Ranking' },
        { href: '#', icon: 'live_help', text: 'Suporte' }
    ];

    menuItems.forEach(item => {
        const a = document.createElement('a');
        a.className = 'nav-op';
        if (item.href !== '#') a.href = item.href;

        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined';
        iconSpan.textContent = item.icon;

        const textSpan = document.createElement('span');
        textSpan.className = 'text-icon';
        textSpan.textContent = item.text;

        a.appendChild(iconSpan);
        a.appendChild(textSpan);
        menuDiv.appendChild(a);
    });

    nav.appendChild(menuDiv);

    // Create the user section

    const userDiv = document.createElement('div');
    userDiv.className = 'user';

    if(loginStatus && loginStatus.status === 'success') {
        const userItems = [
            { href: '/src/tabs/account/account.html', icon: 'person', text: 'Perfil' },
            { href: '#', icon: 'logout', text: 'Log Out' }
        ];

        userItems.forEach(item => {
            const a = document.createElement('a');
            a.className = 'nav-op';
            if (item.href !== '#') a.href = item.href;

            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-symbols-outlined';
            iconSpan.textContent = item.icon;

            const textSpan = document.createElement('span');
            textSpan.className = 'text-icon';
            textSpan.textContent = item.text;

            a.appendChild(iconSpan);
            a.appendChild(textSpan);
            userDiv.appendChild(a);
        });
    }
    else{
        // Create the "Não logado" div
        const userDiv = document.createElement('div');
        userDiv.className = 'nav-op';
        userDiv.textContent = 'Não logado';

        // Create the "Login" link
        const loginLink = document.createElement('a');
        loginLink.className = 'nav-op';
        loginLink.href = '/src/tabs/login/login.html';

        const loginIcon = document.createElement('span');
        loginIcon.className = 'material-symbols-outlined';
        loginIcon.textContent = 'person';

        const loginText = document.createElement('span');
        loginText.className = 'text-icon';
        loginText.textContent = 'Login';

        loginLink.appendChild(loginIcon);
        loginLink.appendChild(loginText);

        // Create the "Cadastrar" link
        const signUpLink = document.createElement('a');
        signUpLink.className = 'nav-op';
        signUpLink.href = '/src/tabs/signUp/cadastro.html';

        const signUpIcon = document.createElement('span');
        signUpIcon.className = 'material-symbols-outlined';
        signUpIcon.textContent = 'person_add';

        const signUpText = document.createElement('span');
        signUpText.className = 'text-icon';
        signUpText.textContent = 'Cadastrar';

        signUpLink.appendChild(signUpIcon);
        signUpLink.appendChild(signUpText);

        // Append all elements to the desired parent element
        const parentElement = document.getElementById('parent-element-id'); // Replace with the actual parent element ID
        parentElement.appendChild(userDiv);
        parentElement.appendChild(loginLink);
        parentElement.appendChild(signUpLink);
    }

    nav.appendChild(userDiv);
}

function esconderNav () {
    console.log('A largura da janela é: ' + larguraJanela + 'px.');
    if(larguraJanela < 430) {
        console.log('A largura da janela é menor que 430px.');
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

        // closenav

        let divCloseNav = document.createElement('div');
        body.appendChild(divCloseNav);
        divCloseNav.classList.add('showNav');

        let divCloseNavContent = document.createElement('div');
        divCloseNav.appendChild(divCloseNavContent);
        divCloseNavContent.classList.add('showNavContent');
        divCloseNavContent.classList.add('main-div');

        let btCloseNav = document.createElement('button');
        divCloseNavContent.appendChild(btCloseNav);

        btCloseNav.innerHTML = `
                <span class="material-symbols-outlined">
                    logout
                </span>
                <span class="text-icon">Fechar nav</span>`;

        btCloseNav.addEventListener('click', () => {
            nav.classList.toggle('hidden');
        });

        filhoNav = nav.children[0];
        filhoNav.appendChild(divCloseNav);
    }
}

document.addEventListener('DOMContentLoaded', esconderNav());

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

verificarTamanhoJanelaENav();

// Adicionar um event listener para verificar o tamanho da janela ao redimensionar
window.addEventListener('resize', verificarTamanhoJanelaENav);