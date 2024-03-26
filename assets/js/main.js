

// carrocel

const carrocel = document.querySelector('.carrocel');
const caixa = document.querySelector('.carrocel .caixa'); 
const proximo = document.querySelector('.proximo'); 
const anterior = document.querySelector('.anterior'); 

let larguraCaixa = caixa.offsetWidth;

anterior.style.display = 'none';

function moverCarrocel(direcao) {
    
    let posicaoAtual = carrocel.scrollLeft;
    console.log(posicaoAtual);
    
    let novaPosicao;
    
    let quantiaMover = larguraCaixa ;

    if (direcao === 1) {
        if(posicaoAtual >= larguraCaixa * 3){
            proximo.style.display = 'none';
        }
        if(posicaoAtual == 0){
            anterior.style.display = 'grid';
        }
        console.log('proximo!!!');
        novaPosicao = posicaoAtual + quantiaMover;
    }
    else {
        if(posicaoAtual >= larguraCaixa * 3){
            proximo.style.display = 'grid';
        }
        if(posicaoAtual >= larguraCaixa && posicaoAtual < larguraCaixa*2){
            anterior.style.display = 'none';
        }
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
