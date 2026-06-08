const BUILDER_STEPS = ["race", "attributes", "class", "skills", "feats", "spells", "deity", "mythic", "export"];
const BUILDER_STEP_NAMES = ["① 种族", "② 属性", "③ 职业", "④ 技能", "⑤ 专长", "⑥ 法术", "⑦ 神祇", "⑧ 神话道途", "⑨ 导出"];

const DEFAULT_BUILD = {
  name: "未命名 Build",
  race: null,
  attributes: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 },
  alignment: null,
  deity: null,
  settings: { alignment_restriction: true },
  levels: [],
  skills: {},
  feats: [],
  mythic_path: null,
  mythic_rank: 0,
  mythic_feats: [],
  mythic_abilities: [],
  spells: [],
  mythic_spells: [],
  export_text: ""
};

let build = JSON.parse(JSON.stringify(DEFAULT_BUILD));
let currentStep = 0;

let cachedClasses = [];
let cachedRaces = [];
let cachedFeats = [];
let cachedPaths = [];
let cachedDeities = [];
let cachedSpells = [];

let builderApp = null;

class BuilderApp {
  constructor() {
    this.build = JSON.parse(JSON.stringify(DEFAULT_BUILD));
    this.step = 0;
    this.data = { classes: [], races: [], feats: [], paths: [], deities: [], spells: [] };
  }

  async init() {
    [this.data.classes, this.data.races, this.data.feats, this.data.paths] = await Promise.all([
      loadData("classes"),
      loadData("races"),
      loadData("feats"),
      loadData("mythic-paths")
    ]);
    cachedClasses = this.data.classes;
    cachedRaces = this.data.races;
    cachedFeats = this.data.feats;
    cachedPaths = this.data.paths;

    try { this.data.deities = await loadData("deities"); cachedDeities = this.data.deities; } catch(e) {}
    try { this.data.spells = await loadData("spells"); cachedSpells = this.data.spells; } catch(e) {}

    builderApp = this;
    this.render();
  }

  get currentStepName() { return BUILDER_STEPS[this.step]; }

  goToStep(n) {
    if (n >= 0 && n < BUILDER_STEPS.length) {
      this.step = n;
      this.render();
    }
  }

  canProceed() {
    return this.step < BUILDER_STEPS.length - 1;
  }

  nextStep() {
    if (this.canProceed()) this.goToStep(this.step + 1);
  }

  prevStep() {
    if (this.step > 0) this.goToStep(this.step - 1);
  }

  saveBuild() {
    try {
      localStorage.setItem("wotr_current_build", JSON.stringify(this.build));
    } catch(e) {}
  }

  loadSavedBuild() {
    try {
      const saved = localStorage.getItem("wotr_current_build");
      if (saved) {
        const parsed = JSON.parse(saved);
        this.build = { ...DEFAULT_BUILD, ...parsed };
        return true;
      }
    } catch(e) {}
    return false;
  }

  resetBuild() {
    this.build = JSON.parse(JSON.stringify(DEFAULT_BUILD));
    this.step = 0;
    localStorage.removeItem("wotr_current_build");
    this.render();
  }

  get totalLevel() {
    return this.build.levels.reduce((s, e) => s + e.level, 0);
  }

  get bab() {
    return calcBAB(this.build.levels, this.data.classes);
  }

  get fort() {
    return calcSave("fortitude", this.build.levels, this.data.classes);
  }

  get reflex() {
    return calcSave("reflex", this.build.levels, this.data.classes);
  }

  get will() {
    return calcSave("will", this.build.levels, this.data.classes);
  }

  get statValues() {
    const a = this.build.attributes;
    const raceBonus = this.build.race ? getAbilityBonus(this.build.race, this.data.races) : {};
    const result = {};
    for (const s of STATS) {
      result[s] = (a[s] || 10) + (raceBonus[s] || 0);
    }
    return result;
  }

  get statMods() {
    const v = this.statValues;
    const m = {};
    for (const s of STATS) m[s] = calcStatMod(v[s]);
    return m;
  }

  get pointBuyTotal() {
    return calcPointBuyTotal(this.build.attributes);
  }

  get skillPointsTotal() {
    return calcSkillPoints(
      this.build.levels,
      this.data.classes,
      this.build.race,
      this.statValues.intelligence
    );
  }

  get skillPointsRemaining() {
    return calcRemainingSkillPoints(this.skillPointsTotal, this.build.skills);
  }

  get currentRace() {
    if (!this.build.race) return null;
    return this.data.races.find(r => r.id === this.build.race) || null;
  }

  get classSummary() {
    return this.build.levels.map(e => {
      const cls = this.data.classes.find(c => c.id === e.class);
      return cls ? { ...e, name: cls.name } : e;
    });
  }

  render() {
    const main = document.getElementById("builder-main");
    const sidebar = document.getElementById("builder-sidebar");
    const steps = document.getElementById("builder-steps");
    if (!main || !sidebar || !steps) return;

    steps.querySelectorAll(".step").forEach((el, i) => {
      el.className = "step";
      if (i === this.step) el.classList.add("active");
      else if (i < this.step) el.classList.add("done");
    });

    main.innerHTML = this.renderStepPanel();
    sidebar.innerHTML = this.renderSidebar();
    this.bindStepEvents();
  }

  renderStepPanel() {
    const fnName = `render${this.currentStepName.charAt(0).toUpperCase()}${this.currentStepName.slice(1)}Step`;
    const fn = window[fnName];
    return fn ? fn(this) : `<p>未知步骤</p>`;
  }

  renderSidebar() {
    const b = this.build;
    const v = this.statValues;
    const m = this.statMods;
    const race = this.currentRace;

    let html = `<div class="summary-card">`;
    html += `<h3>角色摘要</h3>`;

    html += `<div class="summary-row"><span>名称</span><span>${b.name}</span></div>`;
    html += `<div class="summary-row"><span>种族</span><span>${race ? race.name : "未选择"}</span></div>`;
    html += `<div class="summary-row"><span>阵营</span><span>${b.alignment ? alignName(b.alignment) : "未选择"}</span></div>`;
    html += `<div class="summary-row"><span>总等级</span><span>${this.totalLevel} / 20</span></div>`;

    if (b.levels.length > 0) {
      html += `<div class="summary-divider"></div>`;
      this.classSummary.forEach(e => {
        html += `<div class="summary-row"><span>${e.name}</span><span>LV ${e.level}</span></div>`;
      });
    }

    html += `<div class="summary-divider"></div>`;
    html += `<div class="summary-row"><span>BAB</span><span>${this.bab}</span></div>`;
    html += `<div class="summary-row"><span>强韧</span><span>${this.fort}</span></div>`;
    html += `<div class="summary-row"><span>反射</span><span>${this.reflex}</span></div>`;
    html += `<div class="summary-row"><span>意志</span><span>${this.will}</span></div>`;

    html += `<div class="summary-divider"></div>`;
    html += `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:4px;margin-top:8px;">`;
    const statLabels = { strength: "力量", dexterity: "敏捷", constitution: "体质", intelligence: "智力", wisdom: "感知", charisma: "魅力" };
    for (const s of STATS) {
      const mod = m[s];
      const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
      html += `<div class="stat-item"><div class="label">${statLabels[s]}</div><div class="value">${v[s]}</div><div class="mod">${modStr}</div></div>`;
    }
    html += `</div>`;

    if (b.deity) {
      html += `<div class="summary-divider"></div>`;
      html += `<div class="summary-row"><span>神祇</span><span>${b.deity}</span></div>`;
    }

    if (b.mythic_path) {
      html += `<div class="summary-divider"></div>`;
      const path = this.data.paths.find(p => p.id === b.mythic_path);
      html += `<div class="summary-row"><span>道途</span><span>${path ? path.name : b.mythic_path}</span></div>`;
      html += `<div class="summary-row"><span>神话等级</span><span>${b.mythic_rank} / 10</span></div>`;
    }

    html += `</div>`;

    html += `<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap;">`;
    html += `<button class="btn" onclick="builderApp.exportBuild()">📥 导出</button>`;
    html += `<button class="btn" onclick="builderApp.importBuild()">📤 导入</button>`;
    html += `<button class="btn" onclick="if(confirm('确定重置所有数据？')) builderApp.resetBuild()">🔄 重置</button>`;
    html += `</div>`;

    return html;
  }

  bindStepEvents() {
    document.querySelectorAll(".step").forEach(el => {
      el.addEventListener("click", () => {
        this.goToStep(parseInt(el.dataset.step, 10));
      });
    });

    const action = document.getElementById("step-action");
    if (action) {
      const prevBtn = action.querySelector("#step-prev");
      const nextBtn = action.querySelector("#step-next");
      if (prevBtn) prevBtn.addEventListener("click", () => this.prevStep());
      if (nextBtn) nextBtn.addEventListener("click", () => this.nextStep());
    }
  }

  exportBuild() {
    const text = generateBuildText(this.build, this.data);
    const json = JSON.stringify(this.build, null, 2);
    const overlay = document.createElement("div");
    overlay.className = "search-overlay";
    const modal = document.createElement("div");
    modal.className = "search-modal";
    modal.style.maxHeight = "80vh";

    modal.innerHTML = `<h3 style="margin-bottom:12px;">导出 Build</h3>
      <div style="margin-bottom:12px;">
        <button class="btn btn-primary" id="export-copy-btn">复制文本</button>
        <button class="btn" id="export-dl-btn">下载 JSON</button>
      </div>
      <textarea style="width:100%;height:300px;font-size:0.82rem;font-family:monospace;" readonly></textarea>
      <div style="margin-top:8px;"><button class="btn" id="export-close-btn">关闭</button></div>`;

    modal.querySelector("textarea").value = text;
    modal.querySelector("#export-copy-btn").addEventListener("click", () => copyText(text));
    modal.querySelector("#export-dl-btn").addEventListener("click", () => {
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "build.json";
      a.click();
      URL.revokeObjectURL(url);
    });
    modal.querySelector("#export-close-btn").addEventListener("click", () => overlay.remove());

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    overlay.addEventListener("click", e => { if (e.target === overlay) overlay.remove(); });
  }

  importBuild() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        this.build = { ...DEFAULT_BUILD, ...data };
        this.render();
        this.saveBuild();
      } catch(err) {
        alert("JSON 格式错误：" + err.message);
      }
    };
    input.click();
  }

  getFeatsAtLevel(level) {
    const charLevel = level;
    const normalFeats = [{ level: 1 }, { level: 3 }, { level: 5 }, { level: 7 }, { level: 9 }, { level: 11 }, { level: 13 }, { level: 15 }, { level: 17 }, { level: 19 }];
    const bonusFeats = [];
    const fighterLevels = this.build.levels.filter(e => e.class === "fighter");
    const warpriestLevels = this.build.levels.filter(e => e.class === "warpriest");
    let fl = 0, wl = 0;
    for (const e of this.build.levels) {
      if (e.class === "fighter") {
        for (let i = 1; i <= e.level; i++) { if ([1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20].includes(fl + i)) bonusFeats.push({ level: charLevel - e.level + i, source: "战士" }); }
        fl += e.level;
      }
      if (e.class === "warpriest") {
        for (let i = 1; i <= e.level; i++) { if ((wl + i) % 3 === 0) bonusFeats.push({ level: charLevel - e.level + i, source: "战斗祭司" }); }
        wl += e.level;
      }
    }
    const mythicFeatLevel = 1;
    return { normal: normalFeats, bonus: bonusFeats, mythic: mythicFeatLevel };
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("builder-main");
  if (root) {
    const app = new BuilderApp();
    app.init();
  }
});
