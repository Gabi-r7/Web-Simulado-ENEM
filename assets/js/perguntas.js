let perguntas = [];
let i = 0;

async function carregarPerguntas() {
    const request = await fetch("assets/jason/sim_2023.json");
    perguntas = await request.json();
    adicionarQuestao();
}

// Função para adicionar uma questão no HTML
function adicionarQuestao() {
    const container = document.getElementById('questoes-container');

    // Limpar o container antes de adicionar a nova pergunta
    container.innerHTML = '';

    const pergunta = perguntas[i];
    const div = document.createElement('div');
    div.innerHTML = `<p>${pergunta.descricao}</p>`;
    div.innerHTML += `<p>Alternativas:</p>`;
    pergunta.alternativas.forEach((alternativa, index) => {
        div.innerHTML += `<p>${index + 1} - ${alternativa}</p>`;
    });
    container.appendChild(div);
    
}

document.addEventListener('DOMContentLoaded', (event) => {
    // Adicionar ouvinte de evento ao botão
    const nextButton = document.getElementById('next-button');
    if (nextButton) {
        nextButton.addEventListener('click', adicionarQuestao);
    } else {
        console.error("Botão 'next-button' não encontrado");
    }

    // Chamando a função para carregar as questões no carregamento da página
    carregarPerguntas();
});