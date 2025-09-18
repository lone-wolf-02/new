(function(){
  const container = document.getElementById('movieContent');
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const movie = id ? Data.getMovie(id) : null;
  if (!movie) {
    container.innerHTML = '<p class="muted">Movie not found.</p>';
    return;
  }

  const poster = document.getElementById('moviePoster');
  const title = document.getElementById('movieTitle');
  const desc = document.getElementById('movieDescription');
  const streamBtn = document.getElementById('streamBtn');
  const downloadLink = document.getElementById('downloadLink');
  const player = document.getElementById('player');
  const video = document.getElementById('videoPlayer');

  poster.src = movie.thumbnail; poster.alt = movie.title;
  title.textContent = movie.title;
  desc.textContent = movie.description;
  downloadLink.href = '/download.html?id=' + movie.id;

  let lastTime = 0;
  let startTs = 0;

  function startPlayback() {
    if (!player.hidden) return;
    player.hidden = false;
    video.src = movie.streamUrl;
    video.play();
    startTs = performance.now();
  }

  function commitWatch() {
    if (!startTs) return;
    const delta = performance.now() - startTs;
    if (delta > 0) Data.addWatchTime(movie.id, delta);
    startTs = 0;
  }

  streamBtn.addEventListener('click', startPlayback);
  video.addEventListener('pause', commitWatch);
  video.addEventListener('ended', commitWatch);
  window.addEventListener('beforeunload', commitWatch);
})();

