const ALIGNMENTS = {
  LG: { id: "lg", name: "守序善良", axis: "守序", moral: "善良" },
  LN: { id: "ln", name: "守序中立", axis: "守序", moral: "中立" },
  LE: { id: "le", name: "守序邪恶", axis: "守序", moral: "邪恶" },
  NG: { id: "ng", name: "中立善良", axis: "中立", moral: "善良" },
  N:  { id: "n",  name: "绝对中立", axis: "中立", moral: "中立" },
  NE: { id: "ne", name: "中立邪恶", axis: "中立", moral: "邪恶" },
  CG: { id: "cg", name: "混乱善良", axis: "混乱", moral: "善良" },
  CN: { id: "cn", name: "混乱中立", axis: "混乱", moral: "中立" },
  CE: { id: "ce", name: "混乱邪恶", axis: "混乱", moral: "邪恶" }
};

const ALIGNMENT_LIST = Object.values(ALIGNMENTS);

const BAB_PROGRESSIONS = { full: "完整", medium: "中等", half: "低" };
const SAVE_PROGRESSIONS = { good: "高", poor: "低" };

const STATS = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
const STAT_NAMES = {
  strength: "力量", dexterity: "敏捷", constitution: "体质",
  intelligence: "智力", wisdom: "感知", charisma: "魅力"
};

const STAT_ABBR = {
  strength: "str", dexterity: "dex", constitution: "con",
  intelligence: "int", wisdom: "wis", charisma: "cha"
};

const POINT_BUY_COST = {
  7: -4, 8: -2, 9: -1, 10: 0, 11: 1, 12: 2,
  13: 3, 14: 5, 15: 7, 16: 10, 17: 13, 18: 17
};

function getAlignment(id) {
  return ALIGNMENTS[id.toUpperCase()] || null;
}

function getStatMod(score) {
  return Math.floor((score - 10) / 2);
}

function statName(id) {
  return STAT_NAMES[id] || id;
}

function alignName(id) {
  const a = getAlignment(id);
  return a ? a.name : id;
}
