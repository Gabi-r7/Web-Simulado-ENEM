let sessionId = generateSessionId(); // Função para gerar um ID de sessão único
let mainElement = document.querySelector('main');
console.log('Página carregada');

let params = new URLSearchParams(window.location.search);
let ano = params.get('ano');
let tipo = params.get('tipo');
console.log(ano, tipo);

startQuiz(ano, tipo);

function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

let indicePerguntaAtual = 0;
let perguntas = [];
let respostasDoUsuario = []; // Adicionando a variável global para armazenar as respostas do usuário

async function startQuiz(ano, tipo) {
    console.log('ano:', ano, 'tipo:', tipo);
    try {
        const response = await fetch('/startQuiz', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId, ano, tipo })
        });
        const data = await response.json();
        perguntas = data.perguntas;
        console.log('perguntas:', perguntas);
        
        atualizarPergunta(136);
    } catch (error) {
        console.error('Erro ao iniciar o quiz:', error);
    }
}

async function nextQuestion(resposta) {
    try {
        const response = await fetch('/nextQuestion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId, resposta })
        });
        const data = await response.json();
        if (data.fim) {
            enviarRespostas();
        } else {
            perguntas.push(data.pergunta); // Adiciona a nova pergunta ao array de perguntas
            indicePerguntaAtual++;
            atualizarPergunta(data.pergunta);
        }
    } catch (error) {
        console.error('Erro ao obter a próxima pergunta:', error);
    }
}

async function previousQuestion() {
    if (indicePerguntaAtual > 0) {
        indicePerguntaAtual--;
        atualizarPergunta(perguntas[indicePerguntaAtual]);
    }
}

async function enviarRespostas() {
    try {
        const response = await fetch('/checkAnswers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId })
        });
        const resultados = await response.json();
        exibirGabarito(resultados);
    } catch (error) {
        console.error('Erro ao enviar respostas:', error);
    }
}

function atualizarPergunta(pergunta) {
    mainElement.innerHTML = '';
    console.log('pergunta:', pergunta); //undefined
    console.log(pergunta['Descrição']);

    let perguntaTtl = pergunta['Descrição'];
    let descricaoAuxiliar = pergunta['DescriçãoAuxiliar'];
    let imagemAuxiliar = pergunta['ImagemAuxiliar'];
    let alternativas = pergunta['Alternativas'];

    let dataQuestion = document.createElement('div');
    let div = document.createElement('div');
    let h3 = document.createElement('div');
    let numeroPerguntaElement = document.createElement('h2');
    
    numeroPerguntaElement.textContent = `Questão ${indicePerguntaAtual + 1} / ${perguntas.length}`;

    mainElement.appendChild(dataQuestion);
    dataQuestion.appendChild(numeroPerguntaElement);

    dataQuestion.classList.add('data-question');
    dataQuestion.classList.add('main-div');
    numeroPerguntaElement.classList.add('numero-pergunta');

    if (descricaoAuxiliar) {
        let p = document.createElement('p');
        p.innerHTML = descricaoAuxiliar;
        div.appendChild(p);
        p.classList.add('descricaoAuxiliar');
        p.classList.add('border');
    }

    if (imagemAuxiliar) {
        let img = document.createElement('img');
        let divImgAux = document.createElement('div');
        img.src = imagemAuxiliar;
        div.appendChild(divImgAux);
        divImgAux.appendChild(img);
        divImgAux.classList.add('imagemAuxiliar');
        divImgAux.classList.add('border');
    }

    h3.innerHTML = perguntaTtl;
    div.appendChild(h3);
    div.classList.add('questao');
    div.classList.add('main-div');
    h3.classList.add('pergunta');
    h3.classList.add('border');

    let listaAlternativas = document.createElement('div');
    listaAlternativas.classList.add('alternativas');
    let selectedOption = null;

    alternativas.forEach((alternativa, index) => {
        let divAlternativa = document.createElement('div');
        let divTextoAlternativa = document.createElement('div');
        divAlternativa.classList.add('alternativa');
        divAlternativa.dataset.value = index;
        divTextoAlternativa.innerHTML = alternativa;
        divAlternativa.appendChild(divTextoAlternativa);

        if (divTextoAlternativa.textContent.includes('\\')) {
            MathJax.typesetPromise([divAlternativa]);
        }

        divAlternativa.addEventListener('click', function() {
            if (selectedOption == this) {
                selectedOption.classList.remove('selecionada');
                selectedOption = null;
            } else {
                if (selectedOption) {
                    selectedOption.classList.remove('selecionada');
                }
                selectedOption = this;
                selectedOption.classList.add('selecionada');
            }
        });

        listaAlternativas.appendChild(divAlternativa);
    });
    div.appendChild(listaAlternativas);

    let botoes = document.createElement('div');
    dataQuestion.appendChild(botoes);

    let buttonPrevious = document.createElement('div');
    botoes.appendChild(buttonPrevious);
    botoes.classList.add('botoes');

    let spanPrevious = document.createElement('div');
    spanPrevious.textContent = 'chevron_left';
    spanPrevious.classList.add('material-symbols-outlined');
    buttonPrevious.appendChild(spanPrevious);

    buttonPrevious.classList.add('previous');
    buttonPrevious.addEventListener('click', function() {
        if (indicePerguntaAtual > 0) {
            previousQuestion();
        }
    });

    let customQuestion = document.createElement('input');
    customQuestion.type = 'text';
    customQuestion.placeholder = 'N°';
    botoes.appendChild(customQuestion);
    customQuestion.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            let numero = parseInt(customQuestion.value);
            if (numero > 0 && numero <= perguntas.length) {
                indicePerguntaAtual = numero - 1;
                atualizarPergunta(perguntas[indicePerguntaAtual]);
            } else {
                console.error('Número de pergunta inválido');
            }
        }
    });

    let buttonNext = document.createElement('div');
    botoes.appendChild(buttonNext);
    buttonNext.classList.add('next');

    let spanNext = document.createElement('div');
    spanNext.textContent = 'chevron_right';
    spanNext.classList.add('material-symbols-outlined');
    buttonNext.appendChild(spanNext);

    buttonNext.addEventListener('click', function() {
        if (selectedOption !== null) {
            respostasDoUsuario[indicePerguntaAtual] = parseInt(selectedOption.dataset.value);
            nextQuestion(respostasDoUsuario[indicePerguntaAtual]);
        }
    });

    mainElement.appendChild(div);
}

function exibirGabarito(resultados) {
    alert('Você acabou!');
    let gabarito = document.createElement('div');
    gabarito.classList.add('main-div');
    gabarito.classList.add('gabarito');

    let legendaGabarito = document.createElement('div');
    legendaGabarito.classList.add('legenda-gabarito');
    legendaGabarito.classList.add('main-div');
    legendaGabarito.innerHTML = 'Gabarito';
    mainElement.appendChild(legendaGabarito);

    resultados.forEach((resultado, index) => {
        let divLinha = document.createElement('div');
        divLinha.classList.add('linha');
        divLinha.classList.add('border');

        let divNumero = document.createElement('div');
        divNumero.innerHTML = `Questão ${index + 1}`;
        divLinha.appendChild(divNumero);

        let divPergunta = document.createElement('div');
        divPergunta.innerHTML = perguntas[index]['Descrição'];
        divLinha.appendChild(divPergunta);

        let divRespostaUsuario = document.createElement('div');
        divRespostaUsuario.classList.add('resposta-usuario');
        divRespostaUsuario.innerHTML = "Marcada: " + (respostasDoUsuario[index] !== undefined ? perguntas[index]['Alternativas'][respostasDoUsuario[index]] : 'Não respondido');
        divLinha.appendChild(divRespostaUsuario);

        if (resultado.correta) {
            divRespostaUsuario.classList.add('acertou');
        } else {
            divRespostaUsuario.classList.add('errou');
        }

        let divRespostaCorreta = document.createElement('div');
        divRespostaCorreta.classList.add('resposta-correta');
        divRespostaCorreta.innerHTML = "Resposta: " + perguntas[index]['Alternativas'][resultado.respostaCorreta];
        divLinha.appendChild(divRespostaCorreta);

        gabarito.appendChild(divLinha);

        if (divLinha.textContent.includes('\\')) {
            MathJax.typesetPromise([divLinha]);
        }
    });

    mainElement.appendChild(gabarito);
}
