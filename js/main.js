if (typeof window.MOCK_DATA === 'undefined') {
  window.MOCK_DATA = {
    totalArticles: 0,
    articles: []
  };
}

class MainNews {
  constructor({ title, image, url }) {
    this.title = title;
    this.image = image;
    this.url = url;
  }
  
  render() {
    const el = document.createElement('section');
    el.className = 'main-news-wrapper';
    let imageBlock = '';
    
    if (this.image && this.image !== 'null' && this.image !== 'undefined') {
      imageBlock = `<div class="main-news-image">
        <div class="image-loader" role="status" aria-label="Loading main news image"></div>
        <img src="${this.image}" alt="${this.title}" style="display: none;" onload="this.style.display='block';if(this.previousElementSibling)this.previousElementSibling.style.display='none';" onerror="this.style.display='none';if(this.previousElementSibling)this.previousElementSibling.style.display='none';this.parentNode.classList.add('main-news-fallback');this.parentNode.innerHTML='<span class=\'main-news-fallback-title\'>${this.title}</span>';" />
      </div>`;
    } else {
      imageBlock = `<div class="main-news-image main-news-fallback">
        <span class="main-news-fallback-title">${this.title}</span>
      </div>`;
    }
    
    el.innerHTML = `
    <div class="main-news">
      ${imageBlock}
      <div class="main-news-content">
        <h1 class="main-news-title">${this.title}</h1>
        <a class="main-news-btn" href="${this.url}" target="_blank" rel="noopener">
          Explore <span class="main-news-btn-arrow">→</span>
        </a>
      </div>
    </div>
    <a class="main-news-btn main-news-btn-mobile" href="${this.url}" target="_blank" rel="noopener">
          Explore <span class="main-news-btn-arrow">→</span>
    </a>
    `;
    
    setTimeout(() => {
      const imgContainer = el.querySelector('.main-news-image');
      const loader = imgContainer?.querySelector('.image-loader');
      const img = imgContainer?.querySelector('img');
      
      if (loader && img && img.style.display === 'none') {
        imgContainer.classList.add('main-news-fallback');
        imgContainer.innerHTML = `<span class="main-news-fallback-title">${this.title}</span>`;
      }
    }, 3000);
    
    return el;
  }
}

class NewsCard {
    constructor({ title, text }) {
      this.title = title
      this.text = text
    }
  
    render() {
      const el = document.createElement('article')
      el.className = 'news-card'
      el.innerHTML = `
        <h2>${this.title}</h2>
        <p>${this.text}</p>
      `
      return el
    }
}

const API_KEYS = [
  '604c0e605446da8a89e1dff7d4598a7d',
  'ac3f1528f79fa1bdcbd38ef7e4c88c44',
  '4f2d2c1bff7c19757a8384dfa8b2107b',
  'f354e54a15ec714af1ced34633866b2c',
  'd754cfbc8ea2563a0b36fc36710b3f46'
];

let currentApiKeyIndex = 0;

const ALL_NEWS_PAGE_SIZE = 8;

const CACHE_KEY = 'news_cache';
const CACHE_DURATION = 60 * 60 * 1000;

const allNewsCache = {};
let allNewsData = [];
let allNewsTotal = 0;
let allNewsPage = 1;

function getCurrentApiKey() {
  return API_KEYS[currentApiKeyIndex];
}

function switchToNextApiKey() {
  currentApiKeyIndex = (currentApiKeyIndex + 1) % API_KEYS.length;
  console.log(`Switched to API key ${currentApiKeyIndex + 1}/${API_KEYS.length}`);
  clearCache();
}

function isLocalFile() {
  return window.location.protocol === 'file:';
}

async function loadMockData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (window.MOCK_DATA && window.MOCK_DATA.articles) {
        resolve({
          articles: window.MOCK_DATA.articles || [],
          total: window.MOCK_DATA.totalArticles || 0
        });
      } else {
        resolve({
          articles: [],
          total: 0
        });
      }
    }, 100);
  });
}

async function fetchNewsWithRetry({ page = 1, pageSize = 8 } = {}, retries = 3) {
  if (isLocalFile()) {
    const mockData = await loadMockData();
    
    if (!mockData || !mockData.articles) {
      return {
        articles: [],
        total: 0
      };
    }
    
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const articles = mockData.articles.slice(startIndex, endIndex);
    
    return {
      articles: articles,
      total: mockData.total
    };
  }
  
  for (let i = 0; i < retries; i++) {
    try {
      const url = `https://gnews.io/api/v4/top-headlines?lang=en&token=${getCurrentApiKey()}&page=${page}&max=${pageSize}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.errors && data.errors.length > 0) {
        throw new Error(`API error: ${data.errors[0].message || 'Unknown API error'}`);
      }
      
      return {
        articles: data.articles || [],
        total: data.totalArticles || 0
      };
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed with API key ${currentApiKeyIndex + 1}:`, error.message);
      
      if (i === retries - 1) {
        switchToNextApiKey();
        if (currentApiKeyIndex !== 0) {
          return fetchNewsWithRetry({ page, pageSize }, retries);
        }
      }
      
      if (i === retries - 1) {
        throw new Error(`Failed to load news after ${retries} attempts with all API keys: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

function saveToLocalStorage(key, data) {
  try {
    const cacheData = {
      data: data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

function getFromLocalStorage(key) {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    const now = Date.now();
    
    if (now - cacheData.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    
    return cacheData.data;
  } catch (error) {
    console.warn('Failed to get from localStorage:', error);
    return null;
  }
}

function clearExpiredCache() {
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    keys.forEach(key => {
      if (key.startsWith('news_')) {
        try {
          const cached = JSON.parse(localStorage.getItem(key));
          if (now - cached.timestamp > CACHE_DURATION) {
            localStorage.removeItem(key);
          }
        } catch (error) {
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.warn('Failed to clear expired cache:', error);
  }
}

async function getNewsPage(page, pageSize) {
  if (isLocalFile()) {
    return await fetchNewsWithRetry({ page, pageSize });
  }
  
  const cacheKey = `${currentApiKeyIndex}_${page}_${pageSize}`;
  const localStorageKey = `news_${cacheKey}`;
  const cachedData = getFromLocalStorage(localStorageKey);
  
  if (cachedData) {
    return cachedData;
  }
  
  if (allNewsCache[cacheKey]) {
    return allNewsCache[cacheKey];
  }
  
  const data = await fetchNewsWithRetry({ page, pageSize });
  
  allNewsCache[cacheKey] = data;
  saveToLocalStorage(localStorageKey, data);
  
  return data;
}

function clearCache() {
  Object.keys(allNewsCache).forEach(key => {
    delete allNewsCache[key];
  });
  
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('news_')) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.warn('Failed to clear localStorage cache:', error);
  }
  
  console.log('Cache cleared due to API key switch');
}

function formatTimeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hr${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

function createImageWithFallback(src, alt, title, className = '') {
  if (!src || src === 'null' || src === 'undefined') {
    return `<div class="img-fallback ${className}" role="img" aria-label="No image">
      <span class="img-fallback-text">No image</span>
    </div>`;
  }
  
  return `<img class="${className}" src="${src}" alt="${alt}" 
    onerror="this.style.display='none';if(this.parentNode)this.parentNode.innerHTML='<div class=\\"img-fallback ${className}\\" role=\\"img\\" aria-label=\\"No image\\"><span class=\\"img-fallback-text\\">No image</span></div>';" 
    onload="this.style.display='block';" 
    onabort="this.style.display='none';if(this.parentNode)this.parentNode.innerHTML='<div class=\\"img-fallback ${className}\\" role=\\"img\\" aria-label=\\"No image\\"><span class=\\"img-fallback-text\\">No image</span></div>';"
    onloadstart="setTimeout(() => { if(this.naturalWidth === 0) { this.style.display='none';if(this.parentNode)this.parentNode.innerHTML='<div class=\\"img-fallback ${className}\\" role=\\"img\\" aria-label=\\"No image\\"><span class=\\"img-fallback-text\\">No image</span></div>'; } }, 3000);" />`;
}

function checkImageLoadProgrammatically(src, className, container) {
  if (!src || src === 'null' || src === 'undefined') {
    container.innerHTML = `<div class="img-fallback ${className}" role="img" aria-label="No image">
      <span class="img-fallback-text">No image</span>
    </div>`;
    return;
  }

  container.innerHTML = `<img class="${className}" src="${src}" alt="News image" style="display: none;" />`;
  
  const img = container.querySelector('img');
  const loader = document.createElement('div');
  loader.className = 'image-loader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-label', 'Loading image');
  container.insertBefore(loader, img);

  let loadTimeout = setTimeout(() => {
    if (img.naturalWidth === 0) {
      container.innerHTML = `<div class="img-fallback ${className}" role="img" aria-label="No image">
        <span class="img-fallback-text">No image</span>
      </div>`;
    }
  }, 3000);

  img.onload = function() {
    clearTimeout(loadTimeout);
    if (this.naturalWidth === 0) {
      container.innerHTML = `<div class="img-fallback ${className}" role="img" aria-label="No image">
        <span class="img-fallback-text">No image</span>
      </div>`;
    } else {
      this.style.display = 'block';
      if (loader.parentNode) {
        loader.remove();
      }
    }
  };
  
  img.onerror = function() {
    clearTimeout(loadTimeout);
    container.innerHTML = `<div class="img-fallback ${className}" role="img" aria-label="No image">
      <span class="img-fallback-text">No image</span>
    </div>`;
  };
}

function processAllImagesInGrid() {
  const grid = document.querySelector('.all-news-grid');
  if (!grid) return;
  
  const imgContainers = grid.querySelectorAll('.all-news-card-img-container');
  
  imgContainers.forEach(container => {
    if (container.querySelector('.img-fallback') || container.querySelector('img')) {
      return;
    }
    
    if (container.children.length === 0) {
      container.style.height = '200px';
      container.style.minHeight = '200px';
      container.innerHTML = `<div class="image-loader" role="status" aria-label="Loading image"></div>`;
      return;
    }
    
    const img = container.querySelector('img');
    if (img) {
      if (img.naturalWidth > 0) {
        img.style.display = 'block';
        const loader = container.querySelector('.image-loader');
        if (loader) {
          loader.remove();
        }
      } else {
        setTimeout(() => {
          if (img.naturalWidth === 0) {
            container.innerHTML = `<div class="img-fallback all-news-card-img" role="img" aria-label="No image">
              <span class="img-fallback-text">No image</span>
            </div>`;
          } else {
            img.style.display = 'block';
            const loader = container.querySelector('.image-loader');
            if (loader) {
              loader.remove();
            }
          }
        }, 2000);
      }
    }
  });
}

function renderMainNewsAndSidebar(articles) {
  if (!articles || articles.length === 0) return;
  
  const mainRow = document.querySelector('.news-main-row');
  
  if (!mainRow) return;
  
  const mainArticle = articles[0];
  const mainNews = new MainNews({
    title: mainArticle.title,
    image: mainArticle.image,
    url: mainArticle.url
  });
  
  const sidebarArticles = articles.slice(1, 5);
  
  const sidebar = document.createElement('aside');
  sidebar.className = 'sidebar-news';
  sidebar.setAttribute('role', 'complementary');
  sidebar.setAttribute('aria-label', 'Additional news');
  
  const sidebarContent = sidebarArticles.map(article => `
    <a href="${article.url}" target="_blank" rel="noopener" class="sidebar-news-item" aria-label="News: ${article.title}">
      <div class="sidebar-news-title">${article.title}</div>
      <div class="sidebar-news-desc">${article.description}</div>
      <div class="sidebar-news-meta">
        <span>${formatTimeAgo(article.publishedAt)}</span>
        <span class="sidebar-news-meta-sep"></span>
        <span>${article.source && article.source.name ? article.source.name : ''}</span>
      </div>
    </a>
  `).join('');
  
  sidebar.innerHTML = sidebarContent;
  
  mainRow.innerHTML = '';
  mainRow.appendChild(mainNews.render());
  mainRow.appendChild(sidebar);
}

function renderAllNewsGrid(news, append = false) {
  const grid = document.querySelector('.all-news-grid');
  if (!grid) return;
  
  if (!append) grid.innerHTML = '';
  
  const fragment = document.createDocumentFragment();
  
  news.forEach((article, index) => {
    const card = document.createElement('a');
    card.className = 'all-news-card';
    card.href = article.url || '#';
    card.target = '_blank';
    card.rel = 'noopener';
    card.setAttribute('aria-label', `News: ${article.title}`);
    card.setAttribute('role', 'article');
    
    card.innerHTML = `
      <div class='all-news-card-img-container' style="height: 200px; min-height: 200px;"></div>
      <div class='all-news-card-content'>
        <div class='all-news-card-title'>${article.title}</div>
        <div class='all-news-card-desc'>${article.description || ''}</div>
        <div class='all-news-card-meta'>
          <span>${formatTimeAgo(article.publishedAt)}</span>
          <span class='all-news-card-meta-sep'></span>
          <span>${article.source && article.source.name ? article.source.name : ''}</span>
        </div>
      </div>
    `;
    
    fragment.appendChild(card);
    
    setTimeout(() => {
      const imgContainer = card.querySelector('.all-news-card-img-container');
      if (imgContainer) {
        checkImageLoadProgrammatically(article.image, 'all-news-card-img', imgContainer);
      }
    }, index * 100);
  });
  
  grid.appendChild(fragment);
  
  setTimeout(() => {
    processAllImagesInGrid();
  }, 500);
}

function toggleLatestNewsSection(show) {
  const section = document.querySelector('.all-news-section');
  if (section) {
    section.style.display = show ? 'block' : 'none';
  }
}

function toggleReadMoreButton(show) {
  const moreBtn = document.querySelector('.all-news-more-btn');
  if (moreBtn) {
    moreBtn.style.display = show ? 'block' : 'none';
  }
}

function showPageLoader(show) {
  const loader = document.querySelector('.page-loader');
  if (loader) {
    loader.style.display = show ? 'flex' : 'none';
  }
}

function showAllNewsLoader(show) {
  const loader = document.querySelector('.all-news-loader');
  if (loader) {
    loader.style.display = show ? 'flex' : 'none';
  }
}

async function initNews() {
  try {
    showPageLoader(true);
    toggleLatestNewsSection(false);
    toggleReadMoreButton(false);
    
    const pageSize = isLocalFile() ? 13 : 20;
    let { articles: firstArticles, total } = await getNewsPage(1, pageSize); 
    
    if (!isLocalFile() && firstArticles.length < 13) {
      const { articles: additionalArticles } = await getNewsPage(2, pageSize);
      firstArticles = firstArticles.concat(additionalArticles);
    }
    
    allNewsData = firstArticles.slice(5); 
    allNewsTotal = total;
    allNewsPage = 1;

    renderMainNewsAndSidebar(firstArticles.slice(0, 5));
    
    const articlesForGrid = allNewsData.slice(0, ALL_NEWS_PAGE_SIZE);
    renderAllNewsGrid(articlesForGrid);
    
    if (allNewsData.length > 0) {
      toggleLatestNewsSection(true);
      
      const hasMoreData = allNewsData.length < allNewsTotal || articlesForGrid.length < ALL_NEWS_PAGE_SIZE;
      toggleReadMoreButton(hasMoreData);
    }
    
    setTimeout(() => {
      processAllImagesInGrid();
    }, 200);
  } catch (error) {
    const mainRow = document.querySelector('.news-main-row');
    
    if (mainRow) {
      mainRow.innerHTML = '<div class="error-message">Failed to load news. Please try again later.</div>';
    }
    
    toggleLatestNewsSection(false);
    toggleReadMoreButton(false);
  } finally {
    showPageLoader(false);
  }
}

async function handleAllNewsMore() {
  const moreBtn = document.querySelector('.all-news-more-btn');
  const loader = document.querySelector('.all-news-loader');
  
  if (!moreBtn || !loader) return;
  
  toggleReadMoreButton(false);
  showAllNewsLoader(true);
  allNewsPage++;
  
  if (allNewsData.length >= allNewsPage * ALL_NEWS_PAGE_SIZE) {
    renderAllNewsGrid(
      allNewsData.slice(0, allNewsPage * ALL_NEWS_PAGE_SIZE)
    );
    if (allNewsData.length >= allNewsTotal) {
      toggleReadMoreButton(false);
    } else {
      toggleReadMoreButton(true);
    }
    showAllNewsLoader(false);
    return;
  }
  
  try {
    const nextPage = Math.floor(allNewsData.length / ALL_NEWS_PAGE_SIZE) + 1;
    const { articles } = await getNewsPage(nextPage, ALL_NEWS_PAGE_SIZE);
    allNewsData = allNewsData.concat(articles);
    
    renderAllNewsGrid(allNewsData.slice(0, allNewsPage * ALL_NEWS_PAGE_SIZE));
    
    if (allNewsData.length >= allNewsTotal) {
      toggleReadMoreButton(false);
    } else {
      toggleReadMoreButton(true);
    }
  } catch (error) {
    toggleReadMoreButton(false);
  } finally {
    showAllNewsLoader(false);
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedResizeHandler = debounce(() => {
  processAllImagesInGrid();
}, 250);

document.addEventListener('DOMContentLoaded', () => {
  clearExpiredCache();
  
  initNews();
  
  const moreBtn = document.querySelector('.all-news-more-btn');
  if (moreBtn) {
    moreBtn.addEventListener('click', handleAllNewsMore);
  }
  
  window.addEventListener('resize', debouncedResizeHandler);
});
