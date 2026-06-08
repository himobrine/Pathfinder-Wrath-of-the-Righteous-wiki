document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("my.html")) {
    renderMyBuilds();
  } else if (window.location.pathname.includes("builds/index")) {
    renderRecommendedBuilds();
  }
});

function renderMyBuilds() {
  const container = document.getElementById("my-build-list");
  if (!container) return;
  const saved = JSON.parse(localStorage.getItem("wotr_saved_builds") || "[]");
  if (saved.length === 0) {
    container.innerHTML = '<p style="color:var(--text-secondary);">暂无保存的 Build。在构建器中保存后即可在此查看。</p>';
    return;
  }
  container.innerHTML = saved.map((b, i) => {
    const classStr = (b.levels || []).map(e => `${e.class} ${e.level}`).join(" / ");
    return `<div class="card" style="position:relative;">
      <h3>${b.name || "未命名 Build"}</h3>
      <p style="font-size:0.85rem;color:var(--text-secondary);">${classStr}</p>
      <p style="font-size:0.85rem;color:var(--text-secondary);">种族: ${b.race || "—"} | 阵营: ${b.alignment ? alignName(b.alignment) : "—"}</p>
      <div style="display:flex;gap:8px;margin-top:8px;">
        <button class="btn" onclick="deleteBuild(${i})">删除</button>
        <button class="btn" onclick="exportBuildItem(${i})">导出 JSON</button>
      </div>
    </div>`;
  }).join("");
}

function deleteBuild(idx) {
  if (!confirm("确定删除？")) return;
  const saved = JSON.parse(localStorage.getItem("wotr_saved_builds") || "[]");
  saved.splice(idx, 1);
  localStorage.setItem("wotr_saved_builds", JSON.stringify(saved));
  renderMyBuilds();
}

function exportBuildItem(idx) {
  const saved = JSON.parse(localStorage.getItem("wotr_saved_builds") || "[]");
  const build = saved[idx];
  if (!build) return;
  const json = JSON.stringify(build, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${build.name || "build"}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importMyBuild() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const saved = JSON.parse(localStorage.getItem("wotr_saved_builds") || "[]");
      saved.push(data);
      localStorage.setItem("wotr_saved_builds", JSON.stringify(saved));
      renderMyBuilds();
      alert("Build 已导入！");
    } catch (err) {
      alert("JSON 格式错误：" + err.message);
    }
  };
  input.click();
}

async function renderRecommendedBuilds() {
  const container = document.getElementById("build-list");
  if (!container) return;
  try {
    const data = await loadData("builds");
    if (!data || data.length === 0) {
      container.innerHTML = '<p style="color:var(--text-secondary);">暂无 Build 数据。请使用 Build 构建器创建后导入，或添加 JSON 文件。</p>';
      return;
    }
    container.innerHTML = data.map(b => {
      const races = getData("races");
      const classes = getData("classes");
      const race = races.find(r => r.id === b.race);
      const classStr = (b.levels || []).map(e => {
        const cls = classes.find(c => c.id === e.class);
        return `${cls ? cls.name : e.class} ${e.level}`;
      }).join(" / ");
      return `<div class="card">
        <h3>${b.name}</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary);">${classStr}</p>
        <p style="font-size:0.85rem;color:var(--text-secondary);">种族: ${race ? race.name : b.race || "—"} | 阵营: ${b.alignment ? alignName(b.alignment) : "—"}</p>
        ${b.mythic_path ? `<p style="font-size:0.85rem;color:var(--text-secondary);">道途: ${b.mythic_path}</p>` : ""}
      </div>`;
    }).join("");
  } catch (e) {
    container.innerHTML = '<p style="color:var(--text-secondary);">暂无 Build 数据。</p>';
  }
}
