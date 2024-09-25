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
        console.log(user);
        document.getElementById('login').innerText = user.login;
        document.getElementById('email').innerText = user.email;
        document.getElementById('profileIamge').src = user.profileImage;
        let correct = parseFloat(user.correct_answers);
        let wrong = parseFloat(user.wrong_answers);
        let total = parseFloat(user.questions_answered);
        generateChart(correct, wrong, total);


    } else {
        showModal(responseJson);
        setTimeout(() => {
            window.location.href = '/src/tabs/login/login.html';
        }, 700);
    }
};

async function modifyUserProfile(field, value) {
  // Update the specified field with the new value
  const data = {
    field,
    value
  };

  const response = await fetch('/modify', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const responseJson = await response.json();
  if (responseJson.status === 'success' && field != 'password') {
    if (field === 'profileImage') {
      document.getElementById('profileIamge').src = value;
    }
    else {
      document.getElementById(field).innerHTML = value;
    }
  }
  showModal(responseJson);
  setTimeout(() => {
    
  }, 700);
}

let btnsTrocar = document.querySelectorAll('.modifyBtn');
btnsTrocar.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const field = e.target.name;
        const value = prompt(`Digite o novo valor para ${field}`);
        if (value) {
            modifyUserProfile(field, value);
        }
    });
});

function openSelectionWindow() {
  const selectWindow = document.querySelector('.selectWindow');

  selectWindow.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', fetchUserProfile);

function generateChart(correct, wrong, total) {
  var options = {
      series: [{
      name: 'Acertos',
      data: [correct],
      color: '#00FF00'
    }, {
      name: 'Erros',
      data: [wrong],
      color: '#FF0000'
    }, {
      name: 'Respostas',
      data: [total],
      color: '#0000FF'
    }],
      chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        endingShape: 'rounded'
      },
    },
    dataLabels: {
      enabled: true
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Estatístias do Usuário'],
    },
    yaxis: {
      title: {
        text: 'Questões'
      }
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val
        }
      }
      
    }
    };

    var chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}