import axios from 'axios';

export class ServerSequest {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '28584724-c6de5560208975d9c3d1ef906';

  constructor() {
    this.page = 1;
    this.totalPages = 0;
    this.totalHits = 0;
    this.query = null;
    axios.defaults.baseURL = this.#BASE_URL;
  }
  async getArticles() {
    const options = new URLSearchParams({
      key: this.#API_KEY,
      q: this.query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: '40',
    });

    try {
      const response = await axios.get(`?${options}`);
      this.totalPages = Math.ceil(response.data.totalHits / 40);
      this.totalHits = response.data.totalHits;
      return response.data.hits;
    } catch (error) {
      console.log(error);
    }
  }
  resetPage() {
    this.page = 1;
  }

  inPages() {
    this.page += 1;
  }

  setRequest(query) {
    this.query = query;
  }

  getTotalHits() {
    return this.totalHits;
  }

}