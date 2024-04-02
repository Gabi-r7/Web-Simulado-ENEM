const carrocelInicial = document.querySelector('.carrocel');
let quantiaCaixa = 3;

for(let i = 0; i < quantiaCaixa; i++){
    carrocelInicial.innerHTML += `
        <div class="caixa">
            <div class="modalidade"></div>
        </div>
    `;
}
