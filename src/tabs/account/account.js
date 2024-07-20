async function fetchUserProfile() {
    try {
        const response = await fetch('/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erro ao buscar dados do perfil');
        }

        const result = await response.json();
        if (result.status === 'success') {
            const user = result.data;
            document.getElementById('login').innerText = user.login;
            document.getElementById('email').innerText = user.email;
            document.getElementById('password').innerText = user.password;
        } else {
            alert(result.message);
            window.location.href = '/src/tabs/login/login.html';
        }
    } catch (error) {
        alert(error.message);
        window.location.href = '/src/tabs/login/login.html';
    }
}

document.addEventListener('DOMContentLoaded', fetchUserProfile);