function calcStatMod(score) {
  return Math.floor((score - 10) / 2);
}

function calcBAB(levels, classes) {
  let total = 0;
  for (const entry of levels) {
    const cls = classes.find(c => c.id === entry.class);
    if (!cls) continue;
    const prog = cls.bab_progression;
    if (prog === "完整") total += entry.level;
    else if (prog === "中等") total += Math.floor(entry.level * 0.75);
    else if (prog === "低") total += Math.floor(entry.level * 0.5);
  }
  return total;
}

function calcSave(saveKey, levels, classes) {
  let total = 0;
  for (const entry of levels) {
    const cls = classes.find(c => c.id === entry.class);
    if (!cls) continue;
    const prog = cls.saves[saveKey];
    if (prog === "高") total += 2 + Math.floor(entry.level / 2);
    else total += Math.floor(entry.level / 3);
  }
  return total;
}

function calcSkillPoints(levels, classes, race, intScore) {
  let total = 0;
  const intMod = calcStatMod(intScore);
  for (const entry of levels) {
    const cls = classes.find(c => c.id === entry.class);
    if (!cls) continue;
    let pts = cls.skill_points_per_level + intMod;
    if (race === "human") pts += 1;
    if (pts < 1) pts = 1;
    total += pts * entry.level;
  }
  return total;
}

function calcSkillTotal(ranks, keyAbilityScore, isClassSkill) {
  const mod = calcStatMod(keyAbilityScore);
  let total = ranks + mod;
  if (isClassSkill && ranks > 0) total += 3;
  return total;
}

function calcMaxRank(totalLevel) {
  return totalLevel;
}

function getAbilityBonus(raceId, races, stat, bonusChoice) {
  const race = races.find(r => r.id === raceId);
  if (!race || !race.ability_bonuses) return 0;
  if (race.ability_bonuses.any !== undefined && bonusChoice === stat) return race.ability_bonuses.any;
  return race.ability_bonuses[stat] || 0;
}

function calcTotalLevel(levels) {
  return levels.reduce((s, e) => s + e.level, 0);
}

function calcPointBuyCost(score) {
  const costs = { 7: -4, 8: -2, 9: -1, 10: 0, 11: 1, 12: 2, 13: 3, 14: 5, 15: 7, 16: 10, 17: 13, 18: 17 };
  return costs[score] !== undefined ? costs[score] : 100;
}

function calcPointBuyTotal(attrs) {
  return Object.values(attrs).reduce((sum, s) => sum + calcPointBuyCost(s), 0);
}

function calcHP(levels, classes, conScore, includeFirstMax) {
  const conMod = calcStatMod(conScore);
  let hp = 0;
  let first = true;
  for (const entry of levels) {
    const cls = classes.find(c => c.id === entry.class);
    if (!cls) continue;
    for (let i = 0; i < entry.level; i++) {
      if (first && includeFirstMax) {
        hp += cls.hit_die + conMod;
        first = false;
      } else {
        hp += Math.ceil(cls.hit_die / 2) + conMod;
      }
    }
  }
  return hp;
}

function calcSkillRanksTotal(skills) {
  return Object.values(skills).reduce((s, v) => s + v, 0);
}

function calcRemainingSkillPoints(totalPoints, skills) {
  return totalPoints - calcSkillRanksTotal(skills);
}

const BAB_EXTRA_ATTACKS = [6, 11, 16];

function getExtraAttacks(bab) {
  const count = BAB_EXTRA_ATTACKS.filter(t => bab >= t).length;
  return count;
}
