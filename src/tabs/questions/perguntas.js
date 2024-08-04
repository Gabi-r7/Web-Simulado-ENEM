let respostasDoUsuario = [];
let sessionId = generateSessionId();
let mainElement = document.querySelector('main');
console.log('Página carregada');

let params = new URLSearchParams(window.location.search);
let ano = params.get('ano') ? params.get('ano').split(',') : ['2023'];
let tipo = params.get('tipo') ? params.get('tipo').split(',') : ['Ingles'];
console.log(ano, tipo);

startQuiz(ano, tipo);

function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

let indicePerguntaAtual = 0;
let perguntas = [];
let totalPerguntas = 0;
let arrayPerguntas = [];

async function startQuiz(ano, tipo) {
    console.log('ano:', ano, 'tipo:', tipo);
    try {
        const response = await fetch('/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId, ano, tipo })
        });
        const data = await response.json();
        perguntas = data.question;
        totalPerguntas = data.length;
        arrayPerguntas.push(perguntas);
        atualizarPergunta(perguntas);
    } catch (error) {
        console.error('Erro ao iniciar o quiz:', error);
    }
}


function atualizarPergunta(pergunta) {
    mainElement.innerHTML = '';
    
    let perguntaTtl = pergunta['Descrição'];
    let descricaoAuxiliar = pergunta['DescriçãoAuxiliar'];
    let imagemAuxiliar = pergunta['ImagemAuxiliar'];
    let alternativas = pergunta['Alternativas'];

    let dataQuestion = document.createElement('div');
    let div = document.createElement('div');
    let h3 = document.createElement('div');
    let numeroPerguntaElement = document.createElement('h2');

    console.log(indicePerguntaAtual);
    numeroPerguntaElement.textContent = `Questão ${indicePerguntaAtual + 1} / ${totalPerguntas}`;

    mainElement.appendChild(dataQuestion);
    dataQuestion.appendChild(numeroPerguntaElement);

    dataQuestion.classList.add('data-question');
    dataQuestion.classList.add('main-div');
    numeroPerguntaElement.classList.add('numero-pergunta');

    if (descricaoAuxiliar) {
        let p = document.createElement('p');
        p.innerHTML = descricaoAuxiliar;
        p.classList.add('descricao-auxiliar');
        p.classList.add('border');
        div.appendChild(p);
    }

    if (imagemAuxiliar) {
        let img = document.createElement('img');
        let divImgAux = document.createElement('div');
        img.src = imagemAuxiliar;
        div.appendChild(divImgAux);
        divImgAux.appendChild(img);
        divImgAux.classList.add('imagemAuxiliar'); //class
        divImgAux.classList.add('border'); //class
    }

    h3.textContent = perguntaTtl;
    div.appendChild(h3);
    div.classList.add('main-div');
    div.classList.add('questao');
    h3.classList.add('border');
    h3.classList.add('pergunta');

    let listaAlternativas = document.createElement('div');
    listaAlternativas.classList.add('alternativas'); //class
    let selectedOption = null;

    alternativas.forEach((alternativa, index) => {
        let divAlternativa = document.createElement('div');
        let divTextoAlternativa = document.createElement('div');
        divAlternativa.classList.add('alternativa');
        divAlternativa.dataset.value = index; // Armazenar o índice como um atributo de dados
        divTextoAlternativa.innerHTML = alternativa;
        divAlternativa.appendChild(divTextoAlternativa);

       

        if (divTextoAlternativa.textContent.includes('\\')) {
            MathJax.typesetPromise([divAlternativa]);
            console.log('Inclui sabosta');
        }

        // Adicionar um ouvinte de evento 'click' à div
        divAlternativa.addEventListener('click', function () {
            if (selectedOption == this) {
                selectedOption.classList.remove('selecionada');
                selectedOption = null;
            } else {
                if (selectedOption) {
                    selectedOption.classList.remove('selecionada'); //parei aqui (ainda não funciona responder)
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

    //buttonPrevious

    let buttonPrevious = document.createElement('div');
    botoes.appendChild(buttonPrevious);
    botoes.classList.add('botoes'); //class

    let spanPrevious = document.createElement('div');
    spanPrevious.textContent = 'chevron_left';
    spanPrevious.classList.add('material-symbols-outlined'); //class
    buttonPrevious.appendChild(spanPrevious);

    
    buttonPrevious.classList.add('previous'); //class
    buttonPrevious.addEventListener('click', function() {
        if (indicePerguntaAtual > 0) {
            if(selectedOption !== null) {
                respostasDoUsuario[indicePerguntaAtual] = parseInt(selectedOption.dataset.value);
                console.log(respostasDoUsuario);
            }
            mainElement.innerHTML = '';
            previousQuestion();
        }
    });


    let customQuestion = document.createElement('input');
    customQuestion.type = 'text';
    customQuestion.placeholder = 'N°';
    botoes.appendChild(customQuestion);
    customQuestion.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            if(selectedOption !== null) {
                respostasDoUsuario[indicePerguntaAtual] = parseInt(selectedOption.dataset.value);
            }
            let numero = parseInt(customQuestion.value);
            if (numero > 0 && numero <= perguntas.length) {
                indicePerguntaAtual = numero - 1;
                mainElement.innerHTML = '';
                atualizarPergunta();
            } else {
                console.error('Número de pergunta inválido');
            }
        }
    });
            
    //buttonNext

    let buttonNext = document.createElement('div');
    botoes.appendChild(buttonNext);
    buttonNext.classList.add('next'); //class

    let spanNext = document.createElement('div');
    spanNext.textContent = 'chevron_right';
    spanNext.classList.add('material-symbols-outlined'); //class
    buttonNext.appendChild(spanNext);
    
    buttonNext.addEventListener('click', function() {
        if (selectedOption !== null) {
            respostasDoUsuario[indicePerguntaAtual] = parseInt(selectedOption.dataset.value);
            console.log(selectedOption.dataset.value);
        }
        nextQuestion();
    });
    
    mainElement.appendChild(div);
}

async function nextQuestion(resposta) {
    try {
        const response = await fetch('/next', {
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
            indicePerguntaAtual++;
            arrayPerguntas.push(data.pergunta);
            atualizarPergunta(data.pergunta);
        }
    } catch (error) {
        console.error('Erro ao obter a próxima pergunta:', error);
    }
}

async function previousQuestion() {
    try {
        const response = await fetch('/previous', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sessionId })
        });
        const data = await response.json();
        arrayPerguntas.pop();
        indicePerguntaAtual--;
        atualizarPergunta(data.pergunta);
    } catch (error) {
        console.error('Erro ao obter a pergunta anterior:', error);
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

function exibirGabarito(resultados) {
    mainElement.innerHTML = '';

    // Todas as perguntas foram respondidas
    alert('Você acabou!');
    let gabarito = document.createElement('div');
    gabarito.classList.add('main-div'); // Class
    gabarito.classList.add('gabarito'); // Class

    let legendaGabarito = document.createElement('div');
    legendaGabarito.classList.add('legenda-gabarito'); // Class
    legendaGabarito.classList.add('main-div'); // Class
    legendaGabarito.innerHTML = 'Gabarito';
    mainElement.appendChild(legendaGabarito);

    for (let i = 0; i < resultados.length; i++) {
        let pergunta = arrayPerguntas[i];
        let divLinha = document.createElement('div');
        divLinha.classList.add('linha'); // Class
        divLinha.classList.add('border'); // Class

        // Criar div para número da pergunta
        let divNumero = document.createElement('div');
        divNumero.innerHTML = `Questão ${i + 1}`;
        divLinha.appendChild(divNumero);

        // Criar div para a descrição da pergunta
        let divPergunta = document.createElement('div');
        divPergunta.innerHTML = pergunta['Descrição'];
        divLinha.appendChild(divPergunta);

        // Criar div para a resposta do usuário
        let divRespostaUsuario = document.createElement('div');
        divRespostaUsuario.classList.add('resposta-usuario'); // Class
        divRespostaUsuario.innerHTML = "Marcada: " + (respostasDoUsuario[i] !== undefined ? pergunta['Alternativas'][respostasDoUsuario[i]] : 'Não respondido');
        divLinha.appendChild(divRespostaUsuario);

        if (pergunta['Alternativas'][respostasDoUsuario[i]] === pergunta['Alternativas'][resultados[i].respostaCorreta]) {
            divRespostaUsuario.classList.add('acertou'); // Class
        } else {
            divRespostaUsuario.classList.add('errou'); // Class
        }

        // Criar div para a resposta correta
        let divRespostaCorreta = document.createElement('div');
        divRespostaCorreta.classList.add('resposta-correta'); // Class
        divRespostaCorreta.innerHTML = "Resposta: " + (pergunta['Alternativas'][resultados[i].respostaCorreta]); //parei aqui pergunta['Alternativa'][resultados[i][1]]
        divLinha.appendChild(divRespostaCorreta);

        // Adiciona a linha à div principal
        gabarito.appendChild(divLinha);

        // Se a linha contém '\', processa com MathJax
        if (divLinha.textContent.includes('\\')) {
            MathJax.typesetPromise([divLinha]);
            console.log('Inclui sabosta');
        }
    };

    // Adiciona a div principal ao elemento principal na página
    mainElement.appendChild(gabarito);
    console.log(respostasDoUsuario);
    return;
}