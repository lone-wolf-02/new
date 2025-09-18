(function(){
  const grid = document.getElementById('movieGrid');
  if (!grid) return;

  const categorySelect = document.getElementById('categorySelect');
  const params = new URLSearchParams(window.location.search);
  const q = (params.get('q') || '').trim().toLowerCase();

  const resultsMeta = document.getElementById('resultsMeta');
  const resultsText = document.getElementById('resultsText');
  const clearSearch = document.getElementById('clearSearch');

  function render() {
    const movies = Data.listMovies();
    const selectedCat = categorySelect.value;
    const filtered = movies.filter(m => {
      const inCat = selectedCat === 'all' ? true : m.category === selectedCat;
      const matches = !q ? true : (m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
      return inCat && matches;
    });

    grid.innerHTML = filtered.map(m => `
      <a class="movie-card" href="/movie.html?id=${m.id}" aria-label="${m.title}">
        <img src="${m.thumbnail}" alt="${m.title}">
        <div class="meta">
          <div class="title">${m.title}</div>
          <div class="category">${m.category}</div>
        </div>
      </a>
    `).join('');

    if (q) {
      resultsMeta.hidden = false;
      resultsText.textContent = `Results for "${q}" — ${filtered.length} found`;
    } else {
      resultsMeta.hidden = true;
    }
  }

  categorySelect.addEventListener('change', render);
  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      const url = new URL(window.location.href);
      url.searchParams.delete('q');
      window.location.href = url.toString();
    });
  }

  render();
})();

