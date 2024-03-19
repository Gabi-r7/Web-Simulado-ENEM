

// carrocel

const carrocel = document.querySelector('.carrocel');
const caixa = document.querySelector('.carrocel .caixa'); 

let larguraViewport = window.innerWidth;

function moverCarrocel(direcao) {
    
    let posicaoAtual = carrocel.scrollLeft;
    console.log(posicaoAtual);
    
    let novaPosicao;
    
    let quantiaMover = larguraViewport ;

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

// if (direcao === 1) {
    //     console.log('proximo!!!');
    //     if (posicaoAtual == 4095) {
    //         // Rola a div do carrossel até o fim
    //         carrocel.scrollTo({
    //             left: carrocel.scrollWidth,
    //             behavior: 'smooth'
    //         });
    //         return;
    //     }
    //     else{
    //         novaPosicao = posicaoAtual + quantiaMover;
    //     }
    // }
    // else {
    //     console.log('volta ae!!!');
    //     if (posicaoAtual == 1382) {
    //         // Rola a div do carrossel até o começo
    //         carrocel.scrollTo({
    //             left: 0,
    //             behavior: 'smooth'
    //         });
    //         return;
    //     }
    //     else{
    //         novaPosicao = posicaoAtual - quantiaMover;
    //     }
    // }
