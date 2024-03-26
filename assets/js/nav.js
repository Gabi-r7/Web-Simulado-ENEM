
const nav = document.querySelector('nav');

nav.innerHTML = `
    <div class="logo">
        <div class="nomeLogo">SIMULANDO</div>
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
    </div>`

const ranking = document.querySelector('.ranking');
const perfil = document.querySelector('.perfil');
