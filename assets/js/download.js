(function(){
  const { qs } = window.UI;
  const { getMovieById } = window.DataAPI;

  function render(movie){
    const wrap = qs('#downloadDetail');
    const crumb = qs('#breadcrumb');
    if (!wrap || !movie) return;
    crumb.innerHTML = `<a href="/index.html">Home</a> / <a href="/movie.html?id=${movie.id}">${movie.title}</a> / <span>Download</span>`;
    wrap.innerHTML = `
      <div class="card">
        <h1 class="page-title">Download: ${movie.title}</h1>
        <p style="color:#c7d2de">Choose the link below to download.</p>
        <div class="movie-actions">
          <a class="btn" href="${movie.downloadUrl}" target="_blank" rel="noopener">Start Download</a>
          <a class="btn secondary" href="/movie.html?id=${movie.id}">Back to Movie</a>
        </div>
      </div>
    `;
  }

  function init(){
    const url = new URL(location.href);
    const id = url.searchParams.get('id');
    const movie = id ? getMovieById(id) : null;
    if (!movie){
      qs('#downloadContent').innerHTML = '<div class="card">Movie not found.</div>';
      return;
    }
    render(movie);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

