document.getElementById('register-form').addEventListener('submit', async (event) => {
    console.log('entrou');
    event.preventDefault();
    const login = document.getElementById('login').value;
    const email = document.getElementById('email').value;
    const confirmEmail = document.getElementById('confirmEmail').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const profileImage = document.getElementById('profileImage').files[0];
    const data = { login, email, confirmEmail, password, confirmPassword, profileImage };


    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    console.log(response);
    const responseJson = await response.json();
    if (responseJson.status === 'success') {
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/home/index.html';
        }, 700);
    }
    else {
        showModal(responseJson);
    }
});