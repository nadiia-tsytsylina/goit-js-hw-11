import { Notify } from 'notiflix/build/notiflix-notify-aio';
import GalleryApiService from './js/gallery-API';
import { insertContent } from './js/insert-content';
// import InfiniteScroll from 'infinite-scroll';

// let elem = document.querySelector('.container');
// let infScroll = new InfiniteScroll(elem, {
//   // options
//   // path: '.pagination__next',
//   // append: '.post',
//   // history: false,
// });

const galleryApiService = new GalleryApiService();
const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const buttonMore = document.querySelector('.load-more');

const onSearch = async e => {
  e.preventDefault();
  galleryApiService.name = input.value.trim();
  galleryApiService.resetPage();

  if (galleryApiService.name === '') {
    return Notify.failure('Please input valid name');
  }

  try {
    const response = await galleryApiService.getImages();
    gallery.innerHTML = '';

    galleryApiService.totalPages = Math.ceil(
      response.data?.totalHits / response.config.params.per_page
    );

    if (response.data.hits.length === 0) {
      hideButton(buttonMore);
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (
      galleryApiService.page > galleryApiService.totalPages ||
      response.data.totalHits < galleryApiService.perPage
    ) {
      hideButton(buttonMore);
      Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      Notify.success(`Hooray! We found ${response.data.totalHits} images`);
      buttonMore.classList.remove('hide');
    }

    insertContent(response.data.hits);
  } catch (error) {
    console.log(error);
  }
};

const onLoadMore = async () => {
  try {
    const response = await galleryApiService.getImages();

    if (
      galleryApiService.page > galleryApiService.totalPages ||
      response.data.totalHits < galleryApiService.perPage
    ) {
      hideButton(buttonMore);
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
    insertContent(response.data.hits);
    smoothScroll();
  } catch (error) {
    console.log(error);
  }
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

function hideButton(button) {
  button.classList.add('hide');
}

form.addEventListener('submit', onSearch);
buttonMore.addEventListener('click', onLoadMore);
