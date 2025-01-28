export class NewsAPI {
  constructor() {
    this.sources = [
      {
        name: 'El Diario de Chihuahua',
        url: 'https://www.eldiariodechihuahua.mx/', // URL completa de El Diario de Chihuahua
        selector: '.news-item', // Actualiza con el selector adecuado si es necesario
      },
      {
        name: 'El Heraldo de Chihuahua',
        url: 'https://oem.com.mx/elheraldodechihuahua/', // URL completa de El Heraldo de Chihuahua
        selector: '.news-item', // Actualiza con el selector adecuado si es necesario
      },
    ];

    this.proxyUrl = 'https://corsproxy.io/?'; // Proxy para evitar problemas de CORS
  }

  async fetchNews() {
    try {
      const allNews = await Promise.all(
        this.sources.map(source => this.fetchFromSource(source))
      );
      
      return allNews.flat(); // Unifica todas las noticias en un solo array
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      return []; // Si ocurre un error, devuelve un array vacío
    }
  }

  async fetchFromSource(source) {
    try {
      console.log(`📡 Fetching news from: ${source.name}`);

      const response = await fetch(`${this.proxyUrl}${encodeURIComponent(source.url)}`);
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const data = await response.text(); // Obtiene el HTML como texto
      return this.parseNews(data, source);
    } catch (error) {
      console.error(`❌ Error fetching from ${source.name}:`, error);
      return []; // Si ocurre un error en esta fuente, devuelve un array vacío
    }
  }

  parseNews(html, source) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const articles = doc.querySelectorAll(source.selector); // Utiliza el selector que corresponda

    return Array.from(articles).map(article => ({
      title: article.querySelector('h2')?.textContent || 'Sin título', // Asegúrate de que el 'h2' es correcto
      content: article.querySelector('p')?.textContent || 'Sin contenido', // Asegúrate de que el 'p' es correcto
      url: article.querySelector('a')?.href || source.url, // Obtén la URL del artículo
      source: source.name,
      date: new Date().toLocaleString(),
    }));
  }
}
