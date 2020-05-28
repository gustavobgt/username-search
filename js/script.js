let allUsersList = [];
let filteredUsersList = [];

let filterTitle = null;
let statisticsTitle = null;

let filteredUsers = null;
let userStatistics = null;

let inputSearch = null;
let searchButton = null;

window.addEventListener('load', () => {
  function searchUsers(event) {
    function ableButton(element) {
      element.classList.remove('disabled');
      element.classList.add('waves-effect');
      element.classList.add('waves-light');
    }

    function disableButton(element) {
      element.classList.remove('waves-effect');
      element.classList.remove('waves-light');
      element.classList.add('disabled');
    }

    let hasText = !!event.target.value && event.target.value.trim() !== '';
    if (!hasText) {
      disableButton(searchButton);
      clearInput();

      return;
    }

    ableButton(searchButton);

    filteredUsersList = allUsersList
      .filter((user) => {
        const lowerCaseName = user.name.toLowerCase();
        const lowerCaseInput = event.target.value.toLowerCase();

        return lowerCaseName.includes(lowerCaseInput);
      })
      .sort((a, b) => {
        return a.name.localeCompare(b.name);
      });

    if (event.key === 'Enter') {
      render();
    }
  }

  function insertUsers() {
    render();
  }

  inputSearch = document.querySelector('#search');
  searchButton = document.querySelector('#search-button');

  inputSearch.addEventListener('keyup', searchUsers);
  searchButton.addEventListener('click', insertUsers);

  filterTitle = document.querySelector('#filter-title');
  statisticsTitle = document.querySelector('#statistics-title');

  filteredUsers = document.querySelector('#filtered-users');
  userStatistics = document.querySelector('#users-statistics');

  fetchUsers();
});

async function fetchUsers() {
  preLoader('starting-search');

  // prettier-ignore
  const res = await fetch
  ('https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo');
  const json = await res.json();

  allUsersList = json.results.map((user) => {
    const { name, dob, picture, gender } = user;

    return {
      name: `${name.first} ${name.last}`,
      age: dob.age,
      picture: picture.large,
      gender,
    };
  });

  preLoader('');

  console.log('Users loaded successfully!');

  inputSearch.focus();
}

function preLoader(startOrEnd) {
  const preLoader = document.querySelector('#pre-loader');

  if (startOrEnd === 'starting-search') {
    preLoader.innerHTML = `
  <div class="preloader-wrapper small active">
    <div class="spinner-layer spinner-green-only">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
  `;
    return;
  }

  preLoader.innerHTML = '';
}

function render() {
  renderFilteredUsers();
  renderUsersStatistics();
}

function renderFilteredUsers() {
  filteredUsers.innerHTML = '';
  filterTitle.innerHTML = '';

  filterTitle.textContent = `${filteredUsersList.length} user(s) found`;

  let usersHTML = '<div>';

  filteredUsersList.forEach((user) => {
    const { name, age, picture } = user;

    const userHTML = `
    <div class='user'>
      <div>
        <img src="${picture}" alt ="${name}">
      </div>
      <div>
        <h6>${name}, ${age} years old</h6>
      </div>
    </div>
    `;

    usersHTML += userHTML;
  });

  usersHTML += '</div>';
  filteredUsers.innerHTML = usersHTML;
}

function renderUsersStatistics() {
  userStatistics.innerHTML = '';
  statisticsTitle.innerHTML = '';

  statisticsTitle.textContent = `Statistics`;

  const numberOfMales = filteredUsersList.reduce((accumulator, current) => {
    const total = current.gender === 'male' ? accumulator + 1 : accumulator;
    return total;
  }, 0);

  const numberOfFemales = filteredUsersList.length - numberOfMales;

  const sumOfAges = filteredUsersList.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  const avarageAges =
    sumOfAges > 0 ? (sumOfAges / filteredUsersList.length).toFixed(2) : 0;

  const statisticsHTML = `
  <div>
    <h6><span class="bold">Male(s):</span> ${numberOfMales} people(s)</h6>
    <h6><span class="bold">Female(s):</span> ${numberOfFemales} people(s)</h6>
    <h6><span class="bold">Sum of Ages:</span> ${sumOfAges} years old</h6>
    <h6><span class="bold">Average Ages:</span> ${avarageAges} years old</h6>
  </div>
  `;

  userStatistics.innerHTML = statisticsHTML;
}

const clearInput = () => {
  inputSearch.value = '';
  inputSearch.focus();
};
