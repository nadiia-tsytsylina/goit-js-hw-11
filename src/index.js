import { Notify } from 'notiflix/build/notiflix-notify-aio';
const axios = require('axios').default;
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const buttonMore = document.querySelector('.load-more');
const KEY = '35495478-0f618b27834e323a3a3099cd4';
const perPage = 40;
let page = 1;
const lightbox = new SimpleLightbox('.gallery a', {});

const onSubmit = e => {
  e.preventDefault();
  const name = input.value;
  getImages(name)
    .then(response => {
      const totalPages = Math.ceil(response.data?.totalHits / perPage);
      if (e.type === 'submit') {
        lightbox.refresh();
        gallery.innerHTML = '';
        page = 1;
        if (response.data.hits.length === 0) {
          buttonMore.classList.add('hide');
          Notify.failure(
            'Sorry, there are no images matching your search query. Please try again.'
          );
        } else {
          Notify.success(`Hooray! We found ${response.data.totalHits} images`);
          buttonMore.classList.remove('hide');
        }
      } else if (page >= totalPages) {
        buttonMore.classList.add('hide');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      insertContent(response.data.hits);
      page += 1;
    })
    .catch(error => console.log(error));
};

const getImages = async name => {
  try {
    const response = await axios.get(`https://pixabay.com/api/`, {
      params: {
        key: `${KEY}`,
        q: `${name}`,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        per_page: `${perPage}`,
        page: `${page}`,
      },
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};

const createPhotoCard = item => {
  return `
  <div class="photo-card">
  <a href = '${item.largeImageURL}'>
    <img class = 'photo' src='${item.webformatURL}' alt="${item.tags}" loading="lazy" />
    </a>
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
};

const insertContent = array => {
  const result = array.reduce((acc, item) => acc + createPhotoCard(item), '');
  return gallery.insertAdjacentHTML('beforeend', result);
};

buttonMore.classList.add('hide');
form.addEventListener('submit', onSubmit);
buttonMore.addEventListener('click', onSubmit);

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });
