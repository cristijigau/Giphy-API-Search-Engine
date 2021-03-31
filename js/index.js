// Get the html container element
const htmlContainerElement = document.getElementById('mainContent');

// Modal elements
const modal = document.getElementById('myModal');
const modalContent = document.getElementById('modalContent');
const input = document.getElementById('searchInput');

// Request/Response

let httpRequest;
let responseContent;

// Received data storage

let parsed;

input.addEventListener('keyup', event => {
  //used destructuring for event.keyCode => event object is destructured and {keyCode} takes it's value.
  if (event.keyCode === 13) {
    const search = event.target.value;
    searchRequest(search);
  }
});

const onLoad = () => {
  trendingRequest();

  window.onclick = ({ target }) => {
    //used destructuring for event.target => event object is destructured and {target} takes it's value.
    if (target == modalContent) {
      modalContent.innerHTML = '';
      modal.style.display = 'none';
    }
  };
};

const trendingRequest = () => {
  // API URL Request data
  const baseURL = 'https://api.giphy.com';
  const apiEndpoint = '/v1/gifs/trending';
  const apiKey = '?api_key=hHGFaUaGZMVAaFuK6GaC5yUk3ceeykET';
  const limit = '&limit=25';
  const fullURL = baseURL + apiEndpoint + apiKey + limit;
  makeRequest(fullURL);
};

const searchRequest = search => {
  //clearing search input field
  input.value = '';

  // API URL Request data
  const baseURL = 'https://api.giphy.com';
  const apiEndpoint = '/v1/gifs/search';
  const apiKey = '?api_key=hHGFaUaGZMVAaFuK6GaC5yUk3ceeykET';
  const apiSearch = '&q=' + search;
  const apiLimit = '&limit=50';
  const fullURL = baseURL + apiEndpoint + apiKey + apiSearch + apiLimit;
  makeRequest(fullURL);
};

const makeRequest = fullURL => {
  httpRequest = new Request(fullURL, { method: 'GET' });

  fetch(httpRequest)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      parsed = data;
      displayContent(parsed);
    })
    .catch(function (err) {
      alert('Something went wrong during request!', err);
    });
};

const displayContent = ({ data }) => {
  //used destructuring for parsed.data => parsed object is destructured and {data} takes it's value.
  let id = 0;
  htmlContainerElement.innerHTML = '';
  for (let key in data) {
    const img = document.createElement('img');
    img.src = data[key]?.images?.original?.url ?? 'images/tenor.gif';
    img.id = id;
    img.setAttribute('onclick', 'openModal(event)');
    htmlContainerElement.appendChild(img);
    id++;
  }
};

const openModal = ({ target: { id } }) => {
  const image = document.createElement('img');
  image.src = parsed?.data[id]?.images?.original?.url ?? 'images/tenor.gif';
  modalContent.appendChild(image);
  modal.style.display = 'block';
};

const searchAction = ({
  target: {
    previousSibling: { value },
  },
}) => {
  //used destructuring
  const search = value;
  searchRequest(search);
};
