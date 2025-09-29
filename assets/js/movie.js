(function(){
  const { qs, formatMs } = window.UI;
  const { getMovieById, getCategoryLabel, incrementViews, addWatchTime } = window.DataAPI;

  function msToHuman(ms){ return formatMs(ms); }

  function render(movie){
    const detail = qs('#movieDetail');
    const video = qs('#videoPlayer');
    const crumb = qs('#breadcrumb');
    if (!movie || !detail) return;
    crumb.innerHTML = `<a href="/index.html">Home</a> / <a href="/index.html?cat=${movie.category}">${getCategoryLabel(movie.category)}</a> / <span>${movie.title}</span>`;
    detail.innerHTML = `
      <img class="poster" src="${movie.thumbnailUrl}" alt="${movie.title}" />
      <div>
        <h1 class="page-title">${movie.title}</h1>
        <div class="movie-category">${getCategoryLabel(movie.category)}</div>
        <p style="color:#c7d2de">${movie.description}</p>
        <div class="movie-actions">
          <a class="btn" href="/download.html?id=${movie.id}">Download</a>
        </div>
        <div class="movie-stats" style="color:#9fb0c1; font-size:14px">Views: ${movie.views} • Watch time: ${msToHuman(movie.watchMs||0)}</div>
      </div>
    `;
    if (video){
      video.src = movie.streamUrl;
    }
  }

  function init(){
    const url = new URL(location.href);
    const id = url.searchParams.get('id');
    const movie = id ? getMovieById(id) : null;
    if (!movie) {
      qs('#movieContent').innerHTML = '<div class="card">Movie not found.</div>';
      return;
    }
    incrementViews(movie.id);
    render(getMovieById(movie.id));

    // track watch time periodically
    const video = qs('#videoPlayer');
    let lastTime = Date.now();
    let timer = setInterval(() => {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;
      if (!video.paused && !video.ended && video.currentTime > 0){
        addWatchTime(movie.id, delta);
        // update stats text
        const updated = getMovieById(movie.id);
        const stats = document.querySelector('.movie-stats');
        if (stats) stats.textContent = `Views: ${updated.views} • Watch time: ${msToHuman(updated.watchMs||0)}`;
      }
    }, 5000);

    window.addEventListener('beforeunload', () => clearInterval(timer));
  }

  document.addEventListener('DOMContentLoaded', init);
})();

