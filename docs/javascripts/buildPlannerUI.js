import { classes } from "./classData.js"
import { calcBAB, calcSave } from "./calculator.js"

/** 当前构建的职业列表 */
let buildList = []

/**
 * 初始化 BD 制作工具
 */
export function initBuildPlanner() {
  const root = document.getElementById("build-planner-root")
  if (!root) return

  root.innerHTML = renderLayout()
  populateClassSelect(root)
  bindEvents(root)
  updateDisplay(root)
}

/** 渲染整体布局 */
function renderLayout() {
  return `
    <div style="display:flex;gap:24px;flex-wrap:wrap">
      <div style="flex:1;min-width:320px">
        <div style="margin-bottom:16px">
          <label for="bp-class-select">选择职业</label>
          <select id="bp-class-select" style="width:100%;padding:4px 8px;margin-top:4px"></select>
        </div>
        <div style="margin-bottom:16px">
          <label for="bp-level-input">等级 (1-20)</label>
          <input id="bp-level-input" type="number" min="1" max="20" value="1" style="width:100%;padding:4px 8px;margin-top:4px">
        </div>
        <div style="display:flex;gap:8px;margin-bottom:16px">
          <button id="bp-add-btn" style="padding:6px 16px;cursor:pointer">添加职业</button>
          <button id="bp-clear-btn" style="padding:6px 16px;cursor:pointer">清空所有</button>
        </div>
        <div id="bp-list"></div>
      </div>
      <div id="bp-summary" style="flex:1;min-width:280px">
        <h3>数值汇总</h3>
        <table style="width:100%;border-collapse:collapse">
          <thead><tr><th style="text-align:left;border-bottom:2px solid #ccc;padding:4px">属性</th><th style="text-align:left;border-bottom:2px solid #ccc;padding:4px">数值</th></tr></thead>
          <tbody id="bp-summary-body"></tbody>
        </table>
      </div>
    </div>
  `
}

/** 填充职业下拉框 */
function populateClassSelect(root) {
  const select = root.querySelector("#bp-class-select")
  if (!select) return
  classes.forEach((c) => {
    const opt = document.createElement("option")
    opt.value = c.id
    opt.textContent = c.name
    select.appendChild(opt)
  })
}

/** 绑定事件（事件委托） */
function bindEvents(root) {
  root.addEventListener("click", (e) => {
    const target = e.target
    if (target.id === "bp-add-btn") {
      handleAdd(root)
    } else if (target.id === "bp-clear-btn") {
      buildList = []
      updateDisplay(root)
    } else if (target.classList.contains("bp-remove-btn")) {
      const idx = parseInt(target.dataset.index, 10)
      buildList.splice(idx, 1)
      updateDisplay(root)
    }
  })

  root.addEventListener("input", (e) => {
    if (e.target.classList.contains("bp-level-modify")) {
      const idx = parseInt(e.target.dataset.index, 10)
      const val = parseInt(e.target.value, 10)
      if (!isNaN(val) && val >= 1 && val <= 20) {
        buildList[idx].level = val
        updateDisplay(root)
      }
    }
  })
}

/** 处理添加职业 */
function handleAdd(root) {
  const select = root.querySelector("#bp-class-select")
  const levelInput = root.querySelector("#bp-level-input")
  const classId = select.value
  const level = parseInt(levelInput.value, 10)

  if (isNaN(level) || level < 1 || level > 20) {
    alert("请输入 1-20 之间的整数")
    return
  }

  const currentTotal = buildList.reduce((sum, item) => sum + item.level, 0)
  if (currentTotal + level > 20) {
    alert("总等级不能超过 20")
    return
  }

  if (buildList.some((item) => item.classId === classId)) {
    alert("该职业已添加，请修改等级或移除后重试")
    return
  }

  const classData = classes.find((c) => c.id === classId)
  if (!classData) return

  buildList.push({
    classId,
    name: classData.name,
    level,
    babType: classData.bab,
    fort: classData.fort,
    ref: classData.ref,
    will: classData.will,
  })

  levelInput.value = "1"
  updateDisplay(root)
}

/** 更新 UI 显示 */
function updateDisplay(root) {
  renderList(root)
  renderSummary(root)
}

/** 渲染已选职业列表 */
function renderList(root) {
  const container = root.querySelector("#bp-list")
  if (!container) return

  if (buildList.length === 0) {
    container.innerHTML = '<p style="color:#888">尚未添加任何职业</p>'
    return
  }

  container.innerHTML = buildList
    .map(
      (item, idx) => `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:8px;border:1px solid #ddd;border-radius:4px">
        <span style="flex:1">${item.name}</span>
        <label>
          等级
          <input type="number" class="bp-level-modify" data-index="${idx}" value="${item.level}" min="1" max="20" style="width:60px;padding:2px 4px">
        </label>
        <button class="bp-remove-btn" data-index="${idx}" style="padding:2px 10px;cursor:pointer">移除</button>
      </div>
    `
    )
    .join("")
}

/** 渲染数值汇总表 */
function renderSummary(root) {
  const tbody = root.querySelector("#bp-summary-body")
  if (!tbody) return

  const bab = calcBAB(buildList)
  const fort = calcSave("fort", buildList)
  const ref = calcSave("ref", buildList)
  const will = calcSave("will", buildList)
  const totalLevel = buildList.reduce((sum, item) => sum + item.level, 0)

  tbody.innerHTML = `
    <tr><td style="padding:4px;border-bottom:1px solid #eee">总等级</td><td style="padding:4px;border-bottom:1px solid #eee"><strong>${totalLevel}</strong> / 20</td></tr>
    <tr><td style="padding:4px;border-bottom:1px solid #eee">BAB</td><td style="padding:4px;border-bottom:1px solid #eee"><strong>${bab}</strong></td></tr>
    <tr><td style="padding:4px;border-bottom:1px solid #eee">强韧 (Fort)</td><td style="padding:4px;border-bottom:1px solid #eee"><strong>${fort}</strong></td></tr>
    <tr><td style="padding:4px;border-bottom:1px solid #eee">反射 (Ref)</td><td style="padding:4px;border-bottom:1px solid #eee"><strong>${ref}</strong></td></tr>
    <tr><td style="padding:4px;border-bottom:1px solid #eee">意志 (Will)</td><td style="padding:4px;border-bottom:1px solid #eee"><strong>${will}</strong></td></tr>
  `
}
