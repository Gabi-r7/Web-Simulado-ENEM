// Função para fazer a requisição ao backend
async function getUsers() {
    const response = await fetch('/getUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const responseJson = await response.json();
    if (responseJson.status === 'success') {
        const users = responseJson.data;
        const ranking = document.getElementById('ranking');
        ranking.innerHTML = '';
        users.forEach((user, index) => {
            const userElement = document.createElement('div');
            userElement.className = 'user';
            userElement.innerHTML = `
                <div class="position">${index + 1}</div>
                <div class="profile">
                    <img src="${user.profileImage}" alt="Profile Image">
                    <div class="info">
                        <h3>${user.login}</h3>
                    </div>
                </div>
                <div class="score">${user.experience}</div>
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