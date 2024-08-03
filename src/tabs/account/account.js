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
            document.getElementById('profileImg').src = user.profileImage;
        } else {
            alert(result.message);
            window.location.href = '/src/tabs/login/login.html';
        }
    } catch (error) {
        alert(error.message);
        window.location.href = '/src/tabs/login/login.html';
    }
}


async function modifyUserProfile(field, value) {
    const login = document.getElementById('login').innerText;
    const email = document.getElementById('email').innerText;
    const password = document.getElementById('password').innerText;
    const profileImage = document.getElementById('profileImg').src;

    const data = {
        login,
        email,
        password,
        profileImage
    };

    // Update the specified field with the new value
    data[field] = value;

    try {
        const response = await fetch('/modify', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro ao modificar dados do perfil');
        }

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        alert(error.message);
    }
}

document.addEventListener('DOMContentLoaded', fetchUserProfile);