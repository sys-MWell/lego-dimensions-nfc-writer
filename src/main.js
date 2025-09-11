document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("toyTagForm");
  const nfcUidInput = document.getElementById("nfcUid");
  const itemList = document.getElementById("itemList");
  const selectedIdInput = document.getElementById("selectedId");
  const selectionHint = document.getElementById("selectionHint");
  const outputDiv = document.getElementById("output");
  const searchInput = document.getElementById("searchInput");
  const clearSearchBtn = document.getElementById("clearSearch");
  const resultCount = document.getElementById("resultCount");
  const filterRadios = document.querySelectorAll('input[name="filterGroup"]');
  const themeToggle = document.getElementById('themeToggle');

  let masterItems = []; // { id, label, type, meta }
  let filtered = [];

  // ---- THEME TOGGLE ----
  // Persisted preference key
  const THEME_KEY = 'ld_theme';
  /** Apply stored theme or system preference */
  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = saved ? saved === 'dark' : prefersDark;
    document.documentElement.dataset.theme = useDark ? 'dark' : 'light';
    if (themeToggle) themeToggle.checked = useDark;
  }
  /** Toggle theme and persist */
  function toggleTheme() {
    const useDark = themeToggle.checked;
    document.documentElement.dataset.theme = useDark ? 'dark' : 'light';
    localStorage.setItem(THEME_KEY, useDark ? 'dark' : 'light');
  }
  if (themeToggle) {
    initTheme();
    themeToggle.addEventListener('change', toggleTheme);
  }

  /**
   * Fetch combined characters + vehicles, normalise into masterItems then render.
   * Return: void (side-effects populate masterItems & trigger initial filter render).
   */
  fetch("/data")
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data)) {
        // Server returned generated lines because params were used accidentally.
        outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        return;
      }
      const { characters = [], vehicles = [] } = data;

      masterItems = [
        ...characters.map(c => ({ id: c.id, type: "character", label: c.name, meta: c.world })),
        ...vehicles.map(v => ({ id: v.id, type: "vehicle", label: v.name, meta: v.type || "Vehicle" }))
      ].sort((a,b) => String(a.label).localeCompare(b.label));

      applyFilters();
    })
    .catch(err => console.error("Error loading data:", err));

  /**
   * Apply current search text & type radio filters to masterItems.
   * Return: void (updates filtered array then calls renderList).
   */
  function applyFilters() {
    const term = searchInput.value.trim().toLowerCase();
    const mode = document.querySelector('input[name="filterGroup"]:checked').value;

    filtered = masterItems.filter(it => {
      if (mode !== "all" && it.type !== mode) return false;
      if (term && !(`${it.label} ${it.meta} ${it.id}`.toLowerCase().includes(term))) return false;
      return true;
    });

    renderList();
  }

  /**
   * Render filtered items into list-group.
   * Return: void (manipulates DOM only).
   */
  function renderList() {
    itemList.innerHTML = "";
    filtered.forEach(it => {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex gap-2"; // add gap for spacing
      if (String(selectedIdInput.value) === String(it.id)) {
        li.classList.add("active");
      }
      li.dataset.id = it.id;
      li.dataset.type = it.type;
      li.innerHTML = `
        <span class="badge bg-${it.type === 'character' ? 'secondary' : 'info'} text-uppercase me-1">${it.type}</span>
        <strong class="me-2">${escapeHtml(it.label)}</strong>
        <span class="text-muted small ms-auto">${escapeHtml(it.meta)}</span>
      `;
      li.addEventListener("click", () => selectItem(li, it));
      itemList.appendChild(li);
    });

    resultCount.textContent = filtered.length ? `${filtered.length} items` : "No results";
    if (!filtered.length) {
      selectionHint.textContent = "No items match.";
    } else if (!selectedIdInput.value) {
      selectionHint.textContent = "Nothing selected.";
    }
  }

  /**
   * Handle list item selection: mark active & store selected id.
   * @param {HTMLElement} el - clicked list item element
   * @param {{id:string|number,label:string,type:string,meta:string}} item - associated data
   * Return: void
   */
  function selectItem(el, item) {
    [...itemList.children].forEach(li => li.classList.remove("active"));
    el.classList.add("active");
    selectedIdInput.value = item.id;
    selectionHint.textContent = `Selected: ${item.label} (Id ${item.id})`;
  }

  /**
   * Escape HTML special chars to prevent injection.
   * @param {string} str input
   * @returns {string} escaped
   */
  function escapeHtml(str="") {
    return str.replace(/[&<>"']/g, c => (
      { "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;" }[c]
    ));
  }

  // Events
  searchInput.addEventListener("input", applyFilters);
  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    applyFilters();
    searchInput.focus();
  });
  filterRadios.forEach(r => r.addEventListener("change", applyFilters));

  /**
   * Form submit: POST to /generate with uid + selected id then display JSON result.
   * Return: void (updates outputDiv)
   */
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const uid = nfcUidInput.value.trim();
    const id = selectedIdInput.value.trim();

    if (!uid || !id) {
      outputDiv.innerHTML = `<div class="alert alert-danger">Provide UID and select an item.</div>`;
      return;
    }

    fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid, id })
    })
      .then(r => r.json())
      .then(data => {
        outputDiv.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      })
      .catch(err => {
        console.error(err);
        outputDiv.innerHTML = `<div class="alert alert-danger">Generation failed.</div>`;
      });
  });
});