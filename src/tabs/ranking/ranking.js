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
    console.log(response);
    responseJson = await response.json();
    sortUser();
};
let filter = document.getElementById('filtro');
filter.addEventListener('input', () => {
    sortUser();
});
function sortUser() {
    if (filter.value == 'Acertos') {
        responseJson.users.sort((a, b) => b.correct_answers - a.correct_answers);
    }
    else if (filter.value == 'Erros') {
        responseJson.users.sort((a, b) => b.wrong_answers - a.wrong_answers);
    }
    else if (filter.value == 'Respondidas') {
        responseJson.users.sort((a, b) => (b.correct_answers + b.wrong_answers) - (a.correct_answers + a.wrong_answers));
    }
    else {
        responseJson.users.sort((a, b) => b.experience - a.experience);
    }
    let rankingList = document.getElementById('ranking-list');
    let rows = rankingList.querySelectorAll('tr:not(:first-child)');
    rows.forEach(row => row.remove());
    responseJson.users.forEach((user, index) => {
        let userElement = document.createElement('tr');
        userElement.classList.add('linha');
        userElement.classList.add('border');
        if(index % 2 == 0) {
            userElement.classList.add('par');
        }
        userElement.innerHTML = `
            <td class="position">${index + 1}</td>
            <td class="name">${user.login}</td>
            <td class="experience">${user.experience}</td>
            <td class="correct-answers">${user.correct_answers}</td>
            <td class="wrong-answers">${user.wrong_answers}</td>
            <td class="answered-questions">${user.correct_answers + user.wrong_answers}</td>
        `;
        rankingList.appendChild(userElement);
    });
};