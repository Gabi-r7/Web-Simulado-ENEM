let tipo = []; // Declaração no escopo global
let ano = [];
let conc = '';

let perguntas = null;
let indicePerguntaAtual = 0;

let respostasDoUsuario = [];
let mainElement = document.querySelector('main');


console.log('Página carregada');
const urlParams = new URLSearchParams(window.location.search);
ano = urlParams.get('ano');
console.log('ano:', ano);
if (ano) {
    console.log('ano existe');
    tipo = ['Linguagens', 'Matematica', 'Ciencias', 'Humanas', 'Ingles', 'Espanhol'];
    carregarPerguntas(ano, tipo);
}


// function todas() {
//     let checkboxes = document.querySelectorAll('.checkbox-custom');
//     const selecionados = Array.from(checkboxes).filter(checkbox => checkbox.checked);
//     if (selecionados.length === checkboxes.length-1) {
//         checkboxes.forEach(checkbox => checkbox.checked = false);
//     } else {
//         checkboxes.forEach(checkbox => checkbox.checked = true);
//     }
// }
function todas() {
    tipo = [];

    let checkboxes = document.querySelectorAll('.checkbox-custom');
    const selecionados = Array.from(checkboxes).filter(checkbox => checkbox.checked);
    
    // Se todos os checkboxes, exceto um, estiverem selecionados, desmarque todos, exceto os anos, "aleatorio" e "todas" selecionados
    if (selecionados.length === checkboxes.length - 1) {
        checkboxes.forEach(checkbox => {
            if (!checkbox.classList.contains('ano') && !checkbox.classList.contains('aleatorio') && !checkbox.classList.contains('todas')) {
                checkbox.checked = false;
            }
        });
    } else {
        // Caso contrário, marque todos os checkboxes, exceto os anos, "aleatorio" e "todas" que não foram selecionados
        checkboxes.forEach(checkbox => {
            if ((!checkbox.classList.contains('ano') && !checkbox.classList.contains('aleatorio') && !checkbox.classList.contains('todas')) || checkbox.checked) {
                checkbox.checked = true;
            }
        });
    }

    // Garantir que a modalidade "todas" nunca seja marcada
    checkboxes.forEach(checkbox => {
        if (checkbox.classList.contains('todas')) {
            checkbox.checked = false;
        }
    });

    // Atualiza o link com todas as categorias, excluindo "aleatorio" se não estiver selecionado
    tipo = Array.from(checkboxes).map(checkbox => {
        const match = checkbox.getAttribute('onclick') ? checkbox.getAttribute('onclick').match(/\('(.*)'\)/) : null;
        return match && (checkbox.checked || match[1] !== 'aleatorio') ? match[1] : null;
    }).filter(Boolean); // Remove valores nulos ou undefined do array resultante

    console.log(ano, tipo);
}

function updateLink(categoria) {
    console.log('categoria:', categoria);
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

    console.log(ano, tipo);
    carregarPerguntas(ano, tipo);
}

// Função para verificar o tamanho da janela e comparar com o tamanho do nav
function verificarTamanhoJanelaENav() {
    // Obter a largura da janela
    const larguraJanela = window.innerWidth;

    const dataQuestion2 = document.querySelector('.data-question');

    // Obter a largura máxima da janela
    const larguraMaximaJanela = screen.availWidth;

    if(dataQuestion2){

        if (larguraJanela < larguraMaximaJanela * 0.7) {
            dataQuestion2.classList.add('nav-hidden');
    
        } else {
            dataQuestion2.classList.remove('nav-hidden');
        }
    }
}

async function carregarPerguntas(ano, tipo) {
    const response = await fetch('/loadQuestions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ano, tipo })
    });
    const responseJson = await response.json();
    console.log(response);
    if (response.status === 200) {
        mainElement.innerHTML = '';
        perguntas = responseJson['questionList'];
        atualizarPergunta();
    }
    else {
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/login/login.html';
        }, 700);
    }
}

async function atualizarPergunta() {

    verificarTamanhoJanelaENav();
    
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

    // const dataQuestionWidth = dataQuestion.offsetWidth;
    const dataQuestionHeight = dataQuestion.offsetHeight;
    mainElement.style.marginTop = `calc(${dataQuestionHeight}px + 1rem)`;
    
    dataQuestion.classList.add('data-question'); //class
    dataQuestion.classList.add('main-div'); //class
    numeroPerguntaElement.classList.add('numero-pergunta'); //class
    
    // export const dataQuestionSize = dataQuestion.getBoundingClientRect();

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
    
    dataQuestion.appendChild(div);

    // Função para obter o valor da fonte raiz em pixels
    function getRootFontSize() {
        return parseFloat(getComputedStyle(document.documentElement).fontSize);
    }

    // Função para converter rem para pixels
    function remToPixels(rem) {
        const rootFontSize = getRootFontSize();
        return rem * rootFontSize;
    }

    let remValue = 5.5; // valor em rem
    let pixelValue = remToPixels(remValue);
    
    // Função para observar a div
    function observeDiv(targetDiv) {
        // Callback executada quando a interseção muda
        const callback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    console.log('A div está visível na viewport.');
                    dataQuestion.classList.remove('beforeScroll'); //class

                } else {
                    console.log('A div não está visível na viewport.');
                    dataQuestion.classList.add('beforeScroll'); //class
                }
            });
        };
        
        // Cria uma instância de IntersectionObserver
        const observer = new IntersectionObserver(callback, {
            root: null, // Observa a viewport
            threshold: 0 // Chama o callback assim que qualquer parte da div estiver visível
        });

        // Começa a observar a div
        observer.observe(targetDiv);
    }

    // Adicione o código para observar a div
    observeDiv(dataQuestion);

    function checkScroll() {
        const scrollPosition = window.scrollY || window.pageYOffset;        
    
        if (scrollPosition > (dataQuestionHeight - pixelValue)) {
            console.log('A página foi rolada mais do que o tamanho da div dataQuestion.');
            dataQuestion.classList.add('beforeScroll') //class
        }
        else {
            dataQuestion.classList.remove('beforeScroll') //class
        }
    }
    
    // Adiciona o evento de rolagem
    window.addEventListener('scroll', checkScroll);

    // ------------------------
    
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
    mainElement.style.marginTop = '0';
    
    console.log('respostasDoUsuario:', respostasDoUsuario);
    fetch('/checkAnswers', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ respostasDoUsuario, perguntas })
    });

    let gabarito = document.createElement('div');
    gabarito.classList.add('main-div'); // Class
    gabarito.classList.add('gabarito'); // Class

    let legendaGabarito = document.createElement('div');
    legendaGabarito.classList.add('legenda-gabarito'); // Class
    legendaGabarito.classList.add('main-div'); // Class
    legendaGabarito.innerHTML = 'Gabarito';
    mainElement.appendChild(legendaGabarito);       

    let legendaAcertos = document.createElement('div');
    legendaAcertos.classList.add('legenda-acertos'); // Class
    legendaAcertos.classList.add('main-div'); // Class
    legendaAcertos.innerHTML = 'Resultado: ' + respostasDoUsuario.filter((resposta, index) => resposta === perguntas[index]['Resposta']).length + '/' + perguntas.length;
    mainElement.appendChild(legendaAcertos);

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

// Chamar a função para verificar o tamanho da janela e do nav
verificarTamanhoJanelaENav();

// Adicionar um event listener para verificar o tamanho da janela ao redimensionar
window.addEventListener('resize', verificarTamanhoJanelaENav);