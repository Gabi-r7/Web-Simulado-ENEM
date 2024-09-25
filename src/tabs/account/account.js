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
    
    showModal(responseJson);
    setTimeout(() => {
        window.location.reload();
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
  const imageDiv = document.getElementById('profileImgDiv');

  imageDiv.innerHTML = `
    <style>
      .profileImg {
        cursor: pointer;
        border-radius: 50%;
        margin: 5px;
        transition: transform 0.2s;
      }
      .profileImg:hover {
        transform: scale(1.1);
      }
      #profileImgDiv {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: space-between;
        align-items: center;
      }
      .img-account img {
        width: 5vw;
        height: 5vw;
        border-radius: 50%;
      }
      .img-account > div{
        padding: 50px;
      }
      
    </style>
    <div>
      <img src="/src/assets/profileImages/ftDefault.jpg" alt="Default" class="profileImg" onclick="modifyUserProfile('profileImage', '/src/assets/profileImages/ftDefault.jpg')">
    </div>
    <div>
      <img src="/src/assets/profileImages/ft1.jpg" alt="1" class="profileImg" onclick="modifyUserProfile('profileImage', '/src/assets/profileImages/ft1.jpg')">
    </div>
    <div>  
      <img src="/src/assets/profileImages/ft2.jpg" alt="2" class="profileImg" onclick="modifyUserProfile('profileImage', '/src/assets/profileImages/ft2.jpg')">
    </div>
    <div>
      <img src="/src/assets/profileImages/ft3.jpg" alt="3" class="profileImg" onclick="modifyUserProfile('profileImage', '/src/assets/profileImages/ft3.jpg')">
    </div>
    <div>
      <img src="/src/assets/profileImages/ft4.jpg" alt="4" class="profileImg" onclick="modifyUserProfile('profileImage', '/src/assets/profileImages/ft4.jpg')">
    </div>
    <div>  
      <img src="/src/assets/profileImages/ft5.jpg" alt="5" class="profileImg" onclick="modifyUserProfile('profileImage', '/src/assets/profileImages/ft5.jpg')">
    </div>
    <div>
      <img src="/src/assets/profileImages/ft6.jpg" alt="6" class="profileImg" onclick="modifyUserProfile('profileImage', '/src/assets/profileImages/ft6.jpg')">
    </div>  
    <div>  
      <img src="/src/assets/profileImages/ft7.jpg" alt="7" class="profileImg" onclick="modifyUserProfile('profileImage', '/src/assets/profileImages/ft7.jpg')">
    </div>  
    <div>  
      <img src="/src/assets/profileImages/ft8.jpg" alt="8" class="profileImg" onclick="modifyUserProfile('profileImage', '/src/assets/profileImages/ft8.jpg')">
    </div>  
    <div>  
      <img src="/src/assets/profileImages/ft9.jpg" alt="9" class="profileImg" onclick="modifyUserProfile('profileImage', '/src/assets/profileImages/ft9.jpg')">
    </div>
  `;
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