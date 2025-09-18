(function(){
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Simple query helpers
  window.$ = (sel, root=document) => root.querySelector(sel);
  window.$$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Storage keys
  const STORAGE = {
    MOVIES: 'moviehub.movies',
    ANALYTICS: 'moviehub.analytics',
    ADMIN: 'moviehub.admin',
  };

  // Seed data once
  function ensureSeed() {
    const existing = localStorage.getItem(STORAGE.MOVIES);
    if (existing) return;
    const seed = [
      {
        id: crypto.randomUUID(),
        title: 'Dhaka Nights',
        description: 'A gripping Bangla drama set in the heart of Dhaka.',
        category: 'Bangla',
        thumbnail: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=640&auto=format&fit=crop',
        streamUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        downloadUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        createdAt: Date.now()
      },
      {
        id: crypto.randomUUID(),
        title: 'Mumbai Chase',
        description: 'High-octane Hindi action through the streets of Mumbai.',
        category: 'Hindi',
        thumbnail: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68e?q=80&w=640&auto=format&fit=crop',
        streamUrl: 'https://www.w3schools.com/html/movie.mp4',
        downloadUrl: 'https://www.w3schools.com/html/movie.mp4',
        createdAt: Date.now()
      },
      {
        id: crypto.randomUUID(),
        title: 'Galactic Heist (Hindi Dubbed)',
        description: 'Hollywood sci-fi adventure dubbed in Hindi.',
        category: 'Hollywood Hindi Dubbed',
        thumbnail: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=640&auto=format&fit=crop',
        streamUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        downloadUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        createdAt: Date.now()
      },
      {
        id: crypto.randomUUID(),
        title: 'Phoenix Warrior (South Hindi Dubbed)',
        description: 'South Indian epic dubbed in Hindi.',
        category: 'South Indian Hindi Dubbed',
        thumbnail: 'https://images.unsplash.com/photo-1495563381401-ecfbcaaa67bc?q=80&w=640&auto=format&fit=crop',
        streamUrl: 'https://www.w3schools.com/html/movie.mp4',
        downloadUrl: 'https://www.w3schools.com/html/movie.mp4',
        createdAt: Date.now()
      },
      {
        id: crypto.randomUUID(),
        title: 'The Lost Kitten',
        description: 'Cartoon adventure of a brave kitten saving the day.',
        category: 'Cartoon',
        thumbnail: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?q=80&w=640&auto=format&fit=crop',
        streamUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        downloadUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        createdAt: Date.now()
      }
    ];
    localStorage.setItem(STORAGE.MOVIES, JSON.stringify(seed));
    localStorage.setItem(STORAGE.ANALYTICS, JSON.stringify({ watchTimeByMovie: {}, totalWatchMs: 0 }));
    localStorage.setItem(STORAGE.ADMIN, JSON.stringify({ username: 'admin', password: 'admin123', isLoggedIn: false }));
  }

  ensureSeed();

  // Data access helpers
  window.Data = {
    listMovies() { return JSON.parse(localStorage.getItem(STORAGE.MOVIES) || '[]'); },
    getMovie(id) { return this.listMovies().find(m => m.id === id); },
    saveMovies(movies) { localStorage.setItem(STORAGE.MOVIES, JSON.stringify(movies)); },
    addMovie(movie) { const arr = this.listMovies(); arr.unshift({ ...movie, id: crypto.randomUUID(), createdAt: Date.now() }); this.saveMovies(arr); return arr[0]; },
    deleteMovie(id) { const arr = this.listMovies().filter(m => m.id !== id); this.saveMovies(arr); },

    analytics() { return JSON.parse(localStorage.getItem(STORAGE.ANALYTICS) || '{"watchTimeByMovie":{},"totalWatchMs":0}'); },
    saveAnalytics(a) { localStorage.setItem(STORAGE.ANALYTICS, JSON.stringify(a)); },
    addWatchTime(movieId, ms) {
      const a = this.analytics();
      a.totalWatchMs += ms;
      a.watchTimeByMovie[movieId] = (a.watchTimeByMovie[movieId] || 0) + ms;
      this.saveAnalytics(a);
    },

    adminState() { return JSON.parse(localStorage.getItem(STORAGE.ADMIN) || '{"username":"admin","password":"admin123","isLoggedIn":false}'); },
    saveAdminState(s) { localStorage.setItem(STORAGE.ADMIN, JSON.stringify(s)); },
    login(u, p) { const s = this.adminState(); const ok = u === s.username && p === s.password; const next = { ...s, isLoggedIn: ok }; this.saveAdminState(next); return ok; },
    logout() { const s = this.adminState(); this.saveAdminState({ ...s, isLoggedIn: false }); },
    requireAuthOrRedirect() {
      const s = this.adminState();
      if (!s.isLoggedIn) {
        // remain on admin page but show auth view
        return false;
      }
      return true;
    },
  };

  // Global search wiring (works on any page with .search)
  const searchForm = document.querySelector('form.search');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = document.getElementById('globalSearch').value.trim();
      const params = new URLSearchParams(window.location.search);
      if (!q) {
        params.delete('q');
      } else {
        params.set('q', q);
      }
      // Always navigate home to show results
      window.location.href = '/index.html' + (params.toString() ? ('?' + params.toString()) : '');
    });
  }
})();

