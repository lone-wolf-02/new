(function(){
  const info = document.getElementById('downloadInfo');
  if (!info) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const movie = id ? Data.getMovie(id) : null;
  if (!movie) {
    info.innerHTML = '<p class="muted">No movie selected.</p>';
    return;
  }

  info.innerHTML = `
    <div class="admin-item">
      <img src="${movie.thumbnail}" alt="${movie.title}">
      <div>
        <div class="title">${movie.title}</div>
        <div class="muted">${movie.description}</div>
      </div>
      <div class="actions">
        <a class="secondary" href="movie.html?id=${movie.id}">Back</a>
      </div>
    </div>
  `;

  const btn = document.getElementById('downloadBtn');
  btn.href = movie.downloadUrl;
})();

