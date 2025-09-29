(function(){
  const { qs, qsa } = window.UI;
  const { listCategories, getCategoryLabel, searchMovies } = window.DataAPI;

  function renderCategories(active){
    const wrap = qs('#categoryChips');
    if (!wrap) return;
    const cats = listCategories();
    wrap.innerHTML = '';
    const all = document.createElement('button');
    all.className = 'chip' + (!active ? ' active' : '');
    all.textContent = 'All';
    all.addEventListener('click', () => { const u = new URL(location.href); u.searchParams.delete('cat'); location.href = u; });
    wrap.appendChild(all);
    cats.forEach(c => {
      const btn = document.createElement('button');
      btn.className = 'chip' + (active===c.id ? ' active' : '');
      btn.textContent = getCategoryLabel(c.id);
      btn.addEventListener('click', () => { const u = new URL(location.href); u.searchParams.set('cat', c.id); location.href = u; });
      wrap.appendChild(btn);
    });
  }

  function renderGrid(movies){
    const grid = qs('#movieGrid');
    const meta = qs('#resultsMeta');
    if (!grid) return;
    grid.innerHTML = '';
    meta.textContent = movies.length + ' result' + (movies.length===1?'':'s');
    movies.forEach(m => {
      const card = document.createElement('a');
      card.className = 'card movie-card';
      card.href = `/movie.html?id=${encodeURIComponent(m.id)}`;
      card.innerHTML = `
        <div class="thumb">
          <img loading="lazy" alt="${m.title}" src="${m.thumbnailUrl}" />
        </div>
        <div class="movie-meta">
          <div class="movie-title">${m.title}</div>
          <div class="movie-category">${getCategoryLabel(m.category)}</div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function init(){
    const url = new URL(location.href);
    const q = url.searchParams.get('q') || '';
    const cat = url.searchParams.get('cat') || '';
    renderCategories(cat || null);
    const all = searchMovies(q);
    const filtered = cat ? all.filter(m => m.category === cat) : all;
    renderGrid(filtered);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

