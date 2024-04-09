let perguntas = null;
let indicePerguntaAtual = 0;

fetch('assets/json/sim_2023.json')
    .then(response => response.json())
    .then(data => {
        perguntas = [].concat(...Object.values(data['2023']['Linguagens']));
        atualizarPergunta();
    })
    .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));

let respostasDoUsuario = [];
let mainElement = document.querySelector('main');

function atualizarPergunta() {
    if (indicePerguntaAtual >= perguntas.length) {
        // Todas as perguntas foram respondidas
        let tabela = document.createElement('table');
        let cabecalho = tabela.createTHead();
        let linhaCabecalho = cabecalho.insertRow();
        linhaCabecalho.insertCell().textContent = 'Pergunta';
        linhaCabecalho.insertCell().textContent = 'Sua Resposta';
        linhaCabecalho.insertCell().textContent = 'Resposta Correta';

        perguntas.forEach((pergunta, index) => {
            let linha = tabela.insertRow();
            linha.insertCell().textContent = pergunta['Descrição'];
            linha.insertCell().textContent = pergunta['Alternativas'][respostasDoUsuario[index]];
            linha.insertCell().textContent = pergunta['Alternativas'][pergunta['Resposta']];
        });

        mainElement.innerHTML = '';
        mainElement.appendChild(tabela);
        console.log(respostasDoUsuario);
        return;
    }

    let pergunta = perguntas[indicePerguntaAtual];
    let descricao = pergunta['Descrição'];
    let descricaoAuxiliar = pergunta['DescriçãoAuxiliar'];
    let imagemAuxiliar = pergunta['ImagemAuxiliar'];
    let alternativas = pergunta['Alternativas'];

    // Limpar o conteúdo anterior
    mainElement.innerHTML = '';

    // Inserir no HTML
    let div = document.createElement('div');
    let h3 = document.createElement('h3');
    h3.textContent = descricao;
    div.appendChild(h3);

    if (descricaoAuxiliar) {
        let p = document.createElement('p');
        p.textContent = descricaoAuxiliar;
        div.appendChild(p);
    }

    if (imagemAuxiliar) {
        let img = document.createElement('img');
        img.src = imagemAuxiliar;
        div.appendChild(img);
    }

    let ul = document.createElement('ul');
    alternativas.forEach((alternativa, index) => {
        let label = document.createElement('label');
        let radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'alternativa';
        radio.value = index;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(alternativa));
        ul.appendChild(label);
    });
    
    let button = document.createElement('button');
    button.textContent = 'Próxima pergunta';
    button.addEventListener('click', function() {
        let selectedOption = document.querySelector('input[name="alternativa"]:checked');
        if (selectedOption) {
            respostasDoUsuario.push(parseInt(selectedOption.value));
            proximaPergunta();
        }
    });
    div.appendChild(ul);
    div.appendChild(button);
    
    mainElement.appendChild(div);
}

function proximaPergunta() {
    indicePerguntaAtual++;
    atualizarPergunta();
}


// let perguntas = null;
// let conjuntoAtual = "1";
// let perguntaAtual = 0;

// fetch('assets/json/sim_2023.json')
//     .then(response => response.json())
//     .then(data => {
//         perguntas = data['2023']['Português'];
//         atualizarPergunta();
//     })
//     .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));

//     let respostasDoUsuario = [];

// function atualizarPergunta() {
//     if (!perguntas[conjuntoAtual] || !perguntas[conjuntoAtual][perguntaAtual]) {
//         console.error('Pergunta não encontrada:', conjuntoAtual, perguntaAtual);
//         return;
//     }

//     let pergunta = perguntas[conjuntoAtual][perguntaAtual];
//     let descricao = pergunta['Descrição'];
//     let alternativas = pergunta['Alternativas'];

//     // Limpar o conteúdo anterior
//     document.body.innerHTML = '';

//     // Inserir no HTML
//     let div = document.createElement('div');
//     let h3 = document.createElement('h3');
//     h3.textContent = descricao;
//     div.appendChild(h3);

//     let ul = document.createElement('ul');
//     alternativas.forEach((alternativa, index) => {
//         let button = document.createElement('button');
//         button.textContent = alternativa;
//         button.addEventListener('click', function() {
//             respostasDoUsuario.push(index);
//             proximaPergunta();
//         });
//         ul.appendChild(button);
//     });
//     div.appendChild(ul);

//     document.body.appendChild(div);
// }

// function proximaPergunta() {
//     perguntaAtual++;
//     if (perguntaAtual >= perguntas[conjuntoAtual].length) {
//         perguntaAtual = 0;
//         conjuntoAtual = (parseInt(conjuntoAtual) + 1).toString();
//         if (!perguntas[conjuntoAtual]) {
//             conjuntoAtual = "1";
//         }
//         if (!perguntas[conjuntoAtual]) {
//             // Todas as perguntas foram respondidas
//             document.body.innerHTML = 'Obrigado por responder todas as perguntas!';
//             console.log(respostasDoUsuario);
//             return;
//         }
//     }
//     atualizarPergunta();
// }
    




























// let perguntas = [];
// let i = 0;

// async function carregarPerguntas() {
//     const request = await fetch("assets/jason/sim_2023.json");
//     perguntas = await request.json();
//     adicionarQuestao();
// }

// // Função para adicionar uma questão no HTML
// function adicionarQuestao() {
//     const container = document.getElementById('questoes-container');

//     // Limpar o container antes de adicionar a nova pergunta
//     container.innerHTML = '';

//     const pergunta = perguntas[i];
//     const div = document.createElement('div');
//     div.innerHTML = `<p>${pergunta.descricao}</p>`;
//     div.innerHTML += `<p>Alternativas:</p>`;
//     pergunta.alternativas.forEach((alternativa, index) => {
//         div.innerHTML += `<p>${index + 1} - ${alternativa}</p>`;
//     });
//     container.appendChild(div);
    
// }

// document.addEventListener('DOMContentLoaded', (event) => {
//     // Adicionar ouvinte de evento ao botão
//     const nextButton = document.getElementById('next-button');
//     if (nextButton) {
//         nextButton.addEventListener('click', adicionarQuestao);
//     } else {
//         console.error("Botão 'next-button' não encontrado");
//     }

//     // Chamando a função para carregar as questões no carregamento da página
//     carregarPerguntas();
// });