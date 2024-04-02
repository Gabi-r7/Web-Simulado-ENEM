const carrocelInicial = document.querySelector('.carrocel');
let quantiaCaixa = 5;

for(let i = 0; i < quantiaCaixa; i++){
    let novaCaixa = document.createElement('div');
    novaCaixa.className = 'caixa';
    
    let novaModalidade = document.createElement('div');
    novaModalidade.className = 'modalidade';
    
    novaCaixa.appendChild(novaModalidade);
    carrocelInicial.appendChild(novaCaixa);
}
