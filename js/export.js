function generateBuildText(build, data) {
  const lines = [];
  lines.push(`名称: ${build.name || "未命名 Build"}`);
  lines.push(`─`.repeat(30));

  const race = data.races.find(r => r.id === build.race);
  lines.push(`种族: ${race ? race.name : "未选择"}`);
  lines.push(`阵营: ${build.alignment ? alignName(build.alignment) : "未选择"}`);

  if (build.deity) {
    const deity = data.deities ? data.deities.find(d => d.id === build.deity) : null;
    lines.push(`神祇: ${deity ? deity.name : build.deity}`);
  }

  lines.push("");
  lines.push("属性:");
  const raceObj = build.race ? data.races.find(r => r.id === build.race) : null;
  const hasAnyBonus = raceObj && raceObj.ability_bonuses && raceObj.ability_bonuses.any !== undefined;
  for (const s of STATS) {
    const base = build.attributes[s] || 10;
    const bonus = hasAnyBonus ? getAbilityBonus(build.race, data.races, s, build.ability_bonus_choice) : 0;
    const total = base + bonus;
    const mod = calcStatMod(total);
    let bonusLabel = "";
    if (bonus) {
      if (hasAnyBonus && build.ability_bonus_choice === s) {
        bonusLabel = ` 种族+${bonus}(已选)`;
      } else {
        bonusLabel = ` 种族+${bonus}`;
      }
    }
    lines.push(`  ${STAT_NAMES[s]}: ${total} (${mod >= 0 ? '+' : ''}${mod}) [基础${base}${bonusLabel}]`);
  }
  if (hasAnyBonus && raceObj.ability_bonus_desc) {
    lines.push(`  种族加值说明: ${raceObj.ability_bonus_desc}`);
  }

  lines.push("");
  lines.push("职业:");
  for (const e of build.levels) {
    const cls = data.classes.find(c => c.id === e.class);
    lines.push(`  ${cls ? cls.name : e.class} ${e.level}级`);
  }
  const bab = calcBAB(build.levels, data.classes);
  const fort = calcSave("fortitude", build.levels, data.classes);
  const ref = calcSave("reflex", build.levels, data.classes);
  const will = calcSave("will", build.levels, data.classes);
  lines.push(`  BAB: ${bab}  强韧: ${fort}  反射: ${ref}  意志: ${will}`);

  if (Object.keys(build.skills).length > 0) {
    lines.push("");
    lines.push("技能:");
    const skillNames = {
      athletics: "运动", perception: "察觉", persuasion: "说服", knowledge_arcana: "奥秘知识",
      knowledge_world: "世界知识", stealth: "隐匿", use_magic_device: "使用魔法装置",
      acrobatics: "杂技", heal: "医疗", survival: "生存"
    };
    for (const [sid, ranks] of Object.entries(build.skills)) {
      if (ranks > 0) lines.push(`  ${skillNames[sid] || sid}: ${ranks}`);
    }
  }

  if (build.feats.length > 0) {
    lines.push("");
    lines.push("专长:");
    for (const f of build.feats) {
      const feat = data.feats.find(x => x.id === f.feat_ref);
      lines.push(`  ${feat ? feat.name : f.feat_ref}`);
    }
  }

  if (build.mythic_path) {
    lines.push("");
    const path = data.paths.find(p => p.id === build.mythic_path);
    lines.push(`神话道途: ${path ? path.name : build.mythic_path}`);
    lines.push(`神话等级: ${build.mythic_rank || 0}/10`);
    if (build.mythic_feats.length > 0) {
      lines.push("神话专长:");
      for (const f of build.mythic_feats) {
        const feat = data.feats.find(x => x.id === f.feat_ref);
        lines.push(`  ${feat ? feat.name : f.feat_ref}`);
      }
    }
  }

  lines.push("");
  lines.push(`─`.repeat(30));
  lines.push(`由 WotR Wiki Build 构建器生成`);

  return lines.join("\n");
}

function copyText(text) {
  navigator.clipboard.writeText(text).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
  });
}
