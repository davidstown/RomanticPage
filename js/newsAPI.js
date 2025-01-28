export class NewsAPI {
  constructor() {
    this.sources = [
      {
        name: 'Zona Free',
        url: 'https://zonafree.mx/',
        selector: '.post-title a',
      },
      {
        name: 'La Parada Digital',
        url: 'https://laparadadigital.com/',
        selector: '.post-title a',
      },
    ];

    this.proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Proxy recomendado
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

      const response = await fetch(`${this.proxyUrl}${source.url}`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const html = await response.text(); // Obtiene el HTML como texto
      return this.parseNews(html, source);
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
      title: article.textContent.trim() || 'Sin título',
      content: article.closest('p')?.textContent.trim() || 'Sin contenido',
      url: article.href || source.url,
      source: source.name,
      date: new Date().toLocaleString(),
    }));
  }
}
