// Getting DOM elements
const modal = document.getElementById('myModal');
const modalContent = document.getElementById('modalContent');
const input = document.getElementById('searchInput');
const htmlContainerElement = document.getElementById('mainContent');

// Global scope variables

let parsed;
let offset = 0;
const limit = 35; //number of gifs to be displayed at once
const step = limit;
let pageContent = '';
let search = '';

//Functions

const onLoad = () => {
  trendingRequest();
};

const trendingRequest = extend => {
  // API URL Request data
  const baseURL = 'https://api.giphy.com';
  const apiEndpoint = '/v1/gifs/trending';
  const apiKey = '?api_key=hHGFaUaGZMVAaFuK6GaC5yUk3ceeykET';
  const apiLimit = '&limit=' + limit;
  let fullURL = baseURL + apiEndpoint + apiKey + apiLimit;

  pageContent = 'trending';

  if (extend) {
    offset += step;
    fullURL += '&offset=' + offset;

    makeRequest(fullURL, extend);
  } else {
    offset = 0;
    makeRequest(fullURL);
  }
};

const searchRequest = extend => {
  //clearing search input field
  input.value = '';

  // API URL Request data
  const baseURL = 'https://api.giphy.com';
  const apiEndpoint = '/v1/gifs/search';
  const apiKey = '?api_key=hHGFaUaGZMVAaFuK6GaC5yUk3ceeykET';
  const apiSearch = '&q=' + search;
  const apiLimit = '&limit=' + limit;
  let fullURL = baseURL + apiEndpoint + apiKey + apiSearch + apiLimit;

  pageContent = 'search';

  if (extend) {
    offset += step;
    fullURL += '&offset=' + offset;

    makeRequest(fullURL, extend);
  } else {
    offset = 0;
    makeRequest(fullURL);
  }
};

const makeRequest = (fullURL, extend) => {
  const httpRequest = new Request(fullURL, { method: 'GET' });

  fetch(httpRequest)
    .then(response => {
      return response.json();
    })
    .then(data => {
      parsed = data;
      if (extend) addContent(parsed);
      else displayContent(parsed);
    })
    .catch(err => {
      alert('Something went wrong during request!', err);
    });
};

const displayContent = ({ data }) => {
  //used destructuring for parsed.data => parsed object is destructured and {data} takes it's value.
  let id = 0;
  htmlContainerElement.innerHTML = '';
  appendLoop(data, id);
};

const addContent = ({ data }) => {
  let id = offset;
  appendLoop(data, id);
};

const appendLoop = (data, id) => {
  for (let key in data) {
    const img = document.createElement('img');
    img.src = data[key]?.images?.original?.url ?? 'images/tenor.gif';
    img.id = id;
    img.setAttribute('onclick', 'openModal(event)');
    htmlContainerElement.appendChild(img);
    id++;
  }
};

const openModal = ({ target: { id, src } }) => {
  const image = document.createElement('img');
  image.src = src ?? 'images/tenor.gif';
  modalContent.appendChild(image);
  modal.style.display = 'block';
};

const searchAction = ({
  target: {
    previousSibling: { value },
  },
}) => {
  //used destructuring
  search = value;
  searchRequest();
};

const moreContent = () => {
  if (pageContent === 'trending') trendingRequest(true);
  else if (pageContent === 'search') searchRequest(search, true);
};

//Event listeners

input.addEventListener('keyup', event => {
  //used destructuring for event.keyCode => event object is destructured and {keyCode} takes it's value.
  if (event.keyCode === 13) {
    search = event.target.value;
    searchRequest();
  }
});

window.onclick = ({ target }) => {
  //used destructuring for event.target => event object is destructured and {target} takes it's value.
  if (target == modalContent) {
    modalContent.innerHTML = '';
    modal.style.display = 'none';
  }
};

window.addEventListener('scroll', () => {
  if (
    window.scrollY + window.innerHeight + 1 >=
    document.documentElement.scrollHeight
  ) {
    moreContent();
  }
});
