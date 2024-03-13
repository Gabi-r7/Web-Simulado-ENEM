// navegador

const nav = document.querySelector('nav');

nav.innerHTML = `
    <div class="logo">
        <div class="nomeLogo">SIMULANDO</div>
    </div>
    <div class="menu">
        <div class="perfil"></div>
        <div class="perfil"></div>
        <div class="perfil"></div>
    </div>`

// carrocel

const carrocel = document.querySelector('.carrocel');

let estiloElemento = getComputedStyle(document.documentElement);
let gapCaixas = estiloElemento.getPropertyValue('--gap-caixas-carrocel');

let larguraCaixa = carrocel.getBoundingClientRect().width;
let quantidadeCaixas = carrocel.children.length;

function moverCarrocel(direcao) {
    let larguraCarrocel = carrocel.getBoundingClientRect().width;
    console.log(larguraCarrocel);

    let posicaoAtual = carrocel.scrollLeft;
    console.log(posicaoAtual);

    let novaPosicao;

    const mover = (caixaWidth + espacoEntreCaixas) * elementosParaMover; //fafafaffafffaffafaf

    if (direcao === 1) {
        console.log('proximo!!!');
        novaPosicao = posicaoAtual + larguraCarrocel;
    }
    else {
        console.log('volta ae!!!');
        novaPosicao = posicaoAtual - larguraCarrocel;
    }

    carrocel.scrollTo({
        left: novaPosicao,
        behavior: 'smooth'
    });
}

// Carrocel Eventos

document.querySelector('.proximo').addEventListener('click', function () {
    moverCarrocel(1);
});

document.querySelector('.anterior').addEventListener('click', function () {
    moverCarrocel(-1);
});
