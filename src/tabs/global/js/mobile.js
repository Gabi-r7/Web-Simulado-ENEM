let larguraJanela = window.innerWidth;
let larguraMaximaJanela = screen.availWidth;

verificarTamanhoJanelaENav();

function verificarTamanhoJanelaENav() {

    let larguraJanela = window.innerWidth;
    let larguraMaximaJanela = screen.availWidth;

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

document.addEventListener('DOMContentLoaded', esconderNav());

verificarTamanhoJanelaENav();

// Adicionar um event listener para verificar o tamanho da janela ao redimensionar
window.addEventListener('resize', verificarTamanhoJanelaENav);