let tipo = []; // Declaração no escopo global
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
    console.log(ano,tipo);
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

    conc += tipo.join(',');
    conc += '&ano=' + ano;  
    console.log(conc);

    console.log(ano, tipo);
    carregarPerguntas(ano, tipo);
}

async function carregarPerguntas(ano, tipo) {
    // fetch('/src/assets/json/arrayPerguntas.json')
    //     .then(response => response.json())
    //     .then(data => {
    //         perguntas = [];
    //         for (let ano of anos) {
    //             for (let tipo of tipos) {
    //                 if (data[ano] && data[ano][tipo]) {
    //                     perguntas = perguntas.concat(...Object.values(data[ano][tipo]));
    //                 }
    //             }
    //         }
    //         if (tipo.includes('aleatorio')) {
    //             embaralharArray(perguntas);
    //         }
    //         atualizarPergunta();
    //     })
    //     .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
    mainElement.innerHTML = '';
    const response = await fetch('/loadQuestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ano, tipo })
    });
    const data = await response.json();
    perguntas = data['questionList'];
    console.log(perguntas);
    atualizarPergunta();
}

async function atualizarPergunta() {
    
    let pergunta = perguntas[indicePerguntaAtual];
    console.log(perguntas);
    let perguntaTtl = pergunta['Descrição'];
    let descricaoAuxiliar = pergunta['DescriçãoAuxiliar'];
    let imagemAuxiliar = pergunta['ImagemAuxiliar'];
    let alternativas = pergunta['Alternativas'];
    
    // Inserir no HTML ---------------------------------------------------------------------
    let dataQuestion = document.createElement('div');
    let div = document.createElement('div');
    let h3 = document.createElement('div');
    let numeroPergunta = indicePerguntaAtual + 1; // Adicionamos 1 porque os índices começam em 0
    let numeroPerguntaElement = document.createElement('h2');
    
    
    numeroPerguntaElement.textContent = `Questão ${numeroPergunta} / ${perguntas.length}`;
    
    mainElement.appendChild(dataQuestion);
    dataQuestion.appendChild(numeroPerguntaElement);
    
    dataQuestion.classList.add('data-question'); //class
    dataQuestion.classList.add('main-div'); //class
    numeroPerguntaElement.classList.add('numero-pergunta'); //class

    if (descricaoAuxiliar) {
        let p = document.createElement('p');
        p.innerHTML = descricaoAuxiliar;
        div.appendChild(p);
        p.classList.add('descricaoAuxiliar'); //class
        p.classList.add('border'); //class
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
    
    h3.innerHTML = perguntaTtl;
    div.appendChild(h3);
    div.classList.add('questao'); //class
    div.classList.add('main-div') //class
    h3.classList.add('pergunta'); //class
    h3.classList.add('border'); //class

    let listaAlternativas = document.createElement('div');
    listaAlternativas.classList.add('alternativas'); //class
    let selectedOption = null;

alternativas.forEach((alternativa, index) => {
    let divAlternativa = document.createElement('div');
    let divTextoAlternativa = document.createElement('div');
    divAlternativa.classList.add('alternativa'); //class
    divAlternativa.dataset.value = index; // Armazenar o índice como um atributo de dados
    divTextoAlternativa.innerHTML = alternativa;
    divAlternativa.appendChild(divTextoAlternativa);

    if(divTextoAlternativa.textContent.includes('\\')) {
        MathJax.typesetPromise([divAlternativa]);
        console.log('Inclui sabosta');
    }

    // Adicionar um ouvinte de evento 'click' à div
    divAlternativa.addEventListener('click', function() {
        if (selectedOption == this) {
            selectedOption.classList.remove('selecionada');
            selectedOption = null;
        }
        else {
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
    
    // Botões de navegação
    
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
            perguntaAnterior();
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
                console.log(respostasDoUsuario);
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
        console.log('indicePerguntaAtual:', indicePerguntaAtual);
        if (indicePerguntaAtual + 1 <= perguntas.length - 1) {
            if (selectedOption !== null) {
                respostasDoUsuario[indicePerguntaAtual] = parseInt(selectedOption.dataset.value);
                console.log('selecionada: ', selectedOption.dataset.value);
                console.log(respostasDoUsuario);
            }
            mainElement.innerHTML = '';
            proximaPergunta();
        }
    });

    //buttonFinish

    let buttonFinish = document.createElement('div');
    botoes.appendChild(buttonFinish);
    buttonFinish.classList.add('finish'); //class

    let spanFinish = document.createElement('div');
    spanFinish.textContent = 'Terminar';
    buttonFinish.appendChild(spanFinish);

    buttonFinish.addEventListener('click', function() {
        if (selectedOption !== null) {
            respostasDoUsuario[indicePerguntaAtual] = parseInt(selectedOption.dataset.value);
        }
        terminar();
    });
    
    mainElement.appendChild(div);
}

function proximaPergunta() {
    mainElement.innerHTML = '';
    indicePerguntaAtual++;
    atualizarPergunta();
}

function perguntaAnterior() {
    indicePerguntaAtual--;
    atualizarPergunta();
}

function terminar () {
    mainElement.innerHTML = '';
    
    console.log('respostasDoUsuario:', respostasDoUsuario);
    fetch('/checkAnswers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ respostasDoUsuario, perguntas })
    });

    alert('Você acabou!');
    let gabarito = document.createElement('div');
    gabarito.classList.add('main-div'); // Class
    gabarito.classList.add('gabarito'); // Class

    let legendaGabarito = document.createElement('div');
    legendaGabarito.classList.add('legenda-gabarito'); // Class
    legendaGabarito.classList.add('main-div'); // Class
    legendaGabarito.innerHTML = 'Gabarito';
    mainElement.appendChild(legendaGabarito);        

    perguntas.forEach((pergunta, index) => {
        let divLinha = document.createElement('div');
        divLinha.classList.add('linha'); // Class
        divLinha.classList.add('border'); // Class

        // Criar div para número da pergunta
        let divNumero = document.createElement('div');
        divNumero.innerHTML = `Questão ${index + 1}`;
        divLinha.appendChild(divNumero);

        // Criar div para a descrição da pergunta
        let divPergunta = document.createElement('div');
        divPergunta.innerHTML = pergunta['Descrição'];
        divLinha.appendChild(divPergunta);

        // Criar div para a resposta do usuário
        let divRespostaUsuario = document.createElement('div');
        divRespostaUsuario.classList.add('resposta-usuario'); // Class
        divRespostaUsuario.innerHTML = "Marcada: " + (respostasDoUsuario[index] !== undefined ? pergunta['Alternativas'][respostasDoUsuario[index]] : 'Não respondido');
        divLinha.appendChild(divRespostaUsuario);
        
        if(pergunta['Alternativas'][respostasDoUsuario[index]] === pergunta['Alternativas'][pergunta['Resposta']]){
            divRespostaUsuario.classList.add('acertou'); // Class
        }
        else{
            divRespostaUsuario.classList.add('errou'); // Class
        }
        
        // Criar div para a resposta correta
        let divRespostaCorreta = document.createElement('div');
        divRespostaCorreta.classList.add('resposta-correta'); // Class
        divRespostaCorreta.innerHTML = "Resposta: " + (pergunta['Alternativas'][pergunta['Resposta']]);
        divLinha.appendChild(divRespostaCorreta);

        // Adiciona a linha à div principal
        gabarito.appendChild(divLinha);

        // Se a linha contém '\', processa com MathJax
        if (divLinha.textContent.includes('\\')) {
            MathJax.typesetPromise([divLinha]);
            console.log('Inclui sabosta');
        }


    });

    // Adiciona a div principal ao elemento principal na página
    mainElement.appendChild(gabarito);
    console.log('respostasDoUsuario:', respostasDoUsuario);
    return;
}