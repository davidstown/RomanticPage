export class NewsAPI {
  constructor() {
    this.sources = [
      {
        name: 'El Diario de Chihuahua',
        url: 'https://www.eldiariodechihuahua.mx/', // URL válida
        selector: '.article-box', // Selector actualizado (revisar en caso de cambios)
      },
      {
        name: 'El Heraldo de Chihuahua',
        url: 'https://elheraldodechihuahua.mx/', // URL correcta
        selector: '.article-card', // Selector actualizado
      },
    ];

    this.proxyUrl = 'https://corsproxy.io/?'; // Proxy para evitar CORS
  }

  async fetchNews() {
    try {
      const allNews = await Promise.all(
        this.sources.map(source => this.fetchFromSource(source))
      );
      
      return allNews.flat(); // Unifica todas las noticias
    } catch (error) {
      console.error('❌ Error fetching news:', error);
      return [];
    }
  }

  async fetchFromSource(source) {
    try {
      console.log(`📡 Fetching news from: ${source.name}`);

      const response =
