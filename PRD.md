# 产品需求文档 (PRD): 正义之怒 Wiki + Build 构建器

## 1. 概述

### 1.1 项目名称
Wrath of the Righteous Wiki (WotR Wiki) — 正义之怒中文百科

### 1.2 项目背景
《开拓者：正义之怒》(Pathfinder: Wrath of the Righteous) 是一款基于 Pathfinder 1e 规则的 CRPG 游戏，拥有极其丰富的职业、专长、法术和神话道途系统。目前中文社区缺乏一个集百科查询与交互式 Build 规划于一体的工具型站点。

### 1.3 项目目标
构建一个纯静态的 Wiki 站点，提供:
- 完整的游戏数据百科（职业、种族、专长、法术、神话道途等）
- 交互式 Build 构建器（所见即所得的配点规划工具）
- Build 展示与分享
- 通过 GitHub Pages 免费托管，零运营成本

### 1.4 目标用户
- 中文区《正义之怒》玩家
- 新手玩家（需要指引）
- 核心玩家（需要 Build 规划和分享）

---

## 2. 确认决策（通过 Grill Me 流程确认）

以下决策经逐步问答确认:

| # | 决策点 | 结论 |
|---|--------|------|
| 1 | 属性分配方案 | 按游戏内置开卡流程：20 点购点 + 预设配点模板 |
| 2 | 兼职校验粒度 | 完整校验 — 自动检查阵营、种族、信仰、BAB、技能等所有前置条件 |
| 3 | Build 分享方式 | 仅文本导出 + JSON 导入/导出（不做 URL 编码分享） |
| 4 | 预设 Build 库 | 不预置 — 用户后续在 JSON 中自行添加和分类 |
| 5 | 法术模块实现 | 按游戏法术书方式：环数分组 → 阵营冲突过滤 → 已选状态标记 + 搜索筛选 |
| 6 | 装备模块 | Phase 1 不做，后续添加 |
| 7 | GitHub 仓库 | Public 公开仓库 |
| 8 | 语言策略 | 纯中文（UI 界面 + 游戏数据均用中文） |
| 9 | 数据来源 | 先做框架和展示，用户后续分批填充数据 |
| 10 | 视觉风格 | 极简风格（非黑暗奇幻） |
| 11 | 阵营限制开关 | 构建器提供开关，玩家自行决定是否启用阵营过滤；关则所有选项可见 |
| 12 | 神祇阵营校验 | 玩家阵营必须在神祇的 `alignment_options` 列表中才可选（开关关闭时跳过） |
| 13 | 后期道途数据 | 魔鬼/虫群/金龙/传奇均预置完整数据，不在构建器初期可选但可预览解锁条件 |

---

## 3. 技术方案

### 3.1 技术栈
| 层面 | 技术 |
|------|------|
| 前端 | 纯 HTML5 + CSS3 + Vanilla JS |
| 数据格式 | JSON（静态文件） |
| 样式 | 自定义 CSS（极简风格） |
| 图标 | Font Awesome / 自定义 SVG |
| 托管 | GitHub Pages（Public 仓库） |
| 域名 | `yourname.github.io/wrath-wiki` |

### 3.2 为什么纯静态？
- GitHub Pages 原生支持，无需服务器
- 零维护成本，一次构建永久运行
- 最大可访问性，不需要 JS 也能浏览百科内容
- 方便自己维护（直接修改 JSON 即可）

---

## 4. 功能需求

### 4.1 百科系统 (Wiki)

#### 4.1.1 数据覆盖
| 分类 | 内容 | 优先级 |
|------|------|--------|
| 职业 | 25+ 基础职业、10+ 进阶职业、数据、能力描述 | P0 |
| 种族 | 全部可选种族及其属性、特性 | P0 |
| 专长 | 400+ 专长（含神话专长），含前置条件、效果 | P0 |
| 法术 | 800+ 法术，含等级、学派、描述 | P1 |
| 神话道途 | 10 条道途（含后期解锁）详细数据 | P0 |
| 神祇 | 20+ 神祇，含阵营、领域、圣诫禁忌 | P1 |
| 技能 | 20+ 技能，含关键属性、防具减值、是否需受训 | P1 |
| 背景 | 所有背景及其效果 | P1 |
| 武器/护甲/装备 | 装备数据 | P2 |

**数据策略**: 先搭建完整的框架和示例数据，后续由用户分批填充完整数据。

#### 4.1.2 功能
- **分类浏览**: 按类型/等级/学派等维度筛选
- **全文搜索**: 即时搜索所有数据
- **详情页面**: 点击条目查看完整信息
- **关联跳转**: 专长中引用的其他专长/职业可点击跳转

### 4.2 交互式 Build 构建器 (P0)

#### 4.2.1 核心流程
用户遵循游戏内 Build 流程，逐步配置:

```
种族选择 → 属性分配 → 职业选择 → 技能分配 → 专长选择 → 法术选择 → 神话道途 → 导出分享
```

#### 4.2.2 具体功能

**① 种族选择**
- 列出所有可选种族
- 选择后自动应用种族属性加值
- 显示种族的特性/能力

**② 属性分配**
- 按游戏内置开卡流程：20 点购点法
- 实时计算属性修正值
- 支持游戏内置的预设配点模板快速选择

**③ 职业规划（含兼职）**
- 选择 1-3 个职业
- 规划每个职业的等级分配（总 20 级）
- 按职业等级解锁对应能力
- 显示 BAB、豁免、法术位等关键数据

**④ 技能分配**
- 每级技能点数分配
- 实时显示技能总等级
- 标记职业技能（有 +3 加值）

**⑤ 专长选择**
- 按等级阶段（1/3/5/7/9/11/13/15/17/19）展示可用专长数
- 自动过滤符合前置条件的专长
- 标记已选专长，灰色显示不满足条件的专长
- 显示专长前置链
- **神话专长**在专长选择面板中以独立标签页展示（`mythic: true` 过滤），按神话等级前置条件筛选

**⑥ 法术选择（施法职业）**
- 按游戏法术书方式：以**环数分组**展示可用法术
- **阵营冲突过滤**（如善良牧师不可选邪恶法术）
- **已选状态标记**（已勾选/未勾选）
- 支持搜索和筛选
- **阵营限制开关**（见设置面板）— 关闭时跳过阵营冲突过滤，显示所有法术

**⑦ 神祇选择（需信仰职业）**
- 根据当前阵营自动过滤可选神祇（匹配 `alignment_options`）
- **阵营限制开关** — 关闭时显示所有神祇
- 显示神祇阵营、领域、圣诫与禁忌
- 选择后自动添加领域法术到法术列表

**⑧ 神话道途**
- 选择神话道途及道途等级（含后期解锁：魔鬼/虫群/金龙/传奇）
- 选择早期道途后，可预览后期解锁道途的解锁条件
- 道途专属能力/法术选择
- 神话专长（与专长选择面板联动，自动按神话等级前置条件可用）
- 神话法术（天使/巫妖显示独立法术书）

**⑨ 通用设置面板**
- **阵营限制开关**：控制神祇选择/法术选择/道途选择的阵营过滤
  - 开（默认）→ 严格按阵营规则过滤
  - 关 → 不限制，所有选项均可选

**⑩ 实时汇总面板**
- 角色卡总览（肖像、等级、职业组合）
- 关键数据面板（AC、AB、伤害、豁免、技能）
- 完整 Build 代码/文本导出

#### 4.2.3 数据校验
- 专长前置条件自动校验（属性、BAB、技能等级、其他专长）
- 职业阵营/种族/信仰限制校验
- 兼职经验惩罚提示

### 4.3 Build 分享与展示

#### 4.3.1 Build 管理
- localStorage 保存本地 Build
- 导出为文本格式（可读）
- 导出/导入 JSON 格式（完整结构化数据）

#### 4.3.2 Build 展示
- 用户自行在 JSON 数据文件中添加和分类 Build
- 页面自动读取 JSON 渲染 Build 卡片列表
- 分类展示（菜刀、施法者、辅助、Tank 等由用户自定义）

### 4.4 搜索与导航

| 功能 | 说明 |
|------|------|
| 全局搜索 | 搜索所有百科数据 + Build |
| 分类筛选 | 按类别、等级、属性等条件筛选 |
| 面包屑导航 | 清晰的页面层级 |
| 快捷链接 | 首页常用入口 |

---

## 5. 信息架构

### 5.1 页面结构
```
首页 (index.html)
├── 百科 (wiki/)
│   ├── 职业总览 (classes.html)
│   ├── 种族总览 (races.html)
│   ├── 专长列表 (feats.html)
│   ├── 法术书 (spells.html)
│   ├── 神祇 (deities.html)
│   ├── 技能 (skills.html)
│   ├── 神话道途 (mythic-paths.html)
│   └── 详情页面 (detail/) [通过 JS 动态加载]
├── Build 构建器 (builder/)
│   └── 交互式规划 (index.html)
├── Build 展示 (builds/)
│   ├── 推荐 Build (index.html) [从 JSON 读取]
│   └── 我的 Build (my.html) [localStorage]
└── 关于 (about.html)
```

### 5.2 导航系统
- 顶部全局导航栏（固定）
- 首页卡片式快捷入口
- 百科分类侧边栏（在百科相关页面）
- 搜索栏（全局可见）

---

## 6. 数据模型

### 6.1 JSON 数据结构

**阵营常量**（JS 文件，非 JSON）

```js
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
```

阵营为固定 9 格枚举，不作 JSON 数据文件，所有引用通过 `id`（如 `"lg"`）关联。

---

**职业**

核心数据文件：`data/classes/{id}.json`，特征文件：`data/features/{id}.json`。
完整规范见 `data/schemas/class.json` 和 `data/schemas/feature.json`。

```json
{
  "id": "oracle",
  "name": "先知",
  "name_en": "Oracle",
  "description": "诸神通过许多代行者实行己意，但其中最高深莫测的恐怕莫过于先知了。",

  "alignment_restrict": null,
  "deity_required": false,
  "deity_recommended": [],

  "hit_die": 8,
  "bab_progression": "中等",

  "saves": { "fortitude": "低", "reflex": "低", "will": "高" },

  "skill_points_per_level": 4,
  "class_skills": ["athletics", "craft", "diplomacy", "heal", "perception", "spellcraft"],

  "proficiencies": {
    "weapons": ["simple_weapons"],
    "armors": ["light_armor", "medium_armor"],
    "shields": ["light_shield", "heavy_shield"],
    "excluded": ["tower_shield"],
    "summary": "先知擅长使用所有简易武器，轻型盔甲，中型盔甲和盾牌（不包括塔盾）。"
  },

  "spellcasting": {
    "type": "神术",
    "prepared": false,
    "caster_level": "完整",
    "casting_ability": "魅力",
    "max_spell_level": 9,
    "note": "先知作为自发施法者，无需准备法术即可施放已知法术。"
  },

  "class_features": [
    { "feature_ref": "light_armor_proficiency",  "level": 1 },
    { "feature_ref": "medium_armor_proficiency", "level": 1 },
    { "feature_ref": "shield_proficiency",       "level": 1 },
    { "feature_ref": "simple_weapon_proficiency","level": 1 },
    { "feature_ref": "oracle_curse",             "level": 1 },
    { "feature_ref": "oracle_mystery",           "level": 1 },
    { "feature_ref": "oracle_revelation_1",      "level": 1 },
    { "feature_ref": "oracle_revelation_3",      "level": 3 },
    { "feature_ref": "oracle_revelation_7",      "level": 7 },
    { "feature_ref": "oracle_revelation_11",     "level": 11 },
    { "feature_ref": "oracle_revelation_15",     "level": 15 },
    { "feature_ref": "oracle_final_revelation",  "level": 19 }
  ],

  "favored_class_bonuses": [
    { "race": "human",    "bonus": "先知已知法术 +1（必须比最高可施展法术环低至少1级）" },
    { "race": "half_elf", "bonus": "先知已知法术 +1（必须比最高可施展法术环低至少1级）" },
    { "race": "aasimar",  "bonus": "对抗诅咒、疾病和毒素的豁免 +1" }
  ],

  "typical_roles": ["施法者", "辅助", "治疗者", "战斗施法者"],
  "special_notes": "先知作为神术施法者，穿戴盔甲不会导致奥术失败率，可以正常施法。",
  "source": "Pathfinder: Wrath of the Righteous"
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|:----:|:------:|------|
| `id` | string | ✅ | — | 唯一标识符，snake_case |
| `name` | string | ✅ | — | 中文职业名 |
| `name_en` | string | ✅ | — | 英文职业名 |
| `description` | string | ✅ | — | 职业描述 |
| `alignment_restrict` | string[] \| null | ❌ | `null` | 可选阵营 id 列表，`null`=无限制 |
| `deity_required` | boolean | ❌ | `false` | 是否强制要求信仰神祇 |
| `deity_recommended` | string[] | ❌ | `[]` | 推荐神祇 id 列表 |
| `hit_die` | number | ✅ | — | 生命骰大小（如 10 表示 d10） |
| `bab_progression` | string | ✅ | — | BAB 成长：`"完整"` / `"中等"` / `"低"` |
| `saves` | object | ✅ | — | 豁免成长：`{fortitude, reflex, will}` 值均为 `"高"`/`"低"` |
| `skill_points_per_level` | number | ✅ | — | 每级技能点数 |
| `class_skills` | string[] | ✅ | `[]` | 职业技能 id 列表（引用 skills.json） |
| `proficiencies` | object | ✅ | — | 擅长能力结构化对象，见下表 |
| `spellcasting` | object \| null | ❌ | `null` | 施法能力对象，非施法职业为 `null`，见下表 |
| `class_features` | object[] | ✅ | `[]` | 职业特征引用数组，通过 `feature_ref` 关联 `data/features/` 下的特征文件，见下表 |
| `favored_class_bonuses` | object[] | ❌ | `[]` | 种族偏好职业加值数组：`{race, bonus}` |
| `typical_roles` | string[] | ❌ | `[]` | 典型定位标签，用于 Build 分类/推荐 |
| `special_notes` | string | ❌ | — | 特殊规则说明（如奥术失败率豁免） |
| `source` | string | ❌ | — | 数据来源 |

**`proficiencies` 子字段**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `weapons` | string[] | ✅ | 武器擅长 id 列表（引用 weapons.json） |
| `armors` | string[] | ✅ | 盔甲擅长 id 列表 |
| `shields` | string[] | ✅ | 盾牌擅长 id 列表 |
| `excluded` | string[] | ✅ | 明确不擅长的项目 id 列表，无排除项则为 `[]` |
| `summary` | string | ✅ | 便于前端展示的文本摘要 |

**`spellcasting` 子字段**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `type` | string | ✅ | `"神术"` / `"奥术"` |
| `prepared` | boolean | ✅ | `true`=准备施法，`false`=自发施法 |
| `caster_level` | string | ✅ | `"完整"` / `"中等"` / `"低"` |
| `casting_ability` | string \| null | ✅ | 施法关键属性，如 `"魅力"`、`"感知"` |
| `max_spell_level` | number | ✅ | 最高法术环位（0-9） |
| `note` | string | ❌ | 施法相关特殊说明 |

**`class_features[]` 元素字段**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `feature_ref` | string | ✅ | 引用 `data/features/{id}.json` 的特征 ID |
| `level` | number | ✅ | 获取该特征的等级 |
| `uses` | string \| null | ❌ | 每日使用次数表达式（覆盖特征定义），如 `"魅力调整值"` |
| `note` | string | ❌ | 该等级引用的额外说明 |

**特征数据模型**（`data/features/{id}.json`）:

```json
{
  "id": "oracle_curse",
  "name": "先知诅咒",
  "name_en": "Oracle's Curse",
  "type": "职业特性",
  "description": "每个先知都背负着诅咒，这些诅咒既是惩罚也是力量的来源。",
  "sub_features": [
    { "level": 1,  "name": "诅咒初始效果", "description": "诅咒的初始显现效果。" },
    { "level": 5,  "name": "诅咒第二阶",   "description": "诅咒效果增强。" },
    { "level": 10, "name": "诅咒第三阶",   "description": "诅咒效果进一步增强。" },
    { "level": 15, "name": "诅咒最终阶",   "description": "诅咒达到最终形态。" }
  ]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `id` | string | ✅ | 唯一标识符，snake_case。通用特征直接命名（如 `light_armor_proficiency`），职业专属特征加前缀（如 `oracle_curse`） |
| `name` | string | ✅ | 中文特征名 |
| `name_en` | string | ❌ | 英文特征名 |
| `type` | string | ✅ | 特征分类：`"职业特性"` / `"额外专长"`（可扩展） |
| `description` | string | ✅ | 特征描述 |
| `sub_features` | object[] | ❌ | 子特性数组，用于分阶段成长的特征，见下表 |

**`sub_features[]` 元素字段**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `level` | number | ✅ | 子能力获取等级 |
| `name` | string | ✅ | 子能力名 |
| `description` | string | ✅ | 子能力描述 |

**前端加载示例**:

```js
async function loadClass(clsId) {
  const cls = await loadJSON(`data/classes/${clsId}.json`);
  cls.class_features = await Promise.all(
    cls.class_features.map(async ref => {
      const feat = await loadJSON(`data/features/${ref.feature_ref}.json`);
      return { ...feat, level: ref.level, ...(ref.uses && {uses: ref.uses}), ...(ref.note && {note: ref.note}) };
    })
  );
  return cls;
}
```

---

**子职业（Archetype/变体职业）**

子职业以 delta（差分）方式描述对基础职业的修改，数据文件路径：`data/archetypes/{id}.json`，完整规范见 `data/schemas/archetype.json`。

核心机制：
- **直接字段覆盖**：`alignment_restrict`、`class_skills` 等不写在 archetype 中则继承基础职业
- **`replaces[]`**：替换或删除基础职业的特征。`replacement` 非 `null` 时引用 `data/features/{id}.json`；`null` 表示仅删除不替换
- **`adds[]`**：新增的独有能力，内联定义（不写入 `data/features/`）
- **`spell_list`**：法术表的增删差分

```json
{
  "id": "paladin_oath_of_vengeance",
  "name": "复仇誓约",
  "name_en": "Oath of Vengeance",
  "base_class": "paladin",
  "description": "复仇誓约的圣武士放弃防御性的恩典来追求彻底毁灭邪恶的力量。",

  "alignment_restrict": ["lg", "ln", "le"],
  "deity_required": false,

  "class_skills": ["perception", "persuasion", "intimidate"],

  "replaces": [
    { "original": "paladin_smite_evil",       "replacement": "paladin_vengeful_smite",  "level": 1 },
    { "original": "paladin_divine_grace",      "replacement": null,                      "level": 2 },
    { "original": "paladin_aura_of_courage",   "replacement": "paladin_aura_of_vengeance","level": 4 }
  ],

  "adds": [
    {
      "id": "paladin_abjuring_aura",
      "name": "封印恩典",
      "name_en": "Abjuring Aura",
      "level": 8,
      "ability_type": "超自然",
      "description": "圣武士获得法术抗力，数值等于 10 + 圣武士等级。"
    },
    {
      "id": "paladin_righteous_aura",
      "name": "正义恩典",
      "name_en": "Righteous Aura",
      "level": 14,
      "ability_type": "超自然",
      "description": "10英尺内的盟友在攻击检定上获得圣武士魅力调整值的士气加值。"
    }
  ],

  "spell_list": {
    "adds": [
      { "spell_ref": "fear", "level": 1 },
      { "spell_ref": "vampiric_touch", "level": 2 }
    ],
    "removes": [
      { "spell_ref": "bless", "level": 1 }
    ]
  },

  "source": "Pathfinder: Wrath of the Righteous"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `id` | string | ✅ | 唯一标识符，格式 `{base_class}_{archetype}` |
| `name` | string | ✅ | 中文名 |
| `name_en` | string | ✅ | 英文名 |
| `base_class` | string | ✅ | 基础职业 id，引用 `data/classes/{id}.json` |
| `description` | string | ✅ | 子职业描述 |
| `alignment_restrict` | string[] \| null | ❌ | 覆盖基础职业的阵营限制 |
| `deity_required` | boolean | ❌ | 覆盖基础职业的神祇需求 |
| `hit_die` | number | ❌ | 覆盖生命骰 |
| `bab_progression` | string | ❌ | 覆盖 BAB 成长 |
| `saves` | object | ❌ | 覆盖豁免成长 |
| `skill_points_per_level` | number | ❌ | 覆盖技能点数 |
| `class_skills` | string[] | ❌ | 完整覆盖职业技能列表（非追加） |
| `proficiencies` | object | ❌ | 覆盖擅长能力 |
| `spellcasting` | object \| null | ❌ | 覆盖施法能力 |
| `replaces` | object[] | ❌ | 特征替换数组，见下表 |
| `adds` | object[] | ❌ | 新增特征数组（内联定义），见下表 |
| `spell_list` | object | ❌ | 法术表差分：`{adds, removes}` |
| `source` | string | ❌ | 数据来源 |

**`replaces[]` 元素**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `original` | string | ✅ | 被替换的基础职业特征 `feature_ref` |
| `replacement` | string \| null | ✅ | 替换特征 id（对应 `data/features/{id}.json`），`null` = 只删除 |
| `level` | number | ✅ | 替换发生的等级 |

**`adds[]` 元素**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `id` | string | ✅ | 唯一标识符 |
| `name` | string | ✅ | 中文名 |
| `name_en` | string | ❌ | 英文名 |
| `level` | number | ✅ | 获取等级 |
| `ability_type` | string | ✅ | 能力类型：`"职业特性" \| "特异" \| "超自然" \| "类法术"` |
| `description` | string | ✅ | 特征描述 |
| `usage` | string | ❌ | 每日使用次数表达式，如 `"魅力调整值"` |
| `action` | string | ❌ | 动作类型，如 `"标准动作"` |
| `duration` | string | ❌ | 持续时间 |
| `save_dc` | string | ❌ | 豁免 DC 表达式 |
| `scaling` | object | ❌ | 等级成长描述 |

**`spell_list` 子字段**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|:----:|------|
| `adds` | object[] | ❌ | 追加的法术：`{spell_ref, level}` |
| `removes` | object[] | ❌ | 移除的法术：`{spell_ref, level}` |

**前端加载逻辑**（加载子职业时合入基础职业）：

```js
async function loadClassWithArchetype(clsId, archetypeId) {
  let cls = await loadClass(clsId);
  if (!archetypeId) return cls;

  const arch = await loadJSON(`data/archetypes/${archetypeId}.json`);

  // 1. 核心字段覆盖
  for (const key of ['alignment_restrict','deity_required','hit_die','bab_progression',
                     'saves','skill_points_per_level','class_skills','proficiencies','spellcasting']) {
    if (arch[key] !== undefined) cls[key] = arch[key];
  }

  // 2. 处理 replaces
  cls.class_features = cls.class_features.filter(f =>
    !arch.replaces?.some(r => r.original === f.feature_ref && r.replacement === null)
  );
  for (const r of (arch.replaces || [])) {
    if (r.replacement === null) continue;
    const feat = await loadJSON(`data/features/${r.replacement}.json`);
    const idx = cls.class_features.findIndex(f => f.feature_ref === r.original);
    if (idx >= 0) cls.class_features[idx] = { ...feat, level: r.level };
    else cls.class_features.push({ ...feat, level: r.level });
  }

  // 3. 处理 adds
  for (const a of (arch.adds || [])) {
    cls.class_features.push({ ...a });
  }

  // 4. 法术表 delta
  if (arch.spell_list) cls.spell_modifiers = arch.spell_list;

  return cls;
}
```

---

```json
{
  "id": "power_attack",
  "name": "猛力攻击",
  "type": "战斗",
  "prerequisites": {
    "strength": 13,
    "bab": 1,
    "feats": [],
    "skills": []
  },
  "effect": "攻击检定 -1，伤害 +2（双手武器 +3）"
},
{
  "id": "mythic_power_attack",
  "name": "神话猛力攻击",
  "mythic": true,
  "type": "神话",
  "prerequisites": {
    "feats": ["power_attack"],
    "mythic_rank": 1,
    "mythic_path": null
  },
  "effect": "猛力攻击的伤害加值翻倍；可用迅捷动作赋予攻击检定+2加值"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识符 |
| `name` | string | ✅ | 中文专长名 |
| `mythic` | boolean | ❌ | 是否为神话专长（默认 false） |
| `type` | string | ✅ | 专长类型："战斗"/"物品制作"/"超魔"/"神话"/"普通" |
| `prerequisites` | object | ❌ | 前置条件对象 |
| `prerequisites.strength` | number | ❌ | 最低力量属性值 |
| `prerequisites.bab` | number | ❌ | 最低 BAB 值 |
| `prerequisites.feats` | string[] | ❌ | 前置专长 id 列表 |
| `prerequisites.skills` | string[] | ❌ | 前置技能 id 列表（待定格式） |
| `prerequisites.mythic_rank` | number | ❌ | 最低神话等级（仅神话专长） |
| `prerequisites.mythic_path` | string | ❌ | 限制道途 id，null 表示通用（仅神话专长） |
| `effect` | string | ✅ | 专长效果描述 |

**设计说明**: 神话专长与普通专长共用 `feats.json`，通过 `mythic: true` 区分。前端在专长选择面板中分"普通专长"和"神话专长"两个标签页展示。`prerequisites.mythic_path` 为 `null` 表示通用，指定道途 id 表示道途专属。

---

**法术**
```json
{
  "id": "fireball",
  "name": "火球术",
  "name_en": "Fireball",
  "school": "塑能系",
  "descriptors": ["火"],
  "levels": [
    { "class_ref": "sorcerer_wizard", "level": 3 },
    { "class_ref": "magus", "level": 3 },
    { "class_ref": "kineticist", "level": 4 }
  ],
  "casting_time": "一个标准动作",
  "range": "远距",
  "range_detail": "400英尺 + 40英尺/等级",
  "area": "20英尺半径爆发",
  "effect": null,
  "target": null,
  "components": "语言, 姿势, 材料",
  "materials": "蝙蝠粪和硫磺",
  "duration": "立即",
  "saving_throw": "反射, 通过则减半",
  "spell_resistance": true,
  "description": "火球术会生成一片火焰爆炸，对区域内所有生物造成每施法者等级1d6点火焰伤害（最高10d6）。",
  "mythic": {
    "description": "神话火球术无视目标的火焰抗性和火焰免疫。"
  },
  "source": "核心规则书"
}
```

**字段说明**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识符，通常取英文名的snake_case |
| `name` | string | ✅ | 中文法术名 |
| `name_en` | string | ✅ | 英文名 |
| `school` | string | ✅ | 法术学派（塑能系、咒法系、惑控系等） |
| `descriptors` | string[] | ❌ | 法术描述符，如["火","酸"] |
| `levels` | object[] | ✅ | 职业获取列表，`class_ref`指向职业id，`level`为法术环位 |
| `casting_time` | string | ✅ | 施法时间 |
| `range` | string | ✅ | 距离分类（近距/中距/远距/个人/接触） |
| `range_detail` | string | ❌ | 距离具体数值表达式 |
| `area` | string | ❌ | 影响区域（与`target`/`effect`互斥） |
| `effect` | string | ❌ | 效果（与`area`/`target`互斥） |
| `target` | string | ❌ | 目标（与`area`/`effect`互斥） |
| `components` | string | ✅ | 成分，如"语言, 姿势, 材料, 法器" |
| `materials` | string | ❌ | 材料成分的具体描述 |
| `duration` | string | ✅ | 持续时间 |
| `saving_throw` | string | ❌ | 豁免检定描述 |
| `spell_resistance` | boolean | ❌ | 是否受法术抗力影响 |
| `description` | string | ✅ | 完整法术描述（支持 Markdown） |
| `mythic` | object | ❌ | 神话版本，含`description`字段 |
| `source` | string | ❌ | 来源规则书 |

**设计原则**:
- **扁平优先**：PF 法术效果由 CL（施法者等级）线性决定，而非 5e 的升环变体机制，无需变量系统
- **单法术单 entry**：无神话版的法术省略 `mythic` 字段，召唤/变形类法术在 `description` 内描述具体选项
- **Build 构建器查询**：`spells.filter(s => s.levels.some(l => l.class_ref === clsId && l.level <= slotLevel))`
- **CL 缩放**：统一放在 `description` 中描述（如"每等级 1d6，最高 10d6"），不单独拆分字段

---

**技能**

```json
{
  "id": "perception",
  "name": "察觉",
  "name_en": "Perception",
  "key_ability": "感知",
  "armor_check_penalty": false,
  "trained_only": false,
  "description": "用于发现隐藏的生物、物品和陷阱",
  "class_skill_bonus": 3
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识符 |
| `name` | string | ✅ | 中文技能名 |
| `name_en` | string | ✅ | 英文名 |
| `key_ability` | string | ✅ | 关键属性（Build 计算技能总等级时取属性修正） |
| `armor_check_penalty` | boolean | ✅ | 是否受防具检定减值影响 |
| `trained_only` | boolean | ✅ | 是否需受训才能使用 |
| `description` | string | ✅ | 技能描述 |
| `class_skill_bonus` | number | ❌ | 职业技能额外加值（PF 规则为 +3） |

---

**神祇**

```json
{
  "id": "sarenrae",
  "name": "莎伦莱",
  "name_en": "Sarenrae",
  "alignment": "ng",
  "alignment_options": ["lg", "ng", "cg", "n"],
  "domains": ["善良", "医疗", "火焰", "太阳"],
  "subdomains": ["复原", "光亮", "净化"],
  "favored_weapon": "弯刀",
  "holy_symbol": "天使面容的太阳",
  "clergy_classes": ["cleric", "warpriest", "paladin"],
  "edicts": "摧毁邪恶，保护无辜，传播光明与希望",
  "anathema": "放弃治疗机会，故意造成痛苦，目睹邪恶而不作为",
  "description": "莎伦莱是太阳、医疗与救赎之神…",
  "source": "核心规则书"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识符 |
| `name` | string | ✅ | 中文神祇名 |
| `name_en` | string | ✅ | 英文名 |
| `alignment` | string | ✅ | 神祇自身阵营 id |
| `alignment_options` | string[] | ✅ | 可接受信徒阵营列表，构建器据此过滤 |
| `domains` | string[] | ✅ | 神祇提供的领域 |
| `subdomains` | string[] | ❌ | 可选子领域 |
| `favored_weapon` | string | ✅ | 偏好武器 |
| `holy_symbol` | string | ❌ | 圣徽描述 |
| `clergy_classes` | string[] | ❌ | 常见神职人员职业 id 列表 |
| `edicts` | string | ❌ | 圣诫（行为准则） |
| `anathema` | string | ❌ | 禁忌（禁止行为） |
| `description` | string | ✅ | 描述 |
| `source` | string | ❌ | 来源规则书 |

---

**道途（神话道途）**

```json
{
  "id": "angel",
  "name": "天使",
  "name_en": "Angel",
  "alignment_restrict": ["lg", "ng", "cg"],
  "type": "早期",
  "type_order": 1,
  "unlock_condition": null,
  "has_spellbook": true,
  "abilities": [
    { "rank": 1, "name": "天使之击", "type": "被动", "description": "神圣之力灌注武器，造成额外神圣伤害" },
    { "rank": 2, "name": "神圣恩典", "type": "类法术", "description": "…" }
  ],
  "mythic_spells": [
    { "level": 1, "spell_ids": ["divine_favor"] },
    { "level": 2, "spell_ids": ["holy_smite"] }
  ],
  "unique_mechanic": "独立法术书（道途径法术）",
  "description": "天使道途践行善良之道…",
  "source": "Wrath of the Righteous"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | ✅ | 唯一标识符 |
| `name` | string | ✅ | 中文道途名 |
| `name_en` | string | ✅ | 英文名 |
| `alignment_restrict` | string[] | ✅ | 可选阵营列表 |
| `type` | string | ✅ | "早期" / "后期" / "传奇" |
| `type_order` | number | ✅ | 排序用：早期=1, 后期=2, 传奇=3 |
| `unlock_condition` | string | ❌ | 解锁条件描述（仅后期/传奇道途有） |
| `has_spellbook` | boolean | ✅ | 是否拥有独立法术书（仅天使/巫妖为 true） |
| `abilities` | object[] | ✅ | 按道途等级（rank 1-10）列出的能力 |
| `mythic_spells` | object[] | ❌ | 道途径法术表（仅 has_spellbook=true 时存在） |
| `unique_mechanic` | string | ❌ | 道途独特机制简述 |
| `description` | string | ✅ | 描述 |
| `source` | string | ❌ | 来源 |

**说明**: 后期道途（魔鬼/虫群/金龙）和传奇道途均预置完整数据，`type_order` 确保百科列表按"早期→后期→传奇"排序，构建器中仅按当前神话等级展示可用的道途选项。

---

**Build（用户保存格式）**

```json
{
  "name": "经典圣武士",
  "version": "1.0",
  "race": "human",
  "attributes": { "strength": 18, "dexterity": 10, "constitution": 14, "intelligence": 10, "wisdom": 8, "charisma": 16 },
  "alignment": "lg",
  "deity": "iomedae",
  "settings": {
    "alignment_restriction": true
  },
  "levels": [
    { "class": "paladin", "level": 20 }
  ],
  "skills": { "persuasion": 20, "perception": 20, "athletics": 15 },
  "feats": [
    { "feat_ref": "power_attack", "taken_at_level": 1 },
    { "feat_ref": "cleave", "taken_at_level": 3 }
  ],
  "mythic_path": "angel",
  "mythic_rank": 10,
  "mythic_feats": [
    { "feat_ref": "mythic_power_attack", "taken_at_level": 1 }
  ],
  "mythic_abilities": [
    { "ability_ref": "天使之击", "taken_at_rank": 1 }
  ],
  "spells": [],
  "mythic_spells": [],
  "export_text": "完整 Build 描述..."
}
```

**字段说明**:

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | Build 名称 |
| `version` | string | ✅ | 版本号 |
| `race` | string | ✅ | 种族 id |
| `attributes` | object | ✅ | 六维属性对象：`{strength, dexterity, constitution, intelligence, wisdom, charisma}` |
| `alignment` | string | ✅ | 阵营 id（引用 `ALIGNMENTS`） |
| `deity` | string | ❌ | 所选神祇 id |
| `settings.alignment_restriction` | boolean | ❌ | 是否启用阵营过滤（默认 true） |
| `levels` | object[] | ✅ | 职业等级数组：`{class: 职业id, level: 等级数}` |
| `skills` | object | ❌ | 技能加点对象：`{技能id: 投入点数}` |
| `feats` | object[] | ❌ | 专长数组：`{feat_ref: 专长id, taken_at_level: 获取等级}` |
| `mythic_path` | string | ❌ | 神话道途 id |
| `mythic_rank` | number | ❌ | 当前神话等级（1-10） |
| `mythic_feats` | object[] | ❌ | 神话专长数组：`{feat_ref: 专长id, taken_at_level: 获取等级}` |
| `mythic_abilities` | object[] | ❌ | 道途能力选择：`{ability_ref: 能力名称, taken_at_rank: 获取神话等级}` |
| `spells` | string[] | ❌ | 已选法术 id 列表 |
| `mythic_spells` | string[] | ❌ | 已选神话法术 id 列表 |
| `export_text` | string | ❌ | 导出的完整 Build 文本描述 |

---

## 7. 视觉设计

### 7.1 设计风格
- **主题**: 极简风格
- **配色**: 干净清爽，注重内容可读性
- **字体**: 简洁的无衬线字体
- **氛围**: 留白充分，减少视觉干扰

### 7.2 配色方案（初案）
| 用途 | 色值 |
|------|------|
| 背景主色 | `#ffffff` 白色 |
| 背景辅色 | `#f5f5f5` 浅灰 |
| 强调色 | `#2563eb` 蓝色 |
| 文字主色 | `#1a1a1a` 深灰 |
| 文字辅色 | `#6b7280` 中灰 |
| 卡片背景 | `#ffffff` 白色（带阴影） |

### 7.3 响应式
- 桌面优先，适配平板和手机
- 构建器页面在移动端调整为单列布局

---

## 8. 数据录入计划

### 8.1 策略
采用**先框架后数据**方式:
1. 先完成全部功能和展示框架（HTML 骨架、CSS、JS 交互逻辑）
2. 使用示例/占位数据演示功能
3. 后续由用户自行填充完整游戏数据

### 8.2 优先级
| 阶段 | 数据 | 说明 |
|------|------|------|
| Phase 1 (P0) | 职业、种族、专长（含神话专长）、神话道途（含后期解锁） | 构建器和百科核心数据 |
| Phase 2 (P1) | 法术、神祇、技能、背景 | 扩展百科内容 |
| Phase 3 (P2) | 装备、怪物、特殊能力 | 完整百科 |

---

## 9. 质量指标

| 指标 | 目标 |
|------|------|
| Lighthouse 性能 | ≥ 90 |
| 首次内容渲染 (FCP) | ≤ 1.5s |
| 页面体积 | ≤ 500KB (不含图片) |
| Build 构建器操作响应 | ≤ 200ms |
| 数据准确率 | 100% (游戏实际数据) |

---

## 10. 未来规划

### 10.1 v2.0 候选功能
- 黑暗模式/light 模式切换
- Build 对比工具（两个 Build 并列对比）
- DPR (Damage Per Round) 计算器
- 装备推荐搭配
- 多语言支持

---

## 11. 里程碑

| 里程碑 | 内容 | 预估工时 |
|--------|------|----------|
| M1 - 基础框架 | HTML 骨架、极简 CSS 主题、导航、JSON 加载器 | 2 天 |
| M2 - 百科展示 | 百科列表/详情页 + 搜索功能 + 示例数据 | 3 天 |
| M3 - Build 构建器 | 核心交互逻辑、数据校验、实时汇总面板 | 5 天 |
| M4 - 导出与Build展示 | 文本/JSON 导出导入、推荐 Build 页面 | 2 天 |
| M5 - 部署上线 | GitHub 仓库初始化、Pages 配置 | 1 天 |