document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  if (path.includes("classes.html")) initClasses();
  else if (path.includes("races.html")) initRaces();
  else if (path.includes("feats.html")) initFeats();
  else if (path.includes("spells.html")) initSpells();
  else if (path.includes("mythic-paths.html")) initMythicPaths();
});

async function initClasses() {
  const data = await loadData("classes");
  const tbody = document.getElementById("class-table-body");
  const searchInput = document.getElementById("class-search");
  const typeFilter = document.getElementById("class-type-filter");
  if (!tbody) return;

  function render() {
    const term = (searchInput?.value || "").toLowerCase();
    const type = typeFilter?.value || "all";
    const filtered = data.filter(c => {
      if (type === "base" && c.prestige) return false;
      if (type === "prestige" && !c.prestige) return false;
      return c.name.toLowerCase().includes(term) || c.id.includes(term);
    });
    tbody.innerHTML = filtered.map(c => {
      const casting = c.spellcasting ? (c.spellcasting.type === "神术" ? "神" : "奥") : "—";
      return `<tr>
        <td><strong>${c.name}</strong></td>
        <td>d${c.hit_die}</td>
        <td><span class="badge badge-blue">${c.bab_progression}</span></td>
        <td><span class="badge ${c.saves.fortitude === "高" ? "badge-green" : "badge-gray"}">${c.saves.fortitude}</span></td>
        <td><span class="badge ${c.saves.reflex === "高" ? "badge-green" : "badge-gray"}">${c.saves.reflex}</span></td>
        <td><span class="badge ${c.saves.will === "高" ? "badge-green" : "badge-gray"}">${c.saves.will}</span></td>
        <td>${c.skill_points_per_level}</td>
        <td>${casting}</td>
      </tr>`;
    }).join("");
  }
  render();
  searchInput?.addEventListener("input", render);
  typeFilter?.addEventListener("change", render);
}

async function initRaces() {
  const data = await loadData("races");
  const container = document.getElementById("race-list");
  const searchInput = document.getElementById("race-search");
  if (!container) return;

  function render() {
    const term = (searchInput?.value || "").toLowerCase();
    const filtered = data.filter(r => r.name.toLowerCase().includes(term) || r.id.includes(term));
    container.innerHTML = filtered.map(r => {
      let bonusText = "无";
      if (r.ability_bonuses) {
        if (r.ability_bonuses.any !== undefined) {
          bonusText = r.ability_bonus_desc || `任意+${r.ability_bonuses.any}`;
        } else {
          bonusText = Object.entries(r.ability_bonuses).map(([k, v]) => `${STAT_NAMES[k] || k} ${v > 0 ? "+" : ""}${v}`).join("，");
        }
      }
      return `<div class="card" data-race-id="${r.id}">
        <h3>${r.name}</h3>
        <p style="color:var(--ink-muted-48);font-size:0.82rem">${r.size} · ${r.speed}ft</p>
        <p style="margin-top:4px"><strong>属性加值：</strong>${bonusText}</p>
        <p style="margin-top:8px;color:var(--accent);font-size:0.82rem">▶ 点击查看详情</p>
      </div>`;
    }).join("");
    container.querySelectorAll(".card").forEach(el => {
      el.addEventListener("click", () => {
        const race = data.find(d => d.id === el.dataset.raceId);
        if (race) showRaceDetail(race);
      });
    });
  }
  render();
  searchInput?.addEventListener("input", render);
}

function showRaceDetail(r) {
  const existing = document.querySelector(".race-float-window");
  if (existing) existing.remove();

  let bonusText = "无";
  if (r.ability_bonuses) {
    if (r.ability_bonuses.any !== undefined) {
      bonusText = r.ability_bonus_desc || `任意 +${r.ability_bonuses.any}`;
    } else {
      bonusText = Object.entries(r.ability_bonuses).map(([k, v]) => `${STAT_NAMES[k] || k} ${v > 0 ? "+" : ""}${v}`).join("，");
    }
  }

  let traitsHtml = "";
  if (r.traits) {
    if (typeof r.traits === "object" && !Array.isArray(r.traits)) {
      traitsHtml = Object.entries(r.traits).map(([k, v]) => `<p style="margin-top:6px"><strong>${k}：</strong>${v}</p>`).join("");
    } else if (Array.isArray(r.traits)) {
      traitsHtml = r.traits.map(t => `<p style="margin-top:6px">${t}</p>`).join("");
    }
  }

  const el = document.createElement("div");
  el.className = "race-float-window";
  el.innerHTML = `
    <div class="race-float-inner">
      <button class="race-float-close">&times;</button>
      <h2 style="font-size:1.3rem;font-weight:600">${r.name}</h2>
      ${r.name_en ? `<p style="color:var(--ink-muted-48);font-size:0.9rem;margin-bottom:12px">${r.name_en}</p>` : ""}
      <p style="margin-top:4px"><strong>体型：</strong>${r.size}　<strong>速度：</strong>${r.speed}ft</p>
      <p style="margin-top:8px"><strong>属性加值：</strong>${bonusText}</p>
      ${traitsHtml ? `<div style="margin-top:12px"><strong>种族特性：</strong>${traitsHtml}</div>` : ""}
      ${r.description ? `<p style="margin-top:12px;line-height:1.7;color:var(--ink-muted-80);font-size:0.9rem">${r.description}</p>` : ""}
    </div>
  `;
  document.body.appendChild(el);

  el.querySelector(".race-float-close").addEventListener("click", () => el.remove());

  const onKeyDown = (e) => {
    if (e.key === "Escape") { el.remove(); document.removeEventListener("keydown", onKeyDown); }
  };
  document.addEventListener("keydown", onKeyDown);
}

async function initFeats() {
  const data = await loadData("feats");
  const tbody = document.getElementById("feat-table-body");
  const searchInput = document.getElementById("feat-search");
  const typeFilter = document.getElementById("feat-type-filter");
  if (!tbody) return;

  const typeMap = { combat: "战斗", mythic: "神话", metamagic: "超魔", "item-creation": "物品制作", normal: "普通" };

  function render() {
    const term = (searchInput?.value || "").toLowerCase();
    const type = typeFilter?.value || "all";
    const filtered = data.filter(f => {
      if (type !== "all") {
        const t = typeMap[type] || type;
        if (type === "mythic" && !f.mythic) return false;
        if (type !== "mythic" && f.mythic) return false;
        if (type !== "mythic" && f.type !== t) return false;
      }
      return f.name.toLowerCase().includes(term) || f.id.includes(term);
    });
    tbody.innerHTML = filtered.map(f => {
      const prereqs = [];
      if (f.prerequisites) {
        if (f.prerequisites.strength) prereqs.push(`力量 ${f.prerequisites.strength}`);
        if (f.prerequisites.bab) prereqs.push(`BAB ${f.prerequisites.bab}`);
        if (f.prerequisites.feats?.length) prereqs.push(f.prerequisites.feats.join(", "));
      }
      return `<tr>
        <td><strong>${f.name}</strong>${f.mythic ? ' <span class="badge badge-red">神话</span>' : ""}</td>
        <td>${f.type || "—"}</td>
        <td style="font-size:0.85rem;color:var(--text-secondary)">${prereqs.join("; ") || "—"}</td>
        <td style="font-size:0.85rem">${f.effect}</td>
      </tr>`;
    }).join("");
  }
  render();
  searchInput?.addEventListener("input", render);
  typeFilter?.addEventListener("change", render);
}

async function initSpells() {
  const data = await loadData("spells");
  const tbody = document.getElementById("spell-table-body");
  const searchInput = document.getElementById("spell-search");
  const schoolFilter = document.getElementById("spell-school-filter");
  if (!tbody) return;

  function render() {
    const term = (searchInput?.value || "").toLowerCase();
    const school = schoolFilter?.value || "all";
    const filtered = (data || []).filter(s => {
      if (school !== "all" && s.school !== school) return false;
      return s.name.toLowerCase().includes(term) || s.id.includes(term);
    });
    tbody.innerHTML = filtered.slice(0, 200).map(s => {
      const levels = (s.levels || []).map(l => `${l.class_ref}:${l.level}`).join(", ");
      return `<tr>
        <td><strong>${s.name}</strong>${s.name_en ? `<br><span style="font-size:0.8rem;color:var(--text-secondary)">${s.name_en}</span>` : ""}</td>
        <td>${s.school || "—"}</td>
        <td style="font-size:0.85rem">${levels || "—"}</td>
        <td>${s.casting_time || "—"}</td>
        <td>${s.saving_throw || "—"}</td>
      </tr>`;
    }).join("");
    if (filtered.length > 200) {
      tbody.innerHTML += `<tr><td colspan="5" style="text-align:center;color:var(--text-secondary);padding:12px;">显示前 200 条，共 ${filtered.length} 条匹配</td></tr>`;
    }
  }
  render();
  searchInput?.addEventListener("input", render);
  schoolFilter?.addEventListener("change", render);
}

async function initMythicPaths() {
  const data = await loadData("mythic-paths");
  const container = document.getElementById("path-list");
  const typeFilter = document.getElementById("path-type-filter");
  if (!container) return;

  function render() {
    const type = typeFilter?.value || "all";
    const filtered = data.filter(p => type === "all" || p.type === type);
    container.innerHTML = filtered.map(p => {
      const alignRestrict = (p.alignment_restrict || []).map(a => alignName(a)).join(" / ");
      const hasSpellbook = p.has_spellbook ? '<span class="badge badge-blue">独立法术书</span>' : "";
      return `<div class="card">
        <h3>${p.name} ${hasSpellbook}</h3>
        <p style="font-size:0.85rem;color:var(--text-secondary)">${p.type} · ${alignRestrict}</p>
        <p style="font-size:0.85rem;margin-top:4px">${(p.description || "").slice(0, 150)}</p>
        ${p.unlock_condition ? `<p style="font-size:0.8rem;color:var(--accent);margin-top:4px"><img src="../assets/png/jiahao.png" alt="" style="width:1rem;height:1rem;vertical-align:middle"> ${p.unlock_condition}</p>` : ""}
      </div>`;
    }).join("");
  }
  render();
  typeFilter?.addEventListener("change", render);
}
