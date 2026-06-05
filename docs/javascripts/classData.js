/**
 * @typedef {Object} ClassData
 * @property {string} id - 唯一标识符
 * @property {string} name - 显示名称（中文）
 * @property {'full'|'medium'|'half'} bab - BAB 成长类型
 * @property {'good'|'poor'} fort - 强韧豁免成长类型
 * @property {'good'|'poor'} ref - 反射豁免成长类型
 * @property {'good'|'poor'} will - 意志豁免成长类型
 * @property {boolean} [prestige] - 是否为进阶职业，默认 false
 */

/** @type {ClassData[]} */
export const classes = [
  // ===== 基础职业 =====
  { id: "barbarian",     name: "野蛮人",     bab: "full",   fort: "good", ref: "poor",  will: "poor" },
  { id: "bard",          name: "吟游诗人",   bab: "medium", fort: "poor", ref: "good",  will: "good" },
  { id: "cleric",        name: "牧师",       bab: "medium", fort: "good", ref: "poor",  will: "good" },
  { id: "druid",         name: "德鲁伊",     bab: "medium", fort: "good", ref: "poor",  will: "good" },
  { id: "fighter",       name: "战士",       bab: "full",   fort: "good", ref: "poor",  will: "poor" },
  { id: "monk",          name: "武僧",       bab: "full",   fort: "good", ref: "good",  will: "good" },
  { id: "paladin",       name: "圣武士",     bab: "full",   fort: "good", ref: "poor",  will: "poor" },
  { id: "ranger",        name: "游侠",       bab: "full",   fort: "good", ref: "good",  will: "poor" },
  { id: "rogue",         name: "游荡者",     bab: "medium", fort: "poor", ref: "good",  will: "poor" },
  { id: "sorcerer",      name: "术士",       bab: "half",   fort: "poor", ref: "poor",  will: "good" },
  { id: "wizard",        name: "法师",       bab: "half",   fort: "poor", ref: "poor",  will: "good" },
  { id: "alchemist",     name: "炼金术士",   bab: "medium", fort: "good", ref: "poor",  will: "poor" },
  { id: "inquisitor",    name: "审判官",     bab: "medium", fort: "good", ref: "poor",  will: "good" },
  { id: "oracle",        name: "先知",       bab: "medium", fort: "good", ref: "poor",  will: "good" },
  { id: "magus",         name: "魔战士",     bab: "medium", fort: "good", ref: "poor",  will: "good" },
  { id: "witch",         name: "女巫",       bab: "half",   fort: "poor", ref: "poor",  will: "good" },
  { id: "arcanist",      name: "奥能师",     bab: "half",   fort: "poor", ref: "poor",  will: "good" },
  { id: "bloodrager",    name: "血怒者",     bab: "full",   fort: "good", ref: "poor",  will: "poor" },
  { id: "hunter",        name: "猎人",       bab: "full",   fort: "good", ref: "good",  will: "poor" },
  { id: "investigator",  name: "调查员",     bab: "medium", fort: "good", ref: "poor",  will: "poor" },
  { id: "shaman",        name: "萨满",       bab: "medium", fort: "poor", ref: "poor",  will: "good" },
  { id: "skald",         name: "吟游贵族",   bab: "medium", fort: "good", ref: "poor",  will: "poor" },
  { id: "slayer",        name: "杀手",       bab: "full",   fort: "good", ref: "good",  will: "poor" },
  { id: "warpriest",     name: "战斗祭司",   bab: "medium", fort: "good", ref: "poor",  will: "good" },
  { id: "kineticist",    name: "操念使",     bab: "medium", fort: "good", ref: "poor",  will: "poor" },
  { id: "cavalier",      name: "骑将",       bab: "full",   fort: "good", ref: "poor",  will: "poor" },

  // ===== 进阶职业 =====
  { id: "arcane-trickster",   name: "诡术师",       bab: "half",   fort: "poor", ref: "good", will: "good", prestige: true },
  { id: "dragon-disciple",    name: "龙脉术士",     bab: "medium", fort: "good", ref: "poor", will: "good", prestige: true },
  { id: "duelist",            name: "决斗家",       bab: "medium", fort: "poor", ref: "good", will: "poor", prestige: true },
  { id: "eldritch-knight",    name: "奥法骑士",     bab: "full",   fort: "poor", ref: "poor", will: "good", prestige: true },
  { id: "hellknight",         name: "地狱骑士",     bab: "full",   fort: "good", ref: "poor", will: "poor", prestige: true },
  { id: "hellknight-signifer",name: "地狱骑士持印者",bab: "medium", fort: "good", ref: "poor", will: "good", prestige: true },
  { id: "loremaster",         name: "博学士",       bab: "half",   fort: "poor", ref: "poor", will: "good", prestige: true },
  { id: "mystic-theurge",     name: "秘术师",       bab: "half",   fort: "poor", ref: "poor", will: "good", prestige: true },
  { id: "stalwart-defender",  name: "坚毅卫士",     bab: "full",   fort: "good", ref: "poor", will: "poor", prestige: true },
  { id: "student-of-war",     name: "战争学徒",     bab: "medium", fort: "poor", ref: "poor", will: "good", prestige: true },
  { id: "assassin",           name: "刺客",         bab: "medium", fort: "poor", ref: "good", will: "poor", prestige: true },
]
