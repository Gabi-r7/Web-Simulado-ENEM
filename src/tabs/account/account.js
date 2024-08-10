async function fetchUserProfile() {
    const response = await fetch('/profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const responseJson = await response.json();
    if (responseJson.status === 'success') {
        const user = responseJson.data;
        document.getElementById('login').innerText = user.login;
        document.getElementById('email').innerText = user.email;
        document.getElementById('password').innerText = user.password;
        document.getElementById('profileImg').src = user.profileImage;
    } else {
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/login/login.html';
        }, 700);
    }
};


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


    const response = await fetch('/modify', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const responseJson = await response.json();


    showModal(responseJson);
         
}

document.addEventListener('DOMContentLoaded', fetchUserProfile);