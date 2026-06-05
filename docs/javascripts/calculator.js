/**
 * @typedef {Object} LevelEntry
 * @property {'full'|'medium'|'half'} babType - BAB 成长类型
 * @property {number} level - 该职业等级 (1-20)
 */

/**
 * 计算基础攻击加值 (BAB)
 * @param {LevelEntry[]} levels - 各职业等级条目
 * @returns {number} 总 BAB（向下取整）
 * @throws {Error} 当 babType 非法时抛出
 */
export function calcBAB(levels) {
  if (!Array.isArray(levels) || levels.length === 0) return 0

  let total = 0
  for (const entry of levels) {
    const { babType, level } = entry
    switch (babType) {
      case "full":
        total += level
        break
      case "medium":
        total += Math.floor(level * 0.75)
        break
      case "half":
        total += Math.floor(level * 0.5)
        break
      default:
        throw new Error(`未知的 BAB 类型: "${babType}"，请使用 full / medium / half`)
    }
  }
  return total
}

/**
 * 计算豁免检定值
 * @param {'fort'|'ref'|'will'} saveType - 豁免类型
 * @param {{ saveType: 'good'|'poor', level: number }[]} levels - 各职业的豁免成长类型与等级
 * @returns {number} 总豁免值
 * @throws {Error} 当 saveType 非法时抛出
 */
export function calcSave(saveType, levels) {
  if (!Array.isArray(levels) || levels.length === 0) return 0

  let total = 0
  for (const entry of levels) {
    const type = entry[saveType]
    if (!type) {
      throw new Error(`未知的豁免类型: "${saveType}"`)
    }
    const { level } = entry
    switch (type) {
      case "good":
        total += 2 + Math.floor(level / 2)
        break
      case "poor":
        total += Math.floor(level / 3)
        break
      default:
        throw new Error(`未知的豁免成长类型: "${type}"，请使用 good / poor`)
    }
  }
  return total
}
