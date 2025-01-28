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
    ];

    this.proxyUrl = 'https://corsproxy.io/?'; // Nuevo proxy confiable
  }

  async fetchNews() {
    try {
      const allNews = await Promise.all(
        this.sources.map(source => this.fetchFromSource(source))
      );
      
      return allNews.flat();
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      return [];
    }
  }

  async fetchFromSource(source) {
    try {
      console.log(`📡 Fetching news from: ${source.name}`);

      const response = await fetch(`${this.proxyUrl}${encodeURIComponent(source.url)}`);
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.text(); // Obtiene HTML como texto
      return this.parseNews(data, source);
    } catch (error) {
      console.error(`❌ Error fetching from ${source.name}:`, error);
      return [];
    }
  }

  parseNews(html, source) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const articles = doc.querySelectorAll(source.selector);

    return Array.from(articles).map(article => ({
      title: article.querySelector('h2')?.textContent || 'Sin título',
      content: article.querySelector('p')?.textContent || 'Sin contenido',
      url: article.querySelector('a')?.href || source.url,
      source: source.name,
      date: new Date().toLocaleString(),
    }));
  }
}
