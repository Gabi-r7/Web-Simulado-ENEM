document.getElementById('register-form').addEventListener('submit', async (event) => {
    console.log('entrou');
    event.preventDefault();
    const login = document.getElementById('login').value;
    const email = document.getElementById('email').value;
    const confirmEmail = document.getElementById('confirmEmail').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const data = { login, email, confirmEmail, password, confirmPassword };


    const response = await fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    console.log(response);
    const responseJson = await response.json();
    if (responseJson.ok) {
        alert(responseJson.message);

        //cokkie
        window.location.href = '/src/tabs/home/index.html';
    }
    else {
        alert(responseJson.message);
    }
});