// import './css/styles.css';
// import { Notify } from 'notiflix/build/notiflix-notify-aio';

const KEY = '35495478-0f618b27834e323a3a3099cd4';
const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const button = document.querySelector('.submit-button');
const gallery = document.querySelector('.gallery');

function fetchImages(name) {
  return fetch(
    `https://pixabay.com/api/?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}

form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const name = input.value;
  fetchImages(name)
    .then(data => {
      if (data.hits.length === 0) {
        console.log(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        console.log(data.hits);
        insertContent(data.hits);
      }
    })
    .catch(error => console.log(error));
}

function createPhotoCard(item) {
  return `<div class="photo-card">
  <img src='${item.webformatURL}' alt="${item.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${item.downloads}
    </p>
  </div>
</div>`;
}

function generatePhotos(array) {
  return array.reduce((acc, item) => acc + createPhotoCard(item), '');
}

function insertContent(array) {
  const result = generatePhotos(array);
  return (gallery.innerHTML = result);
}

// const DEBOUNCE_DELAY = 300;
// const searchBox = document.querySelector('#search-box');
// const countryList = document.querySelector('.country-list');
// const countryInfo = document.querySelector('.country-info');

// searchBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

// function onInput(event) {
//   event.preventDefault();
//   if (event.target.value === '') {
//     return;
//   } else {
//     fetchCountries(searchBox.value.trim())
//       .then(data => {
//         if (data.length > 10) {
//           clearHtml(countryList);
//           clearHtml(countryInfo);
//           Notify.info(
//             'Too many matches found. Please enter a more specific name.'
//           );
//         } else if (data.length === 1) {
//           clearHtml(countryList);
//           createCountryCard(data[0]);
//         } else {
//           clearHtml(countryInfo);
//           insertContent(data);
//         }
//       })
//       .catch(error => {
//         Notify.failure('Oops, there is no country with that name');
//         clearHtml(countryList);
//         clearHtml(countryInfo);
//       });
//   }
// }

// function clearHtml(element) {
//   return (element.innerHTML = '');
// }

// function createLi(item) {
//   return `<li class = 'item'>
//     <img class='item-img' src='${item.flags.svg}' alt = "flag of ${item.flags.alt}">
//     <p class = 'item-descr'>${item.name.official}</p>
//   </li>`;
// }

// function generateCountries(array) {
//   return array.reduce((acc, item) => acc + createLi(item), '');
// }

// function insertContent(array) {
//   const result = generateCountries(array);
//   return (countryList.innerHTML = result);
// }

// function createCountryCard(item) {
//   const languagesList = Object.values(item.languages);
//   return (countryInfo.innerHTML = `
//   <div class ='country-card'>
//   <img class='card-img' src='${item.flags.svg}' alt = "flag of ${item.flags.alt}">
//     <h2 class = 'card-name'>${item.name.official}</h2>
//     </div>
//     <p class = 'card-descr'><span class = 'card-subtitle'>Capital:</span>${item.capital}</p>
//     <p class = 'card-descr'><span class = 'card-subtitle'>Population:</span>${item.population}</p>
//     <p class = 'card-descr'><span class = 'card-subtitle'>Languages:</span>${languagesList}
//     </p>`);
// }
