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
        document.getElementById('password').innerText = user.password;
        document.getElementById('profileImg').src = user.profileImage;
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