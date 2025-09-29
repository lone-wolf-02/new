(function(){
  const { qs, qsa, formatMs } = window.UI;
  const { getMovies, addMovie, deleteMovie, listCategories, getCategoryLabel, getAnalytics, setAuth, getAuth, fileToDataUrl } = window.DataAPI;

  function renderAuth(){
    const wrap = qs('#adminAuth');
    const auth = getAuth();
    if (!wrap) return;
    wrap.innerHTML = '';
    const card = document.createElement('div');
    card.className = 'card';
    if (!auth.enabled){
      card.innerHTML = `
        <h2>Admin Access</h2>
        <p style="color:#c7d2de">This area is protected. Enable admin to proceed.</p>
        <div class="form-actions">
          <button id="enableAdmin">Enable Admin</button>
        </div>
      `;
    } else {
      card.innerHTML = `
        <h2>Admin Access</h2>
        <p style="color:#c7d2de">Admin mode is enabled on this device.</p>
        <div class="form-actions">
          <button class="secondary" id="disableAdmin">Disable Admin</button>
        </div>
      `;
    }
    wrap.appendChild(card);
    const app = qs('#adminApp');
    app.hidden = !auth.enabled;
    const btnOn = qs('#enableAdmin');
    const btnOff = qs('#disableAdmin');
    if (btnOn) btnOn.addEventListener('click', () => { setAuth(true); renderAuth(); });
    if (btnOff) btnOff.addEventListener('click', () => { setAuth(false); renderAuth(); });
  }

  async function handleSubmit(e){
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    let thumb = fd.get('thumbnailUrl');
    const file = fd.get('thumbnailFile');
    if (file && file.size) thumb = await fileToDataUrl(file);
    const movie = {
      title: fd.get('title'),
      category: fd.get('category'),
      description: fd.get('description'),
      thumbnailUrl: thumb || 'https://via.placeholder.com/600x900?text=Poster',
      streamUrl: fd.get('streamUrl') || 'https://cdn.plyr.io/static/blank.mp4',
      downloadUrl: fd.get('downloadUrl') || fd.get('streamUrl') || 'https://cdn.plyr.io/static/blank.mp4'
    };
    addMovie(movie);
    form.reset();
    renderMovies();
    renderAnalytics();
  }

  function renderMovies(){
    const list = qs('#adminMovieList');
    const movies = getMovies();
    list.innerHTML = '';
    movies.forEach(m => {
      const item = document.createElement('div');
      item.className = 'list-item';
      item.innerHTML = `
        <img src="${m.thumbnailUrl}" alt="${m.title}" />
        <div>
          <div class="list-item-title">${m.title}</div>
          <div class="list-item-meta">${getCategoryLabel(m.category)} • Views ${m.views} • Watch ${formatMs(m.watchMs||0)}</div>
        </div>
        <div>
          <a class="btn secondary" href="/movie.html?id=${m.id}">Open</a>
          <button class="danger" data-id="${m.id}">Delete</button>
        </div>
      `;
      list.appendChild(item);
    });
    qsa('button.danger', list).forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm('Delete this movie?')){
          deleteMovie(id);
          renderMovies();
          renderAnalytics();
        }
      });
    });
  }

  function renderAnalytics(){
    const el = qs('#analytics');
    const movies = getMovies();
    const totalWatch = movies.reduce((a,m) => a + (m.watchMs||0), 0);
    const mostWatched = movies.slice().sort((a,b) => (b.watchMs||0) - (a.watchMs||0)).slice(0, 5);
    el.innerHTML = '';
    const card = document.createElement('div');
    card.innerHTML = `
      <div class="list">
        <div class="list-item" style="grid-template-columns: 1fr;">
          <div class="list-item-title">Total Watch Time</div>
          <div class="list-item-meta">${formatMs(totalWatch)}</div>
        </div>
        ${mostWatched.map(m => `
          <div class="list-item" style="grid-template-columns: 56px 1fr auto;">
            <img src="${m.thumbnailUrl}" alt="${m.title}" />
            <div>
              <div class="list-item-title">${m.title}</div>
              <div class="list-item-meta">${m.views} views • ${formatMs(m.watchMs||0)} watch</div>
            </div>
            <a class="btn secondary" href="/movie.html?id=${m.id}">Open</a>
          </div>
        `).join('')}
      </div>
    `;
    el.appendChild(card);
  }

  function init(){
    renderAuth();
    const form = qs('#movieForm');
    if (form) form.addEventListener('submit', (e) => {
      if (!getAuth().enabled){
        e.preventDefault();
        alert('Enable admin to add movies.');
        return;
      }
    });
    form?.addEventListener('submit', (e) => handleSubmit(e));
    renderMovies();
    renderAnalytics();
  }

  document.addEventListener('DOMContentLoaded', init);
})();

