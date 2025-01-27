export class NewsAPI {
  constructor() {
    this.sources = [
      {
        name: 'El Diario de Chihuahua',
        url: 'https://diario.mx',
        selector: '.article'
      },
      {
        name: 'El Heraldo de Chihuahua',
        url: 'https://heraldodechihuahua.com.mx',
        selector: '.news-item'
      }
      // Agregar más fuentes según sea necesario
    ];
  }

  async fetchNews() {
    try {
      const allNews = await Promise.all(
        this.sources.map(source => this.fetchFromSource(source))
      );
      
      return allNews.flat();
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async fetchFromSource(source) {
    try {
      const response = await axios.get(`/api/fetch?url=${source.url}`);
      return this.parseNews(response.data, source);
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error);
      return [];
    }
  }

  parseNews(html, source) {
    // Implementar parser específico para cada fuente
    // Este es un ejemplo simplificado
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const articles = doc.querySelectorAll(source.selector);
    
    return Array.from(articles).map(article => ({
      title: article.querySelector('h2')?.textContent,
      content: article.querySelector('p')?.textContent,
      url: article.querySelector('a')?.href,
      source: source.name,
      date: new Date(),
    }));
  }
}