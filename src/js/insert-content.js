import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');

const createPhotoCard = item => {
  return `
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
  `;
};

export const insertContent = array => {
  const result = array.reduce((acc, item) => acc + createPhotoCard(item), '');
  gallery.insertAdjacentHTML('beforeend', result);

  let lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();
};
