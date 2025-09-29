// Data and analytics layer using localStorage
// Schema
// movies: Array<Movie>
//   Movie: { id, title, category, description, thumbnailUrl, streamUrl, downloadUrl, createdAt, views, watchMs }
// analytics: { totalWatchMs, movieIdToWatchMs: Record<string, number>, movieIdToViews: Record<string, number> }

(function(){
  const STORAGE_KEYS = {
    MOVIES: 'ms_movies_v1',
    ANALYTICS: 'ms_analytics_v1',
    AUTH: 'ms_admin_auth_v1'
  };

  const CATEGORIES = [
    { id: 'bangla', label: 'Bangla Movie' },
    { id: 'hindi', label: 'Hindi Movie' },
    { id: 'hollywood-hindi-dubbed', label: 'Hollywood Movies (Hindi Dubbed)' },
    { id: 'south-hindi-dubbed', label: 'South Indian Movies (Hindi Dubbed)' },
    { id: 'cartoon', label: 'Cartoon Movies' }
  ];

  function readJson(key, fallback){
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  }
  function writeJson(key, value){ localStorage.setItem(key, JSON.stringify(value)); }

  function generateId(){
    return 'movie_' + Math.random().toString(36).slice(2, 8) + Date.now().toString(36);
  }

  function seedIfEmpty(){
    const existing = readJson(STORAGE_KEYS.MOVIES, []);
    if (existing.length > 0) return;
    const samples = [
      {
        id: generateId(),
        title: 'Dhaka Nights',
        category: 'bangla',
        description: 'A thrilling journey through the streets of Dhaka.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1485841890310-6a055c88698a?q=80&w=800&auto=format&fit=crop',
        streamUrl: 'https://cdn.plyr.io/static/blank.mp4',
        downloadUrl: 'https://cdn.plyr.io/static/blank.mp4',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10,
        views: 0,
        watchMs: 0
      },
      {
        id: generateId(),
        title: 'Mumbai Saga (Hindi)',
        category: 'hindi',
        description: 'Crime drama set in the heart of Mumbai.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?q=80&w=800&auto=format&fit=crop',
        streamUrl: 'https://cdn.plyr.io/static/blank.mp4',
        downloadUrl: 'https://cdn.plyr.io/static/blank.mp4',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7,
        views: 0,
        watchMs: 0
      },
      {
        id: generateId(),
        title: 'Avengers (Hindi Dubbed)',
        category: 'hollywood-hindi-dubbed',
        description: 'Heroes unite to save the world.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=800&auto=format&fit=crop',
        streamUrl: 'https://cdn.plyr.io/static/blank.mp4',
        downloadUrl: 'https://cdn.plyr.io/static/blank.mp4',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5,
        views: 0,
        watchMs: 0
      },
      {
        id: generateId(),
        title: 'Pushpa (Hindi Dubbed)',
        category: 'south-hindi-dubbed',
        description: 'Action-packed saga from the south.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop',
        streamUrl: 'https://cdn.plyr.io/static/blank.mp4',
        downloadUrl: 'https://cdn.plyr.io/static/blank.mp4',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3,
        views: 0,
        watchMs: 0
      },
      {
        id: generateId(),
        title: 'Animated Adventure',
        category: 'cartoon',
        description: 'A fun adventure for the whole family.',
        thumbnailUrl: 'https://images.unsplash.com/photo-1546527868-ccb7ee7dfa6a?q=80&w=800&auto=format&fit=crop',
        streamUrl: 'https://cdn.plyr.io/static/blank.mp4',
        downloadUrl: 'https://cdn.plyr.io/static/blank.mp4',
        createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1,
        views: 0,
        watchMs: 0
      }
    ];
    writeJson(STORAGE_KEYS.MOVIES, samples);
    writeJson(STORAGE_KEYS.ANALYTICS, { totalWatchMs: 0, movieIdToWatchMs: {}, movieIdToViews: {} });
  }

  function getMovies(){ return readJson(STORAGE_KEYS.MOVIES, []); }
  function saveMovies(movies){ writeJson(STORAGE_KEYS.MOVIES, movies); }

  function listCategories(){ return CATEGORIES.slice(); }
  function getCategoryLabel(id){ return CATEGORIES.find(c => c.id === id)?.label || id; }

  function addMovie(movie){
    const movies = getMovies();
    const id = generateId();
    const now = Date.now();
    const created = { id, views: 0, watchMs: 0, createdAt: now, ...movie };
    movies.unshift(created);
    saveMovies(movies);
    return created;
  }

  function deleteMovie(id){
    const movies = getMovies();
    const idx = movies.findIndex(m => m.id === id);
    if (idx >= 0){
      movies.splice(idx, 1);
      saveMovies(movies);
      const analytics = readJson(STORAGE_KEYS.ANALYTICS, { totalWatchMs: 0, movieIdToWatchMs: {}, movieIdToViews: {} });
      delete analytics.movieIdToWatchMs[id];
      delete analytics.movieIdToViews[id];
      writeJson(STORAGE_KEYS.ANALYTICS, analytics);
      return true;
    }
    return false;
  }

  function getMovieById(id){
    return getMovies().find(m => m.id === id) || null;
  }

  function incrementViews(id){
    const movies = getMovies();
    const m = movies.find(x => x.id === id);
    if (!m) return;
    m.views += 1;
    saveMovies(movies);
    const analytics = readJson(STORAGE_KEYS.ANALYTICS, { totalWatchMs: 0, movieIdToWatchMs: {}, movieIdToViews: {} });
    analytics.movieIdToViews[id] = (analytics.movieIdToViews[id] || 0) + 1;
    writeJson(STORAGE_KEYS.ANALYTICS, analytics);
  }

  function addWatchTime(id, ms){
    const movies = getMovies();
    const m = movies.find(x => x.id === id);
    if (!m) return;
    m.watchMs += ms;
    saveMovies(movies);
    const analytics = readJson(STORAGE_KEYS.ANALYTICS, { totalWatchMs: 0, movieIdToWatchMs: {}, movieIdToViews: {} });
    analytics.totalWatchMs += ms;
    analytics.movieIdToWatchMs[id] = (analytics.movieIdToWatchMs[id] || 0) + ms;
    writeJson(STORAGE_KEYS.ANALYTICS, analytics);
  }

  function searchMovies(query){
    const q = (query || '').trim().toLowerCase();
    if (!q) return getMovies();
    const movies = getMovies();
    return movies.filter(m =>
      m.title.toLowerCase().includes(q)
      || m.description.toLowerCase().includes(q)
      || getCategoryLabel(m.category).toLowerCase().includes(q)
    );
  }

  function listTopMovies(limit){
    const movies = getMovies().slice();
    movies.sort((a,b) => (b.watchMs||0) - (a.watchMs||0));
    return movies.slice(0, limit || 10);
  }

  function getAnalytics(){
    const analytics = readJson(STORAGE_KEYS.ANALYTICS, { totalWatchMs: 0, movieIdToWatchMs: {}, movieIdToViews: {} });
    return analytics;
  }

  function setAuth(enabled){ writeJson(STORAGE_KEYS.AUTH, { enabled }); }
  function getAuth(){ return readJson(STORAGE_KEYS.AUTH, { enabled: false }); }

  // Thumbnail helpers: support file uploads by converting to DataURL
  function fileToDataUrl(file){
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // initialize seed
  seedIfEmpty();

  window.DataAPI = {
    STORAGE_KEYS,
    listCategories,
    getCategoryLabel,
    getMovies,
    addMovie,
    deleteMovie,
    getMovieById,
    incrementViews,
    addWatchTime,
    searchMovies,
    listTopMovies,
    getAnalytics,
    setAuth,
    getAuth,
    fileToDataUrl
  };
})();

