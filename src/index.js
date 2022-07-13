import './css/styles.css';
import { ServerSequest } from './JS/fetchGallery';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import photoCard from './parsel/photoCard.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const fetchGallery = new ServerSequest();

const gallerySimpleLightbox = new SimpleLightbox('.gallery a');

const optionObservern = {
  rootMargin: '0px 0px 200px 0px',
  threshold: 0.0,
};

const loadContent = () => {
  const { height: cardHeight } =
    galleryEl.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const fetchRenderEnd = async () => {
  const arrayPromis = await fetchGallery.getArticles();
  if (arrayPromis.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    galleryEl.insertAdjacentHTML('beforeend', photoCard(arrayPromis));
    gallerySimpleLightbox.refresh();
  }
};

const infiniteScrollObserver = () => {
  const callback = async (entries, observer) => {
    if (fetchGallery.page !== fetchGallery.totalPages) {
      if (entries[0].isIntersecting) {
        fetchGallery.inPages();
        await fetchRenderEnd();
        loadContent();
        observer.unobserve(entries[0].target);
        observer.observe(document.querySelector('.photo-card:last-child'));
      }
    } else {
      if (entries[0].isIntersecting) {
        observer.unobserve(entries[0].target);
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    }
  };

  const observer = new IntersectionObserver(callback, { optionObservern });
  observer.observe(document.querySelector('.photo-card:last-child'));
};

const onFormSubmit = async e => {
  e.preventDefault();
  galleryEl.innerHTML = '';
  fetchGallery.resetPage();

  const { searchQuery } = e.currentTarget.elements;
  if(searchQuery.value.trim()===""){
    Notify.warning(`Please! Enter the request for the desired image.`)
    return
  }
  fetchGallery.setRequest(searchQuery.value.trim());
  await fetchRenderEnd();
  if (fetchGallery.getTotalHits() === 0) {
    return;
  }
  Notify.success(`Hooray! We found ${fetchGallery.getTotalHits()} images.`);
  infiniteScrollObserver();
};

searchFormEl.addEventListener('submit', onFormSubmit);