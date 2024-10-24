loginVerify();

const body = document.querySelector('body');

const modal = document.createElement('div'); // Create the 'modal' element
body.appendChild(modal); // Append 'modal' to 'main'
modal.id = 'modal';
modal.style.display = 'none';

const modalModal = document.createElement('div'); // Create the 'modal-modal' element
modal.appendChild(modalModal); // Append 'modalModal' to 'modal'
modalModal.classList.add('modal-modal');

const modalContent = document.createElement('div'); // Create the 'modal-content' element
modalModal.appendChild(modalContent); // Append 'modalContent' to 'modalModal'
modalContent.classList.add('modal-content');
modalContent.classList.add('main-div')


const divH1 = document.createElement('div'); // Create the 'divH1' element
const divH2 = document.createElement('div'); // Create the 'divH2' element
modalContent.appendChild(divH1); // Append 'divH1' to 'modalContent'
modalContent.appendChild(divH2); // Append 'divH2' to 'modalContent'

const h1 = document.createElement('h1'); // Create the 'h1' element
const h2 = document.createElement('h2'); // Create the 'h2' element
divH1.appendChild(h1); // Append 'h1' to 'modalContent'
divH2.appendChild(h2); // Append 'h2' to 'modalContent'

let loginStatus = null; // Variável para armazenar o resultado da verificação de login

async function loginVerify() {
    const response = await fetch('/loginVerify', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });
    
    const responseJson = await response.json();
    loginStatus = responseJson; // Armazena o resultado na variável
    return responseJson; // Retorna o resultado
}

function showModal(responseJson, message) {
    const html = document.querySelector('html');
    let color = 'red';
    if (message !== undefined) {
        h2.innerHTML = message;
    }
    else {
        if (responseJson.status === 'success') {
            color = 'rgb(7, 255, 20)';
        }
        h1.style.color = color;
        h1.innerHTML = responseJson.status;
        h2.innerHTML = responseJson.message;
    }
}

export { loginVerify, loginStatus, showModal };