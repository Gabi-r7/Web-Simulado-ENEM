let respostasDoUsuario = [];
let mainElement = document.querySelector('main');
console.log('Página carregada');


let params = new URLSearchParams(window.location.search);
let ano = params.get('ano').split(',');
let tipo = params.get('tipo').split(',');
let aleatorio = params.get('aleatorio');
console.log(ano, tipo);
carregarPerguntas(ano, tipo);

let perguntas = null;
let indicePerguntaAtual = 0;

function embaralharArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function carregarPerguntas(anos, tipos) {
    fetch('assets/json/arrayPerguntas.json')
        .then(response => response.json())
        .then(data => {
            perguntas = [];
            for (let ano of anos) {
                for (let tipo of tipos) {
                    if (data[ano] && data[ano][tipo]) {
                        perguntas = perguntas.concat(...Object.values(data[ano][tipo]));
                    }
                }
            }
            if (aleatorio) {
                embaralharArray(perguntas);
            }
            atualizarPergunta();
        })
        .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
        
}



function  atualizarPergunta() {
    if (indicePerguntaAtual >= perguntas.length) {
        // Todas as perguntas foram respondidas
        alert('Você acabou!');
        let tabela = document.createElement('table');
        let cabecalho = tabela.createTHead();
        let linhaCabecalho = cabecalho.insertRow();
        linhaCabecalho.insertCell().textContent = 'Pergunta';
        linhaCabecalho.insertCell().textContent = 'Sua Resposta';
        linhaCabecalho.insertCell().textContent = 'Resposta Correta';

        
        perguntas.forEach((pergunta, index) => {
            
            let linha = tabela.insertRow();
            linha.classList.add('linhas'); //class
            linha.insertCell().innerHTML = pergunta['Descrição'];
            linha.insertCell().innerHTML = respostasDoUsuario[index] !== undefined ? pergunta['Alternativas'][respostasDoUsuario[index]] : 'Não respondido';
            linha.insertCell().innerHTML = pergunta['Alternativas'][pergunta['Resposta']];

            if(linha.textContent.includes('\\')) {
                MathJax.typesetPromise([linha]);
                console.log('Inclui sabosta');
            }
        });
        
        mainElement.appendChild(tabela);
        console.log(respostasDoUsuario);
        return;
    }

    let pergunta = perguntas[indicePerguntaAtual];
    let perguntaTtl = pergunta['Descrição'];
    let descricaoAuxiliar = pergunta['DescriçãoAuxiliar'];
    let imagemAuxiliar = pergunta['ImagemAuxiliar'];
    let alternativas = pergunta['Alternativas'];

    // Inserir no HTML ---------------------------------------------------------------------
    let div = document.createElement('div');
    let h3 = document.createElement('div');
    let numeroPergunta = indicePerguntaAtual + 1; // Adicionamos 1 porque os índices começam em 0
    let numeroPerguntaElement = document.createElement('h2');
    
    numeroPerguntaElement.classList.add('numeroPergunta'); //class

    numeroPerguntaElement.textContent = `${numeroPergunta} / ${perguntas.length}`;
    mainElement.appendChild(numeroPerguntaElement);

    if (descricaoAuxiliar) {
        let p = document.createElement('p');
        p.innerHTML = descricaoAuxiliar;
        div.appendChild(p);
        p.classList.add('descricaoAuxiliar'); //class
    }

    if (imagemAuxiliar) {
        let img = document.createElement('img');
        let divImgAux = document.createElement('div');
        img.src = imagemAuxiliar;
        div.appendChild(divImgAux);
        divImgAux.appendChild(img);
        divImgAux.classList.add('imagemAuxiliar'); //class
    }
    
    h3.innerHTML = perguntaTtl;
    div.appendChild(h3);
    div.classList.add('questao'); //class
    h3.classList.add('pergunta'); //class

    let listaAlternativas = document.createElement('div');
    listaAlternativas.classList.add('alternativas'); //class
    let selectedOption = null;

alternativas.forEach((alternativa, index) => {
    let divAlternativa = document.createElement('div');
    let divTextoAlternativa = document.createElement('div');
    let divLedAlternativa = document.createElement('div');
    divAlternativa.classList.add('alternativa'); //class
    divAlternativa.classList.add('tecla'); //class
    divLedAlternativa.classList.add('led'); //class
    divAlternativa.dataset.value = index; // Armazenar o índice como um atributo de dados
    divTextoAlternativa.innerHTML = alternativa;
    divAlternativa.appendChild(divTextoAlternativa);
    divAlternativa.appendChild(divLedAlternativa);

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
    
    // alternativas.forEach((alternativa, index) => {
    //     let label = document.createElement('label');
    //     label.classList.add('alternativa'); //class
    //     let checkbox = document.createElement('input');
    //     checkbox.type = 'checkbox';
    //     checkbox.name = 'alternativa';
    //     checkbox.value = index;
    //     label.appendChild(checkbox);
    //     label.appendChild(document.createElement('p')).innerHTML = alternativa;
        
        
    //     if(label.querySelector('p').textContent.includes('\\')) {
    //         MathJax.typesetPromise([label.querySelector('p')]);
    //         console.log('Inclui sabosta');
    //     }
    
    //     listaAlternativas.appendChild(label);
    // });
    // div.appendChild(listaAlternativas);
    
    let botoes = document.createElement('div');
    mainElement.appendChild(botoes);
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
        proximaPergunta();
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