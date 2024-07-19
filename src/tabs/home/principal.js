let tipo = []; // Declaração no escopo global
let ano = [];
let urlConc = '';
function updateLink(categoria) {
    if (isNaN(categoria)) {
        tipo = [categoria];
        const checkboxes = document.querySelectorAll('.checkbox-custom');
        const selecionados = Array.from(checkboxes).filter(checkbox => checkbox.checked);
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
    console.log(tipo);
}

function confirm() {
    if (tipo.length === 0 || tipo.includes('aleatorio') && tipo.length === 1) {
        alert('Selecione pelo menos uma modalidade');
        return;
    }
    if (ano.length === 0) {
        alert('Selecione pelo menos um ano');
        return;
    }

    urlConc += tipo.join(',');
    urlConc += '&ano=' + ano;  
    console.log(urlConc);
    window.location.href = "/src/tabs/questions/question.html?tipo=" + urlConc;
}

document.addEventListener('DOMContentLoaded', function() {
    var checkboxes = document.querySelectorAll('.checkbox-label input[type="checkbox"]');

    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            var siblingDiv = this.nextElementSibling;
            if (this.checked) {
                siblingDiv.textContent = '✓';
                siblingDiv.style.color = 'black';
            } else {
                siblingDiv.textContent = '';
            }
        });
    });
});