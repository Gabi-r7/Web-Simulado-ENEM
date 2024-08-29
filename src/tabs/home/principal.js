let ano = [];
let conc = '';

let perguntas = null;
let indicePerguntaAtual = 0;

let respostasDoUsuario = [];
let mainElement = document.querySelector('main');
console.log('Página carregada');

function updateLink(categoria) {
    if (isNaN(categoria)) {
        tipo = [categoria];
        const buttons = document.querySelectorAll('.checkbox-custom');
        // const buttonsComing = document.querySelectorAll('.coming-soon');

        const selecionados = Array.from(buttons).filter(checkbox => checkbox.checked);
        tipo = selecionados.map(checkbox => {
            const match = checkbox.getAttribute('onclick') ? checkbox.getAttribute('onclick').match(/\('(.*)'\)/) : null;
            return match ? match[1] : null;
        }).filter(Boolean); // Remove valores nulos ou undefined do array resultante
    } else {
        // Verifica se o ano já foi selecionado
        if (ano.includes(categoria)) {
            // Remove o ano se já estiver selecionado
            ano = ano.filter(item => item !== categoria);
        } else {
            // Adiciona o ano se não estiver selecionado
            ano.push(categoria);
        }
    }
    console.log(ano,tipo);
}

function confirm() {
    if (tipo.length === 0 || tipo.includes('aleatorio') && tipo.length === 1) {
        showModal(0, 'Selecione pelo menos uma modalidade');
        return;
    }
    if (ano.length === 0) {
        showModal(0, 'Selecione pelo menos um ano');
        return;
    }

    conc += tipo.join(',');
    conc += '&ano=' + ano;  
    console.log(conc);

    console.log(ano, tipo);
    carregarPerguntas(ano, tipo);
}