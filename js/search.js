document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("global-search-input");
  if (!input) return;

  let overlay = null;

  input.addEventListener("focus", async () => {
    if (overlay) return;
    const [classes, races, feats, spells, paths] = await loadAll(["classes", "races", "feats", "spells", "mythic-paths"]);

    overlay = document.createElement("div");
    overlay.className = "search-overlay";
    overlay.innerHTML = `
      <div class="search-modal">
        <input type="text" id="search-input" placeholder="输入关键词搜索..." autofocus>
        <div id="search-results"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const searchInput = overlay.querySelector("#search-input");
    const resultsDiv = overlay.querySelector("#search-results");

    const allData = [
      ...classes.map(d => ({ ...d, _category: "职业" })),
      ...races.map(d => ({ ...d, _category: "种族" })),
      ...feats.map(d => ({ ...d, _category: "专长" })),
      ...(spells || []).map(d => ({ ...d, _category: "法术" })),
      ...paths.map(d => ({ ...d, _category: "神话道途" }))
    ];

    function doSearch(q) {
      const term = q.toLowerCase().trim();
      if (!term) { resultsDiv.innerHTML = '<p style="color:var(--text-secondary);font-size:0.88rem;">输入关键词开始搜索</p>'; return; }
      const results = allData.filter(d => (d.name || "").toLowerCase().includes(term) || (d.id || "").toLowerCase().includes(term));
      if (results.length === 0) {
        resultsDiv.innerHTML = '<p style="color:var(--text-secondary);font-size:0.88rem;">未找到匹配结果</p>';
        return;
      }
      resultsDiv.innerHTML = results.slice(0, 50).map(r =>
        `<div class="search-result" data-id="${r.id}" data-cat="${r._category}">
          <span class="category">${r._category}</span>
          <div>${r.name}</div>
        </div>`
      ).join("");

      resultsDiv.querySelectorAll(".search-result").forEach(el => {
        el.addEventListener("click", () => {
          const cat = el.dataset.cat;
          const id = el.dataset.id;
          const catMap = { "职业": "classes", "种族": "races", "专长": "feats", "法术": "spells", "神话道途": "mythic-paths" };
          const page = catMap[cat];
          if (page) window.location.href = `wiki/${page}.html?id=${id}`;
        });
      });
    }

    searchInput.addEventListener("input", () => doSearch(searchInput.value));

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) { overlay.remove(); overlay = null; }
    });

    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { overlay.remove(); overlay = null; }
    });

    setTimeout(() => searchInput.focus(), 50);
  });
});
