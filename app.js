const winnipegTransitApiKey = 'X3DdbTvDFRgZYJp__fkc';
const winnipegTransitApiBaseUrl = 'https://api.winnipegtransit.com/v3';
const streetsApiUrl = '/streets.json';

const searchElement = document.querySelector('form input');
const streetsElement = document.querySelector('.streets');
const displayStreetName = document.querySelector('#street-name');
const stopsElement = document.querySelector('main table tbody');

class UI {
  static generateStreetLinks(streets) {
    streets.forEach(street => {
      const linkElement = document.createElement("a");
      linkElement.innerHTML = `<a href="#" data-street-key="${street.key}">${street.name}</a>`;

      streetsElement.appendChild(linkElement);
    });
  }

  static addSearchEventListener() {
    searchElement.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        if (searchElement.value !== '') {
          search(searchElement.value);
        }
      }
    });
  }

  static cleanDataContainers() {
    displayStreetName.textContent = '';
    streetsElement.innerHTML = '';
    stopsElement.innerHTML = '';
  }
}

function search(streetName) {
  if (streetName == '') {
    return;
  }

  UI.cleanDataContainers();

  fetch(`${winnipegTransitApiBaseUrl}${streetsApiUrl}?name=${streetName}&api-key=${winnipegTransitApiKey}`)
    .then(response => {
      console.log(response);
      if (response.status == 200) {
        return response.json();
      } else {
        Promise.reject(response.statusText);
      }
    })
    .then(data => {
      UI.generateStreetLinks(data.streets);
    });
}

function initialize() {
  UI.cleanDataContainers();
  UI.addSearchEventListener();

  // Only for testing porpuses
  search('portage');
}

initialize();