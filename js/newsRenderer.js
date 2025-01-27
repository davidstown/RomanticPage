export class NewsRenderer {
  constructor() {
    this.featuredNews = document.getElementById('featured-news');
    this.latestNews = document.getElementById('latest-news');
    this.popularNews = document.getElementById('popular-news');
  }

  renderNews(news) {
    this.renderLatestNews(news.slice(0, 6));
    this.renderPopularNews(news.slice(6, 11));
  }

  renderFeaturedNews(article) {
    if (!article) return;
    
    this.featuredNews.innerHTML = `
      <div class="featured-article">
        ${article.image ? `<img src="${article.image}" alt="${article.title}" class="featured-image">` : ''}
        <div class="featured-content">
          <h2>${article.title}</h2>
          <p>${article.content}</p>
          <div class="article-meta">
            <span class="category">${article.category}</span>
            <span class="source">${article.source}</span>
            <span class="date">${this.formatDate(article.date)}</span>
          </div>
        </div>
      </div>
    `;
  }

  renderLatestNews(articles) {
    this.latestNews.innerHTML = articles.map(article => `
      <div class="news-item">
        <h3>${article.title}</h3>
        <p>${article.content}</p>
        <div class="article-meta">
          <span class="source">${article.source}</span>
          <span class="date">${this.formatDate(article.date)}</span>
        </div>
      </div>
    `).join('');
  }

  renderPopularNews(articles) {
    // Override with custom popular news
    const popularArticles = [
      {
        title: "Atoran a 'halcones' del Cártel de Sinaloa en Chihuahua; los detiene la GN",
        source: "El Heraldo de Chihuahua"
      },
      {
        title: "Chihuahua registra temperaturas de hasta -12°C por frente frío",
        source: "El Diario de Chihuahua"
      },
      {
        title: "Crisis de agua en Chihuahua: Presas al 28% de su capacidad",
        source: "Norte Digital"
      },
      {
        title: "Inicia construcción del nuevo Hospital General en Ciudad Juárez",
        source: "La Opción"
      },
      {
        title: "Empresarios de Chihuahua exigen mayor seguridad tras ola de extorsiones",
        source: "El Financiero"
      },
      {
        title: "Detectan desvío millonario en obra del C5 de Chihuahua",
        source: "Proceso"
      },
      {
        title: "Aumento del 8% al transporte público genera protestas en la capital",
        source: "El Heraldo de Chihuahua"
      }
    ];

    this.popularNews.innerHTML = popularArticles.map((article, index) => `
      <div class="popular-item">
        <span class="popular-number">${index + 1}</span>
        <div class="popular-content">
          <h4>${article.title}</h4>
          <span class="source">${article.source}</span>
        </div>
      </div>
    `).join('');
  }

  formatDate(date) {
    return new Intl.DateTimeFormat('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(new Date(date));
  }
}