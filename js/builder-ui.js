// Step 1: Race
function renderRaceStep(app) {
  const races = app.data.races;
  const selected = app.build.race;
  let html = `<div class="builder-panel"><h2>选择种族</h2><p style="color:var(--text-secondary);margin-bottom:16px;font-size:0.88rem;">种族影响属性加值、速度、体型和特殊能力。</p>`;
  html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">`;
  for (const r of races) {
    const isSelected = selected === r.id;
    const bonuses = r.ability_bonuses ? Object.entries(r.ability_bonuses).map(([k, v]) => `${STAT_NAMES[k]} ${v > 0 ? "+" : ""}${v}`).join(", ") : "无";
    html += `<div class="card ${isSelected ? 'active' : ''}" style="${isSelected ? 'border-color:var(--accent);box-shadow:0 0 0 2px var(--accent);' : ''}" onclick="builderApp.selectRace('${r.id}')">
      <h3>${r.name}</h3>
      <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:4px;"><strong>属性加值：</strong>${bonuses}</p>
      <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:4px;"><strong>速度：</strong>${r.speed} 英尺</p>
      <p style="font-size:0.78rem;color:var(--text-secondary);">${(r.description || "").slice(0, 100)}</p>
    </div>`;
  }
  html += `</div></div>`;
  html += renderStepActions(app, !!selected);
  return html;
}

BuilderApp.prototype.selectRace = function(id) {
  this.build.race = id;
  if (!this.build.alignment) this.build.alignment = "lg";
  this.render();
  this.saveBuild();
};

// Step 2: Attributes
function renderAttributesStep(app) {
  const attrs = app.build.attributes;
  const raceBonus = app.build.race ? getAbilityBonus(app.build.race, app.data.races) : {};
  const total = app.pointBuyTotal;
  const remaining = 20 - total;
  let html = `<div class="builder-panel"><h2>属性分配（20点购点）</h2><p style="color:var(--text-secondary);margin-bottom:12px;font-size:0.88rem;">剩余可用点数：<strong style="color:${remaining >= 0 ? 'var(--accent)' : 'red'};">${remaining}</strong> / 20</p>`;

  html += `<div style="margin-bottom:16px;display:flex;gap:8px;flex-wrap:wrap;">`;
  const presets = [
    { name: "标准", attrs: { strength: 14, dexterity: 12, constitution: 14, intelligence: 10, wisdom: 10, charisma: 12 } },
    { name: "高力量", attrs: { strength: 18, dexterity: 10, constitution: 14, intelligence: 10, wisdom: 8, charisma: 10 } },
    { name: "高敏捷", attrs: { strength: 10, dexterity: 18, constitution: 14, intelligence: 12, wisdom: 10, charisma: 8 } },
    { name: "施法者", attrs: { strength: 8, dexterity: 14, constitution: 14, intelligence: 10, wisdom: 10, charisma: 18 } },
    { name: "全10", attrs: { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 } }
  ];
  for (const p of presets) {
    html += `<button class="btn" onclick="builderApp.applyPreset('${p.name}')">${p.name}</button>`;
  }
  html += `</div>`;

  html += `<div class="stat-block">`;
  for (const s of STATS) {
    const base = attrs[s] || 10;
    const bonus = raceBonus[s] || 0;
    const totalVal = base + bonus;
    const mod = calcStatMod(totalVal);
    const cost = calcPointBuyCost(base);
    html += `<div class="stat-item">
      <div class="label">${STAT_NAMES[s]}</div>
      <div class="value">${totalVal}</div>
      <div class="mod">${mod >= 0 ? "+" : ""}${mod}</div>
      <div style="font-size:0.7rem;color:var(--text-secondary);">基础 ${base}${bonus ? ` 种族 +${bonus}` : ""}</div>
      <div style="display:flex;gap:4px;justify-content:center;margin-top:4px;">
        <button class="btn" style="padding:2px 8px;font-size:0.8rem;" onclick="builderApp.adjustStat('${s}', -1)">−</button>
        <button class="btn" style="padding:2px 8px;font-size:0.8rem;" onclick="builderApp.adjustStat('${s}', 1)">+</button>
      </div>
      <div style="font-size:0.72rem;color:var(--text-secondary);margin-top:2px;">费用：${cost >= 0 ? cost : cost}</div>
    </div>`;
  }
  html += `</div></div>`;
  html += renderStepActions(app, remaining >= 0 && total > 0);
  return html;
}

BuilderApp.prototype.adjustStat = function(stat, delta) {
  const current = this.build.attributes[stat] || 10;
  const newVal = current + delta;
  if (newVal < 7 || newVal > 18) return;
  const oldCost = calcPointBuyCost(current);
  const newCost = calcPointBuyCost(newVal);
  const currentTotal = this.pointBuyTotal - oldCost + newCost;
  if (currentTotal > 20 && delta > 0) return;
  this.build.attributes[stat] = newVal;
  this.render();
  this.saveBuild();
};

BuilderApp.prototype.applyPreset = function(name) {
  const presets = {
    "标准": { strength: 14, dexterity: 12, constitution: 14, intelligence: 10, wisdom: 10, charisma: 12 },
    "高力量": { strength: 18, dexterity: 10, constitution: 14, intelligence: 10, wisdom: 8, charisma: 10 },
    "高敏捷": { strength: 10, dexterity: 18, constitution: 14, intelligence: 12, wisdom: 10, charisma: 8 },
    "施法者": { strength: 8, dexterity: 14, constitution: 14, intelligence: 10, wisdom: 10, charisma: 18 },
    "全10": { strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 }
  };
  if (presets[name]) {
    this.build.attributes = { ...presets[name] };
    this.render();
    this.saveBuild();
  }
};

// Step 3: Class
function renderClassStep(app) {
  const classes = app.data.classes;
  const levels = app.build.levels;
  const total = app.totalLevel;
  let html = `<div class="builder-panel"><h2>职业规划（总 ${total}/20 级）</h2>`;

  html += `<div style="margin-bottom:12px;display:flex;gap:8px;align-items:end;flex-wrap:wrap;">`;
  html += `<div class="form-group" style="flex:1;min-width:160px;"><label>选择职业</label><select id="builder-class-select">`;
  for (const c of classes) {
    const taken = levels.find(l => l.class === c.id);
    html += `<option value="${c.id}" ${taken ? "disabled" : ""}>${c.name}${c.prestige ? " (进阶)" : ""}</option>`;
  }
  html += `</select></div>`;
  html += `<div class="form-group" style="width:80px;"><label>等级</label><input type="number" id="builder-class-level" value="1" min="1" max="${20 - total}"></div>`;
  html += `<button class="btn btn-primary" onclick="builderApp.addClass()">+ 添加职业</button>`;
  html += `</div>`;

  if (levels.length === 0) {
    html += '<p style="color:var(--text-secondary);font-size:0.88rem;">尚未选择任何职业。请选择并添加。</p>';
  } else {
    html += `<div style="border:1px solid var(--border);border-radius:var(--radius);">`;
    for (let i = 0; i < levels.length; i++) {
      const e = levels[i];
      const cls = classes.find(c => c.id === e.class);
      html += `<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-bottom:${i < levels.length - 1 ? '1px solid var(--border)' : 'none'}">
        <span style="flex:1;"><strong>${cls ? cls.name : e.class}</strong></span>
        <span style="color:var(--text-secondary);font-size:0.85rem;">等级 ${e.level}</span>
        <input type="number" value="${e.level}" min="1" max="20" style="width:60px;padding:4px;border:1px solid var(--border);border-radius:4px;" onchange="builderApp.modifyClassLevel(${i}, this.value)">
        <button class="btn" style="font-size:0.8rem;" onclick="builderApp.removeClass(${i})">移除</button>
      </div>`;
    }
    html += `</div>`;
  }

  html += `<div style="margin-top:12px;display:flex;gap:16px;flex-wrap:wrap;font-size:0.88rem;color:var(--text-secondary);">`;
  html += `<span>BAB: <strong>${app.bab}</strong></span>`;
  html += `<span>强韧: <strong>${app.fort}</strong></span>`;
  html += `<span>反射: <strong>${app.reflex}</strong></span>`;
  html += `<span>意志: <strong>${app.will}</strong></span>`;
  html += `</div>`;
  html += `</div>`;
  html += renderStepActions(app, total > 0);
  return html;
}

BuilderApp.prototype.addClass = function() {
  const select = document.getElementById("builder-class-select");
  const levelInput = document.getElementById("builder-class-level");
  if (!select || !levelInput) return;
  const classId = select.value;
  const level = parseInt(levelInput.value, 10);
  if (isNaN(level) || level < 1) return;
  if (this.totalLevel + level > 20) { alert("总等级不能超过 20"); return; }
  if (this.build.levels.find(l => l.class === classId)) { alert("该职业已添加"); return; }
  this.build.levels.push({ class: classId, level });
  this.render();
  this.saveBuild();
};

BuilderApp.prototype.removeClass = function(idx) {
  this.build.levels.splice(idx, 1);
  this.build.skills = {};
  this.render();
  this.saveBuild();
};

BuilderApp.prototype.modifyClassLevel = function(idx, val) {
  const level = parseInt(val, 10);
  if (isNaN(level) || level < 1) level = 1;
  const old = this.build.levels[idx].level;
  this.build.levels[idx].level = level;
  const total = this.totalLevel;
  if (total > 20) {
    this.build.levels[idx].level = old;
    alert("总等级不能超过 20");
  }
  this.render();
  this.saveBuild();
};

// Step 4: Skills
function renderSkillsStep(app) {
  const totalPoints = app.skillPointsTotal;
  const remaining = app.skillPointsRemaining;
  const skills = app.build.skills;
  const classes = app.data.classes;
  const maxRank = calcMaxRank(app.totalLevel);

  let allSkillIds = new Set();
  for (const e of app.build.levels) {
    const cls = classes.find(c => c.id === e.class);
    if (cls) cls.class_skills.forEach(s => allSkillIds.add(s));
  }

  const knownSkills = ["athletics", "perception", "persuasion", "knowledge_arcana", "knowledge_world", "stealth", "use_magic_device", "acrobatics", "heal", "survival"];
  const skillNames = {
    athletics: "运动", perception: "察觉", persuasion: "说服", knowledge_arcana: "奥秘知识",
    knowledge_world: "世界知识", stealth: "隐匿", use_magic_device: "使用魔法装置",
    acrobatics: "杂技", heal: "医疗", survival: "生存"
  };

  let html = `<div class="builder-panel"><h2>技能分配</h2>`;
  html += `<p style="color:var(--text-secondary);margin-bottom:12px;font-size:0.88rem;">可用技能点：<strong>${totalPoints}</strong> | 已使用：<strong>${totalPoints - remaining}</strong> | 剩余：<strong style="color:${remaining >= 0 ? 'var(--accent)' : 'red'};">${remaining}</strong></p>`;

  html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">`;
  for (const sid of knownSkills) {
    const isClass = allSkillIds.has(sid);
    const ranks = skills[sid] || 0;
    const total = calcSkillTotal(ranks, 10, isClass);
    html += `<div style="padding:8px;border:1px solid var(--border);border-radius:var(--radius);">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <span><strong>${skillNames[sid] || sid}</strong> ${isClass ? '<span class="badge badge-blue">本职</span>' : ''}</span>
        <span style="font-size:0.85rem;color:var(--text-secondary);">${ranks} / ${maxRank}</span>
      </div>
      <div style="display:flex;gap:4px;margin-top:4px;">
        <button class="btn" style="padding:2px 8px;font-size:0.75rem;" onclick="builderApp.adjustSkill('${sid}', -1)">−</button>
        <button class="btn" style="padding:2px 8px;font-size:0.75rem;" onclick="builderApp.adjustSkill('${sid}', 1)">+</button>
      </div>
    </div>`;
  }
  html += `</div></div>`;
  html += renderStepActions(app, true);
  return html;
}

BuilderApp.prototype.adjustSkill = function(sid, delta) {
  const current = this.build.skills[sid] || 0;
  const maxRank = calcMaxRank(this.totalLevel);
  const newVal = current + delta;
  if (newVal < 0 || newVal > maxRank) return;
  const remaining = this.skillPointsRemaining;
  if (delta > 0 && remaining <= 0) return;
  this.build.skills[sid] = newVal;
  this.render();
  this.saveBuild();
};

// Step 5: Feats
function renderFeatsStep(app) {
  const feats = app.data.feats;
  const selected = app.build.feats.map(f => f.feat_ref);
  const mythicSelected = app.build.mythic_feats.map(f => f.feat_ref);
  const featLevels = { 1: 1, 3: 1, 5: 1, 7: 1, 9: 1, 11: 1, 13: 1, 15: 1, 17: 1, 19: 1 };

  let html = `<div class="builder-panel"><h2>专长选择</h2>`;
  html += `<div style="margin-bottom:12px;display:flex;gap:8px;">`;
      html += `<button class="btn" onclick="builderApp.currentFeatTab='normal';builderApp.render()" id="feat-tab-normal">普通专长</button>`;
      html += `<button class="btn" onclick="builderApp.currentFeatTab='mythic';builderApp.render()" id="feat-tab-mythic">神话专长</button>`;
  html += `</div>`;

  const tab = app.currentFeatTab || "normal";

  let filtered;
  if (tab === "mythic") {
    filtered = feats.filter(f => f.mythic);
  } else {
    filtered = feats.filter(f => !f.mythic);
  }

  html += `<div style="max-height:400px;overflow-y:auto;border:1px solid var(--border);border-radius:var(--radius);">`;
  for (const f of filtered) {
    const isTaken = selected.includes(f.id) || mythicSelected.includes(f.id);
    const statVals = app.statValues;
    const statMods = app.statMods;
    const prereqMet = meetsPrereqs(f, statVals, statMods, app.bab, selected, mythicSelected, app.totalLevel);
    html += `<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border-bottom:1px solid var(--border);${!prereqMet && !isTaken ? 'opacity:0.5;' : ''}">
      <input type="checkbox" ${isTaken ? "checked" : ""} ${!prereqMet && !isTaken ? "disabled" : ""} onchange="builderApp.toggleFeat('${f.id}', this.checked, '${tab}')">
      <div style="flex:1;">
        <strong>${f.name}</strong> ${f.mythic ? '<span class="badge badge-red">神话</span>' : ''}
        <span class="badge badge-gray">${f.type}</span>
        <div style="font-size:0.78rem;color:var(--text-secondary);margin-top:2px;">${f.effect.slice(0, 100)}</div>
      </div>
    </div>`;
  }
  html += `</div></div>`;
  html += renderStepActions(app, true);
  return html;
}

BuilderApp.prototype.toggleFeat = function(featId, checked, tab) {
  const list = tab === "mythic" ? this.build.mythic_feats : this.build.feats;
  if (checked) {
    if (tab === "mythic") list.push({ feat_ref: featId, taken_at_level: 1 });
    else list.push({ feat_ref: featId, taken_at_level: 1 });
  } else {
    const idx = list.findIndex(f => f.feat_ref === featId);
    if (idx >= 0) list.splice(idx, 1);
  }
  this.saveBuild();
  this.render();
};

function meetsPrereqs(feat, statVals, statMods, bab, takenFeats, mythicTaken, totalLevel) {
  if (!feat.prerequisites) return true;
  const p = feat.prerequisites;
  if (p.strength && (statVals.strength || 0) < p.strength) return false;
  if (p.dexterity && (statVals.dexterity || 0) < p.dexterity) return false;
  if (p.intelligence && (statVals.intelligence || 0) < p.intelligence) return false;
  if (p.wisdom && (statVals.wisdom || 0) < p.wisdom) return false;
  if (p.charisma && (statVals.charisma || 0) < p.charisma) return false;
  if (p.bab && bab < p.bab) return false;
  if (p.mythic_rank) return false;
  if (p.feats) {
    for (const req of p.feats) {
      if (!takenFeats.includes(req)) return false;
    }
  }
  return true;
}

// Step 6: Spells
function renderSpellsStep(app) {
  let html = `<div class="builder-panel"><h2>法术选择</h2><p style="color:var(--text-secondary);font-size:0.88rem;">须先选择施法职业和等级。</p></div>`;
  html += renderStepActions(app, true);
  return html;
}

// Step 7: Deity
function renderDeityStep(app) {
  const deities = app.data.deities;
  const align = app.build.alignment;
  const restrict = app.build.settings.alignment_restriction;
  let html = `<div class="builder-panel"><h2>神祇选择</h2>`;

  html += `<div style="margin-bottom:12px;display:flex;align-items:center;gap:8px;">`;
  html += `<label style="font-size:0.88rem;">阵营限制：</label>`;
  html += `<label style="display:flex;align-items:center;gap:4px;font-size:0.85rem;cursor:pointer;"><input type="checkbox" ${restrict ? "checked" : ""} onchange="builderApp.toggleAlignmentRestrict(this.checked)">启用阵营过滤</label>`;
  html += `</div>`;

  if (!deities || deities.length === 0) {
    html += '<p style="color:var(--text-secondary);">暂无神祇数据。</p>';
  } else {
    html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;">`;
    for (const d of deities) {
      const alignOk = !restrict || !align || !d.alignment_options || d.alignment_options.includes(align);
      const isSelected = app.build.deity === d.id;
      html += `<div class="card" style="${isSelected ? 'border-color:var(--accent);' : ''}${!alignOk ? 'opacity:0.4;' : ''}" onclick="builderApp.selectDeity('${d.id}')">
        <h3>${d.name}</h3>
        <p style="font-size:0.8rem;color:var(--text-secondary);">阵营：${alignName(d.alignment)}</p>
        <p style="font-size:0.8rem;color:var(--text-secondary);">偏好武器：${d.favored_weapon || "无"}</p>
      </div>`;
    }
    html += `</div>`;
  }
  html += `</div>`;
  html += renderStepActions(app, true);
  return html;
}

BuilderApp.prototype.selectDeity = function(id) {
  this.build.deity = id;
  this.render();
  this.saveBuild();
};

BuilderApp.prototype.toggleAlignmentRestrict = function(val) {
  this.build.settings.alignment_restriction = val;
  this.render();
  this.saveBuild();
};

// Step 8: Mythic Path
function renderMythicStep(app) {
  const paths = app.data.paths;
  const selected = app.build.mythic_path;
  const align = app.build.alignment;
  const restrict = app.build.settings.alignment_restriction;
  let html = `<div class="builder-panel"><h2>神话道途</h2>`;

  html += `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">`;
  for (const p of paths) {
    const alignOk = !restrict || !align || !p.alignment_restrict || p.alignment_restrict.includes(align);
    const isSelected = selected === p.id;
    const isLate = p.type === "后期" || p.type === "传奇";
    html += `<div class="card" style="${isSelected ? 'border-color:var(--accent);' : ''}${!alignOk ? 'opacity:0.4;' : ''}" onclick="builderApp.selectPath('${p.id}')">
      <h3>${p.name} <span class="badge ${p.type === '早期' ? 'badge-blue' : p.type === '后期' ? 'badge-red' : 'badge-green'}">${p.type}</span></h3>
      <p style="font-size:0.8rem;color:var(--text-secondary);">${(p.alignment_restrict || []).map(a => alignName(a)).join(" / ")}</p>
      <p style="font-size:0.82rem;margin-top:4px;">${(p.description || "").slice(0, 100)}</p>
      ${p.unlock_condition ? `<p style="font-size:0.78rem;color:var(--accent);margin-top:4px;">🔓 ${p.unlock_condition}</p>` : ""}
      ${!alignOk ? `<p style="font-size:0.78rem;color:red;margin-top:2px;">阵营不符</p>` : ""}
    </div>`;
  }
  html += `</div>`;

  if (selected) {
    html += `<div style="margin-top:16px;">`;
    html += `<div class="form-group" style="width:120px;"><label>神话等级 (1-10)</label>
      <input type="number" value="${app.build.mythic_rank || 1}" min="1" max="10" onchange="builderApp.setMythicRank(this.value)"></div>`;
    html += `</div>`;
  }
  html += `</div>`;
  html += renderStepActions(app, true);
  return html;
}

BuilderApp.prototype.selectPath = function(id) {
  this.build.mythic_path = id;
  if (!this.build.mythic_rank) this.build.mythic_rank = 1;
  this.render();
  this.saveBuild();
};

BuilderApp.prototype.setMythicRank = function(val) {
  this.build.mythic_rank = parseInt(val, 10) || 1;
  this.render();
  this.saveBuild();
};

// Step 9: Export
function renderExportStep(app) {
  let html = `<div class="builder-panel"><h2>导出与保存</h2>`;

  html += `<div class="form-group"><label>Build 名称</label>
    <input type="text" value="${app.build.name}" onchange="builderApp.setBuildName(this.value)" style="max-width:400px;"></div>`;

  html += `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">`;
  html += `<button class="btn btn-primary" onclick="builderApp.exportBuild()">📥 导出 Build</button>`;
  html += `<button class="btn" onclick="builderApp.importBuild()">📤 导入 Build</button>`;
  html += `<button class="btn" onclick="builderApp.saveToLocal()">💾 保存到本地</button>`;
  html += `<button class="btn" onclick="builderApp.loadFromLocal()">📂 从本地加载</button>`;
  html += `</div>`;

  html += `<div style="border:1px solid var(--border);border-radius:var(--radius);padding:16px;background:var(--bg-secondary);">`;
  html += `<h3 style="font-size:0.95rem;margin-bottom:8px;">Build 摘要</h3>`;
  html += `<div style="font-family:monospace;font-size:0.82rem;white-space:pre-wrap;line-height:1.7;">${generateBuildText(app.build, app.data)}</div>`;
  html += `</div>`;

  html += `</div>`;
  html += renderStepActions(app, true);
  return html;
}

BuilderApp.prototype.setBuildName = function(name) {
  this.build.name = name || "未命名 Build";
  this.saveBuild();
};

BuilderApp.prototype.saveToLocal = function() {
  this.saveBuild();
  const saved = JSON.parse(localStorage.getItem("wotr_saved_builds") || "[]");
  saved.push(JSON.parse(JSON.stringify(this.build)));
  localStorage.setItem("wotr_saved_builds", JSON.stringify(saved));
  alert("Build 已保存！");
};

BuilderApp.prototype.loadFromLocal = function() {
  const saved = JSON.parse(localStorage.getItem("wotr_saved_builds") || "[]");
  if (saved.length === 0) { alert("本地没有保存的 Build"); return; }
  const names = saved.map((b, i) => `${i + 1}. ${b.name || "未命名"}`);
  const idx = parseInt(prompt(`选择 Build 加载：\n${names.join("\n")}`), 10) - 1;
  if (idx >= 0 && idx < saved.length) {
    this.build = JSON.parse(JSON.stringify(saved[idx]));
    this.render();
    alert("Build 已加载！");
  }
};

// Step actions bar
function renderStepActions(app, canProceed) {
  return `<div id="step-action" style="display:flex;justify-content:space-between;margin-top:16px;">
    <div>${app.step > 0 ? '<button id="step-prev" class="btn">← 上一步</button>' : '<span></span>'}</div>
    <div>${app.step < BUILDER_STEPS.length - 1 ? `<button id="step-next" class="btn btn-primary" ${canProceed ? "" : "disabled"}>下一步 →</button>` : ""}</div>
  </div>`;
}
