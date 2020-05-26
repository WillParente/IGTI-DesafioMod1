let userListTitle = null;
let statisticsTitle = null;
let tabUsers = null;
let tabStatistics = null;
let searchInput = null;
let searchBtn = null;

let users = [];
let filteredUsers = [];

window.addEventListener('load', () => {
  userListTitle = document.getElementById('userListTitle');
  statisticsTitle = document.getElementById('statisticsTitle');
  tabUsers = document.getElementById('tabUsers');
  tabStatistics = document.getElementById('tabStatistics');
  searchInput = document.getElementById('searchInput');
  searchBtn = document.getElementById('searchBtn');

  searchInput.focus();
  fetchUsers();
});

const fetchUsers = async () => {
  //prettier-ignore
  const api_url ='https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo';
  const res = await fetch(api_url);
  const json = await res.json();
  users = json.results.map((user) => {
    const { gender, name, dob, picture } = user;

    return {
      gender: gender,
      firstName: name.first,
      fullName: `${name.first} ${name.last}`,
      age: dob.age,
      picture: picture.thumbnail,
    };
  });

  start();
};

function start() {
  renderBoxTitles();
  handleEnter();
  handleButton();
}

function renderBoxTitles() {
  if (filteredUsers.length === 0) {
    userListTitle.textContent = 'Nenhum usuário filtrado';
    statisticsTitle.textContent = 'Nada a ser exibido';
  } else {
    userListTitle.textContent = `${filteredUsers.length} usuário(s) encontrado(s)`;
    statisticsTitle.textContent = 'Estatística';
  }
}

function handleEnter() {
  searchInput.addEventListener('keypress', (event) => {
    if (event.keyCode == 13 || event.which == 13) {
      event.preventDefault();
    }
  });

  searchInput.addEventListener('keyup', (event) => {
    searchInput.value.length === 0
      ? searchBtn.classList.add('disabled')
      : searchBtn.classList.remove('disabled');
    if (event.keyCode == 13 || event.which == 13) {
      if (searchInput.value.length > 0) {
        event.preventDefault();
        searchBtn.click();
      }
    }
  });
}

function handleButton() {
  searchBtn.addEventListener('click', () => {
    filterUsers();
  });
}

const filterUsers = () => {
  filteredUsers = users.filter((user) => {
    return user.fullName.toLowerCase().indexOf(searchInput.value) !== -1;
  });

  filteredUsers.sort((a, b) => {
    return a.fullName.localeCompare(b.fullName);
  });

  render();
};

function render() {
  renderBoxTitles();
  renderUserList();
  renderStatistics();
}

function renderUserList() {
  let usersHTML = `<div>`;

  filteredUsers.forEach((user) => {
    const { firstName, fullName, age, picture } = user;
    const userHTML = `
    <div class='user'>
      <div>
        <img src="${picture}" alt="${firstName}">
      </div>
      <div>
        ${fullName}, ${age} anos
      </div>
    </div>
    `;

    usersHTML += userHTML;
  });
  usersHTML += `</div>`;
  tabUsers.innerHTML = usersHTML;
}

function renderStatistics() {
  let statisticsHTML = '';
  if (filteredUsers.length > 0) {
    const sumMales = filteredUsers.filter((user) => user.gender === 'male')
      .length;
    const sumFemales = filteredUsers.filter((user) => user.gender === 'female')
      .length;
    const sumAges = filteredUsers.reduce((accumulator, current) => {
      return accumulator + current.age;
    }, 0);
    const averageAge = sumAges / filteredUsers.length;

    statisticsHTML = `
  <div>
    <p>Sexo masculino: ${formatNumber(sumMales)}</p>
    <p>Sexo feminino: ${formatNumber(sumFemales)}</p>
    <p>Soma das idades: ${formatNumber(sumAges)}</p>
    <p>Média das idades: ${formatNumber(averageAge)}</p>
  </div>
  `;
  }

  tabStatistics.innerHTML = statisticsHTML;
}

function formatNumber(number) {
  return Intl.NumberFormat('pt-BR').format(number.toFixed(2));
}
