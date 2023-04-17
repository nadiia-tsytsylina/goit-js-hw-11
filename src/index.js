import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const buttonMore = document.querySelector('.load-more');
const KEY = '35495478-0f618b27834e323a3a3099cd4';
const perPage = 40;
let page = 1;

buttonMore.classList.add('hide');

form.addEventListener('submit', onSubmit);
buttonMore.addEventListener('click', onSubmit);

function onSubmit(e) {
  e.preventDefault();
  const name = input.value;
  fetchImages(name)
    .then(data => {
      const totalPages = Math.ceil(data?.totalHits / perPage);
      if (e.type === 'submit') {
        gallery.innerHTML = '';
        page = 1;
        if (data.hits.length === 0) {
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          Notify.success(`Hooray! We found ${data.totalHits} images`);
          buttonMore.classList.remove('hide');
        }
      } else if (page >= totalPages) {
        buttonMore.classList.add('hide');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      insertContent(data.hits);
      page += 1;
    })
    .catch(error => console.log(error));
}

function fetchImages(name) {
  return fetch(
    `https://pixabay.com/api/?key=${KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
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

function insertContent(array) {
  const result = array.reduce((acc, item) => acc + createPhotoCard(item), '');
  return gallery.insertAdjacentHTML('beforeend', result);
}
