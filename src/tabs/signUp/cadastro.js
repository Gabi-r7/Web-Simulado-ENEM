const divsError = document.querySelectorAll('.divsError');

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
    if (responseJson.status === 'success') {
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/home/index.html';
        }, 700);
    }
    else {
        divsError.forEach(divError => {
            divError.innerHTML = '';
        });

        if(responseJson.message == 'Usuário já existe'){
            divsError[0].innerHTML = responseJson.message;
        }
        else if(responseJson.message == 'Email já existe'){
            divsError[1].innerHTML = responseJson.message;
        }
        else if(responseJson.message == 'Emails não coincidem'){
            divsError[2].innerHTML = responseJson.message;
        }
        else if(responseJson.message == 'Senha deve ter no mínimo 6 caracteres'){
            divsError[3].innerHTML = responseJson.message;
        }
        else if(responseJson.message == 'Senhas não coincidem'){
            divsError[4].innerHTML = responseJson.message;
        }
        else{
            showModal(responseJson);
        }
        
    }
});