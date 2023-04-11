import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const apiKey = '35160839-4fe9cbd0f2e961147388a4735';
const inputValue = document.querySelector('input[name="searchQuery"]');
const btnLoadMore = document.querySelector('.btn-load-more');
const btnSearch = document.querySelector('.btnSearch');
const gallery = document.querySelector('.gallery');
const gallerySimpleLightbox = new SimpleLightbox('.gallery a');
let pageNumber = 1;

const fetchData = async (inputValue2, pageNr) => {
  try {
    const request = await axios.get(
      `https://pixabay.com/api/?key=${apiKey}&q=${inputValue2}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${pageNr}`
    );
    return request.data;
  } catch (error) {
    Notify.failure('ERROR', error);
  }
};
btnLoadMore.style.display = 'none';

btnSearch.addEventListener('click', e => {
  e.preventDefault();
  cleanGallery();
  searchFunction();
});

const searchFunction = async () => {
  const inputTrim = inputValue.value.trim();
  if (inputTrim !== '') {
    const foundData = await fetchData(inputTrim, pageNumber);
    if (foundData.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderImageList(foundData.hits);
      Notiflix.Notify.success(
        `Hooray! We found ${foundData.totalHits} images.`
      );
      btnLoadMore.style.display = 'block';
      gallerySimpleLightbox.refresh();
    }
  }
};

btnLoadMore.addEventListener('click', () => {
  pageNumber++;
  loadMoreFunction();
});

const loadMoreFunction = async () => {
  const inputTrim = inputValue.value.trim();
  btnLoadMore.style.display = 'none';
  const foundData = await fetchData(inputTrim, pageNumber);
  if (foundData.hits.length === 0) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    renderImageList(foundData.hits);
    Notiflix.Notify.success(`Hooray! We found ${foundData.totalHits} images.`);
    btnLoadMore.style.display = 'block';
  }
};
function renderImageList(photos) {
  const markup = photos
    .map(photo => {
      return `<div class="photo-card">
       <a href="${photo.largeImageURL}"><img class="photo-card-img" src="${photo.webformatURL}" alt="${photo.tags}" title="${photo.tags}" loading="lazy"/></a>
        <div class="info">
           <p class="info-item">
    <b>Likes</b> <span class="info-item-span"> ${photo.likes} </span>
</p>
            <p class="info-item">
                <b>Views</b> <span class="info-item-span">${photo.views}</span>  
            </p>
            <p class="info-item">
                <b>Comments</b> <span class="info-item-span">${photo.comments}</span>  
            </p>
            <p class="info-item">
                <b>Downloads</b> <span class="info-item-span">${photo.downloads}</span> 
            </p>
        </div>
    </div>`;
    })
    .join('');
  gallery.innerHTML += markup;
}

function cleanGallery() {
  gallery.innerHTML = '';
  pageNumber = 1;
  btnLoadMore.style.display = 'none';
}
