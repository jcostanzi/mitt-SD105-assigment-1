const winnipegTransitApiKey = 'X3DdbTvDFRgZYJp__fkc';
const winnipegTransitApiBaseUrl = 'https://api.winnipegtransit.com/v3';
const streetsApiUrl = '/streets.json';
const stopsApiUrl = '/stops.json';

const searchElement = document.querySelector('form input');
const streetsElement = document.querySelector('.streets');
const displayStreetName = document.querySelector('#street-name');
const stopsElement = document.querySelector('main table tbody');

class UI {
  static generateStreetLinks(streets) {
    streets.forEach(street => {
      const linkElement = document.createElement("a");
      linkElement.innerHTML = `<a href="#" data-street-key="${street.key}">${street.name}</a>`;

      UI.addStreetLinkEventListener(linkElement);

      streetsElement.appendChild(linkElement);
    });
  }

  static generateStopRows(stops) {
    stops.forEach(stop => {
      const rowElement = document.createElement("tr");

      rowElement.innerHTML = `<td>${stop.street.name}</td>
                              <td>${stop['cross-street'].name}</td>
                              <td>${stop.direction}</td>
                              <td></td>
                              <td></td>`;

      stopsElement.insertAdjacentElement('afterbegin', rowElement);
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

  static addStreetLinkEventListener(linkElement) {
    linkElement.addEventListener('click', event => {
      const streetKey = event.target.dataset.streetKey;

      UI.cleanStopsTable();

      fetch(`${winnipegTransitApiBaseUrl}${stopsApiUrl}?street=${streetKey}&api-key=${winnipegTransitApiKey}`)
        .then(response => {
          console.log(response);
          if (response.status == 200) {
            return response.json();
          } else {
            Promise.reject(response.statusText);
          }
        })
        .then(data => {
          UI.generateStopRows(data.stops);
        });
    });
  }

  static cleanStopsTable() {
    displayStreetName.textContent = '';
    stopsElement.innerHTML = '';
  }

  static cleanAllDataContainers() {
    UI.cleanStopsTable();
    streetsElement.innerHTML = '';
  }
}

function search(streetName) {
  if (streetName == '') {
    return;
  }

  UI.cleanAllDataContainers();

  fetch(`${winnipegTransitApiBaseUrl}${streetsApiUrl}?name=${streetName}&usage=long&api-key=${winnipegTransitApiKey}`)
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
  UI.cleanAllDataContainers();
  UI.addSearchEventListener();

  // Only for testing porpuses
  search('kenaston');
}

initialize();