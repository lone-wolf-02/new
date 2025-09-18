(function(){
  const authView = document.getElementById('authView');
  const dashView = document.getElementById('dashboardView');
  if (!authView && !dashView) return;

  const loginForm = document.getElementById('loginForm');
  const uploadForm = document.getElementById('uploadForm');
  const adminMovieList = document.getElementById('adminMovieList');
  const logoutBtn = document.getElementById('logoutBtn');

  function formatMs(ms){
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const remMin = minutes % 60;
    if (hours > 0) return `${hours}h ${remMin}m`;
    return `${minutes}m`;
  }

  function refresh() {
    const loggedIn = Data.requireAuthOrRedirect();
    if (!loggedIn) {
      authView.hidden = false;
      dashView.hidden = true;
      return;
    }
    authView.hidden = true;
    dashView.hidden = false;
    renderMovies();
    renderAnalytics();
  }

  function renderMovies(){
    const movies = Data.listMovies();
    if (!movies.length) { adminMovieList.innerHTML = '<p class="muted">No movies yet.</p>'; return; }
    adminMovieList.innerHTML = movies.map(m => `
      <div class="admin-item" data-id="${m.id}">
        <img src="${m.thumbnail}" alt="${m.title}">
        <div>
          <div class="title">${m.title}</div>
          <div class="muted">${m.category}</div>
        </div>
        <div class="actions">
          <a class="secondary" href="/movie.html?id=${m.id}">Open</a>
          <button class="danger" data-action="delete">Delete</button>
        </div>
      </div>
    `).join('');

    adminMovieList.addEventListener('click', (e) => {
      const target = e.target;
      if (target.matches('button[data-action="delete"]')) {
        const root = target.closest('.admin-item');
        const id = root.getAttribute('data-id');
        Data.deleteMovie(id);
        renderMovies();
      }
    });
  }

  function renderAnalytics(){
    const a = Data.analytics();
    const totalEl = document.getElementById('totalWatchTime');
    const topEl = document.getElementById('topWatched');
    totalEl.textContent = formatMs(a.totalWatchMs || 0);
    let topId = null, topMs = 0;
    for (const [mid, ms] of Object.entries(a.watchTimeByMovie || {})) {
      if (ms > topMs) { topMs = ms; topId = mid; }
    }
    if (topId) {
      const m = Data.getMovie(topId);
      topEl.textContent = m ? `${m.title} (${formatMs(topMs)})` : '—';
    } else {
      topEl.textContent = '—';
    }
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const u = document.getElementById('adminUser').value.trim();
      const p = document.getElementById('adminPass').value;
      if (Data.login(u, p)) {
        refresh();
      } else {
        alert('Invalid credentials. Try admin / admin123');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => { Data.logout(); refresh(); });
  }

  if (uploadForm) {
    uploadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('movieTitleInput').value.trim();
      const description = document.getElementById('movieDescInput').value.trim();
      const category = document.getElementById('movieCatInput').value;
      const thumbnail = document.getElementById('movieThumbInput').value.trim();
      const streamUrl = document.getElementById('movieStreamInput').value.trim();
      const downloadUrl = document.getElementById('movieDownloadInput').value.trim();
      Data.addMovie({ title, description, category, thumbnail, streamUrl, downloadUrl });
      uploadForm.reset();
      renderMovies();
    });
  }

  refresh();
})();

