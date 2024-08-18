// Função para fazer a requisição ao backend
document.addEventListener('DOMContentLoaded', getUsers);
let responseJson = {};
async function getUsers() {
    const response = await fetch('/getUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    responseJson = await response.json();
    console.log(responseJson);
    if (responseJson.status != 'error') {
        sortUser();
    }
    else {
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/login/login.html';
        }, 700);
    }
};
let filter = document.getElementById('filtro');
filter.addEventListener('input', () => {
    sortUser();
});
function sortUser() {
    let filterOp;

    if (filter.value == 'Acertos') {
        responseJson.users.sort((a, b) => b.correct_answers - a.correct_answers);
        filterOp = 'Acertos';
    }
    else if (filter.value == 'Erros') {
        responseJson.users.sort((a, b) => b.wrong_answers - a.wrong_answers);
        filterOp = 'Erros';
    }
    else if (filter.value == 'Respondidas') {
        responseJson.users.sort((a, b) => (b.correct_answers + b.wrong_answers) - (a.correct_answers + a.wrong_answers));
        filterOp = 'Respondidas';
    }
    else {
        responseJson.users.sort((a, b) => b.experience - a.experience);
        filterOp = 'Experiência';
    }

    let rankingList = document.getElementById('ranking-list');
    let rows = rankingList.querySelectorAll('.linha:not(:first-child)');

    rows.forEach(row => row.remove());

    responseJson.users.forEach((user, index) => {
        let userElement = document.createElement('div');
        userElement.classList.add('linha');
        userElement.classList.add('border');

        if(index % 2 == 0) {
            userElement.classList.add('par');
        }
        if(responseJson.users.length - 1 == index) {
            userElement.classList.remove('border');
        }

        userElement.innerHTML = `
        <div class="position coluna">${index + 1}</div>
        <div class="name coluna">${user.login}</div>
        <div class="experience coluna">${user.experience}</div>
        <div class="correct-answers coluna">${user.correct_answers}</div>
        <div class="wrong-answers coluna">${user.wrong_answers}</div>
        <div class="answered-questions coluna border-right">${user.correct_answers + user.wrong_answers}</div>
        `;
        
        
        rankingList.appendChild(userElement);
    });

    const filterText = document.getElementById('filter-text');
    filterText.innerHTML = 'Filtrando por ';
    
    const legendas = document.querySelectorAll('.legendas');
    legendas.forEach((legenda, index) => {
        legenda.classList.remove('selected');
        legenda.classList.remove('border-right');

        if(index == legendas.length - 1) {
            legenda.classList.add('border-right');
        }
    });

    if (filterOp == 'Acertos') {
        let legenda = document.querySelector('.correct-answers.legendas');
        afterLegenda = legenda.previousElementSibling;
        afterLegenda.classList.add('border-right');

        filterText.innerHTML += 'acertos';

        correct_answers = document.querySelectorAll('.correct-answers');
        correct_answers.forEach(correct_answer => {
            // correct_answer.style.backgroundColor = 'yellowgreen';
            correct_answer.classList.add('selected');
        });
        
    }
    else if (filterOp == 'Erros') {
        let legenda = document.querySelector('.wrong-answers.legendas');
        afterLegenda = legenda.previousElementSibling;
        afterLegenda.classList.add('border-right');

        filterText.innerHTML += 'erros';

        wrong_answers = document.querySelectorAll('.wrong-answers');
        wrong_answers.forEach(wrong_answer => {
            // wrong_answer.style.backgroundColor = 'red';
            wrong_answer.classList.add('selected');
        });
        
    }
    else if (filterOp == 'Respondidas') {
        let legenda = document.querySelector('.answered-questions.legendas');
        afterLegenda = legenda.previousElementSibling;
        afterLegenda.classList.add('border-right');

        filterText.innerHTML += 'respondidas';

        answered_questions = document.querySelectorAll('.answered-questions');
        answered_questions.forEach(answered_question => {
            // answered_question.style.backgroundColor = 'rgb(71, 71, 255)';
            answered_question.classList.add('selected');
        });
    }
    else {
        let legenda = document.querySelector('.experience.legendas');
        afterLegenda = legenda.previousElementSibling;
        afterLegenda.classList.add('border-right');

        filterText.innerHTML += 'experiência';

        experience = document.querySelectorAll('.experience');
        experience.forEach(experience => {
            // experience.style.backgroundColor = 'orange';
            experience.classList.add('selected');
        });
    }
};