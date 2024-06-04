let pontos = document.querySelectorAll(".ponto");
let caixas = document.querySelectorAll(".caixa");
let indiceAtual = 0;

function atualizarDiv() {
    caixas.forEach(caixa => caixa.classList.remove('ativo'));
    pontos.forEach(ponto => ponto.classList.remove('ativo'));
    caixas[indiceAtual].classList.add("ativo");
    pontos[indiceAtual].classList.add("ativo");
}

pontos.forEach((ponto, indice) => {
    ponto.addEventListener("click", () => {
        indiceAtual = indice;
        console.log(indiceAtual); 
        atualizarDiv();
    });
});

atualizarDiv();