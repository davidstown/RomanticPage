export class DBManager {
  constructor() {
    this.dbName = 'chiwastownDB';
    this.db = null;
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Crear almacén de noticias
        const store = db.createObjectStore('news', { keyPath: 'url' });
        store.createIndex('date', 'date');
        store.createIndex('source', 'source');
        store.createIndex('category', 'category');
      };
    });
  }

  async saveNews(news) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['news'], 'readwrite');
      const store = transaction.objectStore('news');

      news.forEach(article => {
        store.put(article);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getNewsByCategory(category) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['news'], 'readonly');
      const store = transaction.objectStore('news');
      const index = store.index('category');
      const request = index.getAll(category);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}