// Getting DOM elements
const modal = document.getElementById('myModal');
const modalContent = document.getElementById('modalContent');
const input = document.getElementById('searchInput');
const htmlContainerElement = document.getElementById('mainContent');

// Global scope variables

let parsed;
let offset = 0;
const limit = 35; //number of gifs to be displayed at once
let pageContent = '';
let search = '';

const GIFS_ENDPOINT = 'https://api.giphy.com/v1/gifs/';
const API_KEY = '?api_key=hHGFaUaGZMVAaFuK6GaC5yUk3ceeykET';
const API_LIMIT = '&limit=' + limit;

//Functions

const onLoad = () => {
  trendingRequest();
};

const trendingRequest = extend => {
  // API URL Request data
  pageContent = 'trending';
  let URL = GIFS_ENDPOINT + pageContent + API_KEY + API_LIMIT;
  checkRequest(extend, URL);
};

const searchRequest = extend => {
  //clearing search input field
  input.value = '';

  // API URL Request data
  pageContent = 'search';
  const apiSearch = '&q=' + search;
  let URL = GIFS_ENDPOINT + pageContent + API_KEY + apiSearch + API_LIMIT;
  checkRequest(extend, URL);
};

const checkRequest = (extend, URL) => {
  if (extend) {
    offset += limit;
    URL += '&offset=' + offset;
    makeRequest(URL, extend);
  } else {
    offset = 0;
    URL += '&offset=' + offset;
    makeRequest(URL);
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
  htmlContainerElement.innerHTML = '';
  appendLoop(data);
};

const addContent = ({ data }) => {
  appendLoop(data);
};

const appendLoop = (data) => {
  for (let key in data) {
    const img = document.createElement('img');
    img.src = data[key]?.images?.original?.url ?? 'images/tenor.gif';
    img.setAttribute('onclick', 'openModal(event)');
    htmlContainerElement.appendChild(img);
  }
};

const openModal = ({ target: { src } }) => {
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
