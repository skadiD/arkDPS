import fs from "fs"
const chars = JSON.parse(fs.readFileSync("./public/data/character_table.json", "utf8"))
const skills = JSON.parse(fs.readFileSync("./public/data/skill_table.json", "utf8"))
const attributeMap = {
    0: 'hp',
    1: 'atk',
    2: 'def',
    3: 'res', // 法抗: resistance
    4: 'cost',
    5: 'block', // 阻挡: block count
    6: 'ms', // 移速: move speed
    7: 'as', // 攻速: attack speed
    8: 'base_at', // 基础攻击: base attack
    21: 're_deploy', // 再部署: redeploy time
}
const result = []
Object.keys(chars).reverse().forEach(key => {
    if (key.indexOf('char_') === -1 || chars[key].rarity !== 5) return
    const data = {
        id: key,
        name: chars[key].name,
        profession: chars[key].profession,                  // 职业
        subProfessionId: chars[key].subProfessionId,        // 子职业
        rarity: chars[key].rarity,                          // 星级
        maxPotentialLevel: chars[key].maxPotentialLevel,    // 潜能等级
        position: chars[key].position,                      // 部署位置
        val: {},
        potentialRanks: [], // 潜能
        favor: {},          // 信赖加成
        skills: [],         // 技能
        talents: {},        // 天赋列表 {ev等级_天赋id_模组id}
        trait:{},           // 特性列表 {ev等级_天赋id_模组id}
    }
    let index = 0
    chars[key].phases?.forEach(phase => {
        data.val[`e${index++}`] = phase.attributesKeyFrames
    })
    let level = 0
    // 潜能提升
    chars[key].potentialRanks?.forEach(rank => { 
        if (!rank.buff?.attributes) {
            data.potentialRanks.push({
                id: ++level,
                name: '天赋增强', 
                key: '', 
                value: -1
            })
            return
        }
        const val = {
            id: ++level,
            name: rank.description,
            key: attributeMap[rank.buff.attributes.attributeModifiers[0].attributeType],
            value: rank.buff.attributes.attributeModifiers[0].value
        }
        data.potentialRanks.push(val)
    })
    // 天赋提升
    chars[key].talents?.forEach(talent => {
        talent.candidates.forEach(candidate => {
            const blackboard = {}
            candidate.blackboard.forEach(item => {
                blackboard[item.key] = item.value
            })
            console.log(`精英${candidate.unlockCondition.phase}`, chars[key].name, `第${candidate.prefabKey}天赋【${candidate.name}】潜能等级${candidate.requiredPotentialRank}效果提升`)
            const name = `e${candidate.unlockCondition.phase}_${candidate.prefabKey}`
            // 已有的天赋 修正潜能提升
            if (data.talents[name]) {
                data.talents[name].value[candidate.requiredPotentialRank] = blackboard
            } else {
                data.talents[name] = {
                    name: candidate.name,
                    desc: candidate.description,
                    value: {0: blackboard},
                    token: candidate.tokenKey
                }
            }
            if (candidate.requiredPotentialRank == 0) return
            data.potentialRanks[candidate.requiredPotentialRank-1].name = `第${candidate.prefabKey}天赋【${candidate.name}】效果提升`
            // data.potentialRanks[candidate.requiredPotentialRank-1].value = blackboard
        })
    })
    // 特性提升
    chars[key].trait?.candidates.forEach(candidate => {
        if (candidate?.unlockCondition?.phase === undefined) return
        const blackboard = {}
        candidate.blackboard.forEach(item => {
            blackboard[item.key] = item.value
        })
        // console.log(`精英${candidate.unlockCondition.phase}`, chars[key].name, `第${candidate.prefabKey}天赋【${candidate.name}】潜能等级${candidate.requiredPotentialRank}效果提升`)
        const name = `e${candidate.unlockCondition.phase}`
        data.trait[name] = {
            desc: candidate.overrideDescripton || chars[key].description,
            value: blackboard,
        }
    })
    // 技能
    chars[key].skills?.forEach((skill, index) => {
        if (!skills[skill?.skillId]) {
            console.log(chars[key].name, chars[key].rarity, skill?.skillId)
            return
        }
        const detail = skills[skill?.skillId]['levels']?.pop()
        const blackboard = {}
        detail.blackboard.forEach(item => {
            blackboard[item.key] = item.value
        })
        detail.blackboard = blackboard
        detail.id = index
        detail.hasToken = skill.overrideTokenKey
        data.skills.push(detail)
    })
    function findDiff(a, b) {
        let diff = {};
        Object.keys(a).filter(key => a[key] !== b[key]).forEach(key => diff[key] = b[key]);
        return diff;
    }
    if (chars[key].favorKeyFrames === null) {
        console.log(chars[key].name)
        return
    }
    // 信赖加成
    data.favor = findDiff(chars[key].favorKeyFrames[0]?.data, chars[key].favorKeyFrames[1]?.data)
    // 是否有召唤物
    // console.log(res[key].name, res[key].potentialRanks?.length, data.potentialRanks.length)
    result.push(data)
})
// 模组数据
fs.readFile("./public/data/uniequip_table.json", "utf8", async (err, dataStr) => {
    const data = JSON.parse(dataStr)
    const uniequip = data.equipDict // 模组 Obj
    const equip = JSON.parse(fs.readFileSync("./public/data/battle_equip_table.json", "utf8"))
    // const chars = JSON.parse(fs.readFileSync("./public/data/chars.json", "utf8")) -> result

    // 主循环结构 将 "char": string[] 转换为 "char": {id: number, name: string, attrs: any[]}[]
    Object.keys(data.charEquip).forEach(key => {
        if (result.filter(char => char.id === key).length === 0) {
            console.log(key)
            return
        }
        const temp = []
        data.charEquip[key].forEach(id => { // 模组 id
            const attrs = []
            if (equip[id] !== undefined) {
                equip[id].phases.forEach(phases => { // 属性 id
                    const attr = {}
                    phases.attributeBlackboard.forEach(obj => attr[obj.key] = obj.value)
                    // 修正模组对天赋的影响
                    attr.rewrite = [] // 对应 parts 部分
                    phases.parts.forEach(part => {
                        if (!part.addOrOverrideTalentDataBundle.candidates && !part.overrideTraitDataBundle.candidates) return
                        attr.rewrite.push(execDataBundle(part.target, 
                            (part.target !== 'TRAIT' && part.target != "TRAIT_DATA_ONLY" && part.target != "DISPLAY") 
                            ? part.addOrOverrideTalentDataBundle.candidates : part.overrideTraitDataBundle.candidates))
                    })
                    attrs.push(attr)
                })
            }
            temp.push({
                id: id,
                name: uniequip[id].uniEquipName,
                prefabKey: uniequip[id].prefabKey,
                attrs: attrs
            })
        })
        data.charEquip[key] = temp
    })
    result.forEach(char => {
        char['equip'] = data.charEquip[char.id] || []
    })
    fs.writeFileSync("./public/data/chars.json", JSON.stringify(result, null, 4), "utf8")
})

// 处理模组对特性天赋的修正
function execDataBundle(type, candidates) {
    const result = {}
    if (!candidates) {
        console.log(type, candidates)
        return
    }
    let prefabKey = ''
    candidates = candidates.map(candidate => {
        const blackboard = {}
        candidate.blackboard.forEach(item => {
            blackboard[item.key] = item.value
        })
        prefabKey = candidate.prefabKey
        return {
            up_desc: candidate.upgradeDescription,
            add_desc: candidate.additionalDescription,
            upgrade: candidate.requiredPotentialRank,
            blackboard
        }
    })
    type = type.indexOf("TALENT") === -1 ? "TRAIT" : "TALENT"
    result.type = type 
    result[type] = candidates
    result.prefabKey = prefabKey
    return result
}

// fs.writeFileSync("./public/data/chars.json", JSON.stringify(result, null, 4), "utf8")