// Shared UI helpers
(function(){
  function qs(sel, el){ return (el||document).querySelector(sel); }
  function qsa(sel, el){ return Array.from((el||document).querySelectorAll(sel)); }
  function formatMs(ms){
    const sec = Math.floor(ms/1000);
    const h = Math.floor(sec/3600);
    const m = Math.floor((sec%3600)/60);
    const s = sec%60;
    if (h>0) return `${h}h ${m}m ${s}s`;
    if (m>0) return `${m}m ${s}s`;
    return `${s}s`;
  }

  function setYear(){
    const el = qs('#year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function wireGlobalSearch(){
    const input = qs('#globalSearch');
    if (!input) return;
    const onSearch = () => {
      const q = input.value.trim();
      const url = new URL(location.origin + '/index.html');
      if (q) url.searchParams.set('q', q);
      location.href = url.toString();
    };
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') onSearch(); });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setYear();
    wireGlobalSearch();
  });

  window.UI = { qs, qsa, formatMs };
})();

