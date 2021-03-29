// Get the html container element
const htmlContainerElement = document.getElementById('mainContent');

// Modal elements
const modal = document.getElementById('myModal');
const modalContent = document.getElementById('modalContent');

// Request/Response

let httpRequest;
let responseContent;

// Received data storage

let parsed;

const onLoad = () => {
  trendingRequest();

  window.onclick = event => {
    if (event.target == modalContent) {
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
  const limit = '&limit=50';
  const fullURL = baseURL + apiEndpoint + apiKey + limit;
  makeRequest(fullURL);
};

const searchRequest = search => {
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
  httpRequest = new XMLHttpRequest();
  if (!httpRequest) {
    alert("Can't create the request");
    return false;
  }

  httpRequest.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      responseContent = httpRequest.responseText;
      parsed = JSON.parse(responseContent);
      displayContent(parsed);
      console.log(parsed);
    }
  };

  httpRequest.open('GET', fullURL);
  httpRequest.send();

  const displayContent = parsed => {
    let id = 0;
    htmlContainerElement.innerHTML = '';
    for (let key in parsed.data) {
      const img = document.createElement('img');
      const imgSrc = parsed.data[key].images.fixed_width.url;
      img.style.margin = '0.5rem 0.5rem';
      img.src = imgSrc;
      img.id = id;
      img.setAttribute('onclick', 'openModal()');
      htmlContainerElement.appendChild(img);
      id++;
    }
  };
};

const openModal = () => {
  const image = document.createElement('img');
  image.src = parsed.data[event.target.id].images.original.url;
  modalContent.appendChild(image);
  modal.style.display = 'block';
};

const input = document.getElementById('searchInput');
input.addEventListener('keyup', event => {
  if (event.keyCode === 13) {
    const search = event.target.value;
    searchRequest(search);
  }
});

const searchAction = () => {
  const search = event.target.previousSibling.value;
  searchRequest(search);
};
