import { NewsAPI } from './newsAPI.js';
import { NewsRenderer } from './newsRenderer.js';
import { DBManager } from './dbManager.js';

class App {
  constructor() {
    this.newsAPI = new NewsAPI();
    this.renderer = new NewsRenderer();
    this.dbManager = new DBManager();
    
    this.init();
  }

  async init() {
    try {
      // Inicializar la base de datos
      await this.dbManager.connect();
      
      // Cargar la noticia destacada primero
      this.loadFeaturedStory();
      
      // Cargar otras noticias
      await this.loadNews();
      
      // Configurar actualizaciones automáticas
      this.setupAutoRefresh();
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  loadFeaturedStory() {
    const featuredStory = {
      title: 'Boda de la Gobernadora Maru Campos genera controversia por contratos millonarios',
      content: `El pasado sábado, 25 de enero de 2025, la gobernadora de Chihuahua, María Eugenia "Maru" Campos Galván, contrajo matrimonio con el empresario automotriz Víctor Cruz Russek en una ceremonia privada que contó con la asistencia de familiares y amigos cercanos. La relación entre ambos se hizo pública en abril de 2023, y en 2024 anunciaron su compromiso matrimonial.

      Víctor Cruz Russek es propietario de varias concesionarias de vehículos en el estado, incluyendo "Tu Mejor Agencia Automotriz" y "Automotores Tokio" (Autotokio). Desde el inicio de su relación con la gobernadora, estas empresas han sido beneficiarias de contratos gubernamentales que suman más de 316 millones de pesos.

      Por ejemplo, el 9 de enero de 2025, "Tu Mejor Agencia Automotriz" obtuvo un contrato por 5.2 millones de pesos para la compra de 12 vehículos para la Secretaría de Desarrollo Rural.`,
      source: 'GRUPO MILENIO / ZONAFREE',
      date: '2025-01-25',
      image: 'https://nortedigital.mx/wp-content/uploads/2023/04/53763e3d-7e15-427e-a2c3-6676f7be81f3-702x526.jpg',
      category: 'Política'
    };
    
    this.renderer.renderFeaturedNews(featuredStory);
  }

  async loadNews() {
    const news = await this.newsAPI.fetchNews();
    const processedNews = await this.processNews(news);
    this.renderer.renderNews(processedNews);
  }

  async processNews(news) {
    // Eliminar duplicados
    const uniqueNews = this.removeDuplicates(news);
    
    // Verificar y respetar licencias
    const licensedNews = await this.checkLicenses(uniqueNews);
    
    // Guardar en base de datos
    await this.dbManager.saveNews(licensedNews);
    
    return licensedNews;
  }

  removeDuplicates(news) {
    return Array.from(new Set(news.map(item => item.url)))
      .map(url => news.find(item => item.url === url));
  }

  async checkLicenses(news) {
    return news.filter(item => {
      // Implementar verificación de licencias aquí
      return true; // Placeholder
    });
  }

  setupAutoRefresh() {
    setInterval(() => this.loadNews(), 300000); // Actualizar cada 5 minutos
  }
}

// Iniciar la aplicación
new App();