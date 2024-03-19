

// carrocel

const carrocel = document.querySelector('.carrocel');
const caixa = document.querySelector('.carrocel .caixa'); 

// let estiloElemento = getComputedStyle(document.documentElement);
// let gapCaixas = parseFloat(estiloElemento.getPropertyValue('--gap-caixas-carrocel').trim());

// let larguraCaixa = caixa.offsetWidth;
// let quantidadeCaixas = carrocel.children.length;

// let quantasCaixasMover = 1;

// root.style.setProperty('--largura-caixa-carrocel', `${larguraViewport}px`);

let larguraViewport = window.innerWidth;

function moverCarrocel(direcao) {
    
    let posicaoAtual = carrocel.scrollLeft;
    console.log(posicaoAtual);
    
    let novaPosicao;
    
    let quantiaMover = larguraViewport ;

    console.log(quantiaMover);

    if (direcao === 1) {
        console.log('proximo!!!');
        novaPosicao = posicaoAtual + quantiaMover;
    }
    else {
        console.log('volta ae!!!');
        novaPosicao = posicaoAtual - quantiaMover;
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
