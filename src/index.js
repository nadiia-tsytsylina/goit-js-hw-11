import { Notify } from 'notiflix/build/notiflix-notify-aio';
import GalleryApiService from './js/gallery-API';
import { insertContent } from './js/insert-content';

const galleryApiService = new GalleryApiService();
const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const gallery = document.querySelector('.gallery');
const endOfGallery = document.querySelector('.end');
// const buttonMore = document.querySelector('.load-more');

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
    smoothScroll();

    galleryApiService.totalPages = Math.ceil(
      response.data?.totalHits / response.config.params.per_page
    );

    if (response.data.hits.length === 0) {
      // addHideClass(buttonMore);
      observer.unobserve(endOfGallery);
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else if (
      galleryApiService.page > galleryApiService.totalPages ||
      response.data.totalHits < galleryApiService.perPage
    ) {
      // addHideClass(buttonMore);
      observer.unobserve(endOfGallery);
      Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      Notify.success(`Hooray! We found ${response.data.totalHits} images`);
      // buttonMore.classList.remove('hide');
      observer.observe(endOfGallery);
    }

    insertContent(response.data.hits);
  } catch (error) {
    console.log(error);
  }
};

// функция для события на кнопку load more
// const onLoadMore = async () => {
//   try {
//     const response = await galleryApiService.getImages();

//     if (
//       galleryApiService.page > galleryApiService.totalPages ||
//       response.data.totalHits < galleryApiService.perPage
//     ) {
//       addHideClass(buttonMore);
//       Notify.info("We're sorry, but you've reached the end of search results.");
//     }
//     insertContent(response.data.hits);
//     smoothScroll();
//   } catch (error) {
//     console.log(error);
//   }
// };

// Функция плавного скролла для кнопки load more
// function smoothScroll() {
//   const { height: cardHeight } = document
//     .querySelector('.gallery')
//     .firstElementChild.getBoundingClientRect();

//   window.scrollBy({
//     top: cardHeight * 1.7,
//     behavior: 'smooth',
//   });
// }

// функция для кнопки load more
// function addHideClass(elem) {
//   elem.classList.add('hide');
// }

function smoothScroll() {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
}

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && galleryApiService.name !== '') {
      galleryApiService
        .getImages()
        .then(response => {
          if (
            galleryApiService.page > galleryApiService.totalPages ||
            response.data.totalHits < galleryApiService.perPage
          ) {
            observer.unobserve(endOfGallery);
            Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }
          insertContent(response.data.hits);
        })
        .catch(error => console.log(error));
    }
  });
};

const observerOptions = {
  rootMargin: '300px',
};

const observer = new IntersectionObserver(onEntry, observerOptions);

form.addEventListener('submit', onSearch);
// buttonMore.addEventListener('click', onLoadMore);
