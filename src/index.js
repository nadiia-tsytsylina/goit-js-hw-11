import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import InfiniteScroll from 'infinite-scroll';

// let elem = document.querySelector('.container');
// let infScroll = new InfiniteScroll(elem, {
//   // options
//   // path: '.pagination__next',
//   // append: '.post',
//   // history: false,
// });

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const buttonMore = document.querySelector('.load-more');
const KEY = '35495478-0f618b27834e323a3a3099cd4';
const perPage = 40;
let page = 1;

const onSubmit = e => {
  e.preventDefault();
  const name = input.value.trim();
  if (name === '') {
    return;
  }
  getImages(name)
    .then(response => {
      const totalPages = Math.ceil(response.data?.totalHits / perPage);
      if (e.type === 'submit') {
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
      } else if (page >= totalPages || response.data.totalHits < perPage) {
        buttonMore.classList.add('hide');
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
      insertContent(response.data.hits);
      if (page > 1) {
        smoothScroll();
      }
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
  <article class="post">
  <div class="photo-card">
  <a href = '${item.largeImageURL}'>
    <img class = 'photo' src='${item.webformatURL}' alt="${item.tags}" loading="lazy"/>
    <div class="info">
    <p class="info-item">
      <b>Likes</b><br>
      ${item.likes}
    </p>
    <p class="info-item">
      <b>Views</b><br>
      ${item.views}
    </p>
    <p class="info-item">
      <b>Comments</b><br>
      ${item.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b><br>
      ${item.downloads}
    </p>
  </div>
    </a>
</div>
  </article>
  `;
};

const insertContent = array => {
  const result = array.reduce((acc, item) => acc + createPhotoCard(item), '');
  gallery.insertAdjacentHTML('beforeend', result);

  let lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
};

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 1.7,
    behavior: 'smooth',
  });
}

form.addEventListener('submit', onSubmit);
buttonMore.addEventListener('click', onSubmit);
