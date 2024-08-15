// Função para fazer a requisição ao backend
async function getUsers() {
    const response = await fetch('/getUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log(response);
    const responseJson = await response.json();
    console.log(responseJson);
    if (response.status == 200) {
        const users = responseJson.users;
        const ranking = document.getElementById('ranking-list');
        
        users.forEach((user, index) => {
            const userElement = document.createElement('tr');
            userElement.className = 'user';
            userElement.innerHTML = `
                <td class="position">${index + 1}</td>
                <td class="info"><h3>${user.login}</h3></td>
                <td class="score">${user.experience}</td>
            `;
            ranking.appendChild(userElement);
        });
    } else {
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/login/login.html';
        }, 700);
    }
}
document.addEventListener('DOMContentLoaded', getUsers);