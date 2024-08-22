document.getElementById('login-form').addEventListener('submit', async (event) => {
    console.log('entrou');
    event.preventDefault();
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const data = { login, password };

    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    const responseJson = await response.json();
    if (response.status == 200) {
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/home/index.html';
            // location.reload(); sla q desgraça é essa
        }, 700);
    }
    else {
        showModal(responseJson);
    }
});