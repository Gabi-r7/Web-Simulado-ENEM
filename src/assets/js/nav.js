
const nav = document.querySelector('nav');

nav.innerHTML = `
    <div>
        <div class="logo">
            <a href="/src/tabs/initial/index.html" class="nomeLogo">SIMULANDO</a>
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
        </div>
    </div>`

// const ranking = document.querySelector('.ranking');
// const perfil = document.querySelector('.perfil');
