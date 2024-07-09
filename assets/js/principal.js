let tipo = []; // Declaração no escopo global
let ano = [];
let urlConc = '';
function updateLink(categoria) {
    if (isNaN(categoria)) {
        tipo = [categoria];
    }
    else {
        ano = categoria;
    }
    const checkboxes = document.querySelectorAll('.checkbox-custom');
    const selecionados = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    tipo = selecionados.map(checkbox => checkbox.getAttribute('onclick').match(/\('(.*)'\)/)[1]); // Atualiza a variável global
}

function confirm() {
    urlConc += tipo.join(',');
    urlConc += '&ano=' + ano;   
    console.log(urlConc);
    window.location.href = "modalidade.html?tipo=" + urlConc;
}