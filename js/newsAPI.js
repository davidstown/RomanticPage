export class NewsAPI {
  constructor() {
    this.sources = [
      {
        name: 'Zona Free',
        url: 'https://zonafree.mx/',
        selector: '.post-title a', // Selector para el título de los artículos (ajustar si es necesario)
      },
      {
        name: 'La Parada Digital',
        url: 'https://laparadadigital.com/',
        selector: '.post-title a', // Selector para el título de los artículos (ajustar si es necesario)
      },
    ];

    this.proxyUrl = 'https://api.allorigins.win/get?url='; // Proxy para evitar problemas de CORS
  }

  async fetchNews() {
    try {
      const allNews = await Promise.all(
        this.sources.map(source => this.fetchFromSource(source))
      );

      return allNews.flat(); // Combina las noticias de todas las fuentes
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

      const json = await response.json(); // AllOrigins devuelve un JSON con el HTML
      const html = json.contents; // El HTML está en el campo `contents`
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
      title: article.textContent.trim() || 'Sin título', // Obtén el texto del título
      content: article.closest('p')?.textContent.trim() || 'Sin contenido', // Busca contenido cercano
      url: article.href || source.url, // Obtén el enlace del artículo
      source: source.name,
      date: new Date().toLocaleString(),
    }));
  }
}
