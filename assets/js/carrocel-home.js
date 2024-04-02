

// carrocel

const carrocel = document.querySelector('.carrocel');
const caixa = document.querySelector('.carrocel .caixa'); 
const proximo = document.querySelector('.proximo'); 
const anterior = document.querySelector('.anterior'); 


let larguraCaixa = caixa.offsetWidth;

anterior.style.display = 'none';

let quantiaCaixa = 5;


for(i = 0; i < quantiaCaixa; i++){
    carrocel.innerHTML = `
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
}

function moverCarrocel(direcao) {
    
    let posicaoAtual = carrocel.scrollLeft;
    console.log(posicaoAtual);
    
    let novaPosicao;
    
    let quantiaMover = larguraCaixa ;

    if (direcao === 1) {
        if(posicaoAtual >= larguraCaixa * (quantiaCaixa -2)){
            proximo.style.display = 'none';
        }
        if(posicaoAtual == 0){
            anterior.style.display = 'grid';
        }
        console.log('proximo!!!');
        novaPosicao = posicaoAtual + quantiaMover;
    }
    else {
        if(posicaoAtual >= larguraCaixa * (quantiaCaixa -2)){
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
